import { cp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { restartEsbuild } from "./esbuild-wrapper.js";
import { CustomServer } from "./server.js";

export async function barelyServe(inputOptions) {
  const { ...options } = inputOptions;
  if (!options.entryRoot) {
    throw new Error("Must specify `entryRoot`");
  }
  options.dev ??= true;
  options.esbuildOptions ??= {};
  options.port ??= 1234;
  options.outDir ??= join(options.dev ? "dist/dev" : "dist", options.entryRoot);

  // TODO: Is there a succinct way to clear the `outDir` contents without
  // removing the `dir` itself (e.g. in case someone has the folder open in
  // Finder)?
  await rm(options.outDir, { recursive: true, force: true }); // Clear stale output files.

  if (!options.dev) {
    await cp(options.entryRoot, options.outDir, { recursive: true });
  }
  const waitFor = restartEsbuild(options);
  if (options.dev) {
    new CustomServer({ ...options, waitFor }).start();
  }
  await waitFor;
}
