import { A_Fragment } from "@adaas/a-concept";

import type { A_TYPES__InspectorClientOptions } from "../A-Inspector.types";


/**
 * `InspectorClientConfig` — configuration A_Fragment that supplies
 * connection options (host / port / secret / timeout) to the inspector
 * client stack.
 *
 * The fragment is registered in the client scope by the caller. The
 * `InspectorChannel` and `InspectorChannelProcessor` resolve it via
 * `@A_Inject(InspectorClientConfig)` instead of receiving options
 * through a constructor — keeping channels and components pure
 * framework entities with no ad-hoc construction parameters.
 *
 * @example
 * ```ts
 * const config = new InspectorClientConfig({ host, port, secret });
 * client.scope.register(config);
 * client.scope.register(new InspectorChannel());
 * ```
 */
export class InspectorClientConfig extends A_Fragment {

    public readonly host: string;
    public readonly port: number;
    public readonly secret: string;
    public readonly timeout: number;

    constructor(options: A_TYPES__InspectorClientOptions) {
        super({ name: 'InspectorClientConfig' });
        this.host = options.host;
        this.port = options.port;
        this.secret = options.secret;
        this.timeout = options.timeout ?? 10000;
    }
}
