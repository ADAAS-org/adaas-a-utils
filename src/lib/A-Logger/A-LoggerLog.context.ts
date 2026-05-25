import { A_Fragment, A_TYPES__Fragment_Serialized } from "@adaas/a-concept";
import { A_LoggerLevel } from "./A-Logger.types";



export class A_LoggerLogContext extends A_Fragment {

    level: A_LoggerLevel;
    args: any[];


    constructor(
        level: A_LoggerLevel,
        ...args: any[]) {
        super();
        this.level = level;
        this.args = args;
    }


    toJSON(): A_TYPES__Fragment_Serialized & { level: A_LoggerLevel; args: any[] } {
        return {
            ...super.toJSON(),
            level: this.level,
            args: this.args
        }
    }
} 