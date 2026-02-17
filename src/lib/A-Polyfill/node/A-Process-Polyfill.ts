import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_ProcessPolyfillBase } from "../base/A-Process-Polyfill.base";

export class A_ProcessPolyfill extends A_ProcessPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._process = {
            env: process.env as Record<string, string>,
            argv: process.argv,
            platform: process.platform,
            version: process.version,
            versions: process.versions as Record<string, string>,
            cwd: process.cwd,
            exit: process.exit,
            nextTick: process.nextTick
        };
    }
}