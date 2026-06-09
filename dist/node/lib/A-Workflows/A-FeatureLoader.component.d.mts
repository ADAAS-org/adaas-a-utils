import * as _adaas_a_concept from '@adaas/a-concept';
import { A_Component, A_Scope, A_Feature, A_Dependency } from '@adaas/a-concept';
import { A_TYPES__FeatureLoaderConfig, A_TYPES__FeatureLoaderStep } from './A-Workflows.types.mjs';
import './A-Workflows.constants.mjs';

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
declare class A_FeatureLoader extends A_Component {
    /**
     * Compile a {@link A_TYPES__FeatureLoaderConfig} into an `A_Feature`.
     *
     * @param config  The JSON feature description.
     * @param scope   The scope used to resolve target constructors and to run
     *                the resulting feature. Targets MUST be registered (or
     *                resolvable through inheritance) in this scope.
     * @returns A ready-to-process `A_Feature` bound to `scope`.
     */
    load(config: A_TYPES__FeatureLoaderConfig, scope: A_Scope): A_Feature;
    /** Validate the loader config and scope before compilation. */
    protected _validate(config: A_TYPES__FeatureLoaderConfig, scope: A_Scope): void;
    /** Convert one loader step into a fully-specified stage step. */
    protected _toStageStep(featureName: string, step: A_TYPES__FeatureLoaderStep, scope: A_Scope): {
        name: string;
        handler: string;
        dependency: A_Dependency<_adaas_a_concept.A_TYPES__A_DependencyInjectable>;
        behavior: "sync" | "async";
        before: string;
        after: string;
        throwOnError: boolean;
        override: string;
    };
}

export { A_FeatureLoader };
