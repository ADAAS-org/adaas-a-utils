import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_ProcessPolyfillBase } from "../base/A-Process-Polyfill.base";

export class A_ProcessPolyfill extends A_ProcessPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._process = {
            env: {
                NODE_ENV: 'browser',
                ...((globalThis as any).process?.env || {})
            },
            argv: ['browser'],
            platform: 'browser',
            version: 'browser',
            versions: { node: 'browser' },
            cwd: () => '/',
            exit: (code?: number) => {
                this.logger.warning('process.exit not available in browser');
                throw new Error(`Process exit with code ${code}`);
            },
            nextTick: (callback: Function, ...args: any[]) => {
                setTimeout(() => callback(...args), 0);
            }
        };
    }
}