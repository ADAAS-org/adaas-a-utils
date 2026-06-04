'use strict';

const A_CONSTANTS__INSPECTOR_ENV_VARIABLES = {
  /**
   * Shared secret used to authenticate inspector clients.
   *
   * The server side of the inspector will refuse any connection whose
   * handshake message does not carry exactly this value. If the variable
   * is not set, remote inspection is disabled on the server side.
   */
  A_CONCEPT_DEBUG_SECRET: "A_CONCEPT_DEBUG_SECRET",
  /**
   * If set to a truthy value (`'1'`, `'true'`, `'yes'`) the inspector
   * server is started automatically together with the concept (via the
   * `@A_Concept.Start()` lifecycle hook).
   */
  A_CONCEPT_INSPECTOR_ENABLED: "A_CONCEPT_INSPECTOR_ENABLED",
  /**
   * Hostname/interface the inspector TCP server binds to. Defaults to
   * `127.0.0.1` (loopback only) so the inspector is never exposed
   * outside the host unless explicitly configured.
   */
  A_CONCEPT_INSPECTOR_HOST: "A_CONCEPT_INSPECTOR_HOST",
  /**
   * TCP port the inspector server listens on. `0` lets the OS pick an
   * ephemeral port — useful for tests; the chosen port is announced via
   * the container's `address` property after `start()` resolves.
   */
  A_CONCEPT_INSPECTOR_PORT: "A_CONCEPT_INSPECTOR_PORT"
};
const A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY = [
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_DEBUG_SECRET,
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_ENABLED,
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_HOST,
  A_CONSTANTS__INSPECTOR_ENV_VARIABLES.A_CONCEPT_INSPECTOR_PORT
];
var A_InspectorFeatures = /* @__PURE__ */ ((A_InspectorFeatures2) => {
  A_InspectorFeatures2["onBeforeServe"] = "_A_Inspector_onBeforeServe";
  A_InspectorFeatures2["onServe"] = "_A_Inspector_onServe";
  A_InspectorFeatures2["onAfterServe"] = "_A_Inspector_onAfterServe";
  A_InspectorFeatures2["onBeforeShutdown"] = "_A_Inspector_onBeforeShutdown";
  A_InspectorFeatures2["onShutdown"] = "_A_Inspector_onShutdown";
  A_InspectorFeatures2["onAfterShutdown"] = "_A_Inspector_onAfterShutdown";
  A_InspectorFeatures2["onAuthenticate"] = "_A_Inspector_onAuthenticate";
  A_InspectorFeatures2["onCommand"] = "_A_Inspector_onCommand";
  return A_InspectorFeatures2;
})(A_InspectorFeatures || {});
var A_InspectorMessageType = /* @__PURE__ */ ((A_InspectorMessageType2) => {
  A_InspectorMessageType2["Auth"] = "auth";
  A_InspectorMessageType2["AuthOk"] = "auth-ok";
  A_InspectorMessageType2["AuthFail"] = "auth-fail";
  A_InspectorMessageType2["Command"] = "command";
  A_InspectorMessageType2["Result"] = "result";
  A_InspectorMessageType2["Error"] = "error";
  return A_InspectorMessageType2;
})(A_InspectorMessageType || {});
const A_CONSTANTS__INSPECTOR_DEFAULT_HOST = "127.0.0.1";
const A_CONSTANTS__INSPECTOR_DEFAULT_PORT = 0;

exports.A_CONSTANTS__INSPECTOR_DEFAULT_HOST = A_CONSTANTS__INSPECTOR_DEFAULT_HOST;
exports.A_CONSTANTS__INSPECTOR_DEFAULT_PORT = A_CONSTANTS__INSPECTOR_DEFAULT_PORT;
exports.A_CONSTANTS__INSPECTOR_ENV_VARIABLES = A_CONSTANTS__INSPECTOR_ENV_VARIABLES;
exports.A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY = A_CONSTANTS__INSPECTOR_ENV_VARIABLES_ARRAY;
exports.A_InspectorFeatures = A_InspectorFeatures;
exports.A_InspectorMessageType = A_InspectorMessageType;
//# sourceMappingURL=A-Inspector.constants.js.map
//# sourceMappingURL=A-Inspector.constants.js.map