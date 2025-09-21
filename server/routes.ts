import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { CompanyFilters, InsertFundedCompany } from "@shared/schema";

// Helper to normalize funding_stage and status
function normalizeFilters(filters: Partial<CompanyFilters>): Partial<CompanyFilters> {
  const normalized: Partial<CompanyFilters> = { ...filters };

  if (filters.funding_stage) {
    const stageMap: Record<string, string> = {
      "pre-seed": "Pre-Seed",
      "seed": "Seed",
      "series-a": "Series A",
      "series-b": "Series B",
      "series-c": "Series C",
    };
    normalized.funding_stage =
      stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
  }

  if (filters.status) {
    const statusMap: Record<string, string> = {
      "new": "new",
      "contacted": "contacted",
      "follow-up": "follow-up",
    };
    normalized.status = statusMap[filters.status.toLowerCase()] || filters.status;
  }

  return normalized;
}

export async function registerRoutes(app: Express): Promise<Server> {
  /** -----------------------------
   * Companies
   * ----------------------------- */
  app.get("/api/companies", async (req, res) => {
    try {
      const filters = normalizeFilters(req.query as Partial<CompanyFilters>);
      const companies = await storage.getFilteredFundedCompanies(filters);
      res.json(companies);
    } catch (error) {
      res.status(400).json({ message: "Invalid filter parameters", error: (error as Error).message });
    }
  });

  app.get("/api/companies/:id", async (req, res) => {
    try {
      const company = await storage.getFundedCompany(req.params.id);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company", error: (error as Error).message });
    }
  });

  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = req.body as InsertFundedCompany;
      const company = await storage.createFundedCompany({
        ...companyData,
        social_media: companyData.social_media ?? [],
      });
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data", error: (error as Error).message });
    }
  });

  app.patch("/api/companies/:id", async (req, res) => {
    try {
      const updates = req.body;
      if (updates.social_media && !Array.isArray(updates.social_media)) updates.social_media = [];
      const company = await storage.updateFundedCompany(req.params.id, updates);
      res.json(company);
    } catch (error) {
      if ((error as Error).message.includes("not found")) {
        return res.status(404).json({ message: (error as Error).message });
      }
      res.status(400).json({ message: "Failed to update company", error: (error as Error).message });
    }
  });

  app.delete("/api/companies/:id", async (req, res) => {
    try {
      await storage.deleteFundedCompany(req.params.id);
      res.status(204).send();
    } catch (error) {
      if ((error as Error).message.includes("not found")) return res.status(404).json({ message: (error as Error).message });
      res.status(500).json({ message: "Failed to delete company", error: (error as Error).message });
    }
  });

  app.post("/api/companies/bulk", async (req, res) => {
    try {
      const { companies } = req.body;
      if (!Array.isArray(companies)) return res.status(400).json({ message: "Expected array of companies" });

      const created = await storage.bulkCreateFundedCompanies(companies.map(c => ({
        ...c,
        social_media: c.social_media ?? [],
      })));

      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ message: "Invalid company data in bulk create", error: (error as Error).message });
    }
  });

  /** -----------------------------
   * Dashboard
   * ----------------------------- */
  app.get("/api/dashboard/stats", async (_req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats", error: (error as Error).message });
    }
  });

  /** -----------------------------
   * Export
   * ----------------------------- */
  app.get("/api/companies/export", async (req, res) => {
    try {
      const filters = normalizeFilters(req.query as Partial<CompanyFilters>);
      const companies = await storage.getFilteredFundedCompanies(filters);

      const csvData = companies.map(company => ({
        "Company Name": company.company_name,
        "Domain": company.domain || "",
        "Funding Date": company.funding_date,
        "Funding Stage": company.funding_stage,
        "Funding Amount": company.funding_amount || "",
        "Investors": Array.isArray(company.investors) ? company.investors.join(", ") : "",
        "Contacts": (company.contacts ?? []).map(c => `${c.name} <${c.email}>`).join("; "),
        "Social Media": (company.social_media ?? []).join(", "),
        "Industry": company.industry || "",
        "Status": company.status,
        "Source": company.source || "",
      }));

      res.json({ data: csvData });
    } catch (error) {
      res.status(500).json({ message: "Failed to export companies", error: (error as Error).message });
    }
  });

  /** -----------------------------
   * Company Reports
   * ----------------------------- */
  app.get("/api/company-reports", async (_req, res) => {
    try {
      const reports = await storage.getCompanyReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company reports", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
