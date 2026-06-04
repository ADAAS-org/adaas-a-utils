'use strict';

var aConcept = require('@adaas/a-concept');

class A_InspectorError extends aConcept.A_Error {
}
A_InspectorError.InspectorStartError = "Inspector start error";
A_InspectorError.InspectorStopError = "Inspector stop error";
A_InspectorError.InspectorAuthError = "Inspector authentication failure";
A_InspectorError.InspectorTransportError = "Inspector transport error";
A_InspectorError.InspectorProtocolError = "Inspector protocol error";
A_InspectorError.InspectorCommandNotFoundError = "Inspector command not found";
A_InspectorError.InspectorDisabledError = "Inspector disabled";
A_InspectorError.InspectorNotSupportedError = "Inspector not supported in this runtime";

exports.A_InspectorError = A_InspectorError;
//# sourceMappingURL=A-Inspector.error.js.map
//# sourceMappingURL=A-Inspector.error.js.map