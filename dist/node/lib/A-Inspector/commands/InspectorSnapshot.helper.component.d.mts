import { A_Component, A_Scope, A_Container, A_Entity } from '@adaas/a-concept';
import { A_TYPES__InspectorScopeSnapshot, A_TYPES__InspectorContainerSnapshot, A_TYPES__InspectorFeatureSnapshot } from '../A-Inspector.types.mjs';
import '../../../A-Command.entity-24rvXQLC.mjs';
import '../../A-Command/A-Command.constants.mjs';
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
