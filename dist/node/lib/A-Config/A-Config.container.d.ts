import { A_Container } from '@adaas/a-concept';
import { A_Polyfill } from '../A-Polyfill/A-Polyfill.component.env-node.js';
import '../A-Polyfill/A-Polyfill.types.js';
import '../A-Logger/A-Logger.component.js';
import '../A-Logger/A-Logger.types.js';
import '../A-Logger/A-Logger.env.js';
import './A-Config.context.js';
import './A-Config.types.js';
import '../A-Execution/A-Execution.context.js';
import './A-Config.constants.js';
import '../A-Polyfill/node/A-Crypto-Polyfill.js';
import '../A-Polyfill/base/A-Crypto-Polyfill.base.js';
import '../A-Polyfill/node/A-Http-Polyfill.js';
import '../A-Polyfill/base/A-Http-Polyfill.base.js';
import '../A-Polyfill/node/A-Https-Polyfill.js';
import '../A-Polyfill/base/A-Https-Polyfill.base.js';
import '../A-Polyfill/node/A-Path-Polyfill.js';
import '../A-Polyfill/base/A-Path-Polyfill.base.js';
import '../A-Polyfill/node/A-Url-Polyfill.js';
import '../A-Polyfill/base/A-Url-Polyfill.base.js';
import '../A-Polyfill/node/A-Buffer-Polyfill.js';
import '../A-Polyfill/base/A-Buffer-Polyfill.base.js';
import '../A-Polyfill/node/A-Process-Polyfill.js';
import '../A-Polyfill/base/A-Process-Polyfill.base.js';
import '../A-Polyfill/node/A-FS-Polyfill.js';
import '../A-Polyfill/base/A-FS-Polyfill.base.js';

declare class A_ConfigLoader extends A_Container {
    private reader;
    prepare(polyfill: A_Polyfill): Promise<void>;
}

export { A_ConfigLoader };
