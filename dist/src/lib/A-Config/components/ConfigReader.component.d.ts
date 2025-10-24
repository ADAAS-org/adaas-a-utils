import { A_Component, A_Container, A_Feature } from "@adaas/a-concept";
import { A_Config } from "../A-Config.context";
import { A_Polyfill } from "../../A-Polyfill/A-Polyfill.component";
/**
 * Config Reader
 */
export declare class ConfigReader extends A_Component {
    protected polyfill: A_Polyfill;
    constructor(polyfill: A_Polyfill);
    attachContext(container: A_Container, feature: A_Feature): Promise<void>;
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
    /**
     * Finds the root directory of the project by locating the folder containing package.json
     *
     * @param {string} startPath - The initial directory to start searching from (default is __dirname)
     * @returns {string|null} - The path to the root directory or null if package.json is not found
     */
    protected getProjectRoot(startPath?: string): Promise<string>;
}
