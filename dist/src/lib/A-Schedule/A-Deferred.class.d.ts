export declare class A_Deferred<T> {
    promise: Promise<T>;
    private resolveFn;
    private rejectFn;
    /**
     * Creates a deferred promise
     * @returns A promise that can be resolved or rejected later
     */
    constructor();
    resolve(value: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}
