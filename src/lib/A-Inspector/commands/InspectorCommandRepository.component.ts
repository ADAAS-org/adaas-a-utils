import {
    A_Caller,
    A_Component,
    A_Context,
    A_Feature,
    A_Inject,
    A_Scope,
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame/core";
import { A_Command, A_CommandFeatures } from "@adaas/a-utils/a-command";

import { A_InspectorError } from "../A-Inspector.error";
import type {
    A_TYPES__InspectorConceptSnapshot,
    A_TYPES__InspectorScopeSnapshot,
} from "../A-Inspector.types";

import { InspectorSnapshotHelper } from "./InspectorSnapshot.helper.component";
import { InspectorPingCommand } from "./InspectorPingCommand";
import { InspectConceptCommand } from "./InspectConceptCommand";
import { InspectScopeCommand } from "./InspectScopeCommand";
import { InspectFeatureCommand } from "./InspectFeatureCommand";
import { A_Logger } from "@adaas/a-utils/a-logger";


/**
 * `InspectorCommandRepository` — server-side executor for every
 * `A_Command` shipped by `A_ConceptInspector`.
 *
 * Mirrors the canonical ADAAS "command + repository" pattern (see
 * `AisKnowledgeBaseRepository.onIngestKbFileCommandExecute`):
 *
 *   - The command classes (`InspectorPingCommand`, `InspectConceptCommand`,
 *     ...) are pure typed data shells — they declare `params` /
 *     `result` shapes and a stable `entity` name. They can therefore
 *     live in any environment (browser, Node, worker) and ship over
 *     the wire by themselves.
 *   - This component listens on `A_CommandFeatures.onExecute` scoped to
 *     each command class, and supplies the actual execution logic.
 *     `A_ConceptInspector` registers it into the inspector container's
 *     own scope, so feature dispatch resolves it for any command that
 *     is registered into that scope before `execute()` is invoked.
 */
@A_Frame.Define({
    namespace: 'A-Utils',
    description: 'Server-side executor for InspectorPing / InspectConcept / InspectScope / InspectFeature commands.'
})
export class InspectorCommandRepository extends A_Component {

    // ====================================================================
    // =========================  PING  ===================================
    // ====================================================================

    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute,
        scope: [InspectorPingCommand],
    })
    async onPingExecute(
        @A_Inject(A_Caller) command: InspectorPingCommand,
        @A_Inject(A_Logger) logger: A_Logger,
    ): Promise<void> {
        logger.debug(`Received ping command with params`, command.params);

        await command.complete({
            pong: true,
            token: command.params?.token ?? '',
            serverTime: new Date().toISOString(),
        });
    }


    // ====================================================================
    // ======================  INSPECT CONCEPT  ===========================
    // ====================================================================

    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute,
        scope: [InspectConceptCommand],
    })
    async onInspectConceptExecute(
        @A_Inject(A_Caller) command: InspectConceptCommand,
        @A_Inject(InspectorSnapshotHelper) snap: InspectorSnapshotHelper,
        @A_Inject(A_Logger) logger: A_Logger,
    ): Promise<void> {
        const root = A_Context.root;

        logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);

        const snapshot: A_TYPES__InspectorConceptSnapshot = {
            name: A_Context.concept,
            environment: A_Context.environment,
            rootScope: snap.scopeSnapshot(root) as A_TYPES__InspectorScopeSnapshot,
            containers: snap.collectContainers(root),
        };

        await command.complete({ snapshot });
    }


    // ====================================================================
    // =======================  INSPECT SCOPE  ============================
    // ====================================================================

    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute,
        scope: [InspectScopeCommand],
    })
    async onInspectScopeExecute(
        @A_Inject(A_Caller) command: InspectScopeCommand,
        @A_Inject(InspectorSnapshotHelper) snap: InspectorSnapshotHelper,
    ): Promise<void> {
        const target = command.params?.scope;
        const root = A_Context.root;

        const found = !target || target === root.name || target === 'root'
            ? root
            : this.findScope(root, target);

        if (!found) {
            await command.fail(new A_InspectorError({
                title: A_InspectorError.InspectorCommandNotFoundError,
                description: `Scope '${target}' was not reachable from the root scope.`,
            }));
            return;
        }

        await command.complete({ snapshot: snap.scopeSnapshot(found) });
    }


    // ====================================================================
    // =======================  INSPECT FEATURE  ==========================
    // ====================================================================

    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute,
        scope: [InspectFeatureCommand],
    })
    async onInspectFeatureExecute(
        @A_Inject(A_Caller) command: InspectFeatureCommand,
        @A_Inject(InspectorSnapshotHelper) snap: InspectorSnapshotHelper,
        @A_Inject(A_Logger) logger: A_Logger,
    ): Promise<void> {
        const { component: componentName, feature, scope: scopeName } = command.params;

        const root = A_Context.root;
        const scope = !scopeName || scopeName === 'root' || scopeName === root.name
            ? root
            : this.findScope(root, scopeName);

        logger.debug(`Executing Command ${command.aseid.toString()} in status ${command.status} with params`, command.params);

        if (!scope) {
            await command.fail(new A_InspectorError({
                title: A_InspectorError.InspectorCommandNotFoundError,
                description: `Scope '${scopeName}' not reachable from root scope.`,
            }));
            return;
        }

        const componentInstance = scope.resolve<any>(componentName as any);

        if (!componentInstance) {
            await command.fail(new A_InspectorError({
                title: A_InspectorError.InspectorCommandNotFoundError,
                description: `Component '${componentName}' is not registered in scope '${scope.name}'.`,
            }));
            return;
        }

        const snapshot = snap.featureSnapshot(componentInstance, feature, scope);
        await command.complete({ snapshot });
    }


    // ====================================================================
    // =========================  HELPERS  ================================
    // ====================================================================

    protected findScope(start: A_Scope, name: string): A_Scope | undefined {
        const seen = new Set<A_Scope>();
        const stack: A_Scope[] = [start];

        while (stack.length) {
            const s = stack.pop()!;
            if (seen.has(s)) continue;
            seen.add(s);
            if (s.name === name) return s;
            if (s.parent) stack.push(s.parent);
            for (const imp of s.imports) stack.push(imp);
            // Walk children too — container scopes are subscribers of
            // the root scope they inherit from, not parents of it.
            const subs: Set<WeakRef<A_Scope>> | undefined = (s as any)._subscribers;
            if (subs) {
                for (const ref of subs) {
                    const child = ref.deref();
                    if (child) stack.push(child);
                }
            }
        }
        return undefined;
    }
}
