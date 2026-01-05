import { A_Caller, A_Component, A_Concept, A_Container, A_Context, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import {  A_SignalVectorFeatures } from "@adaas/a-utils/lib/A-Signal/A-Signal.constants";
import { A_SignalBus } from "@adaas/a-utils/lib/A-Signal/components/A-SignalBus.component";
import { A_SignalConfig } from "@adaas/a-utils/lib/A-Signal/context/A-SignalConfig.context";
import { A_Signal } from "@adaas/a-utils/lib/A-Signal/entities/A-Signal.entity";
import { A_SignalVector } from "@adaas/a-utils/lib/A-Signal/entities/A-SignalVector.entity";



jest.retryTimes(0);

describe('A-Signal tests', () => {
    it('Should Allow to emit basic signal structure', async () => {

        let result: A_SignalVector | undefined = undefined;

        class UserIntentionListener extends A_Component {
            @A_Concept.Start()
            async start(
                @A_Inject(A_Scope) scope: A_Scope,
                @A_Inject(A_SignalBus) bus: A_SignalBus
            ) {


                const signal = new A_Signal({
                    data: {
                        buttonId: 'submit-order'
                    }
                })
                await signal.next(scope)
            }


            @A_Feature.Extend()
            async [A_SignalVectorFeatures.Next](
                @A_Inject(A_Caller) vector: A_SignalVector
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

                await signal.next(scope)
            }


            @A_Feature.Extend()
            async [A_SignalVectorFeatures.Next](
                @A_Inject(A_Caller) vector: A_SignalVector
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