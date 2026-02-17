'use strict';

var aConcept = require('@adaas/a-concept');
var aFrame = require('@adaas/a-frame');
var AConfig_context = require('../A-Config.context');
var aPolyfill = require('@adaas/a-utils/a-polyfill');
var AConfig_constants = require('../A-Config.constants');

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
exports.ConfigReader = class ConfigReader extends aConcept.A_Component {
  constructor(polyfill) {
    super();
    this.polyfill = polyfill;
    this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
      ...aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
      ...AConfig_constants.A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
    ];
  }
  async attachContext(container, context, config) {
    if (!config) {
      config = new AConfig_context.A_Config({
        defaults: {}
      });
      container.scope.register(config);
    }
    config.set("A_CONCEPT_ROOT_FOLDER", aConcept.A_CONCEPT_ENV.A_CONCEPT_ROOT_FOLDER);
  }
  async initialize(config) {
    const data = await this.read();
    for (const key in data) {
      config.set(key, data[key]);
    }
  }
  /**
   * Get the configuration property by Name
   * @param property 
   */
  resolve(property) {
    return property;
  }
  /**
   * This method reads the configuration and sets the values to the context
   * 
   * @returns 
   */
  async read(variables = []) {
    return {};
  }
};
__decorateClass([
  aConcept.A_Concept.Load(),
  __decorateParam(0, aConcept.A_Inject(aConcept.A_Container)),
  __decorateParam(1, aConcept.A_Inject(aConcept.A_Scope)),
  __decorateParam(2, aConcept.A_Inject(AConfig_context.A_Config))
], exports.ConfigReader.prototype, "attachContext", 1);
__decorateClass([
  aConcept.A_Concept.Load(),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(AConfig_context.A_Config))
], exports.ConfigReader.prototype, "initialize", 1);
exports.ConfigReader = __decorateClass([
  aFrame.A_Frame.Component({
    namespace: "A-Utils",
    name: "ConfigReader",
    description: "Abstract component for reading configuration data from various sources such as files, environment variables, or remote services. This component can be extended to implement specific configuration reading strategies."
  }),
  __decorateParam(0, aConcept.A_Dependency.Required()),
  __decorateParam(0, aConcept.A_Inject(aPolyfill.A_Polyfill))
], exports.ConfigReader);
//# sourceMappingURL=ConfigReader.component.js.map
//# sourceMappingURL=ConfigReader.component.js.map