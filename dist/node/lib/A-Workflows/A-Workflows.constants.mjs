import '../../chunk-EQQGB2QZ.mjs';

var A_Workflow_Status = /* @__PURE__ */ ((A_Workflow_Status2) => {
  A_Workflow_Status2["CREATED"] = "CREATED";
  A_Workflow_Status2["RUNNING"] = "RUNNING";
  A_Workflow_Status2["PAUSED"] = "PAUSED";
  A_Workflow_Status2["COMPLETED"] = "COMPLETED";
  A_Workflow_Status2["FAILED"] = "FAILED";
  return A_Workflow_Status2;
})(A_Workflow_Status || {});
var A_WorkflowFeatures = /* @__PURE__ */ ((A_WorkflowFeatures2) => {
  A_WorkflowFeatures2["onStart"] = "_A_Workflow_onStart";
  A_WorkflowFeatures2["onBeforeStep"] = "_A_Workflow_onBeforeStep";
  A_WorkflowFeatures2["onAfterStep"] = "_A_Workflow_onAfterStep";
  A_WorkflowFeatures2["onPause"] = "_A_Workflow_onPause";
  A_WorkflowFeatures2["onResume"] = "_A_Workflow_onResume";
  A_WorkflowFeatures2["onComplete"] = "_A_Workflow_onComplete";
  A_WorkflowFeatures2["onFail"] = "_A_Workflow_onFail";
  return A_WorkflowFeatures2;
})(A_WorkflowFeatures || {});
var A_WorkflowEvent = /* @__PURE__ */ ((A_WorkflowEvent2) => {
  A_WorkflowEvent2["onStart"] = "onStart";
  A_WorkflowEvent2["onStep"] = "onStep";
  A_WorkflowEvent2["onSkip"] = "onSkip";
  A_WorkflowEvent2["onPause"] = "onPause";
  A_WorkflowEvent2["onResume"] = "onResume";
  A_WorkflowEvent2["onComplete"] = "onComplete";
  A_WorkflowEvent2["onFail"] = "onFail";
  return A_WorkflowEvent2;
})(A_WorkflowEvent || {});
var A_WorkflowStepErrorBehavior = /* @__PURE__ */ ((A_WorkflowStepErrorBehavior2) => {
  A_WorkflowStepErrorBehavior2["FAIL"] = "fail";
  A_WorkflowStepErrorBehavior2["CONTINUE"] = "continue";
  A_WorkflowStepErrorBehavior2["GOTO"] = "goto";
  return A_WorkflowStepErrorBehavior2;
})(A_WorkflowStepErrorBehavior || {});
var A_WorkflowConditionFn = /* @__PURE__ */ ((A_WorkflowConditionFn2) => {
  A_WorkflowConditionFn2["EQUALS"] = "equals";
  A_WorkflowConditionFn2["NOT_EQUALS"] = "notEquals";
  A_WorkflowConditionFn2["EXISTS"] = "exists";
  A_WorkflowConditionFn2["NOT_EXISTS"] = "notExists";
  A_WorkflowConditionFn2["TRUTHY"] = "truthy";
  A_WorkflowConditionFn2["FALSY"] = "falsy";
  A_WorkflowConditionFn2["GT"] = "gt";
  A_WorkflowConditionFn2["GTE"] = "gte";
  A_WorkflowConditionFn2["LT"] = "lt";
  A_WorkflowConditionFn2["LTE"] = "lte";
  A_WorkflowConditionFn2["IN"] = "in";
  A_WorkflowConditionFn2["MATCHES"] = "matches";
  A_WorkflowConditionFn2["AND"] = "and";
  A_WorkflowConditionFn2["OR"] = "or";
  A_WorkflowConditionFn2["NOT"] = "not";
  return A_WorkflowConditionFn2;
})(A_WorkflowConditionFn || {});
var A_WorkflowValueFn = /* @__PURE__ */ ((A_WorkflowValueFn2) => {
  A_WorkflowValueFn2["CONCAT"] = "concat";
  A_WorkflowValueFn2["UPPERCASE"] = "uppercase";
  A_WorkflowValueFn2["LOWERCASE"] = "lowercase";
  A_WorkflowValueFn2["COALESCE"] = "coalesce";
  A_WorkflowValueFn2["NOW"] = "now";
  A_WorkflowValueFn2["SUM"] = "sum";
  A_WorkflowValueFn2["NOT"] = "not";
  A_WorkflowValueFn2["JSON"] = "json";
  return A_WorkflowValueFn2;
})(A_WorkflowValueFn || {});
var A_WorkflowContextKey = /* @__PURE__ */ ((A_WorkflowContextKey2) => {
  A_WorkflowContextKey2["PARAMS"] = "params";
  A_WorkflowContextKey2["STEPS"] = "steps";
  return A_WorkflowContextKey2;
})(A_WorkflowContextKey || {});

export { A_WorkflowConditionFn, A_WorkflowContextKey, A_WorkflowEvent, A_WorkflowFeatures, A_WorkflowStepErrorBehavior, A_WorkflowValueFn, A_Workflow_Status };
//# sourceMappingURL=A-Workflows.constants.mjs.map
//# sourceMappingURL=A-Workflows.constants.mjs.map