'use strict';

var aConcept = require('@adaas/a-concept');
var AConfig_context = require('./A-Config.context');
var AConfig_error = require('./A-Config.error');
var FileConfigReader_component = require('./components/FileConfigReader.component');
var ENVConfigReader_component = require('./components/ENVConfigReader.component');
var AConfig_constants = require('./A-Config.constants');
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
exports.A_ConfigLoader = class A_ConfigLoader extends aConcept.A_Container {
  async prepare(polyfill) {
    if (!this.scope.has(AConfig_context.A_Config)) {
      const newConfig = new AConfig_context.A_Config({
        variables: [
          ...aConcept.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
          ...AConfig_constants.A_CONSTANTS__CONFIG_ENV_VARIABLES_ARRAY
        ],
        defaults: {}
      });
      this.scope.register(newConfig);
    }
    const fs = await polyfill.fs();
    try {
      switch (true) {
        case (aConcept.A_Context.environment === "server" && !!fs.existsSync(`${aConcept.A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(FileConfigReader_component.FileConfigReader);
          break;
        case (aConcept.A_Context.environment === "server" && !fs.existsSync(`${aConcept.A_Context.concept}.conf.json`)):
          this.reader = this.scope.resolve(ENVConfigReader_component.ENVConfigReader);
          break;
        case aConcept.A_Context.environment === "browser":
          this.reader = this.scope.resolve(ENVConfigReader_component.ENVConfigReader);
          break;
        default:
          throw new AConfig_error.A_ConfigError(
            AConfig_error.A_ConfigError.InitializationError,
            `Environment ${aConcept.A_Context.environment} is not supported`
          );
      }
    } catch (error) {
      if (error instanceof aConcept.A_ScopeError) {
        throw new AConfig_error.A_ConfigError({
          title: AConfig_error.A_ConfigError.InitializationError,
          description: `Failed to initialize A_ConfigLoader. Reader not found for environment ${aConcept.A_Context.environment}`,
          originalError: error
        });
      }
    }
  }
};
__decorateClass([
  aConcept.A_Concept.Load({
    before: /.*/
  }),
  __decorateParam(0, aConcept.A_Inject(aPolyfill.A_Polyfill))
], exports.A_ConfigLoader.prototype, "prepare", 1);
exports.A_ConfigLoader = __decorateClass([
  aFrame.A_Frame.Container({
    namespace: "A-Utils",
    name: "A-ConfigLoader",
    description: "Container responsible for loading and initializing the A_Config component based on the environment and available configuration sources. It can be useful for application that need a separated configuration management and sharable across multiple containers."
  })
], exports.A_ConfigLoader);
//# sourceMappingURL=A-Config.container.js.map
//# sourceMappingURL=A-Config.container.js.map