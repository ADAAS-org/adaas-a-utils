import { __decorateClass, __decorateParam } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Feature, A_Inject, A_Caller, A_Component, A_Context } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import { A_CommandFeatures } from '@adaas/a-utils/a-command';
import { A_InspectorError } from '../A-Inspector.error';
import { InspectorSnapshotHelper } from './InspectorSnapshot.helper.component';
import { InspectorPingCommand } from './InspectorPingCommand';
import { InspectConceptCommand } from './InspectConceptCommand';
import { InspectScopeCommand } from './InspectScopeCommand';
import { InspectFeatureCommand } from './InspectFeatureCommand';
import { A_Logger } from '@adaas/a-utils/a-logger';

let InspectorCommandRepository = class extends A_Component {
  async onPingExecute(command, logger) {
    logger.debug(`Received ping command with params`, command.params);
    await command.complete({
      pong: true,
      token: command.params?.token ?? "",
      serverTime: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async onInspectConceptExecute(command, snap, logger) {
    const root = A_Context.root;
    logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);
    const snapshot = {
      name: A_Context.concept,
      environment: A_Context.environment,
      rootScope: snap.scopeSnapshot(root),
      containers: snap.collectContainers(root)
    };
    await command.complete({ snapshot });
  }
  async onInspectScopeExecute(command, snap) {
    const target = command.params?.scope;
    const root = A_Context.root;
    const found = !target || target === root.name || target === "root" ? root : this.findScope(root, target);
    if (!found) {
      await command.fail(new A_InspectorError({
        title: A_InspectorError.InspectorCommandNotFoundError,
        description: `Scope '${target}' was not reachable from the root scope.`
      }));
      return;
    }
    await command.complete({ snapshot: snap.scopeSnapshot(found) });
  }
  async onInspectFeatureExecute(command, snap, logger) {
    const { component: componentName, feature, scope: scopeName } = command.params;
    const root = A_Context.root;
    const scope = !scopeName || scopeName === "root" || scopeName === root.name ? root : this.findScope(root, scopeName);
    logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);
    if (!scope) {
      await command.fail(new A_InspectorError({
        title: A_InspectorError.InspectorCommandNotFoundError,
        description: `Scope '${scopeName}' not reachable from root scope.`
      }));
      return;
    }
    const componentInstance = scope.resolve(componentName);
    if (!componentInstance) {
      await command.fail(new A_InspectorError({
        title: A_InspectorError.InspectorCommandNotFoundError,
        description: `Component '${componentName}' is not registered in scope '${scope.name}'.`
      }));
      return;
    }
    const snapshot = snap.featureSnapshot(componentInstance, feature, scope);
    await command.complete({ snapshot });
  }
  // ====================================================================
  // =========================  HELPERS  ================================
  // ====================================================================
  findScope(start, name) {
    const seen = /* @__PURE__ */ new Set();
    const stack = [start];
    while (stack.length) {
      const s = stack.pop();
      if (seen.has(s)) continue;
      seen.add(s);
      if (s.name === name) return s;
      if (s.parent) stack.push(s.parent);
      for (const imp of s.imports) stack.push(imp);
      const subs = s._subscribers;
      if (subs) {
        for (const ref of subs) {
          const child = ref.deref();
          if (child) stack.push(child);
        }
      }
    }
    return void 0;
  }
};
__decorateClass([
  A_Feature.Extend({
    name: A_CommandFeatures.onExecute,
    scope: [InspectorPingCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(A_Logger))
], InspectorCommandRepository.prototype, "onPingExecute", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_CommandFeatures.onExecute,
    scope: [InspectConceptCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorSnapshotHelper)),
  __decorateParam(2, A_Inject(A_Logger))
], InspectorCommandRepository.prototype, "onInspectConceptExecute", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_CommandFeatures.onExecute,
    scope: [InspectScopeCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorSnapshotHelper))
], InspectorCommandRepository.prototype, "onInspectScopeExecute", 1);
__decorateClass([
  A_Feature.Extend({
    name: A_CommandFeatures.onExecute,
    scope: [InspectFeatureCommand]
  }),
  __decorateParam(0, A_Inject(A_Caller)),
  __decorateParam(1, A_Inject(InspectorSnapshotHelper)),
  __decorateParam(2, A_Inject(A_Logger))
], InspectorCommandRepository.prototype, "onInspectFeatureExecute", 1);
InspectorCommandRepository = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Server-side executor for InspectorPing / InspectConcept / InspectScope / InspectFeature commands."
  })
], InspectorCommandRepository);

export { InspectorCommandRepository };
//# sourceMappingURL=InspectorCommandRepository.component.mjs.map
//# sourceMappingURL=InspectorCommandRepository.component.mjs.map