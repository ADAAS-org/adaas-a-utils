import { A_Concept, A_Container, A_Context, A_Inject, A_ScopeError } from "@adaas/a-concept";
import { ConfigReader } from "./components/ConfigReader.component";
import { A_Config } from "./A-Config.context";
import { A_Polyfill } from "../A-Polyfill/A-Polyfill.component";
import { A_ConfigError } from "./A-Config.error";
import { FileConfigReader } from "./components/FileConfigReader.component";
import { ENVConfigReader } from "./components/ENVConfigReader.component";


export class A_ConfigLoader extends A_Container {

    private reader!: ConfigReader


    @A_Concept.Load()
    async prepare(
        @A_Inject(A_Polyfill) polyfill: A_Polyfill,
    ) {
        const fs = await polyfill.fs();

        try {
            switch (true) {

                case A_Context.environment === 'server' && !!fs.existsSync(`${A_Context.concept}.conf.json`):
                    this.reader = this.scope.resolve<ConfigReader>(FileConfigReader);
                    break;

                case A_Context.environment === 'server' && !fs.existsSync(`${A_Context.concept}.conf.json`):
                    this.reader = this.scope.resolve<ConfigReader>(ENVConfigReader);
                    break;

                case A_Context.environment === 'browser':
                    this.reader = this.scope.resolve<ConfigReader>(ENVConfigReader);
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


    @A_Concept.Load({
        after: ['A_ConfigLoader.prepare']
    })
    async readVariables(
        @A_Inject(A_Config) config: A_Config,
    ) {
        await this.reader.inject(config);
    }
}