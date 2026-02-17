import { __decorateClass, __decorateParam } from '../../../chunk-EQQGB2QZ.mjs';
import { A_Concept, A_Inject, A_Feature, A_CONCEPT_ENV, A_FormatterHelper } from '@adaas/a-concept';
import { ConfigReader } from './ConfigReader.component';
import { A_Config } from '../A-Config.context';
import { A_Frame } from '@adaas/a-frame';
import { A_Polyfill } from '@adaas/a-utils/a-polyfill';

let ENVConfigReader = class extends ConfigReader {
  async readEnvFile(config, polyfill, feature) {
    const fs = await polyfill.fs();
    if (fs.existsSync(".env"))
      fs.readFileSync(`${config.get("A_CONCEPT_ROOT_FOLDER")}/.env`, "utf-8").split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          A_CONCEPT_ENV.set(key.trim(), value.trim());
        }
      });
  }
  /**
   * Get the configuration property Name 
   * @param property 
   */
  getConfigurationProperty_ENV_Alias(property) {
    return A_FormatterHelper.toUpperSnakeCase(property);
  }
  resolve(property) {
    return A_CONCEPT_ENV.get(this.getConfigurationProperty_ENV_Alias(property));
  }
  async read(variables = []) {
    const allVariables = [
      ...variables,
      ...A_CONCEPT_ENV.getAllKeys()
    ];
    const config = {};
    allVariables.forEach((variable) => {
      config[variable] = this.resolve(variable);
    });
    return config;
  }
};
__decorateClass([
  A_Concept.Load({
    before: ["ENVConfigReader.initialize"]
  }),
  __decorateParam(0, A_Inject(A_Config)),
  __decorateParam(1, A_Inject(A_Polyfill)),
  __decorateParam(2, A_Inject(A_Feature))
], ENVConfigReader.prototype, "readEnvFile", 1);
ENVConfigReader = __decorateClass([
  A_Frame.Component({
    namespace: "A-Utils",
    name: "ENVConfigReader",
    description: "Configuration reader that sources configuration data from environment variables. It supports loading variables from a .env file and maps them to the configuration context, making it suitable for applications running in diverse environments such as local development, staging, and production."
  })
], ENVConfigReader);

export { ENVConfigReader };
//# sourceMappingURL=ENVConfigReader.component.mjs.map
//# sourceMappingURL=ENVConfigReader.component.mjs.map