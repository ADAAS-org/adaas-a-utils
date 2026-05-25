import { A_Fragment, A_TYPES__Fragment_Serialized } from '@adaas/a-concept';
import { A_LoggerLevel } from './A-Logger.types.js';
import './A-Logger.constants.js';

declare class A_LoggerLogContext extends A_Fragment {
    level: A_LoggerLevel;
    args: any[];
    constructor(level: A_LoggerLevel, ...args: any[]);
    toJSON(): A_TYPES__Fragment_Serialized & {
        level: A_LoggerLevel;
        args: any[];
    };
}

export { A_LoggerLogContext };
