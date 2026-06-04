import {
    A_Component,
    A_Container,
    A_Context,
    A_Entity,
    A_Error,
    A_Fragment,
    A_Scope,
    A_CommonHelper,
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";

import type {
    A_TYPES__InspectorContainerSnapshot,
    A_TYPES__InspectorFeatureSnapshot,
    A_TYPES__InspectorFeatureStepSnapshot,
    A_TYPES__InspectorScopeSnapshot,
} from "../A-Inspector.types";


/**
 * `InspectorSnapshotHelper` is a regular `A_Component` (NOT a loose
 * utility module) whose only purpose is to turn the live in-memory
 * `A_Context`/`A_Scope` graph into plain serializable snapshots that
 * the inspection commands can return as their `result`.
 *
 * Keeping the snapshot logic inside a component keeps it within the
 * A-Concept dependency-injection world: commands receive it via
 * `@A_Inject(InspectorSnapshotHelper)`, individual hosts can replace
 * it by registering a subclass, and we don't leak any "free functions"
 * into the public surface.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Helper component that turns the live A_Context / A_Scope graph into serializable inspector snapshots used by InspectXxxCommand results.'
})
export class InspectorSnapshotHelper extends A_Component {

    scopeSnapshot(scope: A_Scope): A_TYPES__InspectorScopeSnapshot {
        return {
            name: scope.name,
            fingerprint: scope.fingerprint,
            version: scope.version,
            parent: scope.parent?.name,
            imports: scope.imports.map((s: A_Scope) => s.name),
            components: scope.components.map((c: A_Component) => ({
                name: A_CommonHelper.getComponentName(c),
                constructor: c.constructor.name,
            })),
            fragments: scope.fragments.map((f: A_Fragment) => ({
                name: A_CommonHelper.getComponentName(f),
                constructor: f.constructor.name,
            })),
            entities: scope.entities.map((e: A_Entity) => ({
                name: A_CommonHelper.getComponentName(e),
                constructor: e.constructor.name,
                aseid: e.aseid?.toString?.() ?? '',
            })),
            errors: scope.errors.map((e: A_Error) => ({
                name: e.constructor.name,
                code: (e as any).code ?? '',
            })),
            allowedComponents: Array.from(scope.allowedComponents).map(c => c.name),
            allowedEntities: Array.from(scope.allowedEntities).map(c => c.name),
            allowedFragments: Array.from(scope.allowedFragments).map(c => c.name),
            allowedErrors: Array.from(scope.allowedErrors).map(c => c.name),
        };
    }

    /**
     * Walks the registry of allocated containers reachable from the
     * given scope (and its inherited/imported scopes) and returns a
     * stable list of container snapshots.
     */
    collectContainers(scope: A_Scope): Array<A_TYPES__InspectorContainerSnapshot> {
        const seen = new Set<A_Container>();
        const visitedScopes = new Set<A_Scope>();
        const out: Array<A_TYPES__InspectorContainerSnapshot> = [];

        const instance: any = (A_Context as any).getInstance();
        const scopeIssuers: WeakMap<A_Scope, any> | undefined = instance?._scopeIssuers;

        const addContainer = (c: A_Container) => {
            if (seen.has(c)) return;
            seen.add(c);
            out.push({
                name: c.name,
                constructor: c.constructor.name,
                scope: this.safeScopeName(c),
            });
        };

        const visit = (s: A_Scope) => {
            if (visitedScopes.has(s)) return;
            visitedScopes.add(s);

            // 1) Components hosted inside the scope itself.
            for (const c of s.components) {
                if (c instanceof A_Container) addContainer(c);
            }

            // 2) The scope's *issuer* (when scope was allocated for a
            //    container by `A_Context.allocate`).
            const issuer = scopeIssuers?.get(s);
            if (issuer instanceof A_Container) addContainer(issuer);

            // 3) Walk child scopes — every container's allocated scope
            //    inherits from root and so is a subscriber of root.
            const subs: Set<WeakRef<A_Scope>> | undefined = (s as any)._subscribers;
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
    featureSnapshot(
        component: A_Component | A_Container | A_Entity,
        feature: string,
        scope: A_Scope,
    ): A_TYPES__InspectorFeatureSnapshot {
        const steps = A_Context.featureTemplate(feature, component, scope);
        const stepSnapshots: Array<A_TYPES__InspectorFeatureStepSnapshot> = steps.map((step) => ({
            handler: step.handler,
            dependency: step.dependency?.name ?? '',
            order: (step as any).order,
            scope: (step as any).scope?.toString?.(),
            override: (step as any).override?.toString?.(),
        }));

        return {
            component: A_CommonHelper.getComponentName(component),
            feature,
            steps: stepSnapshots,
        };
    }

    protected safeScopeName(component: A_Container | A_Component): string {
        try {
            return A_Context.scope(component).name;
        } catch {
            return '<unregistered>';
        }
    }
}
