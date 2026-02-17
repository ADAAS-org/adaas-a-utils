import { A_Container, A_Error } from '@adaas/a-concept';
import { A_ServiceFeatures } from './A-Service.constants.js';
import { A_Logger } from '../A-Logger/A-Logger.component.js';
import { A_Polyfill } from '../A-Polyfill/A-Polyfill.component.env-node.js';
import '../A-Logger/A-Logger.types.js';
import '../A-Logger/A-Logger.env.js';
import '../A-Config/A-Config.context.js';
import '../A-Config/A-Config.types.js';
import '../A-Execution/A-Execution.context.js';
import '../A-Config/A-Config.constants.js';
import '../A-Polyfill/A-Polyfill.types.js';
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

/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 *
 */
declare class A_Service extends A_Container {
    load(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    protected [A_ServiceFeatures.onBeforeLoad](polyfill: A_Polyfill, ...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onLoad](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onAfterLoad](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onBeforeStart](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onStart](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onAfterStart](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onBeforeStop](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onStop](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onAfterStop](...args: any[]): Promise<void>;
    protected [A_ServiceFeatures.onError](error: A_Error, logger?: A_Logger, ...args: any[]): Promise<void>;
}

export { A_Service };
