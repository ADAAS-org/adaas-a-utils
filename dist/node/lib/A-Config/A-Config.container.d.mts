import { A_Container } from '@adaas/a-concept';
import { A_Polyfill } from '../A-Polyfill/A-Polyfill.component.env-node.mjs';
import '../A-Polyfill/A-Polyfill.types.mjs';
import '../A-Logger/A-Logger.component.mjs';
import '../A-Logger/A-Logger.types.mjs';
import '../A-Logger/A-Logger.env.mjs';
import './A-Config.context.mjs';
import './A-Config.types.mjs';
import '../A-Execution/A-Execution.context.mjs';
import './A-Config.constants.mjs';
import '../A-Polyfill/node/A-Crypto-Polyfill.mjs';
import '../A-Polyfill/base/A-Crypto-Polyfill.base.mjs';
import '../A-Polyfill/node/A-Http-Polyfill.mjs';
import '../A-Polyfill/base/A-Http-Polyfill.base.mjs';
import '../A-Polyfill/node/A-Https-Polyfill.mjs';
import '../A-Polyfill/base/A-Https-Polyfill.base.mjs';
import '../A-Polyfill/node/A-Path-Polyfill.mjs';
import '../A-Polyfill/base/A-Path-Polyfill.base.mjs';
import '../A-Polyfill/node/A-Url-Polyfill.mjs';
import '../A-Polyfill/base/A-Url-Polyfill.base.mjs';
import '../A-Polyfill/node/A-Buffer-Polyfill.mjs';
import '../A-Polyfill/base/A-Buffer-Polyfill.base.mjs';
import '../A-Polyfill/node/A-Process-Polyfill.mjs';
import '../A-Polyfill/base/A-Process-Polyfill.base.mjs';
import '../A-Polyfill/node/A-FS-Polyfill.mjs';
import '../A-Polyfill/base/A-FS-Polyfill.base.mjs';

declare class A_ConfigLoader extends A_Container {
    private reader;
    prepare(polyfill: A_Polyfill): Promise<void>;
}

export { A_ConfigLoader };
