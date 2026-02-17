import { A_Container, A_Error, A_Component, A_Scope, A_TYPES__ConceptENVVariables, A_Feature } from '@adaas/a-concept';
import { A_Polyfill } from './a-polyfill.mjs';
import { f as A_Config } from './A-Logger.component-Be-LMV3I.mjs';
export { g as A_CONSTANTS__CONFIG_ENV_VARIABLES, h as A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY, i as A_TYPES__ConfigContainerConstructor, j as A_TYPES__ConfigENVVariables, k as A_TYPES__ConfigFeature } from './A-Logger.component-Be-LMV3I.mjs';
import './a-execution.mjs';

declare class A_ConfigLoader extends A_Container {
    private reader;
    prepare(polyfill: A_Polyfill): Promise<void>;
}

declare class A_ConfigError extends A_Error {
    static readonly InitializationError = "A-Config Initialization Error";
}

/**
 * Config Reader
 */
declare class ConfigReader extends A_Component {
    protected polyfill: A_Polyfill;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_RUNTIME_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(polyfill: A_Polyfill);
    attachContext(container: A_Container, context: A_Scope, config?: A_Config<any>): Promise<void>;
    initialize(config: A_Config): Promise<void>;
    /**
     * Get the configuration property by Name
     * @param property
     */
    resolve<_ReturnType = any>(property: string): _ReturnType;
    /**
     * This method reads the configuration and sets the values to the context
     *
     * @returns
     */
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

declare class ENVConfigReader extends ConfigReader {
    readEnvFile(config: A_Config<A_TYPES__ConceptENVVariables>, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_ENV_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

declare class FileConfigReader extends ConfigReader {
    private FileData;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_File_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

export { A_Config, A_ConfigError, A_ConfigLoader, ConfigReader, ENVConfigReader, FileConfigReader };
