import { A_Concept, A_Feature, A_FormatterHelper, A_Inject, A_TYPES__ConceptENVVariables } from "@adaas/a-concept";
import { ConfigReader } from "./ConfigReader.component";
import { A_Config } from "../A-Config.context";
import { A_Polyfill } from "../../A-Polyfill/A-Polyfill.component";


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
                    process.env[key.trim()] = value.trim();
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
        return process.env[this.getConfigurationProperty_ENV_Alias(property)] as _ReturnType;
    }


    async read<T extends string>(variables: Array<T> = []): Promise<Record<T, any>> {
        const allVariables = [
            ...variables,
            ...Object.keys(process.env),
        ]

        const config: Record<T, any> = {} as Record<T, any>;

        allVariables.forEach(variable => {
            config[variable] = this.resolve(variable);
        });

        return config;
    }
} 