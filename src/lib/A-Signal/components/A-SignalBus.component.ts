import { A_Caller, A_Component, A_Context, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_SignalFeatures } from "../A-Signal.constants";
import { A_SignalState } from "../context/A-SignalState.context";
import { A_SignalConfig } from "../context/A-SignalConfig.context";
import { A_Config } from "../../A-Config/A-Config.context";
import { A_Logger } from "../../A-Logger/A-Logger.component";
import { A_Signal } from "../entities/A-Signal.entity";
import { A_Frame } from "@adaas/a-frame";



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
@A_Frame.Component({
    namespace: 'A-Utils',
    name: 'A-SignalBus',
    description: 'Signal bus component that manages the emission and state of signals within a given scope. It listens for emitted signals, updates their state, and forwards them to registered watchers. The bus ensures a consistent signal vector structure based on the defined configuration, facilitating signal management across multiple components.'
})
export class A_SignalBus extends A_Component {


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
    @A_Feature.Extend({
        scope: [A_Signal]
    })
    async [A_SignalFeatures.Next](
        @A_Inject(A_Caller) signal: A_Signal,
        @A_Inject(A_Scope) scope: A_Scope,

        @A_Inject(A_Config) globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>,
        @A_Inject(A_Logger) logger?: A_Logger,
        @A_Inject(A_SignalState) state?: A_SignalState,
        @A_Inject(A_SignalConfig) config?: A_SignalConfig,
    ) {

        /*
        1) create a signal when it occurs via new A_Signal('somedata')
        2) emit a signal when needed via signal.emit(scope)
        3) the bus should listen for all emitted signals within the scope
        4) when a signal is emitted, the bus should store a signal in some place (probably it's memory)
        */

        /**
         * We need a context where component is registered, to prevent any duplicate registrations
         */
        const componentContext = A_Context.scope(this);


        if (!config) {
            config = new A_SignalConfig({
                stringStructure: globalConfig?.get('A_SIGNAL_VECTOR_STRUCTURE') || undefined
            });

            componentContext.register(config);
        }

        if (!config.ready)
            await config.initialize();

        if (!state) {
            state = new A_SignalState(config.structure);
            componentContext.register(state);
        }


        if (!state.has(signal))
            return;


        //  ------------------------------------------------------------------
        //  And finally if all checks are passed, we can update the state
        //  ------------------------------------------------------------------

        logger?.debug(`A_SignalBus: Updating state for signal '${signal.constructor.name}' with data:`, signal.data);

        state.set(signal);

        const vector = state.toVector();

        await vector.next(scope);
    }
}
