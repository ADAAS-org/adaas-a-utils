import { A_Logger } from '../../A-Logger/A-Logger.component.mjs';
import { A_CryptoPolyfillBase } from '../base/A-Crypto-Polyfill.base.mjs';
import '@adaas/a-concept';
import '../../A-Logger/A-Logger.types.mjs';
import '../../A-Logger/A-Logger.env.mjs';
import '../../A-Config/A-Config.context.mjs';
import '../../A-Config/A-Config.types.mjs';
import '../../A-Execution/A-Execution.context.mjs';
import '../../A-Config/A-Config.constants.mjs';
import '../A-Polyfill.types.mjs';

declare class A_CryptoPolyfill extends A_CryptoPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

export { A_CryptoPolyfill };
