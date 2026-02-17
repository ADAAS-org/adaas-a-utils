import '../../../chunk-EQQGB2QZ.mjs';

class A_ManifestChecker {
  constructor(manifest, component, method, checkExclusion = false) {
    this.manifest = manifest;
    this.component = component;
    this.method = method;
    this.checkExclusion = checkExclusion;
  }
  for(target) {
    const result = this.manifest.internal_checkAccess({
      component: this.component,
      method: this.method,
      target
    });
    return this.checkExclusion ? !result : result;
  }
}

export { A_ManifestChecker };
//# sourceMappingURL=A-ManifestChecker.class.mjs.map
//# sourceMappingURL=A-ManifestChecker.class.mjs.map