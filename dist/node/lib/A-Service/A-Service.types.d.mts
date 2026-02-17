import { A_Component, A_Fragment } from '@adaas/a-concept';

type A_SERVER_TYPES__ServerFeatures = [
    A_SERVER_TYPES__ServerFeature.beforeStart,
    A_SERVER_TYPES__ServerFeature.afterStart,
    A_SERVER_TYPES__ServerFeature.beforeStop,
    A_SERVER_TYPES__ServerFeature.afterStop,
    A_SERVER_TYPES__ServerFeature.onRequest
];
declare enum A_SERVER_TYPES__ServerFeature {
    beforeStart = "beforeStart",
    afterStart = "afterStart",
    beforeStop = "beforeStop",
    afterStop = "afterStop",
    beforeRequest = "beforeRequest",
    onRequest = "onRequest",
    afterRequest = "afterRequest"
}
type A_ServiceConstructor = {
    name: string;
    version: string;
    controllers: Array<A_Component>;
    entities: Array<A_Fragment>;
    extensions: Array<A_Component>;
};

export { A_SERVER_TYPES__ServerFeature, type A_SERVER_TYPES__ServerFeatures, type A_ServiceConstructor };
