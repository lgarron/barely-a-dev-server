import { join } from "node:path";
import * as esbuild from "esbuild";

let currentBuildContext;

export async function restartEsbuild(options) {
  await currentBuildContext?.stop();
  const absoluteRootPath = join(process.cwd(), options.entryRoot);

  console.log(
    `[barely-a-dev-server] Starting esbuild with entry root: ${options.entryRoot}`,
  );
  const esbuildOptions = {
    target: "es2022",
    logLevel: "info",
    minify: !options.dev,
    sourcemap: true,
    format: "esm",
    bundle: true,
    splitting: true,
    ...options.esbuildOptions,
    entryPoints: [join(options.entryRoot, "**", "*.ts")],
    outdir: options.outDir,
  };
  if (options.dev) {
    currentBuildContext = esbuild.context(esbuildOptions);
    (await currentBuildContext).watch();
  } else {
    await esbuild.build(esbuildOptions);
  }
}
