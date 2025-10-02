import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfigImported from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * Resolve whatever viteConfig exports (object, async fn, or promise).
 */
async function resolveViteConfig() {
  if (!viteConfigImported) return {};
  if (typeof viteConfigImported === "function") {
    return await (viteConfigImported as any)();
  }
  if (typeof (viteConfigImported as any).then === "function") {
    return await (viteConfigImported as any);
  }
  return viteConfigImported;
}

export async function setupVite(app: Express, server: Server) {
  const isProd = process.env.NODE_ENV === "production";

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  // Make sure we resolve config properly
  const resolvedConfig: any = await resolveViteConfig();

  // Ensure root points to client folder if not set in vite.config.ts
  const defaultClientRoot = path.resolve(import.meta.dirname, "..", "client");
  const root = resolvedConfig.root || defaultClientRoot;

  log(`Using Vite root: ${root}`, "vite");

  const vite = await createViteServer({
    ...resolvedConfig,
    configFile: false,
    root,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // Add cache-busting only in production
      if (isProd) {
        template = template.replace(
          /src=(['"])\/src\/main\.tsx\1/,
          (match, q) => `src=${q}/src/main.tsx?v=${nanoid()}${q}`
        );
      }

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      try {
        vite.ssrFixStacktrace(e as Error);
      } catch (_) {
        // ignore if vite isn't ready
      }
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // When bundled, import.meta.dirname points to dist/server
  // React build output goes into dist/public (per vite.config.ts)
  const distPath = path.resolve(import.meta.dirname, "../public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Missing build directory: ${distPath}. Run "npm run build" before starting in production.`
    );
  }

  app.use(express.static(distPath));

  // Fallback: always return index.html for SPA routes
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}
