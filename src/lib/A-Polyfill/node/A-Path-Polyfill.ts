import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_PathPolyfillBase } from "../base/A-Path-Polyfill.base";
import { IpathInterface } from "../A-Polyfill.types";
import pathModule from 'path';

export class A_PathPolyfill extends A_PathPolyfillBase {
    constructor(logger: A_Logger) {
        super(logger);
    }

    protected async initImplementation(): Promise<void> {
        this._path = {
            basename: pathModule.basename,
            dirname: pathModule.dirname,
            extname: pathModule.extname,
            join: pathModule.join,
            resolve: pathModule.resolve,
            relative: pathModule.relative,
            normalize: pathModule.normalize,
            isAbsolute: pathModule.isAbsolute,
            parse: pathModule.parse,
            format: pathModule.format,
            sep: pathModule.sep,
            delimiter: pathModule.delimiter
        } as IpathInterface;
    }
}