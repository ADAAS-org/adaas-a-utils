type A_LoggerLevel = 'debug' | 'info' | 'warn' | 'error' | 'all';
/**
 * Available color names for the logger
 * Can be used as first parameter in logging methods to specify message color
 */
type A_LoggerColorName = 'red' | 'yellow' | 'green' | 'blue' | 'cyan' | 'magenta' | 'gray' | 'brightBlue' | 'brightCyan' | 'brightMagenta' | 'darkGray' | 'lightGray' | 'indigo' | 'violet' | 'purple' | 'lavender' | 'skyBlue' | 'steelBlue' | 'slateBlue' | 'deepBlue' | 'lightBlue' | 'periwinkle' | 'cornflower' | 'powder' | 'charcoal' | 'silver' | 'smoke' | 'slate';

export type { A_LoggerColorName, A_LoggerLevel };
