import { A as A_Command } from '../../../A-Command.entity-ISgSk8wB.js';
import { A_TYPES__InspectorConceptSnapshot } from '../A-Inspector.types.js';
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
import '../A-Inspector.constants.js';

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
