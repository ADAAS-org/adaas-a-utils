import { A_Context, A_Fragment, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor } from "@adaas/a-concept";
import { A_SignalConfig_Init } from "../A-Signal.types";
import { A_Signal } from "../entities/A-Signal.entity";



/**
 * This component should dictate a structure of the vector for all signals within a given scope.
 * so if there're multiple signals it should say what type at what position should be expected.
 * 
 * e.g. [A_RouterWatcher, A_ScopeWatcher, A_LoggerWatcher]
 * This structure then should be used for any further processing of signals within the scope.
 */
export class A_SignalConfig extends A_Fragment {

    protected _structure?: Array<A_TYPES__Entity_Constructor<A_Signal>>;

    protected _config: A_SignalConfig_Init

    protected _ready?: Promise<void>;

    get structure(): Array<A_TYPES__Entity_Constructor<A_Signal>> {
        if (this._structure) {
            return this._structure;
        }

        const scope = A_Context.scope(this);
        const signalConfigs = scope.allowedEntities;

        //  just sort by constructor name to have consistent order
        return [...scope.allowedEntities]
            .sort((a, b) => a.constructor.name.localeCompare(b.constructor.name))
            .map(s => scope.resolveConstructor<A_Signal>(s.constructor.name));
    }

    /**
     * Uses for synchronization to ensure the config is initialized.
     * 
     * @returns True if the configuration has been initialized.
     */
    get ready() {
        return this._ready;
    }

    constructor(
        params: A_SignalConfig_Init
    ) {
        super({ name: "A_SignalConfig" });
        this._config = params;
    }


    /**
     * Initializes the signal configuration if not already initialized.
     * 
     * @returns 
     */
    async initialize() {
        if (!this._ready) {
            this._ready = this._initialize();
        }
        return this._ready;
    }

    /**
     * Initializes the signal configuration by processing the provided structure or string representation.
     * This method sets up the internal structure of signal constructors based on the configuration.
     */
    protected async _initialize() {
        if (this._config.structure) {
            this._structure = this._config.structure;
        } else if (this._config.stringStructure) {
            const stringStructure = this._config.stringStructure.split(',').map(s => s.trim());
            this._structure = stringStructure
                .map(name => A_Context.scope(this).resolveConstructor<A_Signal>(name))
                .filter(s => s);
        }

    }

}