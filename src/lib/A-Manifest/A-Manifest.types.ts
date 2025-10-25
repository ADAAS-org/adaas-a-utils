import { A_Component, A_Container, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor, A_TYPES__Fragment_Constructor } from "@adaas/a-concept"
import { A_TYPES__Container_Constructor } from "@adaas/a-concept/dist/src/global/A-Container/A-Container.types"


export type A_UTILS_TYPES__Manifest_Init = Array<A_UTILS_TYPES__Manifest_ComponentLevelConfig>



export type A_UTILS_TYPES__Manifest_ComponentLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Component constructor
     */
    component: A_TYPES__Component_Constructor<T>,
    /**
     * Method level configurations for the component
     */
    methods?: Array<A_UTILS_TYPES__Manifest_MethodLevelConfig<T>>
} & Partial<A_UTILS_TYPES__Manifest_Rules>



export type A_UTILS_TYPES__Manifest_MethodLevelConfig<T extends A_Component = A_Component> = {
    /**
     * Method name from the component provided
     */
    method: string | RegExp
} & Partial<A_UTILS_TYPES__Manifest_Rules>



export type A_UTILS_TYPES__Manifest_Rules = {
    /**
     * A list of entities to which a component is applied
     * 
     * By default is for all
     */
    apply: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp
    /**
     * A list of entities to which a component is excluded
     */
    exclude: Array<A_UTILS_TYPES__Manifest_AllowedComponents> | RegExp
}

export type A_UTILS_TYPES__Manifest_AllowedComponents = A_TYPES__Component_Constructor
    | A_TYPES__Entity_Constructor
    | A_TYPES__Fragment_Constructor
    | A_TYPES__Container_Constructor



export interface A_UTILS_TYPES__ManifestRule {
    componentRegex: RegExp;
    methodRegex: RegExp;
    applyRegex?: RegExp;
    excludeRegex?: RegExp;
}

export interface A_UTILS_TYPES__ManifestQuery {
    component: A_TYPES__Component_Constructor;
    method: string;
    target: A_TYPES__Component_Constructor;
}