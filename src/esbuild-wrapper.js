import * as esbuild from "esbuild";
import { join } from "node:path";
import { listFiles } from "./ls.js";

let currentBuildContext;

export async function restartEsbuild(options) {
  await currentBuildContext?.stop();
  const absoluteRootPath = join(process.cwd(), options.entryRoot);
  const entryPoints = (
    await listFiles(
      absoluteRootPath,
      (path) => path.endsWith(".ts") && !path.endsWith(".d.ts"),
    )
  ).map((relativePath) => join(absoluteRootPath, relativePath));

  console.log(
    `[barely-a-dev-server] Starting esbuild with ${entryPoints.length} entry point(s).`,
  );
  const esbuildOptions = {
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
  };
  if (options.dev) {
    currentBuildContext = esbuild.context(esbuildOptions);
    (await currentBuildContext).watch();
  } else {
    await esbuild.build(esbuildOptions);
  }
}
