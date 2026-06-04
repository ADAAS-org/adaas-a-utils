import { A as A_Command } from '../../../A-Command.entity-24rvXQLC.mjs';
import { A_TYPES__InspectorScopeSnapshot } from '../A-Inspector.types.mjs';
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
