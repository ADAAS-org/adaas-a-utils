import { A_Component, A_Concept, A_Container, A_Context, A_Error, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_Signal, A_SignalBus, A_SignalBusError, A_SignalBusFeatures, A_SignalConfig, A_SignalState, A_SignalVector } from "@adaas/a-utils/a-signal";



jest.retryTimes(0);

describe('A-Signal tests', () => {
    it('Should Allow to create a new Signal', async () => {
        const signal = new A_Signal<{ message: string }>({
            data: {
                message: 'Hello, World!'
            }
        });

        expect(signal).toBeDefined();
        expect(signal).toBeInstanceOf(A_Signal);
        expect(signal.data.message).toBe('Hello, World!');
    });
    it('Should Allow to create a new Signal Vector', async () => {
        class MySignalA extends A_Signal<{ buttonId: string }> { }
        class MySignalB extends A_Signal<{ pageId: string }> { }

        const vector = new A_SignalVector<[MySignalA, MySignalB]>([
            new MySignalA({ data: { buttonId: 'submit-order' } }),
            new MySignalB({ data: { pageId: 'home-page' } })
        ]);

        expect(vector).toBeDefined();
        expect(vector).toBeInstanceOf(A_SignalVector);
        expect(vector.length).toBe(2);
        expect((vector.toDataVector())[0]?.buttonId).toBe('submit-order');
        expect((vector.toDataVector())[1]?.pageId).toBe('home-page');
    });
    it('Should Allow to match Signal Vector', async () => {
        class MySignalA extends A_Signal<{ buttonId: string }> { }
        class MySignalB extends A_Signal<{ pageId: string }> { }

        const vector = new A_SignalVector<[MySignalA, MySignalB]>([
            new MySignalA({ data: { buttonId: 'submit-order' } }),
            new MySignalB({ data: { pageId: 'home-page' } })
        ]);
        const vector2 = new A_SignalVector<[MySignalA, MySignalB]>([
            new MySignalA({ data: { buttonId: 'submit-order2' } }),
            new MySignalB({ data: { pageId: 'home-page' } })
        ]);
        const vector3 = new A_SignalVector<[MySignalA, MySignalB]>([
            new MySignalA({ data: { buttonId: 'submit-order' } }),
            new MySignalB({ data: { pageId: 'home-page' } })
        ]);

        expect(vector.match(vector2)).toBe(false);
        expect(vector.match(vector3)).toBe(true);
    });
    it('Should Allow to check if Signal Vector contains another Signal Vector', async () => {

        class MySignalA extends A_Signal<{ buttonId: string }> { }
        class MySignalB extends A_Signal<{ pageId: string }> { }
        class MySignalC extends A_Signal<{ userId: string }> { }

        const vector = new A_SignalVector<[MySignalA, MySignalB, MySignalC]>([
            new MySignalA({ data: { buttonId: 'submit-order' } }),
            new MySignalB({ data: { pageId: 'home-page' } }),
            new MySignalC({ data: { userId: 'user123' } })
        ]);
        const vector2 = new A_SignalVector<[MySignalA, MySignalC]>([
            new MySignalA({ data: { buttonId: 'submit-order' } }),
            new MySignalC({ data: { userId: 'user123' } })
        ]);
        const vector3 = new A_SignalVector<[MySignalB]>([
            new MySignalB({ data: { pageId: 'other-page' } })
        ]);

        expect(vector.contains(vector2)).toBe(true);
        expect(vector.contains(vector3)).toBe(true);
        expect(vector2.contains(vector)).toBe(false);

    });
    it('Should Allow to get signals fro Signal Vector', async () => {
        class MySignalA extends A_Signal<{ buttonId: string }> { }
        class MySignalB extends A_Signal<{ pageId: string }> { }
        class MySignalC extends A_Signal<{ userId: string }> { }

        const vector = new A_SignalVector([
            new MySignalA({ data: { buttonId: 'submit-order' } }),
            new MySignalB({ data: { pageId: 'home-page' } })
        ]);

        const signalA = vector.get(MySignalA);
        const signalB = vector.get(MySignalB);
        const signalC = vector.get(MySignalC);

        expect(signalA).toBeDefined();
        expect(signalA).toBeInstanceOf(MySignalA);
        expect(signalA?.data.buttonId).toBe('submit-order');
        expect(signalB).toBeDefined();
        expect(signalB).toBeInstanceOf(MySignalB);
        expect(signalB?.data.pageId).toBe('home-page');
        expect(signalC).toBeUndefined();
    });
    it('Should Allow to emit basic signal structure', async () => {

        let result: A_SignalVector | undefined = undefined;

        class UserIntentionListener extends A_Component {
            @A_Concept.Start()
            async start(
                @A_Inject(A_SignalBus) bus: A_SignalBus
            ) {
                await bus.next(new A_Signal({
                    data: {
                        buttonId: 'submit-order'
                    }
                }))
            }


            @A_Feature.Extend()
            async [A_SignalBusFeatures.onNext](
                @A_Inject(A_SignalVector) vector: A_SignalVector
            ) {
                result = vector;
            }
        }

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [new A_Container({
                name: 'test-container',
                components: [A_SignalBus, UserIntentionListener],
                fragments: [
                    new A_SignalConfig({
                        structure: [A_Signal]
                    })
                ]
            })]
        });

        await concept.load();
        await concept.start();

        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(A_SignalVector);
        expect(result!.length).toBe(1);
        expect((result!.toDataVector())[0]?.buttonId).toBe('submit-order');

    });
    it('Should Allow to work with custom Signals', async () => {

        class UserIntentionSignal extends A_Signal<{ buttonId: string }> { }

        class UserMousePositionSignal extends A_Signal<{ x: number, y: number }> {
            fromUndefined(): void {
                super.fromNew({
                    name: 'UserMousePositionSignal',
                    data: {
                        x: 0,
                        y: 0
                    }
                })
            }
        }
        class UserElementHoverSignal extends A_Signal<{ elementId: string }> { }



        let result: A_SignalVector | undefined = undefined;

        class UserIntentionListener extends A_Component {
            @A_Concept.Start()
            async start(
                @A_Inject(A_Scope) scope: A_Scope,
                @A_Inject(A_SignalBus) bus: A_SignalBus
            ) {

                const signal = new UserIntentionSignal({
                    data: {
                        buttonId: 'submit-order'
                    }
                })

                await bus.next(signal)
            }


            @A_Feature.Extend()
            async [A_SignalBusFeatures.onNext](
                @A_Inject(A_SignalVector) vector: A_SignalVector
            ) {
                result = vector;
            }
        }

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [new A_Container({
                name: 'test-container',
                components: [A_SignalBus, UserIntentionListener],
                fragments: [
                    new A_SignalConfig({
                        structure: [UserIntentionSignal, UserMousePositionSignal, UserElementHoverSignal]
                    })
                ]
            })]
        });

        await concept.load();
        await concept.start();


        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(A_SignalVector);
        expect(result!.length).toBe(3);

        expect((result!.toDataVector())[0]?.buttonId).toBe('submit-order');
        expect((result!.toDataVector())[1]?.x).toBe(0);
        expect((result!.toDataVector())[1]?.y).toBe(0);
        expect((result!.toDataVector())[2]).toBeUndefined();

    });

    // -----------------------------------------------------------------------
    // A_SignalState unit tests
    // -----------------------------------------------------------------------

    it('Should return false from A_SignalState.has() when signal type is not in structure', () => {
        class RouteSignal extends A_Signal<{ path: string }> { }
        class OtherSignal extends A_Signal<{ id: string }> { }

        const state = new A_SignalState([OtherSignal]);

        expect(state.has(new RouteSignal({ data: { path: '/' } }))).toBe(false);
        expect(state.has(RouteSignal)).toBe(false);
    });

    it('Should return true from A_SignalState.has() when signal type is in structure', () => {
        class RouteSignal extends A_Signal<{ path: string }> { }

        const state = new A_SignalState([RouteSignal]);

        expect(state.has(new RouteSignal({ data: { path: '/' } }))).toBe(true);
        expect(state.has(RouteSignal)).toBe(true);
    });

    it('Should return false from A_SignalState.has() when structure is empty (no config)', () => {
        class RouteSignal extends A_Signal<{ path: string }> { }

        const state = new A_SignalState([]);

        expect(state.has(new RouteSignal({ data: { path: '/' } }))).toBe(false);
    });

    it('Should track current and previous state in A_SignalState across set() calls', () => {
        class RouteSignal extends A_Signal<{ path: string }> { }

        const state = new A_SignalState([RouteSignal]);

        const first = new RouteSignal({ data: { path: '/' } });
        const second = new RouteSignal({ data: { path: '/settings' } });

        state.set(first);
        expect(state.get(RouteSignal)?.data.path).toBe('/');
        expect(state.getPrev(RouteSignal)).toBeUndefined();

        state.set(second);
        expect(state.get(RouteSignal)?.data.path).toBe('/settings');
        expect(state.getPrev(RouteSignal)?.data.path).toBe('/');
    });

    it('Should produce correct vector from A_SignalState.toVector() after set()', () => {
        class RouteSignal extends A_Signal<{ path: string }> { }

        const state = new A_SignalState([RouteSignal]);
        const signal = new RouteSignal({ data: { path: '/dashboard' } });

        state.set(signal);

        const vector = state.toVector();
        expect(vector).toBeInstanceOf(A_SignalVector);
        expect(vector.length).toBe(1);
        expect((vector.toDataVector())[0]?.path).toBe('/dashboard');
    });

    // -----------------------------------------------------------------------
    // Bus behavior when A_SignalConfig is missing or incomplete
    // -----------------------------------------------------------------------

    it('Should auto-discover signal types from scope when A_SignalConfig is missing from fragments', async () => {
        class RouteSignal extends A_Signal<{ path: string }> { }

        let result: A_SignalVector | undefined = undefined;

        class Listener extends A_Component {
            @A_Concept.Start()
            async start(@A_Inject(A_SignalBus) bus: A_SignalBus) {
                await bus.next(new RouteSignal({ data: { path: '/settings' } }));
            }

            @A_Feature.Extend()
            async [A_SignalBusFeatures.onNext](
                @A_Inject(A_SignalVector) vector: A_SignalVector
            ) {
                result = vector;
            }
        }

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [new A_Container({
                name: 'test-container',
                components: [A_SignalBus, Listener],
                fragments: []  // no explicit A_SignalConfig — auto-discovery from scope should kick in
            })]
        });

        await concept.load();
        await concept.start();

        // Bus auto-builds config from the emitted signal instance → onNext fires
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(A_SignalVector);
        expect((result!.toDataVector())[0]?.path).toBe('/settings');
    });

    it('Should produce undefined vector in onNext when emitted signal type is absent from A_SignalConfig structure', async () => {
        class RouteSignal extends A_Signal<{ path: string }> { }
        class OtherSignal extends A_Signal<{ id: string }> { }

        let receivedVector: A_SignalVector | undefined = undefined;
        let onNextCalled = false;

        class Listener extends A_Component {
            @A_Concept.Start()
            async start(@A_Inject(A_SignalBus) bus: A_SignalBus) {
                await bus.next(new RouteSignal({ data: { path: '/settings' } }));
            }

            @A_Feature.Extend()
            async [A_SignalBusFeatures.onNext](
                @A_Inject(A_SignalVector) vector: A_SignalVector
            ) {
                onNextCalled = true;
                receivedVector = vector;
            }
        }

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [new A_Container({
                name: 'test-container',
                components: [A_SignalBus, Listener],
                fragments: [
                    new A_SignalConfig({ structure: [OtherSignal] })  // RouteSignal not listed
                ]
            })]
        });

        await concept.load();
        await concept.start();

        // onNext chain still fires (early-return in bus ext doesn't block downstream extensions)
        // but A_SignalVector is never registered in scope → listener receives undefined
        expect(onNextCalled).toBe(true);
        expect(receivedVector).toBeUndefined();
    });

    it('Should accumulate state and track previous values across sequential bus.next() calls', async () => {
        class RouteSignal extends A_Signal<{ path: string }> { }

        const vectors: A_SignalVector[] = [];

        class Listener extends A_Component {
            @A_Concept.Start()
            async start(@A_Inject(A_SignalBus) bus: A_SignalBus) {
                await bus.next(new RouteSignal({ data: { path: '/' } }));
                await bus.next(new RouteSignal({ data: { path: '/settings' } }));
                await bus.next(new RouteSignal({ data: { path: '/dashboard' } }));
            }

            @A_Feature.Extend()
            async [A_SignalBusFeatures.onNext](
                @A_Inject(A_SignalVector) vector: A_SignalVector
            ) {
                vectors.push(vector);
            }
        }

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [new A_Container({
                name: 'test-container',
                components: [A_SignalBus, Listener],
                fragments: [new A_SignalConfig({ structure: [RouteSignal] })]
            })]
        });

        await concept.load();
        await concept.start();

        expect(vectors.length).toBe(3);
        expect((vectors[0]!.toDataVector())[0]?.path).toBe('/');
        expect((vectors[1]!.toDataVector())[0]?.path).toBe('/settings');
        expect((vectors[2]!.toDataVector())[0]?.path).toBe('/dashboard');
    });

    it('Should call onError handler with a proper error instance when signal processing fails', async () => {
        class RouteSignal extends A_Signal<{ path: string }> { }

        let caughtError: A_Error | undefined = undefined;

        class Listener extends A_Component {
            @A_Concept.Start()
            async start(@A_Inject(A_SignalBus) bus: A_SignalBus) {
                await bus.next(new RouteSignal({ data: { path: '/fail' } }));
            }

            // Override onNext to throw intentionally
            @A_Feature.Extend()
            async [A_SignalBusFeatures.onNext](
                @A_Inject(A_SignalVector) vector: A_SignalVector
            ) {
                throw new Error('intentional failure');
            }

            // Override onError to capture the wrapped error
            @A_Feature.Extend()
            async [A_SignalBusFeatures.onError](
                @A_Inject(A_Error) error: A_Error
            ) {
                caughtError = error;
            }
        }

        const concept = new A_Concept({
            name: 'test-concept',
            containers: [new A_Container({
                name: 'test-container',
                components: [A_SignalBus, Listener],
                fragments: [new A_SignalConfig({ structure: [RouteSignal] })]
            })]
        });

        await concept.load();
        await concept.start();

        expect(caughtError).toBeDefined();
        expect(caughtError).toBeInstanceOf(A_SignalBusError);
    });

})