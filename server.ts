import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

class StaticServer {
  private readonly rootDirectory: string;
  private readonly mimeTypes: Map<string, string>;
  private readonly server: Server;

  constructor(rootDirectory: string, private readonly port: number = 3000) {
    this.rootDirectory = resolve(rootDirectory);
    this.mimeTypes = new Map([
      [".html", "text/html; charset=utf-8"],
      [".css", "text/css; charset=utf-8"],
      [".js", "text/javascript; charset=utf-8"],
      [".map", "application/json; charset=utf-8"],
      [".png", "image/png"],
      [".svg", "image/svg+xml"]
    ]);
    this.server = createServer(this.handleRequest.bind(this));
  }

  start(): void {
    this.server.listen(this.port, () => {
      console.log(`Costume Rental Management running at http://localhost:${this.port}`);
    });
  }

  private async handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const host = request.headers.host ?? `localhost:${this.port}`;
    const requestUrl = new URL(request.url ?? "/", `http://${host}`);
    const requestPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
    const filePath = resolve(this.rootDirectory, `.${decodeURIComponent(requestPath)}`);
    const isInsideRoot = filePath === this.rootDirectory ||
      filePath.startsWith(`${this.rootDirectory}${sep}`);

    if (!isInsideRoot) {
      this.sendText(response, 403, "Forbidden");
      return;
    }

    try {
      const file = await readFile(filePath);
      const contentType = this.mimeTypes.get(extname(filePath)) ?? "application/octet-stream";
      response.writeHead(200, { "Content-Type": contentType });
      response.end(file);
    } catch {
      this.sendText(response, 404, "Not found");
    }
  }

  private sendText(response: ServerResponse, status: number, text: string): void {
    response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(text);
  }
}

new StaticServer(process.cwd(), Number(process.env.PORT) || 3000).start();
