import { A_Component, A_Dependency, A_Feature, A_Scope } from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_WorkflowError } from "./A-Workflows.error";
import {
    A_TYPES__FeatureLoaderConfig,
    A_TYPES__FeatureLoaderStep,
} from "./A-Workflows.types";


/**
 * A_FeatureLoader — compiles a JSON feature description into a runnable
 * `A_Feature` using the framework's template initializer.
 *
 * This is the bridge between a portable, serializable workflow definition
 * and the A-Concept feature pipeline. A workflow step (or any caller) can
 * describe a feature purely as data:
 *
 * ```jsonc
 * {
 *   "name": "charge-card",
 *   "steps": [
 *     { "target": "PaymentGateway", "handler": "authorize" },
 *     { "target": "PaymentGateway", "handler": "capture", "after": "PaymentGateway.authorize" }
 *   ]
 * }
 * ```
 *
 * {@link load} resolves each `target` class name against the provided scope,
 * builds the corresponding `A_Dependency`, assembles the
 * `A_TYPES__A_StageStep[]` template, and returns a `new A_Feature({...})`
 * ready to `process(scope)`.
 *
 * Because the config carries only class names + method names (strings), the
 * same description compiles to an identical feature on any service whose
 * scope registers the referenced components — which is what makes templated
 * workflow steps work across a distributed run.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Compiles a JSON feature description (target class names + handler method names) into a runnable A_Feature using the framework template initializer. Enables portable, serialization-safe feature definitions for distributed workflows.'
})
export class A_FeatureLoader extends A_Component {

    /**
     * Compile a {@link A_TYPES__FeatureLoaderConfig} into an `A_Feature`.
     *
     * @param config  The JSON feature description.
     * @param scope   The scope used to resolve target constructors and to run
     *                the resulting feature. Targets MUST be registered (or
     *                resolvable through inheritance) in this scope.
     * @returns A ready-to-process `A_Feature` bound to `scope`.
     */
    load(
        config: A_TYPES__FeatureLoaderConfig,
        scope: A_Scope
    ): A_Feature {
        this._validate(config, scope);

        const template = config.steps.map(step => this._toStageStep(config.name, step, scope));

        return new A_Feature({
            name: config.name,
            scope,
            template,
        });
    }

    // ====================================================================
    // ================== Internal Helpers ================================
    // ====================================================================

    /** Validate the loader config and scope before compilation. */
    protected _validate(config: A_TYPES__FeatureLoaderConfig, scope: A_Scope): void {
        if (!config || typeof config !== 'object' || typeof config.name !== 'string') {
            throw new A_WorkflowError({
                title: A_WorkflowError.FeatureLoaderError,
                description: `Invalid feature loader config: a "name" string is required.`,
            });
        }

        if (!Array.isArray(config.steps) || config.steps.length === 0) {
            throw new A_WorkflowError({
                title: A_WorkflowError.FeatureLoaderError,
                description: `Feature "${config.name}" must declare at least one step.`,
            });
        }

        if (!(scope instanceof A_Scope)) {
            throw new A_WorkflowError({
                title: A_WorkflowError.FeatureLoaderError,
                description: `A valid A_Scope is required to load feature "${config.name}".`,
            });
        }
    }

    /** Convert one loader step into a fully-specified stage step. */
    protected _toStageStep(
        featureName: string,
        step: A_TYPES__FeatureLoaderStep,
        scope: A_Scope
    ) {
        if (!step || typeof step.target !== 'string' || typeof step.handler !== 'string') {
            throw new A_WorkflowError({
                title: A_WorkflowError.FeatureLoaderError,
                description: `Feature "${featureName}" has an invalid step. Each step requires "target" and "handler" strings.`,
            });
        }

        const ctor = scope.resolveConstructor(step.target);

        if (!ctor) {
            throw new A_WorkflowError({
                title: A_WorkflowError.ResolutionError,
                description: `Feature "${featureName}" references target "${step.target}" which is not registered in the provided scope.`,
            });
        }

        return {
            name: featureName,
            handler: step.handler,
            dependency: new A_Dependency(ctor as any),
            behavior: step.behavior ?? 'sync',
            before: step.before ?? '',
            after: step.after ?? '',
            throwOnError: step.throwOnError ?? true,
            override: '',
        };
    }
}
