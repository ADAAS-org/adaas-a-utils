import { A_Concept, A_Container } from "@adaas/a-concept"
import { A_ConfigLoader } from "@adaas/a-utils/lib/A-Config/A-Config.container";
import { A_Config } from "@adaas/a-utils/lib/A-Config/A-Config.context";
import { ENVConfigReader } from "@adaas/a-utils/lib/A-Config/components/ENVConfigReader.component";
import { A_Polyfill } from "@adaas/a-utils/lib/A-Polyfill/A-Polyfill.component";



(async () => {


    const service1 = new A_ConfigLoader({
        name: 'ConfigLoaderContainer',
        components: [
            A_Polyfill, ENVConfigReader
        ]
    })

    const concept = new A_Concept({
        name: 'test-config',
        containers: [service1],
    });


    await concept.load();
    await concept.start();


    const config = service1.scope.resolve<A_Config<['ADAAS_SSO_LOCATION']>>(A_Config)!;

    console.log('config: ', config.get('ADAAS_SSO_LOCATION'))

})()