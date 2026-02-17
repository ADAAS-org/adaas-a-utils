'use strict';

var aConcept = require('@adaas/a-concept');

class A_Service_Error extends aConcept.A_Error {
}
A_Service_Error.ServiceLoadError = "Service load error";
A_Service_Error.ServiceStartError = "Service start error";
A_Service_Error.ServiceStopError = "Service stop error";

exports.A_Service_Error = A_Service_Error;
//# sourceMappingURL=A-Service.error.js.map
//# sourceMappingURL=A-Service.error.js.map