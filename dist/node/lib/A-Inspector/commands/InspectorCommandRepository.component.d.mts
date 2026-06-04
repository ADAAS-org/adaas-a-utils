import { A_Component, A_Scope } from '@adaas/a-concept';
import { InspectorSnapshotHelper } from './InspectorSnapshot.helper.component.mjs';
import { InspectorPingCommand } from './InspectorPingCommand.mjs';
import { InspectConceptCommand } from './InspectConceptCommand.mjs';
import { InspectScopeCommand } from './InspectScopeCommand.mjs';
import { InspectFeatureCommand } from './InspectFeatureCommand.mjs';
import { A_Logger } from '../../A-Logger/A-Logger.component.mjs';
import '../A-Inspector.types.mjs';
import '../../../A-Command.entity-24rvXQLC.mjs';
import '../../A-Command/A-Command.constants.mjs';
import '../../A-StateMachine/A-StateMachine.component.mjs';
import '../../A-StateMachine/A-StateMachine.constants.mjs';
import '../../A-StateMachine/A-StateMachineTransition.context.mjs';
import '../../A-Operation/A-Operation.context.mjs';
import '../../A-Operation/A-Operation.types.mjs';
import '../../A-Execution/A-Execution.context.mjs';
import '../../A-StateMachine/A-StateMachine.types.mjs';
import '../A-Inspector.constants.mjs';
import '../../A-Logger/A-Logger.types.mjs';
import '../../A-Logger/A-Logger.constants.mjs';
import '../../A-Logger/A-Logger.env.mjs';
import '../../A-Config/A-Config.context.mjs';
import '../../A-Config/A-Config.types.mjs';
import '../../A-Config/A-Config.constants.mjs';

/**
 * `InspectorCommandRepository` — server-side executor for every
 * `A_Command` shipped by `A_ConceptInspector`.
 *
 * Mirrors the canonical ADAAS "command + repository" pattern (see
 * `AisKnowledgeBaseRepository.onIngestKbFileCommandExecute`):
 *
 *   - The command classes (`InspectorPingCommand`, `InspectConceptCommand`,
 *     ...) are pure typed data shells — they declare `params` /
 *     `result` shapes and a stable `entity` name. They can therefore
 *     live in any environment (browser, Node, worker) and ship over
 *     the wire by themselves.
 *   - This component listens on `A_CommandFeatures.onExecute` scoped to
 *     each command class, and supplies the actual execution logic.
 *     `A_ConceptInspector` registers it into the inspector container's
 *     own scope, so feature dispatch resolves it for any command that
 *     is registered into that scope before `execute()` is invoked.
 */
declare class InspectorCommandRepository extends A_Component {
    onPingExecute(command: InspectorPingCommand, logger: A_Logger): Promise<void>;
    onInspectConceptExecute(command: InspectConceptCommand, snap: InspectorSnapshotHelper, logger: A_Logger): Promise<void>;
    onInspectScopeExecute(command: InspectScopeCommand, snap: InspectorSnapshotHelper): Promise<void>;
    onInspectFeatureExecute(command: InspectFeatureCommand, snap: InspectorSnapshotHelper, logger: A_Logger): Promise<void>;
    protected findScope(start: A_Scope, name: string): A_Scope | undefined;
}

export { InspectorCommandRepository };
