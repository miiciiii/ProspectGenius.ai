import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { CompanyFilters, InsertFundedCompany } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  /** -----------------------------
   * Companies
   * ----------------------------- */
  // Get all companies with optional filters
  app.get("/api/companies", async (req, res) => {
    try {
      const filters = req.query as Partial<CompanyFilters>;

      // Normalize filters
      const normalizedFilters: Partial<CompanyFilters> = { ...filters };

      if (filters.funding_stage) {
        const stageMap: Record<string, string> = {
          "pre-seed": "Pre-Seed",
          "seed": "Seed",
          "series-a": "Series A",
          "series-b": "Series B",
          "series-c": "Series C",
        };
        normalizedFilters.funding_stage =
          stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
      }

      if (filters.status) {
        const statusMap: Record<string, string> = {
          "new": "new",
          "contacted": "contacted",
          "follow-up": "follow-up",
        };
        normalizedFilters.status =
          statusMap[filters.status.toLowerCase()] || filters.status;
      }

      const companies = await storage.getFilteredFundedCompanies(normalizedFilters);
      res.json(companies);
    } catch (error) {
      res.status(400).json({
        message: "Invalid filter parameters",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get single company by ID
  app.get("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const company = await storage.getFundedCompany(id);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch company",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Create new company
  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = req.body as InsertFundedCompany;

      // Ensure social_media defaults to empty array
      const payload = { ...companyData, social_media: companyData.social_media ?? [] };

      const company = await storage.createFundedCompany(payload);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({
        message: "Invalid company data",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Update company
  app.patch("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Ensure social_media remains an array if provided
      if (updates.social_media && !Array.isArray(updates.social_media)) {
        updates.social_media = [];
      }

      const company = await storage.updateFundedCompany(id, updates);
      res.json(company);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({
        message: "Failed to update company",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Delete company
  app.delete("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFundedCompany(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({
        message: "Failed to delete company",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Bulk create companies
  app.post("/api/companies/bulk", async (req, res) => {
    try {
      const { companies } = req.body;

      if (!Array.isArray(companies)) {
        return res.status(400).json({ message: "Expected array of companies" });
      }

      const payload = companies.map((c: InsertFundedCompany) => ({
        ...c,
        social_media: c.social_media ?? [],
      }));

      const createdCompanies = await storage.bulkCreateFundedCompanies(payload);
      res.status(201).json(createdCompanies);
    } catch (error) {
      res.status(400).json({
        message: "Invalid company data in bulk create",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  /** -----------------------------
   * Dashboard
   * ----------------------------- */
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch dashboard stats",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  /** -----------------------------
   * Export
   * ----------------------------- */
  app.get("/api/companies/export", async (req, res) => {
    try {
      const filters = req.query as Partial<CompanyFilters>;

      // Normalize filters like in getCompanies
      const normalizedFilters: Partial<CompanyFilters> = { ...filters };

      if (filters.funding_stage) {
        const stageMap: Record<string, string> = {
          "pre-seed": "Pre-Seed",
          "seed": "Seed",
          "series-a": "Series A",
          "series-b": "Series B",
          "series-c": "Series C",
        };
        normalizedFilters.funding_stage =
          stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
      }

      if (filters.status) {
        const statusMap: Record<string, string> = {
          "new": "new",
          "contacted": "contacted",
          "follow-up": "follow-up",
        };
        normalizedFilters.status =
          statusMap[filters.status.toLowerCase()] || filters.status;
      }

      const companies = await storage.getFilteredFundedCompanies(normalizedFilters);

      const csvData = companies.map((company) => ({
        "Company Name": company.company_name,
        "Domain": company.domain || "",
        "Funding Date": company.funding_date,
        "Funding Stage": company.funding_stage,
        "Funding Amount": company.funding_amount || "",
        "Investors": company.investors || "",
        "Contact Name": company.contact_name || "",
        "Contact Email": company.contact_email || "",
        "Social Media": (company.social_media ?? []).join(", "),
        "Industry": company.industry || "",
        "Status": company.status,
        "Source": company.source || "",
      }));

      res.json({ data: csvData });
    } catch (error) {
      res.status(500).json({
        message: "Failed to export companies",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
