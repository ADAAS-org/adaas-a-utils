import { A_Container } from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";

import { InspectorChannelProcessor } from "./transport/InspectorChannelProcessor.component";
import { InspectorClientForwarder } from "./commands/InspectorClientForwarder.component";
import { InspectorPingCommand } from "./commands/InspectorPingCommand";
import { InspectConceptCommand } from "./commands/InspectConceptCommand";
import { InspectScopeCommand } from "./commands/InspectScopeCommand";
import { InspectFeatureCommand } from "./commands/InspectFeatureCommand";
import { InspectorClientConfig } from "./transport/InspectorClientConfig.fragment";
import { InspectorChannel } from "./transport/InspectorChannel";


/**
 * `A_ConceptInspectorClient` — running bundle for the CLIENT side of
 * the inspector protocol.
 *
 * The container itself exposes no query / RPC API — it is, like every
 * `A_Container`, just a registration bundle. Combined with a freshly
 * registered `InspectorChannel`, it lets callers execute any
 * `A_Command` instance locally and have the call transparently
 * forwarded to a remote `A_ConceptInspectorContainer`.
 *
 * Typical usage:
 *
 * ```ts
 * import {
 *     A_ConceptInspectorClient,
 *     InspectorChannel,
 *     InspectorPingCommand,
 * } from '@adaas/a-utils/a-inspector';
 *
 * const client  = new A_ConceptInspectorClient({ name: 'inspector-client' });
 * const channel = new InspectorChannel({ host, port, secret });
 *
 * client.scope.register(channel);
 *
 * const ping = new InspectorPingCommand({ token: 'hello' });
 * client.scope.register(ping);
 *
 * await ping.execute();              // travels over the wire
 * console.log(ping.result?.pong);    // -> true
 * ```
 *
 * The container pre-registers `InspectorChannelProcessor` (so the
 * channel actually opens / authenticates), `InspectorClientForwarder`
 * (the polymorphic `onExecute` interceptor), and the four built-in
 * `Inspect*` command classes as allowed entities — registering custom
 * command classes is done at consumer level.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Client-side running bundle for the A-Concept inspector: ships the channel transport processor + a polymorphic onExecute forwarder so any A_Command executed under its scope is shipped to a remote inspector server.'
})
export class A_ConceptInspectorClient extends A_Container {

    constructor(config: InspectorClientConfig) {
        super({
            name: 'inspector-client',
            components: [InspectorChannel, InspectorChannelProcessor, InspectorClientForwarder],
            entities: [
                InspectorPingCommand,
                InspectConceptCommand,
                InspectScopeCommand,
                InspectFeatureCommand,
            ],
            fragments: [
                config
            ],
        });

    }


    /**
     * Gracefully disconnects the client's channel, if any. After calling
     * 
     * @returns 
     */
    async disconnect(): Promise<void> {
        const channel = this.scope.resolve(InspectorChannel);
        if (!channel) return Promise.resolve();
        return await channel.disconnect();
    }

}
