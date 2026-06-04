import { A as A_Command } from '../../../A-Command.entity-24rvXQLC.mjs';
import { A_TYPES__InspectorFeatureSnapshot } from '../A-Inspector.types.mjs';
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

type InspectFeatureCommandParams = {
    /** Name of the component / container / entity to inspect. */
    component: string;
    /** Name of the feature to inspect. */
    feature: string;
    /** Optional scope name to evaluate the feature template under. */
    scope?: string;
};
/**
 * Returns the topologically-sorted step list that would execute when
 * `<component>.call(<feature>)` is invoked under the given scope.
 *
 * Pure data shell — execution logic lives in
 * `InspectorCommandRepository.onInspectFeatureExecute`.
 */
declare class InspectFeatureCommand extends A_Command<InspectFeatureCommandParams, {
    snapshot: A_TYPES__InspectorFeatureSnapshot;
}> {
    static get entity(): string;
}

export { InspectFeatureCommand, type InspectFeatureCommandParams };
