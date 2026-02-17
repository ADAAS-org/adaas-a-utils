import { A_Component, A_Container, A_Scope } from '@adaas/a-concept';
import { A_Config } from '../A-Config.context.js';
import { A_Polyfill } from '../../A-Polyfill/A-Polyfill.component.env-node.js';
import '../A-Config.types.js';
import '../../A-Execution/A-Execution.context.js';
import '../A-Config.constants.js';
import '../../A-Polyfill/A-Polyfill.types.js';
import '../../A-Logger/A-Logger.component.js';
import '../../A-Logger/A-Logger.types.js';
import '../../A-Logger/A-Logger.env.js';
import '../../A-Polyfill/node/A-Crypto-Polyfill.js';
import '../../A-Polyfill/base/A-Crypto-Polyfill.base.js';
import '../../A-Polyfill/node/A-Http-Polyfill.js';
import '../../A-Polyfill/base/A-Http-Polyfill.base.js';
import '../../A-Polyfill/node/A-Https-Polyfill.js';
import '../../A-Polyfill/base/A-Https-Polyfill.base.js';
import '../../A-Polyfill/node/A-Path-Polyfill.js';
import '../../A-Polyfill/base/A-Path-Polyfill.base.js';
import '../../A-Polyfill/node/A-Url-Polyfill.js';
import '../../A-Polyfill/base/A-Url-Polyfill.base.js';
import '../../A-Polyfill/node/A-Buffer-Polyfill.js';
import '../../A-Polyfill/base/A-Buffer-Polyfill.base.js';
import '../../A-Polyfill/node/A-Process-Polyfill.js';
import '../../A-Polyfill/base/A-Process-Polyfill.base.js';
import '../../A-Polyfill/node/A-FS-Polyfill.js';
import '../../A-Polyfill/base/A-FS-Polyfill.base.js';

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
