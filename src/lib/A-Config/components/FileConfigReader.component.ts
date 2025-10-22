import { A_Context, A_FormatterHelper } from "@adaas/a-concept";
import { ConfigReader } from "./ConfigReader.component";

export class FileConfigReader extends ConfigReader {

    private FileData: Map<string, any> = new Map<string, any>();

    /**
     * Get the configuration property Name
     * @param property 
     */
    getConfigurationProperty_File_Alias(property: string): string {
        return A_FormatterHelper.toCamelCase(property);
    }


    resolve<_ReturnType = any>(property: string): _ReturnType {
        return this.FileData.get(this.getConfigurationProperty_File_Alias(property)) as _ReturnType;
    }


    async read<T extends string>(
        variables?: Array<T>
    ): Promise<Record<T, any>> {

        const fs = await this.polyfill.fs();

        try {
            const data = fs.readFileSync(`${A_Context.concept}.conf.json`, 'utf8');

            const config: Record<T, any> = JSON.parse(data);

            this.FileData = new Map(Object.entries(config));

            return config;

        } catch (error) {
            // this.context.Logger.error(error);
            return {} as Record<T, any>;
        }
    }
}
