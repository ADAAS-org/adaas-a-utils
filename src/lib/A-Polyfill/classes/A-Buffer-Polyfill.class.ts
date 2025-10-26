import { A_Context } from "@adaas/a-concept";
import { IbufferInterface } from "../A-Polyfill.types";
import { A_Logger } from "../../A-Logger/A-Logger.component";

export class A_BufferPolyfillClass {
    private _buffer!: IbufferInterface;
    private _initialized: boolean = false;

    constructor(
        protected logger: A_Logger
    ) {

    }

    get isInitialized(): boolean {
        return this._initialized;
    }


    async get(): Promise<IbufferInterface> {
        if (!this._initialized) {
            await this.init();
        }
        return this._buffer;
    }

    private async init(): Promise<void> {
        try {
            if (A_Context.environment === 'server') {
                await this.initServer();
            } else {
                this.initBrowser();
            }
            this._initialized = true;
        } catch (error) {
            this.initBrowser();
            this._initialized = true;
        }
    }

    private async initServer(): Promise<void> {
        const bufferModule = await import('buffer');
        this._buffer = {
            from: bufferModule.Buffer.from,
            alloc: bufferModule.Buffer.alloc,
            allocUnsafe: bufferModule.Buffer.allocUnsafe,
            isBuffer: bufferModule.Buffer.isBuffer,
            concat: bufferModule.Buffer.concat
        };
    }

    private initBrowser(): void {
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