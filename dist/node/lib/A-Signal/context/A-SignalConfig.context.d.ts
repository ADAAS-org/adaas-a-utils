import { A_Fragment, A_TYPES__Entity_Constructor } from '@adaas/a-concept';
import { A as A_Signal, a as A_SignalConfig_Init } from '../../../A-Signal.types-P5VKMKMs.js';

/**
 * This component should dictate a structure of the vector for all signals within a given scope.
 * so if there're multiple signals it should say what type at what position should be expected.
 *
 * e.g. [A_RouterWatcher, A_ScopeWatcher, A_LoggerWatcher]
 * This structure then should be used for any further processing of signals within the scope.
 */
declare class A_SignalConfig extends A_Fragment {
    protected _structure?: Array<A_TYPES__Entity_Constructor<A_Signal>>;
    protected _config: A_SignalConfig_Init;
    protected _ready?: Promise<void>;
    get structure(): Array<A_TYPES__Entity_Constructor<A_Signal>>;
    /**
     * Uses for synchronization to ensure the config is initialized.
     *
     * @returns True if the configuration has been initialized.
     */
    get ready(): Promise<void> | undefined;
    constructor(params: A_SignalConfig_Init);
    /**
     * Initializes the signal configuration if not already initialized.
     *
     * @returns
     */
    initialize(): Promise<void>;
    /**
     * Initializes the signal configuration by processing the provided structure or string representation.
     * This method sets up the internal structure of signal constructors based on the configuration.
     */
    protected _initialize(): Promise<void>;
}

export { A_SignalConfig };
