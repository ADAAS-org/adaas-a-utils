// A-Inspector module entry point.
//
// Ships TWO running-bundle containers:
//
//   - `A_ConceptInspectorContainer` — server side. Drop into any
//     concept and the inspector TCP server starts when
//     `A_CONCEPT_INSPECTOR_ENABLED=1`.
//   - `A_ConceptInspectorClient`    — client side class. Instantiate
//     it, register an `InspectorChannel`, then call
//     `await new SomeCommand({...}).execute()` to round-trip over
//     the wire transparently.
//
// Neither container exposes a `query()` / RPC helper — execution flows
// through the normal `A_Command` pipeline.

export { A_ConceptInspector, A_ConceptInspectorContainer } from './A-Inspector.container';
export type { InspectorConfigVars } from './A-Inspector.types';
export { A_ConceptInspectorClient } from './A-InspectorClient.container';
export { A_InspectorError } from './A-Inspector.error';
export * from './A-Inspector.constants';
export * from './A-Inspector.types';

// Commands — same data shells live on both sides of the wire.
export { InspectorPingCommand } from './commands/InspectorPingCommand';
export { InspectConceptCommand } from './commands/InspectConceptCommand';
export { InspectScopeCommand } from './commands/InspectScopeCommand';
export { InspectFeatureCommand } from './commands/InspectFeatureCommand';
export { InspectorSnapshotHelper } from './commands/InspectorSnapshot.helper.component';
export { InspectorCommandRepository } from './commands/InspectorCommandRepository.component';
export { InspectorClientForwarder } from './commands/InspectorClientForwarder.component';

// Client-side transport — `InspectorChannel` (data shell / A_Channel
// subclass) + `InspectorChannelProcessor` (connect / request /
// disconnect feature extensions).
export { InspectorChannel } from './transport/InspectorChannel';
export type { A_TYPES__InspectorPendingRequest } from './transport/InspectorChannel';
export { InspectorChannelProcessor } from './transport/InspectorChannelProcessor.component';
export { InspectorClientConfig } from './transport/InspectorClientConfig.fragment';
