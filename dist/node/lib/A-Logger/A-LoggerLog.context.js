'use strict';

var aConcept = require('@adaas/a-concept');

class A_LoggerLogContext extends aConcept.A_Fragment {
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

exports.A_LoggerLogContext = A_LoggerLogContext;
//# sourceMappingURL=A-LoggerLog.context.js.map
//# sourceMappingURL=A-LoggerLog.context.js.map