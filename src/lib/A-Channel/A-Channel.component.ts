import { A_Component, A_Feature } from "@adaas/a-concept";
import { A_ChannelError } from "./A-Channel.error";



export class A_Channel extends A_Component {

    /**
     * Indicates whether the channel is processing requests
     */
    protected _processing: boolean = false;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;

    /**
      * Indicates whether the channel is processing requests
      */
    get processing(): boolean {
        return this._processing;
    }
    /**
     * Indicates whether the channel is connected
     */
    get initialize(): Promise<void> {
        if (!this._initialized) {
            this._initialized = this.connect();
        }
        return this._initialized;
    }


    @A_Feature.Define()
    /**
     * Initializes the channel before use
     */
    async connect() {
        throw new A_ChannelError(
            A_ChannelError.MethodNotImplemented,
            `The connect method is not implemented in ${this.constructor.name} channel. This method is required to initialize the channel before use. So please implement it in the derived class.`
        );
    }


    @A_Feature.Define()
    /**
     * Allows to send a request through the channel
     *
     * @param req - The request parameters
     * @returns The response from the channel
     */
    async request(params: any): Promise<any> {
        throw new A_ChannelError(
            A_ChannelError.MethodNotImplemented,
            `The request method is not implemented in ${this.constructor.name} channel.`
        );
    }



    @A_Feature.Define()
    /**
     * Uses for Fire-and-Forget messaging through the channel
     * 
     * @param message - can be of any type depending on the channel implementation
     */
    async send(message: any): Promise<void> {
        throw new A_ChannelError(
            A_ChannelError.MethodNotImplemented,
            `The send method is not implemented in ${this.constructor.name} channel.`
        );
    }

}

