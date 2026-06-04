import { e as A_TYPES__Command_Serialized } from '../../A-Command.entity-ISgSk8wB.js';
import { A_CONSTANTS__INSPECTOR_ENV_VARIABLES, A_InspectorMessageType } from './A-Inspector.constants.js';
import '../A-Command/A-Command.constants.js';
import '@adaas/a-concept';
import '../A-StateMachine/A-StateMachine.component.js';
import '../A-StateMachine/A-StateMachine.constants.js';
import '../A-StateMachine/A-StateMachineTransition.context.js';
import '../A-Operation/A-Operation.context.js';
import '../A-Operation/A-Operation.types.js';
import '../A-Execution/A-Execution.context.js';
import '../A-StateMachine/A-StateMachine.types.js';
import '../A-Logger/A-Logger.component.js';
import '../A-Logger/A-Logger.types.js';
import '../A-Logger/A-Logger.constants.js';
import '../A-Logger/A-Logger.env.js';
import '../A-Config/A-Config.context.js';
import '../A-Config/A-Config.types.js';
import '../A-Config/A-Config.constants.js';

type InspectorConfigVars = [
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT
];
/**
 * Connection options used by `A_ConceptInspector.query()` to reach a
 * remote (or in-process) inspector server.
 */
type A_TYPES__InspectorClientOptions = {
    host: string;
    port: number;
    secret: string;
    /** Maximum time to wait for the remote response, in milliseconds. */
    timeout?: number;
};
/**
 * Resolved address of a running inspector server. Returned by the server
 * after `start()` completes (especially useful when port `0` was used).
 */
type A_TYPES__InspectorAddress = {
    host: string;
    port: number;
};
type A_TYPES__InspectorMessage_Auth = {
    type: A_InspectorMessageType.Auth;
    secret: string;
};
type A_TYPES__InspectorMessage_AuthOk = {
    type: A_InspectorMessageType.AuthOk;
};
type A_TYPES__InspectorMessage_AuthFail = {
    type: A_InspectorMessageType.AuthFail;
    reason: string;
};
type A_TYPES__InspectorMessage_Command = {
    type: A_InspectorMessageType.Command;
    /** Correlation id so multiple in-flight commands can share a socket. */
    id: string;
    payload: A_TYPES__Command_Serialized;
};
type A_TYPES__InspectorMessage_Result = {
    type: A_InspectorMessageType.Result;
    id: string;
    payload: A_TYPES__Command_Serialized;
};
type A_TYPES__InspectorMessage_Error = {
    type: A_InspectorMessageType.Error;
    id?: string;
    error: {
        title: string;
        description?: string;
    };
};
type A_TYPES__InspectorMessage = A_TYPES__InspectorMessage_Auth | A_TYPES__InspectorMessage_AuthOk | A_TYPES__InspectorMessage_AuthFail | A_TYPES__InspectorMessage_Command | A_TYPES__InspectorMessage_Result | A_TYPES__InspectorMessage_Error;
type A_TYPES__InspectorConceptSnapshot = {
    name: string;
    environment: string | undefined;
    rootScope: A_TYPES__InspectorScopeSnapshot;
    containers: Array<A_TYPES__InspectorContainerSnapshot>;
};
type A_TYPES__InspectorScopeSnapshot = {
    name: string;
    fingerprint: string;
    version: number;
    parent: string | undefined;
    imports: Array<string>;
    components: Array<{
        name: string;
        constructor: string;
    }>;
    fragments: Array<{
        name: string;
        constructor: string;
    }>;
    entities: Array<{
        name: string;
        constructor: string;
        aseid: string;
    }>;
    errors: Array<{
        name: string;
        code: string;
    }>;
    allowedComponents: Array<string>;
    allowedEntities: Array<string>;
    allowedFragments: Array<string>;
    allowedErrors: Array<string>;
};
type A_TYPES__InspectorContainerSnapshot = {
    name: string;
    constructor: string;
    scope: string;
};
type A_TYPES__InspectorFeatureStepSnapshot = {
    handler: string;
    dependency: string;
    order?: number;
    scope?: string;
    override?: string;
};
type A_TYPES__InspectorFeatureSnapshot = {
    component: string;
    feature: string;
    steps: Array<A_TYPES__InspectorFeatureStepSnapshot>;
};

export type { A_TYPES__InspectorAddress, A_TYPES__InspectorClientOptions, A_TYPES__InspectorConceptSnapshot, A_TYPES__InspectorContainerSnapshot, A_TYPES__InspectorFeatureSnapshot, A_TYPES__InspectorFeatureStepSnapshot, A_TYPES__InspectorMessage, A_TYPES__InspectorMessage_Auth, A_TYPES__InspectorMessage_AuthFail, A_TYPES__InspectorMessage_AuthOk, A_TYPES__InspectorMessage_Command, A_TYPES__InspectorMessage_Error, A_TYPES__InspectorMessage_Result, A_TYPES__InspectorScopeSnapshot, InspectorConfigVars };
