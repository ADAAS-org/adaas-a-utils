import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_FSPolyfillBase } from "../base/A-FS-Polyfill.base";
import { Ifspolyfill } from "../A-Polyfill.types";
import fs from 'fs';

export class A_FSPolyfill extends A_FSPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._fs = fs as Ifspolyfill;
    }
}