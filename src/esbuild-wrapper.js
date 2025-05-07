import { join } from "node:path";
import { es2022App } from "@cubing/dev-config/esbuild/es2022";
import * as esbuild from "esbuild";

let currentBuildContext;

export async function restartEsbuild(options) {
  await currentBuildContext?.stop();
  const absoluteRootPath = join(process.cwd(), options.entryRoot);

  console.log(
    `[barely-a-dev-server] Starting esbuild with entry root: ${options.entryRoot}`,
  );
  const entryPoints = [join(options.entryRoot, "**", "*.ts")];
  if (options.bundleCSS) {
    entryPoints.push(join(options.entryRoot, "**", "*.css"));
  }
  const esbuildOptions = {
    ...es2022App({ dev: options.dev }),
    logLevel: "info",
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
