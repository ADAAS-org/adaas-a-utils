import { A_CommonHelper, A_Context, A_Fragment, A_TYPES__Component_Constructor, A_TYPES__Entity_Constructor } from "@adaas/a-concept";
import { A_SignalConfig_Init } from "../A-Signal.types";
import { A_Signal } from "../entities/A-Signal.entity";
import { A_Frame } from "@adaas/a-frame";



/**
 * This component should dictate a structure of the vector for all signals within a given scope.
 * so if there're multiple signals it should say what type at what position should be expected.
 * 
 * e.g. [A_RouterWatcher, A_ScopeWatcher, A_LoggerWatcher]
 * This structure then should be used for any further processing of signals within the scope.
 */
@A_Frame.Fragment({
    namespace: 'A-Utils',
    name: 'A-SignalConfig',
    description: 'Signal configuration fragment that defines the structure and types of signals within a given scope. It allows specifying the expected signal constructors and their order, facilitating consistent signal management and processing across components that emit or listen to signals.'
})
export class A_SignalConfig extends A_Fragment {

    protected _structure?: Array<A_TYPES__Entity_Constructor<A_Signal>>;

    protected _config: A_SignalConfig_Init

    protected _ready?: Promise<void>;

    get structure(): Array<A_TYPES__Entity_Constructor<A_Signal>> {
        if (this._structure) {
            return this._structure;
        }

        const scope = A_Context.scope(this);

        //  just sort by constructor name to have consistent order
        const constructors = [...scope.allowedEntities]
            .filter(e => A_CommonHelper.isInheritedFrom(e, A_Signal))
            .sort((a, b) => a.constructor.name.localeCompare(b.name))
            .map(s => scope.resolveConstructor<A_Signal>(s.name));

        return constructors.filter(s => s) as Array<A_TYPES__Entity_Constructor<A_Signal>>;
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