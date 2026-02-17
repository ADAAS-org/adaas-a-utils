import '../../chunk-EQQGB2QZ.mjs';
import { A_Error, A_TypeGuards } from '@adaas/a-concept';
import { A_OperationContext } from '@adaas/a-utils/a-operation';

class A_ChannelError extends A_Error {
  /**
   * Channel Error allows to keep track of errors within a channel if something goes wrong
   * 
   * 
   * @param originalError 
   * @param context 
   */
  constructor(originalError, context) {
    if (A_TypeGuards.isString(context))
      super(originalError, context);
    else
      super(originalError);
    if (context instanceof A_OperationContext)
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

export { A_ChannelError };
//# sourceMappingURL=A-Channel.error.mjs.map
//# sourceMappingURL=A-Channel.error.mjs.map