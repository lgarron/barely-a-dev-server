import * as esbuild from "esbuild";
import { join } from "node:path";
import { listFiles } from "./ls.js";

let currentBuildResult = null;

export async function restartEsbuild(options) {
  if (currentBuildResult) {
    (await currentBuildResult).stop();
  }
  const absoluteRootPath = join(process.cwd(), options.entryRoot);
  const entryPoints = (
    await listFiles(absoluteRootPath, (path) => path.endsWith(".ts"))
  ).map((relativePath) => join(absoluteRootPath, relativePath));

  console.log(
    `[barely-a-dev-server] Starting esbuild with ${entryPoints.length} entry point(s).`,
  );
  return (currentBuildResult = esbuild.build({
    target: "es2020",
    logLevel: "info",
    minify: !options.dev,
    sourcemap: true,
    format: "esm",
    bundle: true,
    splitting: true,
    ...options.esbuildOptions,
    entryPoints,
    outdir: options.outDir,
    watch: options.dev,
  }));
}
