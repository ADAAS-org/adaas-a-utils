import { A_Logger } from '../../A-Logger/A-Logger.component.js';
import { IcryptoInterface, Ifspolyfill } from '../A-Polyfill.types.js';
import '@adaas/a-concept';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-Config/A-Config.constants.js';

declare abstract class A_CryptoPolyfillBase {
    protected logger: A_Logger;
    protected _crypto: IcryptoInterface;
    protected _initialized: boolean;
    protected _fsPolyfill?: Ifspolyfill;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(fsPolyfill?: Ifspolyfill): Promise<IcryptoInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

export { A_CryptoPolyfillBase };
