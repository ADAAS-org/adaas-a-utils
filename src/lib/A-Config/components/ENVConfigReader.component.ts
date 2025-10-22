import { A_FormatterHelper } from "@adaas/a-concept";
import { ConfigReader } from "./ConfigReader.component";


export class ENVConfigReader extends ConfigReader {


    /**
     * Get the configuration property Name 
     * @param property 
     */
    getConfigurationProperty_ENV_Alias(property: string): string {
        return A_FormatterHelper.toUpperSnakeCase(property);
    }


    resolve<_ReturnType = any>(property: string): _ReturnType {
        return process.env[this.getConfigurationProperty_ENV_Alias(property)] as _ReturnType;
    }


    async read<T extends string>(variables: Array<T> = []): Promise<Record<T, any>> {
        const config: Record<T, any> = {} as Record<T, any>;

        variables.forEach(variable => {
            config[variable] = this.resolve(variable);
        });

        return config;
    }
} 