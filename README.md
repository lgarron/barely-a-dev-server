# `barely-a-dev-server`

A thin, opinionated wrapper for `esbuild` as a `.ts` web server. Given a `srcRoot` folder, it:

- finds all `.ts` file in `srcRoot` and uses them as entry files to run `esbuild` in `watch` mode, and
- serves the built `.js` files together with a fallback to `srcRoot` for static files.

When run with `"dev": false`, it writes these files to an output dir (`dist/` + the source root by default), ready to serve using your favorite static file server.

# Usage:

```js
// script/build.js
import { barelyServe } from "barely-a-dev-server";

barelyServe({
  srcRoot: "src/sites",
  dev,
  port: 3333,
  esbuildOptions: {
    target: "esnext",
  },
});
```

```html
<!-- src/index.html -->
<script src="./index.js" href="./index.ts" type="module" defer></script>
```

(Note that `src` must reference the built `.js` file. You can use `href` to store a reference to the source that e.g. you can click in VSCode.)

```ts
// index.ts
const a: number = 4;
console.log(a);
```

# Assumptions

- You're using only ESM code.
- You have a build script to invoke this from. (TODO: [CLI](https://github.com/lgarron/barely-a-dev-server/issues/1))
