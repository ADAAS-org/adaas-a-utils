import { A_TYPES__ConceptENVVariables, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from '@adaas/a-concept';
import { A_TYPES__ConfigContainerConstructor } from './A-Config.types.js';
import { A_ExecutionContext } from '../A-Execution/A-Execution.context.js';
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from './A-Config.constants.js';

declare class A_Config<T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]> extends A_ExecutionContext<{
    [key in T[number]]: any;
} & {
    [key in typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY[number]]: any;
} & {
    [key in typeof A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY[number]]: any;
}> {
    protected _strict: boolean;
    protected _configProperties: T;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_RUNTIME_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(config: Partial<A_TYPES__ConfigContainerConstructor<T>>);
    get strict(): boolean;
    /**
      * This method is used to get the configuration property by name
      *
      * @param property
      * @returns
      */
    get<K extends T[number]>(property: K | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]): {
        [key in T[number]]: any;
    }[K] | undefined;
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

export { A_Config };
