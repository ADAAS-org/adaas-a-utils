"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Deferred = void 0;
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
exports.A_Deferred = A_Deferred;
//# sourceMappingURL=A-Deferred.class.js.map