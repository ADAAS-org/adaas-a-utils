import { A_Component } from "@adaas/a-concept";
export declare class A_Channel extends A_Component {
    /**
     * Indicates whether the channel is processing requests
     */
    protected _processing: boolean;
    /**
     * Indicates whether the channel is connected
     */
    protected _initialized?: Promise<void>;
    /**
      * Indicates whether the channel is processing requests
      */
    get processing(): boolean;
    /**
     * Indicates whether the channel is connected
     */
    get initialize(): Promise<void>;
    connect(): Promise<void>;
    request(params: any): Promise<any>;
    send(message: any): Promise<void>;
}
