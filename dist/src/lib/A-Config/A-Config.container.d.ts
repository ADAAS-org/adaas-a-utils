import { A_Container } from "@adaas/a-concept";
import { A_Config } from "./A-Config.context";
import { A_Polyfill } from "../A-Polyfill/A-Polyfill.component";
export declare class A_ConfigLoader extends A_Container {
    private reader;
    prepare(polyfill: A_Polyfill): Promise<void>;
    readVariables(config: A_Config): Promise<void>;
}
