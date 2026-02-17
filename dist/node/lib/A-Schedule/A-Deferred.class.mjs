import '../../chunk-EQQGB2QZ.mjs';

class A_Deferred {
  /**
   * Creates a deferred promise
   * @returns A promise that can be resolved or rejected later
   */
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveFn = resolve;
      this.rejectFn = reject;
    });
  }
  resolve(value) {
    this.resolveFn(value);
  }
  reject(reason) {
    this.rejectFn(reason);
  }
}

export { A_Deferred };
//# sourceMappingURL=A-Deferred.class.mjs.map
//# sourceMappingURL=A-Deferred.class.mjs.map