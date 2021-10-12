# `barely-a-dev-server`

A thin, opinionated wrapper for `esbuild` as a `.ts` web server. Given a `entryRoot` folder, it:

- finds all `.ts` file in `entryRoot` and uses them as entry files to run `esbuild` in `watch` mode, and
- serves the built `.js` files together with a fallback to `entryRoot` for static files.
  - Paths ending in `/` are mapped to `index.html` in the corresponding folder.

When run with `"dev": false`, it writes these files to an output dir (`dist/` + the entry root by default), ready to serve using your favorite static file server.

# Usage:

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

(Note that `src` must reference the built `.js` file. You can use `href` to store a reference to the source that e.g. you can click in VSCode.)

```ts
// src/index.ts
const a: number = 4;
console.log(a);
```

# Assumptions

- You're using only ESM code.
- You have a build script to invoke this from. (TODO: [CLI](https://github.com/lgarron/barely-a-dev-server/issues/1))
