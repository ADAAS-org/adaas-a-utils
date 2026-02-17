import { A_Container, A_Error } from '@adaas/a-concept';
import { A_ServiceFeatures } from './A-Service.constants.mjs';
import { A_Logger } from '../A-Logger/A-Logger.component.mjs';
import { A_Polyfill } from '../A-Polyfill/A-Polyfill.component.env-node.mjs';
import '../A-Logger/A-Logger.types.mjs';
import '../A-Logger/A-Logger.env.mjs';
import '../A-Config/A-Config.context.mjs';
import '../A-Config/A-Config.types.mjs';
import '../A-Execution/A-Execution.context.mjs';
import '../A-Config/A-Config.constants.mjs';
import '../A-Polyfill/A-Polyfill.types.mjs';
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
