import { A_Component, A_Fragment, A_TypeGuards, A_TYPES__Component_Constructor } from "@adaas/a-concept";
import { A_UTILS_TYPES__Manifest_Init, A_UTILS_TYPES__Manifest_ComponentLevelConfig, A_UTILS_TYPES__Manifest_AllowedComponents, A_UTILS_TYPES__ManifestRule, A_UTILS_TYPES__ManifestQuery } from "./A-Manifest.types";
import { A_ManifestError } from "./A-Manifest.error";
import { A_ManifestChecker } from "./classes/A-ManifestChecker.class";





export class A_Manifest extends A_Fragment {

    private rules: A_UTILS_TYPES__ManifestRule[] = [];

    /**
     * A-Manifest is a configuration set that allows to include or exclude component application for the particular methods.
     *
     * For example, if A-Scope provides polymorphic A-Component that applies for All A-Entities in it but you have another component that should be used for only One particular Entity, you can use A-Manifest to specify this behavior.
     * 
     * 
     * By default if Component is provided in the scope - it applies for all entities in it. However, if you want to exclude some entities or include only some entities for the particular component - you can use A-Manifest to define this behavior.
     * 
     * @param config - Array of component configurations
     */
    constructor(config: A_UTILS_TYPES__Manifest_Init = []) {
        super({
            name: 'A-Manifest',
        });

        this.prepare(config);
    }


    /**
     * Should convert received configuration into internal Regexp applicable for internal storage
     */
    protected prepare(config: A_UTILS_TYPES__Manifest_Init) {
        if (!A_TypeGuards.isArray(config))
            throw new A_ManifestError(
                A_ManifestError.ManifestInitializationError,
                `A-Manifest configuration should be an array of configurations`
            );

        for (const item of config) {
            this.processConfigItem(item);
        }
    }

    /**
     * Process a single configuration item and convert it to internal rules
     */
    private processConfigItem(item: A_UTILS_TYPES__Manifest_ComponentLevelConfig) {
        if (!A_TypeGuards.isComponentConstructor(item.component))
            throw new A_ManifestError(
                A_ManifestError.ManifestInitializationError,
                `A-Manifest configuration item should be a A-Component constructor`
            );

        const componentRegex = this.constructorToRegex(item.component);

        // Always add component-level rule first (applies to all methods)
        if (item.apply || item.exclude) {
            const methodRegex = /.*/; // Match all methods

            this.rules.push({
                componentRegex,
                methodRegex,
                applyRegex: item.apply ? this.allowedComponentsToRegex(item.apply) : undefined,
                excludeRegex: item.exclude ? this.allowedComponentsToRegex(item.exclude) : undefined,
            });
        }

        // Then add method-level configurations (these will override component-level)
        if (item.methods && item.methods.length > 0) {
            for (const methodConfig of item.methods) {
                const methodRegex = this.methodToRegex(methodConfig.method);

                this.rules.push({
                    componentRegex,
                    methodRegex,
                    applyRegex: methodConfig.apply ? this.allowedComponentsToRegex(methodConfig.apply) : undefined,
                    excludeRegex: methodConfig.exclude ? this.allowedComponentsToRegex(methodConfig.exclude) : undefined,
                });
            }
        }
    }



    /**
     * Convert a constructor to a regex pattern
     */
    private constructorToRegex(ctor: A_TYPES__Component_Constructor): RegExp {
        return new RegExp(`^${this.escapeRegex(ctor.name)}$`);
    }

    /**
     * Convert a method name or regex to a regex pattern
     */
    private methodToRegex(method: string | RegExp): RegExp {
        if (method instanceof RegExp) {
            return method;
        }
        return new RegExp(`^${this.escapeRegex(method as string)}$`);
    }

    /**
     * Convert allowed components array or regex to a single regex
     */
    private allowedComponentsToRegex(components: A_UTILS_TYPES__Manifest_AllowedComponents[] | RegExp): RegExp {
        if (components instanceof RegExp) {
            return components;
        }

        const patterns = components.map(ctor => this.escapeRegex(ctor.name));
        return new RegExp(`^(${patterns.join('|')})$`);
    }

    /**
     * Escape special regex characters in a string
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    protected configItemToRegexp(item: A_TYPES__Component_Constructor): RegExp {
        return this.constructorToRegex(item);
    }


    protected ID(component: A_TYPES__Component_Constructor, method: string) {
        return `${component.name}.${method}`;
    }

    /**
     * Check if a component and method combination is allowed for a target
     */
    isAllowed<T extends A_Component>(
        ctor: T | A_TYPES__Component_Constructor<T>,
        method: string
    ): A_ManifestChecker {
        const componentCtor = typeof ctor === 'function' ? ctor : ctor.constructor as A_TYPES__Component_Constructor;
        return new A_ManifestChecker(this, componentCtor, method);
    }

    /**
     * Internal method to check if access is allowed
     */
    internal_checkAccess(query: A_UTILS_TYPES__ManifestQuery): boolean {
        const componentName = query.component.name;
        const methodName = query.method;
        const targetName = query.target.name;

        // Find matching rules, sorted by specificity (method-specific rules first)
        const matchingRules = this.rules
            .filter(rule =>
                rule.componentRegex.test(componentName) &&
                rule.methodRegex.test(methodName)
            )
            .sort((a, b) => {
                // Method-specific rules (not .* pattern) should come before general rules
                const aIsGeneral = a.methodRegex.source === '.*';
                const bIsGeneral = b.methodRegex.source === '.*';

                if (aIsGeneral && !bIsGeneral) return 1;  // b comes first
                if (!aIsGeneral && bIsGeneral) return -1; // a comes first
                return 0; // same priority
            });

        // If no rules match, allow by default
        if (matchingRules.length === 0) {
            return true;
        }

        // Process rules in order of specificity (most specific first)
        for (const rule of matchingRules) {
            // If this rule has an exclusion that matches, deny access
            if (rule.excludeRegex && rule.excludeRegex.test(targetName)) {
                return false;
            }

            // If this rule has an apply list, check if target is in it
            if (rule.applyRegex) {
                return rule.applyRegex.test(targetName);
            }
        }

        // If we have rules but no specific apply/exclude, allow by default
        return true;
    }

    isExcluded<T extends A_Component>(
        ctor: T | A_TYPES__Component_Constructor<T>,
        method: string
    ): A_ManifestChecker {
        const componentCtor = typeof ctor === 'function' ? ctor : ctor.constructor as A_TYPES__Component_Constructor;
        return new A_ManifestChecker(this, componentCtor, method, true);
    }
}
