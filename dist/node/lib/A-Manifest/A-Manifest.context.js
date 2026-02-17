'use strict';

var aConcept = require('@adaas/a-concept');
var AManifest_error = require('./A-Manifest.error');
var AManifestChecker_class = require('./classes/A-ManifestChecker.class');
var aFrame = require('@adaas/a-frame');

var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (decorator(result)) || result;
  return result;
};
exports.A_Manifest = class A_Manifest extends aConcept.A_Fragment {
  /**
   * A-Manifest is a configuration set that allows to include or exclude component application for the particular methods.
   *
   * For example, if A-Scope provides polymorphic A-Component that applies for All A-Entities in it but you have another component that should be used for only One particular Entity, you can use A-Manifest to specify this behavior.
   * 
   * 
   * By default if Component is provided in the scope - it applies for all entities in it. However, if you want to exclude some entities or include only some entities for the particular component - you can use A-Manifest to define this behavior.
   * 
   * @param config - Array of component configurations
   */
  constructor(config = []) {
    super({
      name: "A-Manifest"
    });
    this.rules = [];
    this.prepare(config);
  }
  /**
   * Should convert received configuration into internal Regexp applicable for internal storage
   */
  prepare(config) {
    if (!aConcept.A_TypeGuards.isArray(config))
      throw new AManifest_error.A_ManifestError(
        AManifest_error.A_ManifestError.ManifestInitializationError,
        `A-Manifest configuration should be an array of configurations`
      );
    for (const item of config) {
      this.processConfigItem(item);
    }
  }
  /**
   * Process a single configuration item and convert it to internal rules
   */
  processConfigItem(item) {
    if (!aConcept.A_TypeGuards.isComponentConstructor(item.component))
      throw new AManifest_error.A_ManifestError(
        AManifest_error.A_ManifestError.ManifestInitializationError,
        `A-Manifest configuration item should be a A-Component constructor`
      );
    const componentRegex = this.constructorToRegex(item.component);
    if (item.apply || item.exclude) {
      const methodRegex = /.*/;
      this.rules.push({
        componentRegex,
        methodRegex,
        applyRegex: item.apply ? this.allowedComponentsToRegex(item.apply) : void 0,
        excludeRegex: item.exclude ? this.allowedComponentsToRegex(item.exclude) : void 0
      });
    }
    if (item.methods && item.methods.length > 0) {
      for (const methodConfig of item.methods) {
        const methodRegex = this.methodToRegex(methodConfig.method);
        this.rules.push({
          componentRegex,
          methodRegex,
          applyRegex: methodConfig.apply ? this.allowedComponentsToRegex(methodConfig.apply) : void 0,
          excludeRegex: methodConfig.exclude ? this.allowedComponentsToRegex(methodConfig.exclude) : void 0
        });
      }
    }
  }
  /**
   * Convert a constructor to a regex pattern
   */
  constructorToRegex(ctor) {
    return new RegExp(`^${this.escapeRegex(ctor.name)}$`);
  }
  /**
   * Convert a method name or regex to a regex pattern
   */
  methodToRegex(method) {
    if (method instanceof RegExp) {
      return method;
    }
    return new RegExp(`^${this.escapeRegex(method)}$`);
  }
  /**
   * Convert allowed components array or regex to a single regex
   */
  allowedComponentsToRegex(components) {
    if (components instanceof RegExp) {
      return components;
    }
    const patterns = components.map((ctor) => this.escapeRegex(ctor.name));
    return new RegExp(`^(${patterns.join("|")})$`);
  }
  /**
   * Escape special regex characters in a string
   */
  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  configItemToRegexp(item) {
    return this.constructorToRegex(item);
  }
  ID(component, method) {
    return `${component.name}.${method}`;
  }
  /**
   * Check if a component and method combination is allowed for a target
   */
  isAllowed(ctor, method) {
    const componentCtor = typeof ctor === "function" ? ctor : ctor.constructor;
    return new AManifestChecker_class.A_ManifestChecker(this, componentCtor, method);
  }
  /**
   * Internal method to check if access is allowed
   */
  internal_checkAccess(query) {
    const componentName = query.component.name;
    const methodName = query.method;
    const targetName = query.target.name;
    const matchingRules = this.rules.filter(
      (rule) => rule.componentRegex.test(componentName) && rule.methodRegex.test(methodName)
    ).sort((a, b) => {
      const aIsGeneral = a.methodRegex.source === ".*";
      const bIsGeneral = b.methodRegex.source === ".*";
      if (aIsGeneral && !bIsGeneral) return 1;
      if (!aIsGeneral && bIsGeneral) return -1;
      return 0;
    });
    if (matchingRules.length === 0) {
      return true;
    }
    for (const rule of matchingRules) {
      if (rule.excludeRegex && rule.excludeRegex.test(targetName)) {
        return false;
      }
      if (rule.applyRegex) {
        return rule.applyRegex.test(targetName);
      }
    }
    return true;
  }
  isExcluded(ctor, method) {
    const componentCtor = typeof ctor === "function" ? ctor : ctor.constructor;
    return new AManifestChecker_class.A_ManifestChecker(this, componentCtor, method, true);
  }
};
exports.A_Manifest = __decorateClass([
  aFrame.A_Frame.Fragment({
    namespace: "A-Utils",
    name: "A-Manifest",
    description: "A-Manifest is a configuration fragment that allows to include or exclude component application for particular methods. It provides fine-grained control over which components are applied to which targets and methods within the application, enabling flexible and dynamic behavior based on defined rules."
  })
], exports.A_Manifest);
//# sourceMappingURL=A-Manifest.context.js.map
//# sourceMappingURL=A-Manifest.context.js.map