import { A_Caller, A_Concept, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_Container, A_Context, A_Fragment, A_Inject, A_Scope, A_ScopeError } from "@adaas/a-concept";
import { ConfigReader } from "./components/ConfigReader.component";
import { A_Config } from "./A-Config.context";
import { A_Polyfill } from "../A-Polyfill/A-Polyfill.component";
import { A_ConfigError } from "./A-Config.error";
import { FileConfigReader } from "./components/FileConfigReader.component";
import { ENVConfigReader } from "./components/ENVConfigReader.component";
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from "./A-Config.constants";
import { A_Frame } from "@adaas/a-frame";



@A_Frame.Container({
    namespace: 'A-Utils',
    name: 'A-ConfigLoader',
    description: 'Container responsible for loading and initializing the A_Config component based on the environment and available configuration sources. It can be useful for application that need a separated configuration management and sharable across multiple containers.'
})
export class A_ConfigLoader extends A_Container {

    private reader!: ConfigReader


    @A_Concept.Load({
        before: /.*/
    })
    async prepare(
        @A_Inject(A_Polyfill) polyfill: A_Polyfill
    ) {
        if (!this.scope.has(A_Config)) {
            const newConfig = new A_Config({
                variables: [
                    ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
                    ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
                ] as const,
                defaults: {}
            });

            this.scope.register<A_Fragment>(newConfig);
        }


        const fs = await polyfill.fs();

        try {
            switch (true) {

                case A_Context.environment === 'server' && !!fs.existsSync(`${A_Context.concept}.conf.json`):
                    this.reader = this.scope.resolve<ConfigReader>(FileConfigReader)!;
                    break;

                case A_Context.environment === 'server' && !fs.existsSync(`${A_Context.concept}.conf.json`):
                    this.reader = this.scope.resolve<ConfigReader>(ENVConfigReader)!;
                    break;

                case A_Context.environment === 'browser':
                    this.reader = this.scope.resolve<ConfigReader>(ENVConfigReader)!;
                    break;

                default:
                    throw new A_ConfigError(
                        A_ConfigError.InitializationError,
                        `Environment ${A_Context.environment} is not supported`
                    );
            }
        } catch (error) {
            if (error instanceof A_ScopeError) {
                throw new A_ConfigError({
                    title: A_ConfigError.InitializationError,
                    description: `Failed to initialize A_ConfigLoader. Reader not found for environment ${A_Context.environment}`,
                    originalError: error,
                })
            }
        }
    }
}