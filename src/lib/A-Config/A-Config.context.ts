import { A_CommonHelper, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_FormatterHelper, A_Fragment, A_TYPES__ConceptENVVariables } from "@adaas/a-concept";
import { A_TYPES__ConfigContainerConstructor } from "./A-Config.types";
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from "./A-Config.constants";


export class A_Config<
    T extends Array<string | A_TYPES__ConceptENVVariables[number]> = any[]
> extends A_Fragment<{
    [key in T[number]]: any
}> {

    config: A_TYPES__ConfigContainerConstructor<T>;


    private VARIABLES: Map<T[number], any> = new Map<T[number], any>();

    CONFIG_PROPERTIES!: T;

    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
        ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
        ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];


    constructor(
        config: Partial<A_TYPES__ConfigContainerConstructor<T>>
    ) {
        super({
            name: 'A_Config'
        });

        this.config = A_CommonHelper.deepCloneAndMerge<A_TYPES__ConfigContainerConstructor<T>>(config as any, {
            strict: false,
            defaults: {},
            variables: A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY as any as T
        } as any);

        this.CONFIG_PROPERTIES = this.config.variables ? this.config.variables : [] as any as T;

        this.config.variables.forEach((variable) => {
            this.VARIABLES.set(
                A_FormatterHelper.toUpperSnakeCase(variable),
                this.config.defaults[variable]
            );
        });
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
        if (this.CONFIG_PROPERTIES.includes(property as any)
            || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property as any)
            || !(this.config.strict)
        )
            return this.VARIABLES.get(A_FormatterHelper.toUpperSnakeCase(property));

        throw new Error('Property not exists or not allowed to read') as never;
        // return this.concept.Errors.throw(A_SDK_CONSTANTS__ERROR_CODES.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ) as never;

    }


    //  get<_OutType = any>(
    //         property: T[number] | typeof this.DEFAULT_ALLOWED_TO_READ_PROPERTIES[number] | string
    //     ): _OutType {
    //         if (this.CONFIG_PROPERTIES.includes(property as any)
    //             || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property as any)
    //             || !(this.config.strict)
    //         )
    //             return this.VARIABLES.get(A_FormatterHelper.toUpperSnakeCase(property)) as _OutType;

    //         throw new Error('Property not exists or not allowed to read') as never;
    //         // return this.concept.Errors.throw(A_SDK_CONSTANTS__ERROR_CODES.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ) as never;
    //     }
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

            let targetValue = value
                ? value
                : this.config?.defaults
                    ? this.config.defaults[property as T[number]]
                    : undefined;

            this.VARIABLES.set(A_FormatterHelper.toUpperSnakeCase(property), targetValue);
        }
    }
}