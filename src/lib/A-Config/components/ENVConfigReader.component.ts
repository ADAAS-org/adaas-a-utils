import {
    A_Concept, A_CONCEPT_ENV,
    A_Feature,
    A_FormatterHelper, A_Inject, A_TYPES__ConceptENVVariables
} from "@adaas/a-concept";
import { ConfigReader } from "./ConfigReader.component";
import { A_Config } from "../A-Config.context";
import { A_Frame } from "@adaas/a-frame";
import { A_Polyfill } from "@adaas/a-utils/a-polyfill";

@A_Frame.Component({
    namespace: 'A-Utils',
    name: 'ENVConfigReader',
    description: 'Configuration reader that sources configuration data from environment variables. It supports loading variables from a .env file and maps them to the configuration context, making it suitable for applications running in diverse environments such as local development, staging, and production.'
})
export class ENVConfigReader extends ConfigReader {


    @A_Concept.Load({
        before: ['ENVConfigReader.initialize']
    })
    async readEnvFile(
        @A_Inject(A_Config) config: A_Config<A_TYPES__ConceptENVVariables>,
        @A_Inject(A_Polyfill) polyfill: A_Polyfill,
        @A_Inject(A_Feature) feature: A_Feature,
    ) {
        const fs = await polyfill.fs();

        if (fs.existsSync('.env'))
            fs.readFileSync(`${config.get('A_CONCEPT_ROOT_FOLDER')}/.env`, 'utf-8').split('\n').forEach(line => {
                const [key, value] = line.split('=');
                if (key && value) {
                    A_CONCEPT_ENV.set(key.trim(), value.trim());
                }
            });
    }


    /**
     * Get the configuration property Name 
     * @param property 
     */
    getConfigurationProperty_ENV_Alias(property: string): string {
        return A_FormatterHelper.toUpperSnakeCase(property);
    }


    resolve<_ReturnType = any>(property: string): _ReturnType {
        return A_CONCEPT_ENV.get(this.getConfigurationProperty_ENV_Alias(property)) as _ReturnType;
    }


    async read<T extends string>(variables: Array<T> = []): Promise<Record<T, any>> {
        const allVariables = [
            ...variables,
            ...A_CONCEPT_ENV.getAllKeys()
        ] as const;

        const config: Record<string, any> = {};

        allVariables.forEach((variable) => {
            config[variable] = this.resolve(variable);
        });

        return config as Record<T, any>;
    }
} 