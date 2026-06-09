import { A_Component } from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_WorkflowError } from "./A-Workflows.error";
import {
    A_WorkflowConditionFn,
    A_WorkflowValueFn,
} from "./A-Workflows.constants";
import {
    A_TYPES__WorkflowCondition,
    A_TYPES__WorkflowRemap,
    A_TYPES__WorkflowValueSource,
} from "./A-Workflows.types";


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
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Predefined, JSON-serialization-safe function library for A-Workflows. Resolves value sources (literal / context-path / named transform), builds remapped step params, and evaluates portable boolean conditions so distributed workflows behave identically on every service.'
})
export class A_WorkflowFunctions extends A_Component {

    // ====================================================================
    // ================== Value Resolution ================================
    // ====================================================================

    /**
     * Resolve a single value source against the workflow `context`.
     *
     *   - `{ value }`     → the literal.
     *   - `{ from }`      → dot-path lookup into context (undefined if absent).
     *   - `{ fn, args }`  → apply the named {@link A_WorkflowValueFn} to the
     *                       resolved args.
     */
    resolveValue(
        context: Record<string, any>,
        source: A_TYPES__WorkflowValueSource
    ): any {
        if (source === null || typeof source !== 'object') {
            throw new A_WorkflowError({
                title: A_WorkflowError.FunctionError,
                description: `Invalid value source: ${JSON.stringify(source)?.slice(0, 100)}`,
            });
        }

        if ('value' in source) return source.value;

        if ('from' in source && typeof source.from === 'string') {
            return this._get(context, source.from);
        }

        if ('fn' in source && typeof source.fn === 'string') {
            const args = (source.args || []).map(a => this.resolveValue(context, a));
            return this._applyValueFn(source.fn, args);
        }

        throw new A_WorkflowError({
            title: A_WorkflowError.FunctionError,
            description: `Value source must define one of "value" | "from" | "fn". Received: ${JSON.stringify(source)?.slice(0, 100)}`,
        });
    }

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
    remap(
        context: Record<string, any>,
        spec?: A_TYPES__WorkflowRemap
    ): Record<string, any> {
        const out: Record<string, any> = {};
        if (!spec) return out;

        for (const targetKey of Object.keys(spec)) {
            const value = this.resolveValue(context, spec[targetKey]);
            this._set(out, targetKey, value);
        }
        return out;
    }

    // ====================================================================
    // ================== Condition Evaluation ============================
    // ====================================================================

    /**
     * Evaluate a boolean condition against the workflow `context`. Unknown
     * function ids throw an {@link A_WorkflowError}.
     */
    evaluate(
        context: Record<string, any>,
        condition?: A_TYPES__WorkflowCondition
    ): boolean {
        // No condition → always run.
        if (!condition) return true;

        const fn = condition.fn;

        switch (fn) {
            // ── Logical combinators ──────────────────────────────────
            case A_WorkflowConditionFn.AND:
                return (condition.conditions || []).every(c => this.evaluate(context, c));

            case A_WorkflowConditionFn.OR:
                return (condition.conditions || []).some(c => this.evaluate(context, c));

            case A_WorkflowConditionFn.NOT:
                return !(condition.conditions || []).every(c => this.evaluate(context, c));

            // ── Unary predicates ─────────────────────────────────────
            case A_WorkflowConditionFn.EXISTS:
                return this._left(context, condition) !== undefined
                    && this._left(context, condition) !== null;

            case A_WorkflowConditionFn.NOT_EXISTS:
                return this._left(context, condition) === undefined
                    || this._left(context, condition) === null;

            case A_WorkflowConditionFn.TRUTHY:
                return !!this._left(context, condition);

            case A_WorkflowConditionFn.FALSY:
                return !this._left(context, condition);

            // ── Binary comparisons ───────────────────────────────────
            case A_WorkflowConditionFn.EQUALS:
                return this._left(context, condition) === this._right(context, condition);

            case A_WorkflowConditionFn.NOT_EQUALS:
                return this._left(context, condition) !== this._right(context, condition);

            case A_WorkflowConditionFn.GT:
                return this._left(context, condition) > this._right(context, condition);

            case A_WorkflowConditionFn.GTE:
                return this._left(context, condition) >= this._right(context, condition);

            case A_WorkflowConditionFn.LT:
                return this._left(context, condition) < this._right(context, condition);

            case A_WorkflowConditionFn.LTE:
                return this._left(context, condition) <= this._right(context, condition);

            case A_WorkflowConditionFn.IN: {
                const haystack = this._right(context, condition);
                const needle = this._left(context, condition);
                return Array.isArray(haystack) ? haystack.includes(needle) : false;
            }

            case A_WorkflowConditionFn.MATCHES: {
                const value = this._left(context, condition);
                const pattern = this._right(context, condition);
                try {
                    return new RegExp(String(pattern)).test(String(value));
                } catch {
                    return false;
                }
            }

            default:
                throw new A_WorkflowError({
                    title: A_WorkflowError.FunctionError,
                    description: `Unknown condition function "${fn}".`,
                });
        }
    }

