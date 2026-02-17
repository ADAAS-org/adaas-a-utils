import { A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_FormatterHelper, A_TYPES__ConceptENVVariables } from "@adaas/a-concept";
import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";
import { A_ExecutionContext } from "@adaas/a-utils/a-execution";
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from "./A-Config.constants";
import { A_ConfigError } from "./A-Config.error";
import { A_Frame } from "@adaas/a-frame";



@A_Frame.Fragment({
    namespace: 'A-Utils',
    name: 'A-Config',
    description: 'Configuration management context that provides structured access to application configuration variables, supporting defaults and strict mode for enhanced reliability. Default environment variables are included for comprehensive configuration handling.'
})
export class A_Config<
    T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]
> extends A_ExecutionContext<
    { [key in T[number]]: any; } & {
        [key in typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY[number]]: any
    } & {
        [key in typeof A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY[number]]: any
    }
> {
    protected _strict: boolean;
    protected _configProperties!: T;

    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
        ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
        ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];


    constructor(
        config: Partial<A_TYPES__ConfigContainerConstructor<T>>
    ) {
        super('a-config');

        this._strict = config.strict ?? false;
        this._configProperties = config.variables ?? [] as any;


        for (const key in config.defaults) {
            this.set(
                A_FormatterHelper.toUpperSnakeCase(key),
                config.defaults[key as T[number]]
            );
        }
    }


    get strict(): boolean {
        return this._strict;
    }


    /** 
      * This method is used to get the configuration property by name
      * 
      * @param property 
      * @returns 
      */
    get<K extends T[number]>(
        property: K | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number]
    ): { [key in T[number]]: any; }[K] | undefined {
        if (this._configProperties.includes(property as any)
            || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property as any)
            || !this._strict
        )
            return super.get(A_FormatterHelper.toUpperSnakeCase(property));

        throw new A_ConfigError('Property not exists or not allowed to read');
    }


    /**
     * 
     * This method is used to set the configuration property by name
     * OR set multiple properties at once by passing an array of objects
     * 
     * @param variables 
     */
    set(
        variables: Array<{
            property: T[number] | A_TYPES__ConceptENVVariables[number],
            value: any
        }>
    )
    set(
        variables: Partial<Record<T[number] | A_TYPES__ConceptENVVariables[number], any>>
    )
    set(
        property: T[number] | A_TYPES__ConceptENVVariables[number],
        value: any
    )
    set(
        property: T[number] | A_TYPES__ConceptENVVariables[number] | Array<{
            property: T[number] | A_TYPES__ConceptENVVariables[number],
            value: any
        }> | Partial<Record<T[number] | A_TYPES__ConceptENVVariables[number], any>>,
        value?: any
    ) {
        const array = Array.isArray(property)
            ? property
            : typeof property === 'string'
                ? [{ property, value }]
                : Object
                    .keys(property)
                    .map((key) => ({
                        property: key,
                        value: property[key]
                    }));

        for (const { property, value } of array) {
            super.set(A_FormatterHelper.toUpperSnakeCase(property), value);
        }
    }
}