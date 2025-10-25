"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Manifest = void 0;
const a_concept_1 = require("@adaas/a-concept");
const A_Manifest_error_1 = require("./A-Manifest.error");
const A_ManifestChecker_class_1 = require("./classes/A-ManifestChecker.class");
class A_Manifest extends a_concept_1.A_Fragment {
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
    constructor(config = []) {
        super({
            name: 'A-Manifest',
        });
        this.rules = [];
        this.prepare(config);
    }
    /**
     * Should convert received configuration into internal Regexp applicable for internal storage
     */
    prepare(config) {
        if (!a_concept_1.A_TypeGuards.isArray(config))
            throw new A_Manifest_error_1.A_ManifestError(A_Manifest_error_1.A_ManifestError.ManifestInitializationError, `A-Manifest configuration should be an array of configurations`);
        for (const item of config) {
            this.processConfigItem(item);
        }
    }
    /**
     * Process a single configuration item and convert it to internal rules
     */
    processConfigItem(item) {
        if (!a_concept_1.A_TypeGuards.isComponentConstructor(item.component))
            throw new A_Manifest_error_1.A_ManifestError(A_Manifest_error_1.A_ManifestError.ManifestInitializationError, `A-Manifest configuration item should be a A-Component constructor`);
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
    constructorToRegex(ctor) {
        return new RegExp(`^${this.escapeRegex(ctor.name)}$`);
    }
    /**
     * Convert a method name or regex to a regex pattern
     */
    methodToRegex(method) {
        if (method instanceof RegExp) {
            return method;
        }
        return new RegExp(`^${this.escapeRegex(method)}$`);
    }
    /**
     * Convert allowed components array or regex to a single regex
     */
    allowedComponentsToRegex(components) {
        if (components instanceof RegExp) {
            return components;
        }
        const patterns = components.map(ctor => this.escapeRegex(ctor.name));
        return new RegExp(`^(${patterns.join('|')})$`);
    }
    /**
     * Escape special regex characters in a string
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    configItemToRegexp(item) {
        return this.constructorToRegex(item);
    }
    ID(component, method) {
        return `${component.name}.${method}`;
    }
    /**
     * Check if a component and method combination is allowed for a target
     */
    isAllowed(ctor, method) {
        const componentCtor = typeof ctor === 'function' ? ctor : ctor.constructor;
        return new A_ManifestChecker_class_1.A_ManifestChecker(this, componentCtor, method);
    }
    /**
     * Internal method to check if access is allowed
     */
    internal_checkAccess(query) {
        const componentName = query.component.name;
        const methodName = query.method;
        const targetName = query.target.name;
        // Find matching rules, sorted by specificity (method-specific rules first)
        const matchingRules = this.rules
            .filter(rule => rule.componentRegex.test(componentName) &&
            rule.methodRegex.test(methodName))
            .sort((a, b) => {
            // Method-specific rules (not .* pattern) should come before general rules
            const aIsGeneral = a.methodRegex.source === '.*';
            const bIsGeneral = b.methodRegex.source === '.*';
            if (aIsGeneral && !bIsGeneral)
                return 1; // b comes first
            if (!aIsGeneral && bIsGeneral)
                return -1; // a comes first
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
    isExcluded(ctor, method) {
        const componentCtor = typeof ctor === 'function' ? ctor : ctor.constructor;
        return new A_ManifestChecker_class_1.A_ManifestChecker(this, componentCtor, method, true);
    }
}
exports.A_Manifest = A_Manifest;
//# sourceMappingURL=A-Manifest.context.js.map