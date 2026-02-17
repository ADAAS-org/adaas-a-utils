import { A_TYPES__ConceptENVVariables, A_Feature } from '@adaas/a-concept';
import { ConfigReader } from './ConfigReader.component.js';
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

declare class ENVConfigReader extends ConfigReader {
    readEnvFile(config: A_Config<A_TYPES__ConceptENVVariables>, polyfill: A_Polyfill, feature: A_Feature): Promise<void>;
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_ENV_Alias(property: string): string;
    resolve<_ReturnType = any>(property: string): _ReturnType;
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}

export { ENVConfigReader };
