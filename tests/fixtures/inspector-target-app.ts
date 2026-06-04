// Target-app fixture used by the inspector integration test.
//
// Defines a small but realistic A-Concept application surface so the
// inspector has something interesting to introspect:
//
//   - `Counter` entity (A_Entity subclass with toJSON/fromJSON state)
//   - `CounterRepository` component with two `@A_Feature.Extend` hooks
//     scoped to the `Counter` entity (increment / reset)
//   - `GreetingService` component with a single `@A_Feature.Extend()`
//     extension on a custom feature name
//
// These are deliberately exported so the integration test can assert
// the inspector's `InspectConceptCommand` / `InspectScopeCommand`
// snapshots actually contain them.

import {
    A_Component,
    A_Container,
    A_Entity,
    A_Feature,
    A_Inject,
    A_Caller,
} from '@adaas/a-concept';
import { A_Frame } from '@adaas/a-frame/core';


// ====================================================================
// ============================  COUNTER  =============================
// ====================================================================

export enum CounterFeatures {
    Increment = 'counter.increment',
    Reset = 'counter.reset',
}


export type CounterNew = {
    name: string;
    value?: number;
};

export type CounterSerialized = {
    aseid: string;
    name: string;
    value: number;
};


@A_Frame.Define({
    namespace: 'A-Inspector-Test',
    description: 'Simple counter entity used by the inspector integration test.'
})
export class Counter extends A_Entity<CounterNew, CounterSerialized> {

    name!: string;
    value!: number;

    fromNew(payload: CounterNew): void {
        super.fromNew(payload);
        this.name = payload.name;
        this.value = payload.value ?? 0;
    }

    fromJSON(payload: CounterSerialized): void {
        super.fromJSON(payload);
        this.name = payload.name;
        this.value = payload.value;
    }

    toJSON(): CounterSerialized {
        return {
            ...super.toJSON(),
            name: this.name,
            value: this.value,
        };
    }
}


@A_Frame.Define({
    namespace: 'A-Inspector-Test',
    description: 'Repository hosting increment/reset feature handlers for Counter entities.'
})
export class CounterRepository extends A_Component {

    @A_Feature.Extend({
        name: CounterFeatures.Increment,
        scope: [Counter],
    })
    async onIncrement(
        @A_Inject(A_Caller) counter: Counter,
    ): Promise<void> {
        counter.value += 1;
    }

    @A_Feature.Extend({
        name: CounterFeatures.Reset,
        scope: [Counter],
    })
    async onReset(
        @A_Inject(A_Caller) counter: Counter,
    ): Promise<void> {
        counter.value = 0;
    }
}


// ====================================================================
// =========================  GREETING SVC  ===========================
// ====================================================================

export enum GreetingFeatures {
    Hello = 'greeting.hello',
}


@A_Frame.Define({
    namespace: 'A-Inspector-Test',
    description: 'Trivial service component exposing a single Hello feature; used to validate feature introspection.'
})
export class GreetingService extends A_Component {

    public lastGreeted?: string;

    @A_Feature.Extend({
        name: GreetingFeatures.Hello,
    })
    async hello(): Promise<void> {
        this.lastGreeted = `hello @ ${Date.now()}`;
    }
}


// ====================================================================
// ============================  CONTAINER  ===========================
// ====================================================================

/**
 * Pre-built container that bundles the test app's components and
 * entities so the integration test can drop it into a concept just
 * like it drops in `A_ConceptInspectorContainer`.
 */
@A_Frame.Define({
    namespace: 'A-Inspector-Test',
    description: 'Target application container for the inspector integration test.'
})
export class TestTargetAppContainer extends A_Container { }

export const TargetAppContainer = new TestTargetAppContainer({
    name: 'inspector-test-target-app',
    components: [
        CounterRepository,
        GreetingService,
    ],
    entities: [Counter] as any,
});
