import { A_Fragment, A_TYPES__ConceptENVVariables } from "@adaas/a-concept";
import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";
export declare class A_Config<T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]> extends A_Fragment {
    config: A_TYPES__ConfigContainerConstructor<T>;
    private VARIABLES;
    CONFIG_PROPERTIES: T;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(config: Partial<A_TYPES__ConfigContainerConstructor<T>>);
    /**
     * This method is used to get the configuration property by name
     *
     * @param property
     * @returns
     */
    get<_OutType = any>(property: T[number] | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]): _OutType;
    /**
     *
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     *
     * @param variables
     */
    set(variables: Array<{
        property: T[number] | A_TYPES__ConceptENVVariables[number];
        value: any;
    }>): any;
    set(variables: Partial<Record<T[number] | A_TYPES__ConceptENVVariables[number], any>>): any;
    set(property: T[number] | A_TYPES__ConceptENVVariables[number], value: any): any;
}
