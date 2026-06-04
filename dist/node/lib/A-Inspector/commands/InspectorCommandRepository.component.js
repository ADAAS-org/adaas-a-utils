'use strict';

var aConcept = require('@adaas/a-concept');
var core = require('@adaas/a-frame/core');
var aCommand = require('@adaas/a-utils/a-command');
var AInspector_error = require('../A-Inspector.error');
var InspectorSnapshot_helper_component = require('./InspectorSnapshot.helper.component');
var InspectorPingCommand = require('./InspectorPingCommand');
var InspectConceptCommand = require('./InspectConceptCommand');
var InspectScopeCommand = require('./InspectScopeCommand');
var InspectFeatureCommand = require('./InspectFeatureCommand');
var aLogger = require('@adaas/a-utils/a-logger');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
exports.InspectorCommandRepository = class InspectorCommandRepository extends aConcept.A_Component {
  async onPingExecute(command, logger) {
    logger.debug(`Received ping command with params`, command.params);
    await command.complete({
      pong: true,
      token: command.params?.token ?? "",
      serverTime: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async onInspectConceptExecute(command, snap, logger) {
    const root = aConcept.A_Context.root;
    logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);
    const snapshot = {
      name: aConcept.A_Context.concept,
      environment: aConcept.A_Context.environment,
      rootScope: snap.scopeSnapshot(root),
      containers: snap.collectContainers(root)
    };
    await command.complete({ snapshot });
  }
  async onInspectScopeExecute(command, snap) {
    const target = command.params?.scope;
    const root = aConcept.A_Context.root;
    const found = !target || target === root.name || target === "root" ? root : this.findScope(root, target);
    if (!found) {
      await command.fail(new AInspector_error.A_InspectorError({
        title: AInspector_error.A_InspectorError.InspectorCommandNotFoundError,
        description: `Scope '${target}' was not reachable from the root scope.`
      }));
      return;
    }
    await command.complete({ snapshot: snap.scopeSnapshot(found) });
  }
  async onInspectFeatureExecute(command, snap, logger) {
    const { component: componentName, feature, scope: scopeName } = command.params;
    const root = aConcept.A_Context.root;
    const scope = !scopeName || scopeName === "root" || scopeName === root.name ? root : this.findScope(root, scopeName);
    logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);
    if (!scope) {
      await command.fail(new AInspector_error.A_InspectorError({
        title: AInspector_error.A_InspectorError.InspectorCommandNotFoundError,
        description: `Scope '${scopeName}' not reachable from root scope.`
      }));
      return;
    }
    const componentInstance = scope.resolve(componentName);
    if (!componentInstance) {
      await command.fail(new AInspector_error.A_InspectorError({
        title: AInspector_error.A_InspectorError.InspectorCommandNotFoundError,
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
  aConcept.A_Feature.Extend({
    name: aCommand.A_CommandFeatures.onExecute,
    scope: [InspectorPingCommand.InspectorPingCommand]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(aLogger.A_Logger))
], exports.InspectorCommandRepository.prototype, "onPingExecute", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aCommand.A_CommandFeatures.onExecute,
    scope: [InspectConceptCommand.InspectConceptCommand]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(InspectorSnapshot_helper_component.InspectorSnapshotHelper)),
  __decorateParam(2, aConcept.A_Inject(aLogger.A_Logger))
], exports.InspectorCommandRepository.prototype, "onInspectConceptExecute", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aCommand.A_CommandFeatures.onExecute,
    scope: [InspectScopeCommand.InspectScopeCommand]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(InspectorSnapshot_helper_component.InspectorSnapshotHelper))
], exports.InspectorCommandRepository.prototype, "onInspectScopeExecute", 1);
__decorateClass([
  aConcept.A_Feature.Extend({
    name: aCommand.A_CommandFeatures.onExecute,
    scope: [InspectFeatureCommand.InspectFeatureCommand]
  }),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Caller)),
  __decorateParam(1, aConcept.A_Inject(InspectorSnapshot_helper_component.InspectorSnapshotHelper)),
  __decorateParam(2, aConcept.A_Inject(aLogger.A_Logger))
], exports.InspectorCommandRepository.prototype, "onInspectFeatureExecute", 1);
exports.InspectorCommandRepository = __decorateClass([
  core.A_Frame.Define({
    namespace: "A-Utils",
    description: "Server-side executor for InspectorPing / InspectConcept / InspectScope / InspectFeature commands."
  })
], exports.InspectorCommandRepository);
//# sourceMappingURL=InspectorCommandRepository.component.js.map
//# sourceMappingURL=InspectorCommandRepository.component.js.map