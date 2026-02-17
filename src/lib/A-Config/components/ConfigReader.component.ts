import {
    A_Component, A_CONCEPT_ENV,
    A_Concept, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
    A_Container, A_Dependency,
    A_Inject, A_Scope
} from "@adaas/a-concept";
import { A_Frame } from "@adaas/a-frame";
import { A_Config } from "../A-Config.context";
import { A_Polyfill } from "@adaas/a-utils/a-polyfill";
import { A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY } from "../A-Config.constants";

/**
 * Config Reader
 */
@A_Frame.Component({
    namespace: 'A-Utils',
    name: 'ConfigReader',
    description: 'Abstract component for reading configuration data from various sources such as files, environment variables, or remote services. This component can be extended to implement specific configuration reading strategies.'
})
export class ConfigReader extends A_Component {

    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
        ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
        ...A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];

    constructor(
        @A_Dependency.Required()
        @A_Inject(A_Polyfill) protected polyfill: A_Polyfill,
    ) {
        super();
    }

    @A_Concept.Load()
    async attachContext(
        @A_Inject(A_Container) container: A_Container,
        @A_Inject(A_Scope) context: A_Scope,
        @A_Inject(A_Config) config?: A_Config<any>,
    ) {
        if (!config) {
            config = new A_Config({
                defaults: {}
            });

            container.scope.register(config);
        }
        
        config.set('A_CONCEPT_ROOT_FOLDER', A_CONCEPT_ENV.A_CONCEPT_ROOT_FOLDER);
    }

    @A_Concept.Load()
    async initialize(
        @A_Dependency.Required()
        @A_Inject(A_Config) config: A_Config,
    ) {
        const data = await this.read();

        for (const key in data) {
            config.set(key, data[key]);
        }
    }

    /**
     * Get the configuration property by Name
     * @param property 
     */
    resolve<_ReturnType = any>(property: string): _ReturnType {
        return property as _ReturnType;
    }

    /**
     * This method reads the configuration and sets the values to the context
     * 
     * @returns 
     */
    async read<T extends string>(
        variables: Array<T> = []
    ): Promise<Record<T, any>> {
        return {} as Record<T, any>;
    }
}