import { A_Component, A_Error, A_Scope } from "@adaas/a-concept";
import { A_Config } from "../A-Config/A-Config.context";
export declare class A_Logger extends A_Component {
    protected scope: A_Scope;
    protected config: A_Config;
    constructor(scope: A_Scope, config: A_Config);
    readonly colors: {
        readonly green: "32";
        readonly blue: "34";
        readonly red: "31";
        readonly yellow: "33";
        readonly gray: "90";
        readonly magenta: "35";
        readonly cyan: "36";
        readonly white: "37";
        readonly pink: "95";
    };
    get scopeLength(): number;
    compile(color: keyof typeof this.colors, ...args: any[]): Array<string>;
    protected get allowedToLog(): boolean;
    log(color: keyof typeof this.colors, ...args: any[]): any;
    log(...args: any[]): any;
    warning(...args: any[]): void;
    error(...args: any[]): void;
    protected log_A_Error(error: A_Error): void;
    protected compile_A_Error(error: A_Error): string;
    protected compile_Error(error: Error): string;
    protected getTime(): string;
}
