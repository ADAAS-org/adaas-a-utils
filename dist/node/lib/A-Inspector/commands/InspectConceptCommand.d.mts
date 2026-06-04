import { A as A_Command } from '../../../A-Command.entity-24rvXQLC.mjs';
import { A_TYPES__InspectorConceptSnapshot } from '../A-Inspector.types.mjs';
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
import '../A-Inspector.constants.mjs';

/**
 * Returns a high-level snapshot of the running concept: its name,
 * runtime environment, root scope contents, and all containers known
 * through `A_Context`'s allocation registry.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectConceptExecute`.
 */
declare class InspectConceptCommand extends A_Command<{}, {
    snapshot: A_TYPES__InspectorConceptSnapshot;
}> {
    static get entity(): string;
}

export { InspectConceptCommand };
