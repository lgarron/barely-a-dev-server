import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

export class CustomServer {
  constructor(options) {
    this.options = options;
  }

  start() {
    createServer(this.onRequest.bind(this)).listen(this.options.port);
    const message = `🌐 Server running at http://${
      this.options.devDomain ?? "localhost"
    }:${this.options.port}/`;
    const dashes = new Array(message.length + 1).fill("-").join("");
    console.log([dashes, message, dashes].join("\n"));
  }

  async onRequest(request, response) {
    let normalizedPath = new URL(request.url, "http://test/").pathname;
    if (normalizedPath.endsWith("/")) {
      normalizedPath += "index.html";
    }

    response.setHeader("Cache-Control", "no-store");
    await this.options.waitFor;
    await this.options.setHeaders?.(request, response);

    for (const rootPath of [this.options.outDir, this.options.entryRoot]) {
      const body = await this.tryReadFile(rootPath, normalizedPath);
      if (body !== null) {
        if (this.options.debug || normalizedPath.endsWith(".html")) {
          console.log(`200 ${request.url} (from ${rootPath})`);
        }
        response.writeHead(200, {
          "Content-Type": this.contentType(normalizedPath),
        });
        response.end(body, "utf-8");
        return;
      }
    }

    console.log(`404 ${request.url}`);
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("404 Not Found", "utf-8");
  }

  async tryReadFile(rootPath, normalizedPath) {
    const filePath = join(process.cwd(), rootPath, normalizedPath);

    try {
      return await readFile(filePath);
    } catch (e) {
      return null;
    }
  }

  contentType(normalizedPath) {
    const extension = String(extname(normalizedPath)).toLowerCase();
    return mimeTypes[extension] || "application/octet-stream";
  }
}
