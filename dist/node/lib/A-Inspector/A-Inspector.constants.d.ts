/**
 * A-Inspector Environment Variables
 *
 * These are read through `A_Config` (so they can come from environment
 * variables OR from a `<concept>.conf.json` file) and control how the
 * `A_ConceptInspector` container behaves at runtime.
 */
declare const A_CONSTANTS__INSPECTOR_ENV_VARIABLES: {
    /**
     * Shared secret used to authenticate inspector clients.
     *
     * The server side of the inspector will refuse any connection whose
     * handshake message does not carry exactly this value. If the variable
     * is not set, remote inspection is disabled on the server side.
     */
    readonly A_CONCEPT_DEBUG_SECRET: "A_CONCEPT_DEBUG_SECRET";
    /**
     * If set to a truthy value (`'1'`, `'true'`, `'yes'`) the inspector
     * server is started automatically together with the concept (via the
     * `@A_Concept.Start()` lifecycle hook).
     */
    readonly A_CONCEPT_INSPECTOR_ENABLED: "A_CONCEPT_INSPECTOR_ENABLED";
    /**
     * Hostname/interface the inspector TCP server binds to. Defaults to
     * `127.0.0.1` (loopback only) so the inspector is never exposed
     * outside the host unless explicitly configured.
     */
    readonly A_CONCEPT_INSPECTOR_HOST: "A_CONCEPT_INSPECTOR_HOST";
    /**
     * TCP port the inspector server listens on. `0` lets the OS pick an
     * ephemeral port — useful for tests; the chosen port is announced via
     * the container's `address` property after `start()` resolves.
     */
    readonly A_CONCEPT_INSPECTOR_PORT: "A_CONCEPT_INSPECTOR_PORT";
};
declare const A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY: readonly ["A_CONCEPT_DEBUG_SECRET", "A_CONCEPT_INSPECTOR_ENABLED", "A_CONCEPT_INSPECTOR_HOST", "A_CONCEPT_INSPECTOR_PORT"];
/**
 * Feature extension points exposed by the inspector container. Other
 * components can hook into these via `@A_Feature.Extend()` to customize
 * authentication, transport, or per-command behavior.
 */
declare enum A_InspectorFeatures {
    onBeforeServe = "_A_Inspector_onBeforeServe",
    onServe = "_A_Inspector_onServe",
    onAfterServe = "_A_Inspector_onAfterServe",
    onBeforeShutdown = "_A_Inspector_onBeforeShutdown",
    onShutdown = "_A_Inspector_onShutdown",
    onAfterShutdown = "_A_Inspector_onAfterShutdown",
    onAuthenticate = "_A_Inspector_onAuthenticate",
    onCommand = "_A_Inspector_onCommand"
}
/**
 * Wire-protocol message types exchanged between an inspector client and
 * server over the TCP transport. Messages are newline-delimited JSON.
 */
declare enum A_InspectorMessageType {
    Auth = "auth",
    AuthOk = "auth-ok",
    AuthFail = "auth-fail",
    Command = "command",
    Result = "result",
    Error = "error"
}
/** Default inspector bind host when none is configured. */
declare const A_CONSTANTS__INSPECTOR_DEFAULT_HOST = "127.0.0.1";
/** Default inspector port when none is configured (0 = OS-assigned). */
declare const A_CONSTANTS__INSPECTOR_DEFAULT_PORT = 0;

export { A_CONSTANTS__INSPECTOR_DEFAULT_HOST, A_CONSTANTS__INSPECTOR_DEFAULT_PORT, A_CONSTANTS__INSPECTOR_ENV_VARIABLES, A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY, A_InspectorFeatures, A_InspectorMessageType };
