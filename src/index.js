import { cp, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { restartEsbuild } from "./esbuild-wrapper.js";
import { CustomServer } from "./server.js";

export async function barelyServe(options) {
  let { debug, dev, entryRoot, esbuildOptions, outDir, port, type, devDomain } =
    options;
  if (!entryRoot) {
    throw new Error("Must specify `entryRoot`");
  }
  debug = debug ?? false;
  dev = dev ?? true;
  esbuildOptions = esbuildOptions ?? {};
  port = port ?? 1234;
  outDir = outDir ?? join(dev ? "dist/dev" : "dist", entryRoot);

  // TODO: Is there a succinct way to clear the `outDir` contents without
  // removing the `dir` itself (e.g. in case someone has the folder open in
  // Finder)?
  await rm(outDir, { recursive: true, force: true }); // Clear stale output files.

  if (!dev) {
    await cp(entryRoot, outDir, { recursive: true });
  }
  const waitFor = restartEsbuild(entryRoot, outDir, dev, esbuildOptions);
  if (dev) {
    new CustomServer({
      rootPaths: [outDir, entryRoot],
      port,
      debug,
      waitFor,
      devDomain,
    }).start();
  }
  await waitFor;
}
