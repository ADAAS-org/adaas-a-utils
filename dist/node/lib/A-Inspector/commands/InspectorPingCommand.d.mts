import { A as A_Command } from '../../../A-Command.entity-24rvXQLC.mjs';
import '../../A-Command/A-Command.constants.mjs';
import '@adaas/a-concept';
import '../../A-StateMachine/A-StateMachine.component.mjs';
import '../../A-StateMachine/A-StateMachine.constants.mjs';
import '../../A-StateMachine/A-StateMachineTransition.context.mjs';
import '../../A-Operation/A-Operation.context.mjs';
import '../../A-Operation/A-Operation.types.mjs';
import '../../A-Execution/A-Execution.context.mjs';
import '../../A-StateMachine/A-StateMachine.types.mjs';
import '../../A-Logger/A-Logger.component.mjs';
import '../../A-Logger/A-Logger.types.mjs';
import '../../A-Logger/A-Logger.constants.mjs';
import '../../A-Logger/A-Logger.env.mjs';
import '../../A-Config/A-Config.context.mjs';
import '../../A-Config/A-Config.types.mjs';
import '../../A-Config/A-Config.constants.mjs';

/**
 * Trivial command that round-trips a single string token. Used by
 * clients to verify connectivity and authentication without doing
 * any introspection work on the server.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onPingExecute`.
 */
declare class InspectorPingCommand extends A_Command<{
    token?: string;
}, {
    pong: true;
    token: string;
    serverTime: string;
}> {
    static get entity(): string;
}

export { InspectorPingCommand };
