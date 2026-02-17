import { A_TYPES__Component_Constructor, A_Fragment, A_Component } from '@adaas/a-concept';
import { A_UTILS_TYPES__Manifest_AllowedComponents, A_UTILS_TYPES__Manifest_Init, A_UTILS_TYPES__ManifestQuery } from './lib/A-Manifest/A-Manifest.types.mjs';

/**
 * Fluent API for checking manifest permissions
 */
declare class A_ManifestChecker {
    private manifest;
    private component;
    private method;
    private checkExclusion;
    constructor(manifest: A_Manifest, component: A_TYPES__Component_Constructor, method: string, checkExclusion?: boolean);
    for(target: A_UTILS_TYPES__Manifest_AllowedComponents): boolean;
}

declare class A_Manifest extends A_Fragment {
    private rules;
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
    constructor(config?: A_UTILS_TYPES__Manifest_Init);
    /**
     * Should convert received configuration into internal Regexp applicable for internal storage
     */
    protected prepare(config: A_UTILS_TYPES__Manifest_Init): void;
    /**
     * Process a single configuration item and convert it to internal rules
     */
    private processConfigItem;
    /**
     * Convert a constructor to a regex pattern
     */
    private constructorToRegex;
    /**
     * Convert a method name or regex to a regex pattern
     */
    private methodToRegex;
    /**
     * Convert allowed components array or regex to a single regex
     */
    private allowedComponentsToRegex;
    /**
     * Escape special regex characters in a string
     */
    private escapeRegex;
    protected configItemToRegexp(item: A_TYPES__Component_Constructor): RegExp;
    protected ID(component: A_TYPES__Component_Constructor, method: string): string;
    /**
     * Check if a component and method combination is allowed for a target
     */
    isAllowed<T extends A_Component>(ctor: T | A_TYPES__Component_Constructor<T>, method: string): A_ManifestChecker;
    /**
     * Internal method to check if access is allowed
     */
    internal_checkAccess(query: A_UTILS_TYPES__ManifestQuery): boolean;
    isExcluded<T extends A_Component>(ctor: T | A_TYPES__Component_Constructor<T>, method: string): A_ManifestChecker;
}

export { A_Manifest as A, A_ManifestChecker as a };
