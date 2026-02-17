import { A_Component, A_Container, A_Scope } from '@adaas/a-concept';
import { A_Config } from '../A-Config.context.mjs';
import { A_Polyfill } from '../../A-Polyfill/A-Polyfill.component.env-node.mjs';
import '../A-Config.types.mjs';
import '../../A-Execution/A-Execution.context.mjs';
import '../A-Config.constants.mjs';
import '../../A-Polyfill/A-Polyfill.types.mjs';
import '../../A-Logger/A-Logger.component.mjs';
import '../../A-Logger/A-Logger.types.mjs';
import '../../A-Logger/A-Logger.env.mjs';
import '../../A-Polyfill/node/A-Crypto-Polyfill.mjs';
import '../../A-Polyfill/base/A-Crypto-Polyfill.base.mjs';
import '../../A-Polyfill/node/A-Http-Polyfill.mjs';
import '../../A-Polyfill/base/A-Http-Polyfill.base.mjs';
import '../../A-Polyfill/node/A-Https-Polyfill.mjs';
import '../../A-Polyfill/base/A-Https-Polyfill.base.mjs';
import '../../A-Polyfill/node/A-Path-Polyfill.mjs';
import '../../A-Polyfill/base/A-Path-Polyfill.base.mjs';
import '../../A-Polyfill/node/A-Url-Polyfill.mjs';
import '../../A-Polyfill/base/A-Url-Polyfill.base.mjs';
import '../../A-Polyfill/node/A-Buffer-Polyfill.mjs';
import '../../A-Polyfill/base/A-Buffer-Polyfill.base.mjs';
import '../../A-Polyfill/node/A-Process-Polyfill.mjs';
import '../../A-Polyfill/base/A-Process-Polyfill.base.mjs';
import '../../A-Polyfill/node/A-FS-Polyfill.mjs';
import '../../A-Polyfill/base/A-FS-Polyfill.base.mjs';

/**
 * Config Reader
 */
declare class ConfigReader extends A_Component {
    protected polyfill: A_Polyfill;
    protected DEFAULT_ALLOWED_TO_READ_PROPERTIES: ("A_CONCEPT_NAME" | "A_CONCEPT_ROOT_SCOPE" | "A_CONCEPT_ENVIRONMENT" | "A_CONCEPT_RUNTIME_ENVIRONMENT" | "A_CONCEPT_ROOT_FOLDER" | "A_ERROR_DEFAULT_DESCRIPTION")[];
    constructor(polyfill: A_Polyfill);
    attachContext(container: A_Container, context: A_Scope, config?: A_Config<any>): Promise<void>;
    initialize(config: A_Config): Promise<void>;
    /**
     * Get the configuration property by Name
     * @param property
     */
    resolve<_ReturnType = any>(property: string): _ReturnType;
    /**
     * This method reads the configuration and sets the values to the context
     *
     * @returns
     */
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

export { ConfigReader };
