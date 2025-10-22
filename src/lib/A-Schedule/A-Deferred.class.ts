export class A_Deferred<T> {
    public promise: Promise<T>;
    private resolveFn!: (value: T | PromiseLike<T>) => void;
    private rejectFn!: (reason?: any) => void;

    /**
     * Creates a deferred promise
     * @returns A promise that can be resolved or rejected later
     */
    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolveFn = resolve;
            this.rejectFn = reject;
        });
    }

    resolve(value: T | PromiseLike<T>): void {
        this.resolveFn(value);
    }

    reject(reason?: any): void {
        this.rejectFn(reason);
    }
}