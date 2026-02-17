import { defineConfig } from "tsup";

export default defineConfig([
  /**
   * ============================
   * Browser build
   * ============================
   *
   * Produces individual component builds:
   *   dist/browser/index.mjs (main entry)
   *   dist/browser/env.mjs (env-specific polyfills)
   *   dist/browser/a-channel.mjs
   *   dist/browser/a-command.mjs
   *   ... (etc for each component)
   */
  {
    entry: {
      // Environment-specific polyfills
      "a-polyfill": "src/lib/A-Polyfill/index.browser.ts",

      // Individual component entries
      "a-channel": "src/lib/A-Channel/index.ts",
      "a-command": "src/lib/A-Command/index.ts",
      "a-config": "src/lib/A-Config/index.ts",
      "a-execution": "src/lib/A-Execution/index.ts",
      "a-logger": "src/lib/A-Logger/index.ts",
      "a-manifest": "src/lib/A-Manifest/index.ts",
      "a-memory": "src/lib/A-Memory/index.ts",
      "a-operation": "src/lib/A-Operation/index.ts",
      "a-route": "src/lib/A-Route/index.ts",
      "a-schedule": "src/lib/A-Schedule/index.ts",
      "a-service": "src/lib/A-Service/index.ts",
      "a-signal": "src/lib/A-Signal/index.ts",
      "a-state-machine": "src/lib/A-StateMachine/index.ts",
    },

    // Output directory for browser bundle
    outDir: "dist/browser",

    tsconfig: ".conf/tsconfig.browser.json",

    bundle: true, // Keep individual modules for better tree-shaking

    // Browser consumers expect ESM
    format: ["esm"],

    // Tells esbuild this is browser-safe code
    platform: "browser",

    // Reasonable baseline for modern browsers
    target: "es2020",

    // Smaller bundles
    treeshake: true,

    // Useful for debugging in bundlers
    sourcemap: true,

    // Emit .d.ts files
    dts: true,
  },

  /**
   * ============================
   * Node build
   * ============================
   *
   */
  {
    entry: [
      "src/**/*.ts"
    ],

    // Output directory for node bundle
    outDir: "dist/node",

    tsconfig: ".conf/tsconfig.node.json",

    bundle: false, // Don't bundle node build, keep imports as-is

    clean: true,

    // Support both module systems
    format: ["cjs", "esm"],

    // Enables Node globals and resolution
    platform: "node",

    // Node 16+ safe baseline
    target: "es2020",

    treeshake: true,
    sourcemap: true,

    // Emit .d.ts files (shared shape)
    dts: true,
  },
]);
