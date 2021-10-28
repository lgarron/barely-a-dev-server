# `barely-a-dev-server`

A thin, opinionated wrapper for `esbuild` as a `.ts` web server. Given an `entryRoot` folder, it:

- finds all `.ts` files under `entryRoot` and uses them as entry files to run `esbuild` in `watch` mode, and
- serves the built `.js` files together with a fallback to `entryRoot` for static files.
  - Paths ending in `/` are mapped to `index.html` in the corresponding folder.

When run with `"dev": false`, it writes these files to an output dir (`dist/` + the entry root by default), ready to serve using your favorite static file server.

Install with:

```shell
npm install -D barely-a-dev-server
```

# Example

```js
// script/build.js
import { barelyServe } from "barely-a-dev-server";

barelyServe({
  entryRoot: "src", // the only required arg
  dev: true,
  port: 3333,
  esbuildOptions: {
    target: "esnext",
  },
});
```

---

```html
<!-- src/index.html -->
<script src="./index.js" href="./index.ts" type="module" defer></script>
```

```ts
// src/index.ts
const a: number = 4;
console.log(a);
```

(Note that `src` must reference the generated `.js` file, not `.ts`. The example shows an ergonomic hack: you can use `href` to store a reference to the `.ts` source, so that you can e.g. "Follow link" in VSCode.)

# Why `barely-a-dev-server`?

- A thin wrapper around `esbuild`, which is very fast and robust.
  - Automatically outputs source maps!
- Works just as well as fancy bundlers, if all your code is TypeScript.
- No dependencies other than `esbuild`.
- [Less than 200 lines](https://github.com/lgarron/barely-a-dev-server/blob/8a7f1f1538b590a13b0f6571f3b73b26c52dbf46/.github/workflows/test.yml#L38) of source code (unminified).

# Why not `barely-a-dev-server`?

- Hardcoded to assume that you are only using TypeScript for your source and ESM for your output.
- No CLI.
  - If you don't have a build script, you can do this: `node -e 'import("barely-a-dev-server").then(s => s.barelyServe({entryRoot: "src"}))'`
- No transformations (therefore no optimization) for non-script files.
- No automatic URL opening, no live refresh.
- Uses every `.ts` file under the `entryRoot` as an entry point. `esbuild` handles this very well, but this may result in significantly more output files than expected/needed.
  - A simple workaround is to put as many "library" files as possible **outside** the entry root, leaving mostly entry files themselves **under** the entry root.

These are mostly because it would make the codebase significantly larger to support them properly.
