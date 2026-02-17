import { A_Component, A_Error, A_Scope } from '@adaas/a-concept';
import { A_SignalState } from '../context/A-SignalState.context.js';
import { A_SignalConfig } from '../context/A-SignalConfig.context.js';
import { A as A_Signal } from '../../../A-Signal.types-P5VKMKMs.js';
import { A_Logger } from '../../A-Logger/A-Logger.component.js';
import { A_Config } from '../../A-Config/A-Config.context.js';
import { A_SignalBusFeatures } from './A-SignalBus.constants.js';
import '../entities/A-SignalVector.entity.js';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-Config/A-Config.constants.js';

/**
 * This component should listen for all available signal watchers components in this and all parent scopes.
 * When a signal is emitted, it should forward the signal to all registered watchers.
 *
 * A_SignalBus should always return the same vector structure of the signals, and that's why it should store the state of the latest behavior.
 * For example if there are 3 watchers registered, the bus should always return a vector of 3 elements, based on the A_SignalConfig structure.
 *
 *
 * The component itself is stateless and all methods uses only parameters (context) is provided with.
 */
declare class A_SignalBus extends A_Component {
    next(...signals: A_Signal[]): Promise<void>;
    protected [A_SignalBusFeatures.onError](error: A_Error, logger?: A_Logger, ...args: any[]): Promise<void>;
    [A_SignalBusFeatures.onBeforeNext](scope: A_Scope, globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>, state?: A_SignalState, logger?: A_Logger, config?: A_SignalConfig): Promise<void>;
    /**
     * This methods extends A-Signal Emit feature to handle signal emission within the bus.
     *
     * It updates the signal state and emits the updated signal vector.
     *
     * @param signal
     * @param globalConfig
     * @param logger
     * @param state
     * @param config
     * @returns
     */
    [A_SignalBusFeatures.onNext](signals: A_Signal[], scope: A_Scope, state: A_SignalState, globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>, logger?: A_Logger, config?: A_SignalConfig): Promise<void>;
}

export { A_SignalBus };
