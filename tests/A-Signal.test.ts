import { A_Component, A_Concept, A_Container, A_Context, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_SignalBus } from "@adaas/a-utils/lib/A-Signal/components/A-SignalBus.component";
import { A_SignalBusFeatures } from "@adaas/a-utils/lib/A-Signal/components/A-SignalBus.constants";
import { A_SignalConfig } from "@adaas/a-utils/lib/A-Signal/context/A-SignalConfig.context";
import { A_Signal } from "@adaas/a-utils/lib/A-Signal/entities/A-Signal.entity";
import { A_SignalVector } from "@adaas/a-utils/lib/A-Signal/entities/A-SignalVector.entity";



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

        const vector = new A_SignalVector({
            structure: [MySignalA, MySignalB],
            values: [
                new MySignalA({ data: { buttonId: 'submit-order' } }),
                new MySignalB({ data: { pageId: 'home-page' } })
            ]
        });

        expect(vector).toBeDefined();
        expect(vector).toBeInstanceOf(A_SignalVector);
        expect(vector.length).toBe(2);
        expect((await vector.toDataVector())[0]?.buttonId).toBe('submit-order');
        expect((await vector.toDataVector())[1]?.pageId).toBe('home-page');
    });
    it('Should Allow to get signals fro Signal Vector', async () => {
        class MySignalA extends A_Signal<{ buttonId: string }> { }
        class MySignalB extends A_Signal<{ pageId: string }> { }
        class MySignalC extends A_Signal<{ userId: string }> { }

        const vector = new A_SignalVector({
            structure: [MySignalA, MySignalB],
            values: [
                new MySignalA({ data: { buttonId: 'submit-order' } }),
                new MySignalB({ data: { pageId: 'home-page' } })
            ]
        });

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
        expect((await result!.toDataVector())[0]?.buttonId).toBe('submit-order');

    });
    it('Should Allow to work with custom Signals', async () => {

        class UserIntentionSignal extends A_Signal<{ buttonId: string }> { }

        class UserMousePositionSignal extends A_Signal<{ x: number, y: number }> {
            static async default(): Promise<A_Signal | undefined> {
                return Promise.resolve(new UserMousePositionSignal({
                    data: { x: 0, y: 0 }
                }));
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

        expect((await result!.toDataVector())[0]?.buttonId).toBe('submit-order');
        expect((await result!.toDataVector())[1]?.x).toBe(0);
        expect((await result!.toDataVector())[1]?.y).toBe(0);
        expect((await result!.toDataVector())[2]).toBeUndefined();

    });

})