import {
    A_Caller,
    A_Component,
    A_Feature,
    A_Inject,
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_Command, A_CommandFeatures } from "@adaas/a-utils/a-command";

import { A_InspectorError } from "../A-Inspector.error";
import { InspectorChannel } from "../transport/InspectorChannel";


/**
 * `InspectorClientForwarder` — the client-side counterpart of
 * `InspectorCommandRepository`.
 *
 * Where the server's repository defines `@A_Feature.Extend(onExecute)`
 * handlers for each concrete inspect command, this forwarder defines a
 * SINGLE polymorphic `onExecute` extension scoped to `A_Command`. The
 * feature template builder walks the caller's class chain — for any
 * concrete `Inspect*Command` subclass the chain includes `A_Command`,
 * so this extension applies to every command executed under a scope
 * that has the forwarder + a connected `InspectorChannel` registered.
 *
 * The forwarder serializes the command, ships it through the channel,
 * waits for the server's serialized response, then completes / fails
 * the local command instance with the remote result. This means tests
 * (and tools) can simply write:
 *
 * ```ts
 * client.scope.register(channel);
 * const ping = new InspectorPingCommand({ token: 'hi' });
 * client.scope.register(ping);
 * await ping.execute();
 * console.log(ping.result?.pong); // true
 * ```
 *
 * No `query()` helper, no static command list — execution flows through
 * the standard `A_Command` pipeline.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Client-side onExecute extension that forwards any A_Command it sees to a remote inspector server via the registered InspectorChannel.'
})
export class InspectorClientForwarder extends A_Component {

    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute,
        scope: [A_Command],
    })
    async forward(
        @A_Inject(A_Caller) command: A_Command<any, any>,
        @A_Inject(InspectorChannel) channel: InspectorChannel,
    ): Promise<void> {
        await channel.initialize;

        const Ctor = command.constructor as any;
        const code = Ctor.entity ?? Ctor.code ?? Ctor.name;
        const payload = command.toJSON();

        let response: any;
        try {
            response = await channel.request<
                { code: string; payload: any },
                { payload: any }
            >({ code, payload });
        } catch (err: any) {
            const unwrapped = unwrapInspectorError(err);
            await command.fail(unwrapped instanceof A_InspectorError
                ? unwrapped
                : new A_InspectorError({
                    title: A_InspectorError.InspectorTransportError,
                    description: err?.message ?? String(err),
                    originalError: err,
                }),
            );
            return;
        }

        const remote = response?.data?.payload;
        const remoteResult = remote?.result;

        if (process.env.A_INSPECTOR_TEST_VERBOSE) {
            // eslint-disable-next-line no-console
            console.log('[forwarder] response.data=', JSON.stringify(response?.data));
            // eslint-disable-next-line no-console
            console.log('[forwarder] remote=', JSON.stringify(remote));
            // eslint-disable-next-line no-console
            console.log('[forwarder] remoteResult=', JSON.stringify(remoteResult));
        }

        await command.complete(remoteResult);
    }
}


/**
 * Walks an error's `originalError` / `_originalError` / `cause` chain
 * looking for the deepest `A_InspectorError`. Returns the outermost
 * error untouched when none is found. The inspector channel wraps
 * transport / auth failures in `A_ChannelError` / `A_FeatureError`, so
 * this helper restores the originally-thrown inspector error to
 * callers.
 */
function unwrapInspectorError(err: any): any {
    let current = err;
    let found: A_InspectorError | undefined;
    const seen = new Set<any>();
    while (current && !seen.has(current)) {
        seen.add(current);
        if (current instanceof A_InspectorError) found = current;
        current = current.originalError ?? current._originalError ?? current.cause;
    }
    return found ?? err;
}
