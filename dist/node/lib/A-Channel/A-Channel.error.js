'use strict';

var aConcept = require('@adaas/a-concept');
var aOperation = require('@adaas/a-utils/a-operation');

class A_ChannelError extends aConcept.A_Error {
  /**
   * Channel Error allows to keep track of errors within a channel if something goes wrong
   * 
   * 
   * @param originalError 
   * @param context 
   */
  constructor(originalError, context) {
    if (aConcept.A_TypeGuards.isString(context))
      super(originalError, context);
    else
      super(originalError);
    if (context instanceof aOperation.A_OperationContext)
      this._context = context;
  }
  /***
   * Returns Context of the error
   */
  get context() {
    return this._context;
  }
}
// ==========================================================
// ==================== Error Types =========================
// ==========================================================
A_ChannelError.MethodNotImplemented = "A-Channel Method Not Implemented";

exports.A_ChannelError = A_ChannelError;
//# sourceMappingURL=A-Channel.error.js.map
//# sourceMappingURL=A-Channel.error.js.map