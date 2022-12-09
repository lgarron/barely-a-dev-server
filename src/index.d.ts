import type { BuildOptions } from "esbuild";

export function barelyServe(options: {
  debug?: boolean;
  dev?: boolean;
  entryRoot: string;
  esbuildOptions?: BuildOptions;
  outDir?: string;
  port?: number;
  devDomain?: string;
  setHeaders?: (request: Request, response: Response) => Promise<void>;
}): Promise<void>;
