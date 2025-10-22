import { A_Component, A_Scope } from "@adaas/a-concept";
import { A_Config } from "../A-Config.context";
import { A_Polyfill } from "../../A-Polyfill/A-Polyfill.component";
/**
 * Config Reader
 */
export declare class ConfigReader extends A_Component {
    protected scope: A_Scope;
    protected polyfill: A_Polyfill;
    constructor(scope: A_Scope, polyfill: A_Polyfill);
    inject(config: A_Config): Promise<void>;
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
