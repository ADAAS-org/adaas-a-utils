import type { A_TYPES__Command_Serialized } from "@adaas/a-utils/a-command";
import { A_CONSTANTS__INSPECTOR_ENV_VARIABLES, A_InspectorMessageType } from "./A-Inspector.constants";


export type InspectorConfigVars = [
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST,
    typeof A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT,
];

/**
 * Connection options used by `A_ConceptInspector.query()` to reach a
 * remote (or in-process) inspector server.
 */
export type A_TYPES__InspectorClientOptions = {
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
export type A_TYPES__InspectorAddress = {
    host: string;
    port: number;
};


// ----------------------------------------------------------------------------
//  Wire protocol
// ----------------------------------------------------------------------------

export type A_TYPES__InspectorMessage_Auth = {
    type: A_InspectorMessageType.Auth;
    secret: string;
};

export type A_TYPES__InspectorMessage_AuthOk = {
    type: A_InspectorMessageType.AuthOk;
};

export type A_TYPES__InspectorMessage_AuthFail = {
    type: A_InspectorMessageType.AuthFail;
    reason: string;
};

export type A_TYPES__InspectorMessage_Command = {
    type: A_InspectorMessageType.Command;
    /** Correlation id so multiple in-flight commands can share a socket. */
    id: string;
    payload: A_TYPES__Command_Serialized;
};

export type A_TYPES__InspectorMessage_Result = {
    type: A_InspectorMessageType.Result;
    id: string;
    payload: A_TYPES__Command_Serialized;
};

export type A_TYPES__InspectorMessage_Error = {
    type: A_InspectorMessageType.Error;
    id?: string;
    error: { title: string; description?: string };
};

export type A_TYPES__InspectorMessage =
    | A_TYPES__InspectorMessage_Auth
    | A_TYPES__InspectorMessage_AuthOk
    | A_TYPES__InspectorMessage_AuthFail
    | A_TYPES__InspectorMessage_Command
    | A_TYPES__InspectorMessage_Result
    | A_TYPES__InspectorMessage_Error;


// ----------------------------------------------------------------------------
//  Inspection payloads (these are what the introspection commands return as
//  their `result` and so are the canonical "snapshot" types consumers see).
// ----------------------------------------------------------------------------

export type A_TYPES__InspectorConceptSnapshot = {
    name: string;
    environment: string | undefined;
    rootScope: A_TYPES__InspectorScopeSnapshot;
    containers: Array<A_TYPES__InspectorContainerSnapshot>;
};

export type A_TYPES__InspectorScopeSnapshot = {
    name: string;
    fingerprint: string;
    version: number;
    parent: string | undefined;
    imports: Array<string>;
    components: Array<{ name: string; constructor: string }>;
    fragments: Array<{ name: string; constructor: string }>;
    entities: Array<{ name: string; constructor: string; aseid: string }>;
    errors: Array<{ name: string; code: string }>;
    allowedComponents: Array<string>;
    allowedEntities: Array<string>;
    allowedFragments: Array<string>;
    allowedErrors: Array<string>;
};

export type A_TYPES__InspectorContainerSnapshot = {
    name: string;
    constructor: string;
    scope: string;
};

export type A_TYPES__InspectorFeatureStepSnapshot = {
    handler: string;
    dependency: string;
    order?: number;
    scope?: string;
    override?: string;
};

export type A_TYPES__InspectorFeatureSnapshot = {
    component: string;
    feature: string;
    steps: Array<A_TYPES__InspectorFeatureStepSnapshot>;
};
