import type { A_Logger } from "@adaas/a-utils/a-logger";
import { A_FSPolyfillBase } from "../base/A-FS-Polyfill.base";

export class A_FSPolyfill extends A_FSPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._fs = {
            readFileSync: (path: string, encoding: string) => {
                this.logger.warning('fs.readFileSync not available in browser environment');
                return '';
            },
            existsSync: (path: string) => {
                this.logger.warning('fs.existsSync not available in browser environment');
                return false;
            },
            createReadStream: (path: string) => {
                this.logger.warning('fs.createReadStream not available in browser environment');
                return null;
            }
        };
    }
}