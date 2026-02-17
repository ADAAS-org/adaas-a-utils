import { A_Logger } from '../../A-Logger/A-Logger.component.js';
import { A_HttpPolyfillBase } from '../base/A-Http-Polyfill.base.js';
import '@adaas/a-concept';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-Config/A-Config.constants.js';
import '../A-Polyfill.types.js';

declare class A_HttpPolyfill extends A_HttpPolyfillBase {
    constructor(logger: A_Logger);
    protected initImplementation(): Promise<void>;
    private createMockRequest;
}

export { A_HttpPolyfill };
