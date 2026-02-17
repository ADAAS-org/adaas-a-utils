'use strict';

var aConcept = require('@adaas/a-concept');

class A_CommandError extends aConcept.A_Error {
}
A_CommandError.CommandScopeBindingError = "A-Command Scope Binding Error";
A_CommandError.ExecutionError = "A-Command Execution Error";
A_CommandError.ResultProcessingError = "A-Command Result Processing Error";
/**
 * Error indicating that the command was interrupted during execution
 */
A_CommandError.CommandInterruptedError = "A-Command Interrupted Error";

exports.A_CommandError = A_CommandError;
//# sourceMappingURL=A-Command.error.js.map
//# sourceMappingURL=A-Command.error.js.map