import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_BufferPolyfillBase } from "../base/A-Buffer-Polyfill.base";
import bufferModule from 'buffer';

export class A_BufferPolyfill extends A_BufferPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._buffer = {
            from: bufferModule.Buffer.from,
            alloc: bufferModule.Buffer.alloc,
            allocUnsafe: bufferModule.Buffer.allocUnsafe,
            isBuffer: bufferModule.Buffer.isBuffer,
            concat: bufferModule.Buffer.concat
        };
    }
}