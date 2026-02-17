import { A_Logger } from '../../A-Logger/A-Logger.component.js';
import { A_ProcessPolyfillBase } from '../base/A-Process-Polyfill.base.js';
import '@adaas/a-concept';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-Config/A-Config.constants.js';
import '../A-Polyfill.types.js';

declare class A_ProcessPolyfill extends A_ProcessPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
}

export { A_ProcessPolyfill };
