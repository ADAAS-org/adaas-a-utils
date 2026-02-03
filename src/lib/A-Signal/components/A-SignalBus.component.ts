import { A_Caller, A_Component, A_Context, A_Dependency, A_Error, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_SignalState } from "../context/A-SignalState.context";
import { A_SignalConfig } from "../context/A-SignalConfig.context";
import { A_Config } from "../../A-Config/A-Config.context";
import { A_Logger } from "../../A-Logger/A-Logger.component";
import { A_Signal } from "../entities/A-Signal.entity";
import { A_Frame } from "@adaas/a-frame";
import { A_SignalBusFeatures } from "./A-SignalBus.constants";
import { A_SignalBusError } from "./A-SignalBus.error";



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


    @A_Frame.Method({
        description: 'Emit multiple signals through the signal bus.'
    })
    async next(...signals: A_Signal[]) {
        const scope = new A_Scope({
            name: `A_SignalBus-Next-Scope`,
            entities: signals
        })
            .inherit(A_Context.scope(this));

        try {
            await this.call(A_SignalBusFeatures.onBeforeNext, scope);

            await this.call(A_SignalBusFeatures.onNext, scope);

            scope.destroy();

        } catch (error) {

            let wrappedError;

            switch (true) {
                case error instanceof A_SignalBusError:
                    wrappedError = error;
                    break;

                case error instanceof A_Error && error.originalError instanceof A_SignalBusError:
                    wrappedError = error.originalError;
                    break;

                default:
                    wrappedError = new A_SignalBusError({
                        title: A_SignalBusError.SignalProcessingError,
                        description: `An error occurred while processing the signal.`,
                        originalError: error
                    })
                    break;
            }

            scope.register(wrappedError);

            await this.call(A_SignalBusFeatures.onError);

            scope.destroy();
        }
    }


    @A_Feature.Extend({
        before: /.*/
    })
    protected async [A_SignalBusFeatures.onError](
        @A_Inject(A_Error) error: A_Error,
        @A_Inject(A_Logger) logger?: A_Logger,
        ...args: any[]
    ) {
        logger?.error(error);
    }

    @A_Feature.Extend({
        scope: [A_SignalBus],
        before: /.*/
    })
    async [A_SignalBusFeatures.onBeforeNext](
        @A_Inject(A_Scope) scope: A_Scope,

        @A_Inject(A_Config) globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>,
        @A_Inject(A_SignalState) state?: A_SignalState,

        @A_Inject(A_Logger) logger?: A_Logger,
        @A_Inject(A_SignalConfig) config?: A_SignalConfig,
    ) {
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
    }

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
        scope: [A_SignalBus],
        before: /.*/
    })
    async [A_SignalBusFeatures.onNext](
        @A_Dependency.Flat()
        @A_Dependency.All()
        @A_Inject(A_Signal) signals: A_Signal[],
        @A_Inject(A_Scope) scope: A_Scope,

        @A_Dependency.Required()
        @A_Inject(A_SignalState) state: A_SignalState,

        @A_Inject(A_Config) globalConfig?: A_Config<['A_SIGNAL_VECTOR_STRUCTURE']>,
        @A_Inject(A_Logger) logger?: A_Logger,
        @A_Inject(A_SignalConfig) config?: A_SignalConfig,
    ) {
        /*
        1) create a signal when it occurs via new A_Signal('somedata')
        2) emit a signal when needed via bus.next(signal)
        3) the bus should listen for all emitted signals within the scope
        4) when a signal is emitted, the bus should store a signal in some place (probably it's memory)
        */
        // const signals = scope.resolveFlatAll<A_Signal>(A_Signal);

        for (const signal of signals) {

            if (!state.has(signal))
                return;

            //  ------------------------------------------------------------------
            //  And finally if all checks are passed, we can update the state
            //  ------------------------------------------------------------------

            logger?.debug(`A_SignalBus: Updating state for signal '${signal.constructor.name}' with data:`, signal.data);

            state.set(signal);
        }

        const vector = state.toVector();

        scope.register(vector);
    }
}
