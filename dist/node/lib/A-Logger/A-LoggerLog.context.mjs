import '../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';

class A_LoggerLogContext extends A_Fragment {
  constructor(level, ...args) {
    super();
    this.level = level;
    this.args = args;
  }
  toJSON() {
    return {
      ...super.toJSON(),
      level: this.level,
      args: this.args
    };
  }
}

export { A_LoggerLogContext };
//# sourceMappingURL=A-LoggerLog.context.mjs.map
//# sourceMappingURL=A-LoggerLog.context.mjs.map