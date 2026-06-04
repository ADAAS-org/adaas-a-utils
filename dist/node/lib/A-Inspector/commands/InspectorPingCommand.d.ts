import { A as A_Command } from '../../../A-Command.entity-ISgSk8wB.js';
import '../../A-Command/A-Command.constants.js';
import '@adaas/a-concept';
import '../../A-StateMachine/A-StateMachine.component.js';
import '../../A-StateMachine/A-StateMachine.constants.js';
import '../../A-StateMachine/A-StateMachineTransition.context.js';
import '../../A-Operation/A-Operation.context.js';
import '../../A-Operation/A-Operation.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-StateMachine/A-StateMachine.types.js';
import '../../A-Logger/A-Logger.component.js';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.constants.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Config/A-Config.constants.js';

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
