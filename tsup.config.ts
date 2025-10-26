import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],     // 👈 adjust if your main file is elsewhere
  format: ["esm", "cjs"],      // both Node (CJS) and ESM builds
  dts: true,                   // generate declaration files
  sourcemap: true,             // helpful for debugging
  clean: true,                 // clear dist/ before build
  target: "es2020",            // good for both Node 18+ and browsers
  treeshake: true,             // ✅ enable tree-shaking
  skipNodeModulesBundle: true, // do NOT bundle node_modules (leave them external)
  splitting: false,            // one file per format (simpler)
  minify: false,               // optional: turn on if you want smaller bundle
  platform: "neutral",         // 👈 important: works in Node & browser
});