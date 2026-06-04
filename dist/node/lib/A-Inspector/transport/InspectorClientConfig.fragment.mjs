import '../../../chunk-EQQGB2QZ.mjs';
import { A_Fragment } from '@adaas/a-concept';

class InspectorClientConfig extends A_Fragment {
  constructor(options) {
    super({ name: "InspectorClientConfig" });
    this.host = options.host;
    this.port = options.port;
    this.secret = options.secret;
    this.timeout = options.timeout ?? 1e4;
  }
}

export { InspectorClientConfig };
//# sourceMappingURL=InspectorClientConfig.fragment.mjs.map
//# sourceMappingURL=InspectorClientConfig.fragment.mjs.map