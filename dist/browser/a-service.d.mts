import { A_Container, A_Error } from '@adaas/a-concept';
import { A as A_Logger } from './A-Logger.component-Be-LMV3I.mjs';
import { A_Polyfill } from './a-polyfill.mjs';
import './a-execution.mjs';

declare enum A_ServiceFeatures {
    onBeforeLoad = "_A_Service_onBeforeLoad",
    onLoad = "_A_Service_onLoad",
    onAfterLoad = "_A_Service_onAfterLoad",
    onBeforeStart = "_A_Service_onBeforeStart",
    onStart = "_A_Service_onStart",
    onAfterStart = "_A_Service_onAfterStart",
    onBeforeStop = "_A_Service_onBeforeStop",
    onStop = "_A_Service_onStop",
    onAfterStop = "_A_Service_onAfterStop",
    onError = "_A_Service_onError"
}

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

export { A_Service, A_ServiceFeatures };
