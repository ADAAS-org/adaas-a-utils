import { A as A_Command } from '../../../A-Command.entity-ISgSk8wB.js';
import { A_TYPES__InspectorScopeSnapshot } from '../A-Inspector.types.js';
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

type InspectScopeCommandParams = {
    /**
     * Either a scope name (matches against `scope.name`) or the literal
     * string `"root"` to inspect the concept's root scope. If omitted,
     * defaults to the root scope.
     */
    scope?: string;
};
/**
 * Returns a snapshot of a single scope reachable from the root scope.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectScopeExecute`.
 */
declare class InspectScopeCommand extends A_Command<InspectScopeCommandParams, {
    snapshot: A_TYPES__InspectorScopeSnapshot;
}> {
    static get entity(): string;
}

export { InspectScopeCommand, type InspectScopeCommandParams };
