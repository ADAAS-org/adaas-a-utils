import { A_Feature, A_TYPES__ConceptENVVariables } from "@adaas/a-concept";
import { ConfigReader } from "./ConfigReader.component";
import { A_Config } from "../A-Config.context";
import { A_Polyfill } from "../../A-Polyfill/A-Polyfill.component";
export declare class ENVConfigReader extends ConfigReader {
    readEnvFile(config: A_Config<A_TYPES__ConceptENVVariables>, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_ENV_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}
