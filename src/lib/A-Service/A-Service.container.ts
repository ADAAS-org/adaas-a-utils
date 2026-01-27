import { A_Concept, A_Container, A_Error, A_Feature, A_Inject } from "@adaas/a-concept";
import { A_ServiceFeatures } from "./A-Service.constants";
import { A_Polyfill } from "../A-Polyfill/A-Polyfill.component";
import { A_Config } from "../A-Config/A-Config.context";
import { A_Logger } from "../A-Logger/A-Logger.component";
import { A_Service_Error } from "./A-Service.error";
import { A_Frame } from "@adaas/a-frame";




/**
 * A-Service is a container that can run different types of services, such as HTTP servers, workers, etc.
 * Depending on the provided config and configuration, it will load the necessary components and start the service.
 * 
 */
@A_Frame.Container({
    namespace: 'A-Utils',
    name: 'A-Service',
    description: 'Service container that manages the lifecycle of various types of services, such as HTTP servers and workers or UI loader. It dynamically loads necessary components based on the provided configuration and orchestrates the start and stop processes, ensuring proper error handling and extensibility through feature hooks.'
})
export class A_Service extends A_Container {


    @A_Concept.Load()
    /**
     * Load the service
     */
    async load() {
        try {
            await this.call(A_ServiceFeatures.onBeforeLoad);

            await this.call(A_ServiceFeatures.onLoad);

            await this.call(A_ServiceFeatures.onAfterLoad);

        } catch (error) {

            let wrappedError;

            switch (true) {
                case error instanceof A_Service_Error:
                    wrappedError = error;
                    break;

                case error instanceof A_Error && error.originalError instanceof A_Service_Error:
                    wrappedError = error.originalError;
                    break;

                default:
                    wrappedError = new A_Service_Error({
                        title: A_Service_Error.ServiceLoadError,
                        description: 'An error occurred while processing the request.',
                        originalError: error
                    })
                    break;
            }

            this.scope.register(wrappedError);

            await this.call(A_ServiceFeatures.onError);
        }

    }


    @A_Concept.Start()
    /**
     * Start the server
     */
    async start() {
        try {
            await this.call(A_ServiceFeatures.onBeforeStart);

            await this.call(A_ServiceFeatures.onStart);

            await this.call(A_ServiceFeatures.onAfterStart);

        } catch (error) {

            let wrappedError;

            switch (true) {
                case error instanceof A_Service_Error:
                    wrappedError = error;
                    break;

                case error instanceof A_Error && error.originalError instanceof A_Service_Error:
                    wrappedError = error.originalError;
                    break;

                default:
                    wrappedError = new A_Service_Error({
                        title: A_Service_Error.ServiceStartError,
                        description: 'An error occurred while processing the request.',
                        originalError: error
                    })
                    break;
            }

            this.scope.register(wrappedError);

            await this.call(A_ServiceFeatures.onError);
        }

    }

    @A_Concept.Stop()
    /**
     * Stop the server
     */
    async stop() {
        try {
            await this.call(A_ServiceFeatures.onBeforeStop);

            await this.call(A_ServiceFeatures.onStop);

            await this.call(A_ServiceFeatures.onAfterStop);

        } catch (error) {

            let wrappedError;

            switch (true) {
                case error instanceof A_Service_Error:
                    wrappedError = error;
                    break;

                case error instanceof A_Error && error.originalError instanceof A_Service_Error:
                    wrappedError = error.originalError;
                    break;

                default:
                    wrappedError = new A_Service_Error({
                        title: A_Service_Error.ServiceStopError,
                        description: 'An error occurred while processing the request.',
                        originalError: error
                    })
                    break;
            }

            this.scope.register(wrappedError);

            await this.call(A_ServiceFeatures.onError);
        }
    }




    // ======================================================================================
    // ============================= A-Service Lifecycle =================================
    // ======================================================================================

    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onBeforeLoad](
        @A_Inject(A_Polyfill) polyfill: A_Polyfill,
        ...args: any[]
    ): Promise<void> {
        // Initialize Polyfill
        if (!polyfill) {
            this.scope.register(A_Polyfill);
            polyfill = this.scope.resolve(A_Polyfill)!
        }
    }

    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onLoad](...args: any[]) { }

    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onAfterLoad](...args: any[]) { }


    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onBeforeStart](...args: any[]) { }

    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onStart](...args: any[]) { }

    @A_Feature.Extend()
    protected async  [A_ServiceFeatures.onAfterStart](...args: any[]) { }



    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onBeforeStop](...args: any[]) { }

    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onStop](...args: any[]) { }

    @A_Feature.Extend()
    protected async [A_ServiceFeatures.onAfterStop](...args: any[]) { }



    @A_Feature.Extend({
        before: /.*/
    })
    protected async [A_ServiceFeatures.onError](
        @A_Inject(A_Error) error: A_Error,
        @A_Inject(A_Logger) logger?: A_Logger,
        ...args: any[]
    ) {
        logger?.error(error);
    }

}








