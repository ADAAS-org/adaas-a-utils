import { A_Command } from "@adaas/a-utils/a-command";
import { A_Frame } from "@adaas/a-frame/core";


/**
 * Trivial command that round-trips a single string token. Used by
 * clients to verify connectivity and authentication without doing
 * any introspection work on the server.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onPingExecute`.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Health-check / authentication-check command. Echoes back the token and the server timestamp.'
})
export class InspectorPingCommand extends A_Command<
    { token?: string },
    { pong: true; token: string; serverTime: string }
> {
    static override get entity(): string {
        return 'inspector-ping';
    }
}
