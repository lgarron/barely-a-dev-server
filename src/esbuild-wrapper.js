import * as esbuild from "esbuild";
import { join } from "node:path";

let currentBuildContext = null;

export async function restartEsbuild(options) {
  if (currentBuildContext) {
    (await currentBuildContext).stop();
  }

  console.log(
    `[barely-a-dev-server] Starting esbuild with entry root: ${options.entryRoot}`,
  );
  currentBuildContext = esbuild.context({
    target: "es2020",
    logLevel: "info",
    minify: !options.dev,
    sourcemap: true,
    format: "esm",
    bundle: true,
    splitting: true,
    ...options.esbuildOptions,
    entryPoints: [join(options.entryRoot, "**", "*.ts")],
    outdir: options.outDir,
  });
  if (options.dev) {
    (await currentBuildContext).watch();
  } else {
    (await currentBuildContext).rebuild();
  }
  return currentBuildContext;
}
