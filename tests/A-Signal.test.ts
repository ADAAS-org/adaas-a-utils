import { A_Component, A_Concept, A_Container, A_Context, A_Feature, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_SignalBusFeatures, A_SignalFeatures } from "@adaas/a-utils/lib/A-Signal/A-Signal.constants";
import { A_SignalBus } from "@adaas/a-utils/lib/A-Signal/components/A-SignalBus.component";
import { A_SignalConfig } from "@adaas/a-utils/lib/A-Signal/context/A-SignalConfig.context";
import { A_Signal } from "@adaas/a-utils/lib/A-Signal/entities/A-Signal.entity";
import { A_SignalVector } from "@adaas/a-utils/lib/A-Signal/entities/A-SignalVector.entity";



jest.retryTimes(0);

describe('A-Signal tests', () => {
    it('Should Allow to create a config object', async () => {

        let result;

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

                console.log(A_Context.featureTemplate(A_SignalFeatures.Emit, signal, scope))

                await signal.emit(scope)
            }


            @A_Feature.Extend()
            async [A_SignalBusFeatures.Emit](
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
        expect(result.values.length).toBe(1);
        expect(result.values[0].buttonId).toBe('submit-order');

    });
})