# `barely-a-dev-server`

A thin, opinionated wrapper for `esbuild` as a `.ts` web server. Given a `entryRoot` folder, it:

- finds all `.ts` file in `entryRoot` and uses them as entry files to run `esbuild` in `watch` mode, and
- serves the built `.js` files together with a fallback to `entryRoot` for static files.
  - Paths ending in `/` are mapped to `index.html` in the corresponding folder.

When run with `"dev": false`, it writes these files to an output dir (`dist/` + the entry root by default), ready to serve using your favorite static file server.

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

(Note that `src` must reference the `.js` file, not `.ts`. The example shows a hack: you can use `href` to store a reference to the `.ts` source, which works with e.g. "Follow link" in VSCode.)

# Why `barely-a-dev-server`?

- Works just as well as fancy bundlers, if all your code is TypeScript.
- No dependencies.
- Less than 200 lines of source code (unminified).

# Why not `barely-a-dev-server`?

- Hardcoded to assume that you are only using TypeScript for your source and ESM for your output.
- No CLI.
  - If you don't have a build script, you can do this: `node -e 'import("barely-a-dev-server").then(s => s.barelyServe({entryRoot: "src"}))'`
- No automatic URL opening, no live refresh.

These are mostly because it would make the codebase significantly larger to support them properly.
