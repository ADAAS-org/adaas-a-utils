import { A_Logger } from '../../A-Logger/A-Logger.component.js';
import { IbufferInterface } from '../A-Polyfill.types.js';
import '@adaas/a-concept';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-Config/A-Config.constants.js';

declare abstract class A_BufferPolyfillBase {
    protected logger: A_Logger;
    protected _buffer: IbufferInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IbufferInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

export { A_BufferPolyfillBase };
