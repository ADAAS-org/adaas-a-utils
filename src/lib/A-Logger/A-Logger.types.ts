import { A_LOGGER_COLORS, A_LOGGER_FEATURES, A_LOGGER_LEVELS } from "./A-Logger.constants";


export type A_LoggerLevel = typeof A_LOGGER_LEVELS[keyof typeof A_LOGGER_LEVELS];

/**
 * Available color names for the logger
 * Can be used as first parameter in logging methods to specify message color
 */
export type A_LoggerColorName = typeof A_LOGGER_COLORS[keyof typeof A_LOGGER_COLORS];


export type A_LoggerFeatureName = typeof A_LOGGER_FEATURES[keyof typeof A_LOGGER_FEATURES];

