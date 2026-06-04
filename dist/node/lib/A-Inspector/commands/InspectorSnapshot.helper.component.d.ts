import { A_Component, A_Scope, A_Container, A_Entity } from '@adaas/a-concept';
import { A_TYPES__InspectorScopeSnapshot, A_TYPES__InspectorContainerSnapshot, A_TYPES__InspectorFeatureSnapshot } from '../A-Inspector.types.js';
import '../../../A-Command.entity-ISgSk8wB.js';
import '../../A-Command/A-Command.constants.js';
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
 * `InspectorSnapshotHelper` is a regular `A_Component` (NOT a loose
 * utility module) whose only purpose is to turn the live in-memory
 * `A_Context`/`A_Scope` graph into plain serializable snapshots that
 * the inspection commands can return as their `result`.
 *
 * Keeping the snapshot logic inside a component keeps it within the
 * A-Concept dependency-injection world: commands receive it via
 * `@A_Inject(InspectorSnapshotHelper)`, individual hosts can replace
 * it by registering a subclass, and we don't leak any "free functions"
 * into the public surface.
 */
declare class InspectorSnapshotHelper extends A_Component {
    scopeSnapshot(scope: A_Scope): A_TYPES__InspectorScopeSnapshot;
    /**
     * Walks the registry of allocated containers reachable from the
     * given scope (and its inherited/imported scopes) and returns a
     * stable list of container snapshots.
     */
    collectContainers(scope: A_Scope): Array<A_TYPES__InspectorContainerSnapshot>;
    /**
     * Build a feature snapshot for the given component + feature name
     * by reusing the same machinery `A_Feature` does (template steps).
     */
    featureSnapshot(component: A_Component | A_Container | A_Entity, feature: string, scope: A_Scope): A_TYPES__InspectorFeatureSnapshot;
    protected safeScopeName(component: A_Container | A_Component): string;
}

export { InspectorSnapshotHelper };
