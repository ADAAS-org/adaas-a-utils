import { __decorateClass } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Component, A_CommonHelper, A_Context, A_Container } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';

let InspectorSnapshotHelper = class extends A_Component {
  scopeSnapshot(scope) {
    return {
      name: scope.name,
      fingerprint: scope.fingerprint,
      version: scope.version,
      parent: scope.parent?.name,
      imports: scope.imports.map((s) => s.name),
      components: scope.components.map((c) => ({
        name: A_CommonHelper.getComponentName(c),
        constructor: c.constructor.name
      })),
      fragments: scope.fragments.map((f) => ({
        name: A_CommonHelper.getComponentName(f),
        constructor: f.constructor.name
      })),
      entities: scope.entities.map((e) => ({
        name: A_CommonHelper.getComponentName(e),
        constructor: e.constructor.name,
        aseid: e.aseid?.toString?.() ?? ""
      })),
      errors: scope.errors.map((e) => ({
        name: e.constructor.name,
        code: e.code ?? ""
      })),
      allowedComponents: Array.from(scope.allowedComponents).map((c) => c.name),
      allowedEntities: Array.from(scope.allowedEntities).map((c) => c.name),
      allowedFragments: Array.from(scope.allowedFragments).map((c) => c.name),
      allowedErrors: Array.from(scope.allowedErrors).map((c) => c.name)
    };
  }
  /**
   * Walks the registry of allocated containers reachable from the
   * given scope (and its inherited/imported scopes) and returns a
   * stable list of container snapshots.
   */
  collectContainers(scope) {
    const seen = /* @__PURE__ */ new Set();
    const visitedScopes = /* @__PURE__ */ new Set();
    const out = [];
    const instance = A_Context.getInstance();
    const scopeIssuers = instance?._scopeIssuers;
    const addContainer = (c) => {
      if (seen.has(c)) return;
      seen.add(c);
      out.push({
        name: c.name,
        constructor: c.constructor.name,
        scope: this.safeScopeName(c)
      });
    };
    const visit = (s) => {
      if (visitedScopes.has(s)) return;
      visitedScopes.add(s);
      for (const c of s.components) {
        if (c instanceof A_Container) addContainer(c);
      }
      const issuer = scopeIssuers?.get(s);
      if (issuer instanceof A_Container) addContainer(issuer);
      const subs = s._subscribers;
      if (subs) {
        for (const ref of subs) {
          const child = ref.deref();
          if (child) visit(child);
        }
      }
      if (s.parent) visit(s.parent);
      for (const imp of s.imports) visit(imp);
    };
    visit(scope);
    return out;
  }
  /**
   * Build a feature snapshot for the given component + feature name
   * by reusing the same machinery `A_Feature` does (template steps).
   */
  featureSnapshot(component, feature, scope) {
    const steps = A_Context.featureTemplate(feature, component, scope);
    const stepSnapshots = steps.map((step) => ({
      handler: step.handler,
      dependency: step.dependency?.name ?? "",
      order: step.order,
      scope: step.scope?.toString?.(),
      override: step.override?.toString?.()
    }));
    return {
      component: A_CommonHelper.getComponentName(component),
      feature,
      steps: stepSnapshots
    };
  }
  safeScopeName(component) {
    try {
      return A_Context.scope(component).name;
    } catch {
      return "<unregistered>";
    }
  }
};
InspectorSnapshotHelper = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Helper component that turns the live A_Context / A_Scope graph into serializable inspector snapshots used by InspectXxxCommand results."
  })
], InspectorSnapshotHelper);

export { InspectorSnapshotHelper };
//# sourceMappingURL=InspectorSnapshot.helper.component.mjs.map
//# sourceMappingURL=InspectorSnapshot.helper.component.mjs.map