'use strict';

var aConcept = require('@adaas/a-concept');
var ConfigReader_component = require('./ConfigReader.component');
var AConfig_context = require('../A-Config.context');
var aFrame = require('@adaas/a-frame');
var aPolyfill = require('@adaas/a-utils/a-polyfill');

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);
exports.ENVConfigReader = class ENVConfigReader extends ConfigReader_component.ConfigReader {
  async readEnvFile(config, polyfill, feature) {
    const fs = await polyfill.fs();
    if (fs.existsSync(".env"))
      fs.readFileSync(`${config.get("A_CONCEPT_ROOT_FOLDER")}/.env`, "utf-8").split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          aConcept.A_CONCEPT_ENV.set(key.trim(), value.trim());
        }
      });
  }
  /**
   * Get the configuration property Name 
   * @param property 
   */
  getConfigurationProperty_ENV_Alias(property) {
    return aConcept.A_FormatterHelper.toUpperSnakeCase(property);
  }
  resolve(property) {
    return aConcept.A_CONCEPT_ENV.get(this.getConfigurationProperty_ENV_Alias(property));
  }
  async read(variables = []) {
    const allVariables = [
      ...variables,
      ...aConcept.A_CONCEPT_ENV.getAllKeys()
    ];
    const config = {};
    allVariables.forEach((variable) => {
      config[variable] = this.resolve(variable);
    });
    return config;
  }
};
__decorateClass([
  aConcept.A_Concept.Load({
    before: ["ENVConfigReader.initialize"]
  }),
  __decorateParam(0, aConcept.A_Inject(AConfig_context.A_Config)),
  __decorateParam(1, aConcept.A_Inject(aPolyfill.A_Polyfill)),
  __decorateParam(2, aConcept.A_Inject(aConcept.A_Feature))
], exports.ENVConfigReader.prototype, "readEnvFile", 1);
exports.ENVConfigReader = __decorateClass([
  aFrame.A_Frame.Component({
    namespace: "A-Utils",
    name: "ENVConfigReader",
    description: "Configuration reader that sources configuration data from environment variables. It supports loading variables from a .env file and maps them to the configuration context, making it suitable for applications running in diverse environments such as local development, staging, and production."
  })
], exports.ENVConfigReader);
//# sourceMappingURL=ENVConfigReader.component.js.map
//# sourceMappingURL=ENVConfigReader.component.js.map