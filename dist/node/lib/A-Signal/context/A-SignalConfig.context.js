'use strict';

var aConcept = require('@adaas/a-concept');
var ASignal_entity = require('../entities/A-Signal.entity');
var aFrame = require('@adaas/a-frame');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_SignalConfig = class A_SignalConfig extends aConcept.A_Fragment {
  get structure() {
    if (this._structure) {
      return this._structure;
    }
    const scope = aConcept.A_Context.scope(this);
    const constructors = [...scope.allowedEntities].filter((e) => aConcept.A_CommonHelper.isInheritedFrom(e, ASignal_entity.A_Signal)).sort((a, b) => a.constructor.name.localeCompare(b.name)).map((s) => scope.resolveConstructor(s.name));
    return constructors.filter((s) => s);
  }
  /**
   * Uses for synchronization to ensure the config is initialized.
   * 
   * @returns True if the configuration has been initialized.
   */
  get ready() {
    return this._ready;
  }
  constructor(params) {
    super({ name: "A_SignalConfig" });
    this._config = params;
  }
  /**
   * Initializes the signal configuration if not already initialized.
   * 
   * @returns 
   */
  async initialize() {
    if (!this._ready) {
      this._ready = this._initialize();
    }
    return this._ready;
  }
  /**
   * Initializes the signal configuration by processing the provided structure or string representation.
   * This method sets up the internal structure of signal constructors based on the configuration.
   */
  async _initialize() {
    if (this._config.structure) {
      this._structure = this._config.structure;
    } else if (this._config.stringStructure) {
      const stringStructure = this._config.stringStructure.split(",").map((s) => s.trim());
      this._structure = stringStructure.map((name) => aConcept.A_Context.scope(this).resolveConstructor(name)).filter((s) => s);
    }
  }
};
exports.A_SignalConfig = __decorateClass([
  aFrame.A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-SignalConfig",
    description: "Signal configuration fragment that defines the structure and types of signals within a given scope. It allows specifying the expected signal constructors and their order, facilitating consistent signal management and processing across components that emit or listen to signals."
  })
], exports.A_SignalConfig);
//# sourceMappingURL=A-SignalConfig.context.js.map
//# sourceMappingURL=A-SignalConfig.context.js.map