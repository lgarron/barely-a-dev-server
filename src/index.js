import { copyFileSync, mkdirSync, rmdirSync, rmSync } from "fs";
import { dirname, join } from "path";
import { restartEsbuild } from "./esbuild.js";
import { listFiles } from "./ls.js";
import { CustomServer } from "./server.js";

export async function barelyServe(options) {
  let { debug, dev, entryRoot, esbuildOptions, outDir, port, type } = options;
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
  rmSync(outDir, { recursive: true, force: true }); // Clear stale output files.

  if (!dev) {
    // `esbuild` output files will take precedence over static files, so we copy
    // them first and let `esbuild` override if needed.
    console.log("\n[barely-a-dev-server] Copying static files...\n");
    for (const relativePath of await listFiles(entryRoot, () => true)) {
      console.log("  " + relativePath);
      mkdirSync(dirname(join(outDir, relativePath)), { recursive: true });
      copyFileSync(join(entryRoot, relativePath), join(outDir, relativePath));
    }
    console.log("");
    // TODO: Switch to this once `node` 16 is the default in Codespaces:
    // await fsPromises.cp(entryRoot, outDir, { recursive: true });
  }
  const waitFor = restartEsbuild(entryRoot, outDir, dev, esbuildOptions);
  if (dev) {
    new CustomServer({
      rootPaths: [outDir, entryRoot],
      port,
      debug,
      waitFor,
    }).start();
  }
  await waitFor;
  return;
}
