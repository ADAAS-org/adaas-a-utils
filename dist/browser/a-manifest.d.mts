import { A_Component, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor, A_TYPES__Fragment_Constructor, A_TYPES__Container_Constructor, A_Fragment, A_Error } from '@adaas/a-concept';

type A_UTILS_TYPES__Manifest_Init = Array<A_UTILS_TYPES__Manifest_ComponentLevelConfig>;
type A_UTILS_TYPES__Manifest_ComponentLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Component constructor
     */
    component: A_TYPES__Component_Constructor<T>;
    /**
     * Method level configurations for the component
     */
    methods?: Array<A_UTILS_TYPES__Manifest_MethodLevelConfig<T>>;
} & Partial<A_UTILS_TYPES__Manifest_Rules>;
type A_UTILS_TYPES__Manifest_MethodLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Method name from the component provided
     */
    method: string | RegExp;
} & Partial<A_UTILS_TYPES__Manifest_Rules>;
type A_UTILS_TYPES__Manifest_Rules = {
    /**
     * A list of entities to which a component is applied
     *
     * By default is for all
     */
    apply: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp;
    /**
     * A list of entities to which a component is excluded
     */
    exclude: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp;
};
type A_UTILS_TYPES__Manifest_AllowedComponents = A_TYPES__Component_Constructor | A_TYPES__Entity_Constructor | A_TYPES__Fragment_Constructor | A_TYPES__Container_Constructor;
interface A_UTILS_TYPES__ManifestRule {
    componentRegex: RegExp;
    methodRegex: RegExp;
    applyRegex?: RegExp;
    excludeRegex?: RegExp;
}
interface A_UTILS_TYPES__ManifestQuery {
    component: A_TYPES__Component_Constructor;
    method: string;
    target: A_UTILS_TYPES__Manifest_AllowedComponents;
}

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

declare class A_ManifestError extends A_Error {
    static readonly ManifestInitializationError = "A-Manifest Initialization Error";
}

export { A_Manifest, A_ManifestChecker, A_ManifestError, type A_UTILS_TYPES__ManifestQuery, type A_UTILS_TYPES__ManifestRule, type A_UTILS_TYPES__Manifest_AllowedComponents, type A_UTILS_TYPES__Manifest_ComponentLevelConfig, type A_UTILS_TYPES__Manifest_Init, type A_UTILS_TYPES__Manifest_MethodLevelConfig, type A_UTILS_TYPES__Manifest_Rules };
