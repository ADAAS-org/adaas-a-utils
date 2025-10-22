import { ConfigReader } from "./ConfigReader.component";
export declare class FileConfigReader extends ConfigReader {
    private FileData;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_File_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}
