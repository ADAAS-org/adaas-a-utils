import { A_TYPES__ConceptENVVariables, A_Feature } from '@adaas/a-concept';
import { ConfigReader } from './ConfigReader.component.mjs';
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
