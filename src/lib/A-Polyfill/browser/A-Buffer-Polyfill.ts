import type { A_Logger } from "@adaas/a-utils/a-logger";
import { A_BufferPolyfillBase } from "../base/A-Buffer-Polyfill.base";

export class A_BufferPolyfill extends A_BufferPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._buffer = {
            from: (data: any, encoding?: string) => {
                if (typeof data === 'string') {
                    return new TextEncoder().encode(data);
                }
                return new Uint8Array(data);
            },
            alloc: (size: number, fill?: any) => {
                const buffer = new Uint8Array(size);
                if (fill !== undefined) {
                    buffer.fill(fill);
                }
                return buffer;
            },
            allocUnsafe: (size: number) => {
                return new Uint8Array(size);
            },
            isBuffer: (obj: any) => {
                return obj instanceof Uint8Array || obj instanceof ArrayBuffer;
            },
            concat: (list: any[], totalLength?: number) => {
                const length = totalLength || list.reduce((sum, buf) => sum + buf.length, 0);
                const result = new Uint8Array(length);
                let offset = 0;
                for (const buf of list) {
                    result.set(buf, offset);
                    offset += buf.length;
                }
                return result;
            }
        };
    }
}