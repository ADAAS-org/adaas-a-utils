import { A as A_Command } from '../../../A-Command.entity-ISgSk8wB.js';
import { A_TYPES__InspectorFeatureSnapshot } from '../A-Inspector.types.js';
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
