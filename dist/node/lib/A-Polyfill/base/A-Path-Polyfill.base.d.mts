import { A_Logger } from '../../A-Logger/A-Logger.component.mjs';
import { IpathInterface } from '../A-Polyfill.types.mjs';
import '@adaas/a-concept';
import '../../A-Logger/A-Logger.types.mjs';
import '../../A-Logger/A-Logger.env.mjs';
import '../../A-Config/A-Config.context.mjs';
import '../../A-Config/A-Config.types.mjs';
import '../../A-Execution/A-Execution.context.mjs';
import '../../A-Config/A-Config.constants.mjs';

declare abstract class A_PathPolyfillBase {
    protected logger: A_Logger;
    protected _path: IpathInterface;
    protected _initialized: boolean;
    constructor(logger: A_Logger);
    get isInitialized(): boolean;
    get(): Promise<IpathInterface>;
    protected init(): Promise<void>;
    protected abstract initImplementation(): Promise<void>;
}

export { A_PathPolyfillBase };
