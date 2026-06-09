import { A_Component } from '@adaas/a-concept';
import { A_TYPES__WorkflowValueSource, A_TYPES__WorkflowRemap, A_TYPES__WorkflowCondition } from './A-Workflows.types.js';
import './A-Workflows.constants.js';

/**
 * A_WorkflowFunctions — the predefined, serialization-safe function library
 * powering parameter remapping and conditional step execution.
 *
 * A workflow definition never carries executable code (it must survive JSON
 * transfer across services). Instead it references VALUES by dot-path and
 * BEHAVIOR by string id. This component is the single place those ids are
 * interpreted, so every service in a distributed run evaluates them
 * identically.
 *
 * Three public capabilities:
 *   - {@link resolveValue} — turn a single {@link A_TYPES__WorkflowValueSource}
 *     into a concrete value against the workflow context.
 *   - {@link remap} — build a full params object from a remap spec.
 *   - {@link evaluate} — evaluate a boolean {@link A_TYPES__WorkflowCondition}.
 *
 * All logic lives on this component (per the strict A-Concept "no loose
 * helper functions" rule); the string ids are merely dispatched internally.
 */
declare class A_WorkflowFunctions extends A_Component {
    /**
     * Resolve a single value source against the workflow `context`.
     *
     *   - `{ value }`     → the literal.
     *   - `{ from }`      → dot-path lookup into context (undefined if absent).
     *   - `{ fn, args }`  → apply the named {@link A_WorkflowValueFn} to the
     *                       resolved args.
     */
    resolveValue(context: Record<string, any>, source: A_TYPES__WorkflowValueSource): any;
    /**
     * Build a params object from a remap specification. Target keys support
     * dot-paths, so a remap may compose nested params.
     *
     * @example
     * ```ts
     * remap(ctx, { 'user.id': { from: 'params.id' }, token: { from: 'steps.login.token' } })
     * // => { user: { id: <ctx.params.id> }, token: <ctx.steps.login.token> }
     * ```
     */
    remap(context: Record<string, any>, spec?: A_TYPES__WorkflowRemap): Record<string, any>;
    /**
     * Evaluate a boolean condition against the workflow `context`. Unknown
     * function ids throw an {@link A_WorkflowError}.
     */
    evaluate(context: Record<string, any>, condition?: A_TYPES__WorkflowCondition): boolean;
    /** Resolve the `left` operand of a condition (undefined when omitted). */
    protected _left(context: Record<string, any>, condition: A_TYPES__WorkflowCondition): any;
    /** Resolve the `right` operand of a condition (undefined when omitted). */
    protected _right(context: Record<string, any>, condition: A_TYPES__WorkflowCondition): any;
    /** Apply a predefined value-transform function to already-resolved args. */
    protected _applyValueFn(fn: string, args: any[]): any;
    /**
     * Read a dot-path from an object. Supports nested objects and numeric
     * array indices (e.g. `steps.list.0.id`). Returns undefined on any
     * missing segment rather than throwing.
     */
    protected _get(obj: Record<string, any>, path: string): any;
    /**
     * Write a value at a dot-path into an object, creating intermediate
     * objects as needed.
     */
    protected _set(obj: Record<string, any>, path: string, value: any): void;
}

export { A_WorkflowFunctions };
