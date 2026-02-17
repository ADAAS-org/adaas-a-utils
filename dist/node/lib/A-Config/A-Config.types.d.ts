import { A_TYPES__ConceptENVVariables, A_TYPES__Fragment_Constructor } from '@adaas/a-concept';

declare enum A_TYPES__ConfigFeature {
}
type A_TYPES__ConfigContainerConstructor<T extends Array<string | A_TYPES__ConceptENVVariables[number]>> = {
    /**
     * If set to true, the SDK will throw an error if the variable is not defined OR not presented in the defaults
     */
    strict: boolean;
    /**
     * Allows to define the names of variable to be loaded
     */
    variables: T;
    /**
     * Allows to set the default values for the variables
     */
    defaults: {
        [key in T[number]]?: any;
    };
} & A_TYPES__Fragment_Constructor;

export { type A_TYPES__ConfigContainerConstructor, A_TYPES__ConfigFeature };
