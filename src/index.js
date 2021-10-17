import { copyFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { restartEsbuild } from "./esbuild.js";
import { listFiles } from "./ls.js";
import { CustomServer } from "./server.js";

/*
We have had serious issues with bugs in bundlers, and are rolling our own dev
server as a thin layer on `esbuild` in watch mode. We: 

- Enumerate all the `.ts` files in `SITES_ROOT` and start `esbuild`:
  - in watch mode,
  - with those `.ts` files as entry points,
  - building to `ESBUILD_OUTPUT_ROOT`.
- Start a server with two roots:
  - Serve from `ESBUILD_OUTPUT_ROOT` if the file can be found there.
  - Else serve from `SITES_ROOT`

This works well enough, but it has a few inconveniences:

- You have the reload the browser manually to pick up `.ts` entry point files that were created after the server was started
- We don't use any caching.
  - TODO: We could cache based on `stat` modified time.
- Since we don't transform our HTML, we have to use `.js` for our script `src` attributes.
  - To make easy to "Follow link" in VSCode, we put the corresponding `.ts` path as an `href` attribute. This attribute is ignored by browsers.
- `esbuild` will not automatically pick up on new `.ts` entry points. You'll have to restart the server for that.
  - TODO: we could restart the `esbuild` server any time we get a request for a `.js` file that we don't know.

Benefits we've gotten from doing this, so far:

- Source maps are working again.
- Safe to deploy to any folder on a server (no absolute resource paths injected by bundlers).
- No `_snowpack` folder.
- We don't have to spend 20 seconds (out of 30 seconds) of `make sites` on `babylonjs` transpilation (even though we're barely using it).
- This doesn't crash (and immediately recovers) if you move some files around or briefly check out some slightly older code.
  - You'll have to restart if you need the dev server to change the set of entry points, though (see above).
- No need to add underscores to `.css.ts` or `.json.ts` file names to prevent bundlers from treating them directly as CSS/JSON.

*/

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

  await restartEsbuild(entryRoot, outDir, dev, esbuildOptions);
  if (dev) {
    new CustomServer({
      rootPaths: [outDir, entryRoot],
      port,
      debug,
    }).start();
  } else {
    for (const relativePath of await listFiles(entryRoot, () => true)) {
      mkdirSync(dirname(join(outDir, relativePath)), { recursive: true });
      copyFileSync(join(entryRoot, relativePath), join(outDir, relativePath));
    }
    // TODO: Switch to this once `node` 16 is the default in Codespaces:
    // await fsPromises.cp(entryRoot, outDir, { recursive: true });
  }
}
