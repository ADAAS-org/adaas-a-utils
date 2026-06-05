import { A as A_LoggerLevel } from './A-Logger.component-NljdXg_n.mjs';
export { a as A_LOGGER_ANSI, b as A_LOGGER_COLORS, c as A_LOGGER_COLOR_CODES, d as A_LOGGER_DEFAULT_LEVEL, e as A_LOGGER_DEFAULT_SCOPE_LENGTH, f as A_LOGGER_ENV_KEYS, g as A_LOGGER_ENV_VARIABLES, h as A_LOGGER_FEATURES, i as A_LOGGER_FORMAT, j as A_LOGGER_LEVELS, k as A_LOGGER_SAFE_RANDOM_COLORS, l as A_LOGGER_TERMINAL, m as A_LOGGER_TIME_FORMAT, n as A_Logger, o as A_LoggerColorName, p as A_LoggerEnvVariables, q as A_LoggerEnvVariablesArray, r as A_LoggerEnvVariablesType, s as A_LoggerFeatureName } from './A-Logger.component-NljdXg_n.mjs';
import { A_Fragment, A_TYPES__Fragment_Serialized } from '@adaas/a-concept';
import './a-execution.mjs';

declare class A_LoggerLogContext extends A_Fragment {
    level: A_LoggerLevel;
    args: any[];
    constructor(level: A_LoggerLevel, ...args: any[]);
    toJSON(): A_TYPES__Fragment_Serialized & {
        level: A_LoggerLevel;
        args: any[];
    };
}

export { A_LoggerLevel, A_LoggerLogContext };
