import * as esbuild from "esbuild";
import { join } from "path";
import { listFilesWithSuffix } from "./ls.js";

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

  const entryPoints = await listFilesWithSuffix(
    join(process.cwd(), entryRootPath),
    ".ts"
  );
  console.log(`Starting esbuild with ${entryPoints.length} entry points.`);
  return (currentBuildResult = esbuild.build({
    format: "esm",
    target: "es2020",
    logLevel: "info",
    minify: true, // TODO: `!dev`?
    sourcemap: true,
    ...options,
    entryPoints,
    outdir: outputRootPath,
    bundle: true,
    splitting: true,
    watch: dev,
  }));
}
