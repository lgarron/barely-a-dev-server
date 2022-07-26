import * as esbuild from "esbuild";
import { join } from "path";
import { listFiles } from "./ls.js";

let currentBuildResult = null;

export async function restartEsbuild(
  entryRootPath,
  outputRootPath,
  dev,
  options
) {
  if (currentBuildResult) {
    (await currentBuildResult).stop();
  }

  const absoluteRootPath = join(process.cwd(), entryRootPath);
  const entryPoints = (
    await listFiles(absoluteRootPath, (path) => path.endsWith(".ts"))
  ).map((relativePath) => join(absoluteRootPath, relativePath));

  console.log(
    `[barely-a-dev-server] Starting esbuild with ${entryPoints.length} entry point(s).`
  );
  return (currentBuildResult = esbuild.build({
    target: "es2020",
    logLevel: "info",
    minify: true, // TODO: `!dev`?
    sourcemap: true,
    ...options,
    format: "esm",
    entryPoints,
    outdir: outputRootPath,
    bundle: true,
    splitting: true,
    watch: dev,
  }));
}