    // ====================================================================
    // ================== Internal Helpers ================================
    // ====================================================================

    /** Resolve the `left` operand of a condition (undefined when omitted). */
    protected _left(context: Record<string, any>, condition: A_TYPES__WorkflowCondition): any {
        return condition.left ? this.resolveValue(context, condition.left) : undefined;
    }

    /** Resolve the `right` operand of a condition (undefined when omitted). */
    protected _right(context: Record<string, any>, condition: A_TYPES__WorkflowCondition): any {
        return condition.right ? this.resolveValue(context, condition.right) : undefined;
    }

    /** Apply a predefined value-transform function to already-resolved args. */
    protected _applyValueFn(fn: string, args: any[]): any {
        switch (fn) {
            case A_WorkflowValueFn.CONCAT:
                return args.map(a => (a === undefined || a === null) ? '' : String(a)).join('');

            case A_WorkflowValueFn.UPPERCASE:
                return String(args[0] ?? '').toUpperCase();

            case A_WorkflowValueFn.LOWERCASE:
                return String(args[0] ?? '').toLowerCase();

            case A_WorkflowValueFn.COALESCE:
                return args.find(a => a !== undefined && a !== null);

            case A_WorkflowValueFn.NOW:
                return new Date().toISOString();

            case A_WorkflowValueFn.SUM:
                return args.reduce((acc, a) => acc + (Number(a) || 0), 0);

            case A_WorkflowValueFn.NOT:
                return !args[0];

            case A_WorkflowValueFn.JSON:
                return JSON.stringify(args[0]);

            default:
                throw new A_WorkflowError({
                    title: A_WorkflowError.FunctionError,
                    description: `Unknown value function "${fn}".`,
                });
        }
    }

    /**
     * Read a dot-path from an object. Supports nested objects and numeric
     * array indices (e.g. `steps.list.0.id`). Returns undefined on any
     * missing segment rather than throwing.
     */
    protected _get(obj: Record<string, any>, path: string): any {
        if (!path) return undefined;
        let cursor: any = obj;
        for (const segment of path.split('.')) {
            if (cursor === undefined || cursor === null) return undefined;
            cursor = cursor[segment];
        }
        return cursor;
    }

    /**
     * Write a value at a dot-path into an object, creating intermediate
     * objects as needed.
     */
    protected _set(obj: Record<string, any>, path: string, value: any): void {
        const segments = path.split('.');
        let cursor: any = obj;
        for (let i = 0; i < segments.length - 1; i++) {
            const segment = segments[i];
            if (cursor[segment] === undefined || cursor[segment] === null || typeof cursor[segment] !== 'object') {
                cursor[segment] = {};
            }
            cursor = cursor[segment];
        }
        cursor[segments[segments.length - 1]] = value;
    }
}
