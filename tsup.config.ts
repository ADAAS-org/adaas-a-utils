import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: !options.watch,
  sourcemap: true,
  target: "es2020",
  minify: !options.watch,
  treeshake: "recommended",
  skipNodeModulesBundle: true,
  splitting: false,
  silent: false,
  platform: "neutral",
  // Add hash to filenames for cache busting in production builds
  outExtension({ format }) {
    return {
      js: format === "esm" ? `.mjs` : `.cjs`,
    };
  },
  // Extra optimization options (for 2025 esbuild)
  esbuildOptions(options) {
    options.keepNames = true; // Preserve class/function names for better debugging
    options.charset = "utf8";
  },

  // Enable minification for output size (production only)
  minifyWhitespace: !options.watch,
  minifyIdentifiers: !options.watch,
  minifySyntax: !options.watch,
}));