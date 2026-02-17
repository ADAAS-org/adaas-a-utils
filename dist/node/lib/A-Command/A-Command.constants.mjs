import '../../chunk-EQQGB2QZ.mjs';

var A_Command_Status = /* @__PURE__ */ ((A_Command_Status2) => {
  A_Command_Status2["CREATED"] = "CREATED";
  A_Command_Status2["INITIALIZED"] = "INITIALIZED";
  A_Command_Status2["COMPILED"] = "COMPILED";
  A_Command_Status2["EXECUTING"] = "EXECUTING";
  A_Command_Status2["COMPLETED"] = "COMPLETED";
  A_Command_Status2["FAILED"] = "FAILED";
  return A_Command_Status2;
})(A_Command_Status || {});
var A_CommandTransitions = /* @__PURE__ */ ((A_CommandTransitions2) => {
  A_CommandTransitions2["CREATED_TO_INITIALIZED"] = "created_initialized";
  A_CommandTransitions2["INITIALIZED_TO_EXECUTING"] = "initialized_executing";
  A_CommandTransitions2["EXECUTING_TO_COMPLETED"] = "executing_completed";
  A_CommandTransitions2["EXECUTING_TO_FAILED"] = "executing_failed";
  return A_CommandTransitions2;
})(A_CommandTransitions || {});
var A_CommandFeatures = /* @__PURE__ */ ((A_CommandFeatures2) => {
  A_CommandFeatures2["onInit"] = "_A_Command_onInit";
  A_CommandFeatures2["onBeforeExecute"] = "_A_Command_onBeforeExecute";
  A_CommandFeatures2["onExecute"] = "_A_Command_onExecute";
  A_CommandFeatures2["onAfterExecute"] = "_A_Command_onAfterExecute";
  A_CommandFeatures2["onComplete"] = "_A_Command_onComplete";
  A_CommandFeatures2["onFail"] = "_A_Command_onFail";
  A_CommandFeatures2["onError"] = "_A_Command_onError";
  return A_CommandFeatures2;
})(A_CommandFeatures || {});
var A_CommandEvent = /* @__PURE__ */ ((A_CommandEvent2) => {
  A_CommandEvent2["onInit"] = "onInit";
  A_CommandEvent2["onBeforeExecute"] = "onBeforeExecute";
  A_CommandEvent2["onExecute"] = "onExecute";
  A_CommandEvent2["onAfterExecute"] = "onAfterExecute";
  A_CommandEvent2["onComplete"] = "onComplete";
  A_CommandEvent2["onFail"] = "onFail";
  A_CommandEvent2["onError"] = "onError";
  return A_CommandEvent2;
})(A_CommandEvent || {});

export { A_CommandEvent, A_CommandFeatures, A_CommandTransitions, A_Command_Status };
//# sourceMappingURL=A-Command.constants.mjs.map
//# sourceMappingURL=A-Command.constants.mjs.map