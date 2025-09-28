// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/supabaseClient.ts
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL;
var supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
var supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// server/storage.ts
var SupabaseStorage = class {
  async getFundedCompany(id) {
    const { data, error } = await supabase.from("funded_companies_production").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ?? void 0;
  }
  async getAllFundedCompanies(filters) {
    let query = supabase.from("funded_companies_production").select("*").order("funding_date", { ascending: false });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== void 0) query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }
  async getFilteredFundedCompanies(filters) {
    let query = supabase.from("funded_companies_production").select("*");
    if (filters.search) query = query.ilike("company_name", `%${filters.search}%`);
    if (filters.funding_stage) query = query.eq("funding_stage", filters.funding_stage);
    if (filters.industry) query = query.eq("industry", filters.industry);
    if (filters.status) query = query.eq("status", filters.status);
    const { data, error } = await query.order("funding_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  }
  async createFundedCompany(company) {
    const { data, error } = await supabase.from("funded_companies_production").insert(company).select().single();
    if (error) throw error;
    return data;
  }
  async updateFundedCompany(id, updates) {
    const { data, error } = await supabase.from("funded_companies_production").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }
  async deleteFundedCompany(id) {
    const { error } = await supabase.from("funded_companies_production").delete().eq("id", id);
    if (error) throw error;
  }
  async getDashboardStats() {
    const { data, error } = await supabase.from("funded_companies_production").select("*");
    if (error) throw error;
    const companies = data ?? [];
    const now = /* @__PURE__ */ new Date();
    const oneWeekAgo = /* @__PURE__ */ new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const thisWeekCompanies = companies.filter(
      (c) => new Date(c.created_at) >= oneWeekAgo
    );
    const totalFunding = companies.reduce(
      (sum, c) => sum + (c.funding_amount ?? 0),
      0
    );
    const contactedCount = companies.filter(
      (c) => c.status === "contacted" || c.status === "follow-up"
    ).length;
    return {
      total_companies: companies.length,
      this_week: thisWeekCompanies.length,
      total_funding: this.formatFunding(totalFunding),
      contacted: contactedCount
    };
  }
  formatFunding(amount) {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount}`;
  }
  async bulkCreateFundedCompanies(companies) {
    const { data, error } = await supabase.from("funded_companies_production").insert(companies).select();
    if (error) throw error;
    return data ?? [];
  }
  async getCompanyReports() {
    const { data, error } = await supabase.from("company_reports").select("*").not("company_name", "is", null).order("funding_date", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((r) => ({
      ...r,
      investors: Array.isArray(r.investors) ? r.investors : [],
      markets: Array.isArray(r.markets) ? r.markets : []
    }));
  }
};
var storage = new SupabaseStorage();

// server/routes.ts
function normalizeFilters(filters) {
  const normalized = { ...filters };
  if (filters.funding_stage) {
    const stageMap = {
      "pre-seed": "Pre-Seed",
      "seed": "Seed",
      "series-a": "Series A",
      "series-b": "Series B",
      "series-c": "Series C"
    };
    normalized.funding_stage = stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
  }
  if (filters.status) {
    const statusMap = {
      "new": "new",
      "contacted": "contacted",
      "follow-up": "follow-up"
    };
    normalized.status = statusMap[filters.status.toLowerCase()] || filters.status;
  }
  return normalized;
}
async function registerRoutes(app2) {
  app2.get("/api/companies", async (req, res) => {
    try {
      const filters = normalizeFilters(req.query);
      const companies = await storage.getFilteredFundedCompanies(filters);
      res.json(companies);
    } catch (error) {
      res.status(400).json({ message: "Invalid filter parameters", error: error.message });
    }
  });
  app2.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getFundedCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company", error: error.message });
    }
  });
  app2.post("/api/companies", async (req, res) => {
    try {
      const companyData = req.body;
      const company = await storage.createFundedCompany({
        ...companyData,
        social_media: companyData.social_media ?? []
      });
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data", error: error.message });
    }
  });
  app2.patch("/api/companies/:id", async (req, res) => {
    try {
      const updates = req.body;
      if (updates.social_media && !Array.isArray(updates.social_media)) updates.social_media = [];
      const company = await storage.updateFundedCompany(req.params.id, updates);
      res.json(company);
    } catch (error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ message: "Failed to update company", error: error.message });
    }
  });
  app2.delete("/api/companies/:id", async (req, res) => {
    try {
      await storage.deleteFundedCompany(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes("not found")) return res.status(404).json({ message: error.message });
      res.status(500).json({ message: "Failed to delete company", error: error.message });
    }
  });
  app2.post("/api/companies/bulk", async (req, res) => {
    try {
      const { companies } = req.body;
      if (!Array.isArray(companies)) return res.status(400).json({ message: "Expected array of companies" });
      const created = await storage.bulkCreateFundedCompanies(companies.map((c) => ({
        ...c,
        social_media: c.social_media ?? []
      })));
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data in bulk create", error: error.message });
    }
  });
  app2.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
    }
  });
  app2.get("/api/companies/export", async (req, res) => {
    try {
      const filters = normalizeFilters(req.query);
      const companies = await storage.getFilteredFundedCompanies(filters);
      const csvData = companies.map((company) => ({
        "Company Name": company.company_name,
        "Domain": company.domain || "",
        "Funding Date": company.funding_date,
        "Funding Stage": company.funding_stage,
        "Funding Amount": company.funding_amount || "",
        "Investors": Array.isArray(company.investors) ? company.investors.join(", ") : "",
        "Contacts": (company.contacts ?? []).map((c) => `${c.name} <${c.email}>`).join("; "),
        "Social Media": (company.social_media ?? []).join(", "),
        "Industry": company.industry || "",
        "Status": company.status,
        "Source": company.source || ""
      }));
      res.json({ data: csvData });
    } catch (error) {
      res.status(500).json({ message: "Failed to export companies", error: error.message });
    }
  });
  app2.get("/api/company-reports", async (_req, res) => {
    try {
      const reports = await storage.getCompanyReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company reports", error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [react(), runtimeErrorOverlay()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      external: ["server"]
    }
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import os from "os";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  const isWindows = os.platform() === "win32";
  const host = isWindows ? "127.0.0.1" : "0.0.0.0";
  server.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
