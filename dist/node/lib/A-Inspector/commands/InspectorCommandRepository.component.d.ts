import { A_Component, A_Scope } from '@adaas/a-concept';
import { InspectorSnapshotHelper } from './InspectorSnapshot.helper.component.js';
import { InspectorPingCommand } from './InspectorPingCommand.js';
import { InspectConceptCommand } from './InspectConceptCommand.js';
import { InspectScopeCommand } from './InspectScopeCommand.js';
import { InspectFeatureCommand } from './InspectFeatureCommand.js';
import { A_Logger } from '../../A-Logger/A-Logger.component.js';
import '../A-Inspector.types.js';
import '../../../A-Command.entity-ISgSk8wB.js';
import '../../A-Command/A-Command.constants.js';
import '../../A-StateMachine/A-StateMachine.component.js';
import '../../A-StateMachine/A-StateMachine.constants.js';
import '../../A-StateMachine/A-StateMachineTransition.context.js';
import '../../A-Operation/A-Operation.context.js';
import '../../A-Operation/A-Operation.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../../A-StateMachine/A-StateMachine.types.js';
import '../A-Inspector.constants.js';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.constants.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Config/A-Config.context.js';
import '../../A-Config/A-Config.types.js';
import '../../A-Config/A-Config.constants.js';

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
