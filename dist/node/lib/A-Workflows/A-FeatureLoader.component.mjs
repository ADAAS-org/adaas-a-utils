import { __decorateClass } from '../../chunk-EQQGB2QZ.mjs';
import { A_Component, A_Feature, A_Scope, A_Dependency } from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';
import { A_WorkflowError } from './A-Workflows.error';

let A_FeatureLoader = class extends A_Component {
  /**
   * Compile a {@link A_TYPES__FeatureLoaderConfig} into an `A_Feature`.
   *
   * @param config  The JSON feature description.
   * @param scope   The scope used to resolve target constructors and to run
   *                the resulting feature. Targets MUST be registered (or
   *                resolvable through inheritance) in this scope.
   * @returns A ready-to-process `A_Feature` bound to `scope`.
   */
  load(config, scope) {
    this._validate(config, scope);
    const template = config.steps.map((step) => this._toStageStep(config.name, step, scope));
    return new A_Feature({
      name: config.name,
      scope,
      template
    });
  }
  // ====================================================================
  // ================== Internal Helpers ================================
  // ====================================================================
  /** Validate the loader config and scope before compilation. */
  _validate(config, scope) {
    if (!config || typeof config !== "object" || typeof config.name !== "string") {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `Invalid feature loader config: a "name" string is required.`
      });
    }
    if (!Array.isArray(config.steps) || config.steps.length === 0) {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `Feature "${config.name}" must declare at least one step.`
      });
    }
    if (!(scope instanceof A_Scope)) {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `A valid A_Scope is required to load feature "${config.name}".`
      });
    }
  }
  /** Convert one loader step into a fully-specified stage step. */
  _toStageStep(featureName, step, scope) {
    if (!step || typeof step.target !== "string" || typeof step.handler !== "string") {
      throw new A_WorkflowError({
        title: A_WorkflowError.FeatureLoaderError,
        description: `Feature "${featureName}" has an invalid step. Each step requires "target" and "handler" strings.`
      });
    }
    const ctor = scope.resolveConstructor(step.target);
    if (!ctor) {
      throw new A_WorkflowError({
        title: A_WorkflowError.ResolutionError,
        description: `Feature "${featureName}" references target "${step.target}" which is not registered in the provided scope.`
      });
    }
    return {
      name: featureName,
      handler: step.handler,
      dependency: new A_Dependency(ctor),
      behavior: step.behavior ?? "sync",
      before: step.before ?? "",
      after: step.after ?? "",
      throwOnError: step.throwOnError ?? true,
      override: ""
    };
  }
};
A_FeatureLoader = __decorateClass([
  A_Frame.Define({
    namespace: "A-Utils",
    description: "Compiles a JSON feature description (target class names + handler method names) into a runnable A_Feature using the framework template initializer. Enables portable, serialization-safe feature definitions for distributed workflows."
  })
], A_FeatureLoader);

export { A_FeatureLoader };
//# sourceMappingURL=A-FeatureLoader.component.mjs.map
//# sourceMappingURL=A-FeatureLoader.component.mjs.map