import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { CompanyFilters, InsertFundedCompany } from "@shared/schema";
import {
  authenticateToken,
  requireSubscriber,
  requireAdmin,
  optionalAuth,
} from "./middleware/auth";
import authRoutes from "./routes/auth";
import planRoutes from "./routes/plans";
import subscriptionRoutes from "./routes/subscription";

export async function registerRoutes(app: Express): Promise<Server> {
  /** -----------------------------
   * Auth & User Management Routes
   * ----------------------------- */
  app.use("/api/auth", authRoutes);
  app.use("/api/plans", planRoutes);
  app.use("/api/subscription", subscriptionRoutes);

  /** -----------------------------
   * Companies (Protected with role-based access)
   * ----------------------------- */
  // Get all companies with optional filters (requires subscription for full access)
  app.get("/api/companies", optionalAuth, async (req, res) => {
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
          stageMap[filters.funding_stage.toLowerCase()] ||
          filters.funding_stage;
      }

      if (filters.status) {
        const statusMap: Record<string, string> = {
          new: "new",
          contacted: "contacted",
          "follow-up": "follow-up",
        };
        normalizedFilters.status =
          statusMap[filters.status.toLowerCase()] || filters.status;
      }

      const companies = await storage.getFilteredFundedCompanies(
        normalizedFilters
      );

      // Limit results for guests (non-authenticated or non-subscribers)
      if (!req.user || req.user.profile?.role === "guest") {
        // Limit to 10 results for guests and hide sensitive information
        const limitedCompanies = companies.slice(0, 10).map((company) => ({
          ...company,
          contact_email: null, // Hide email for guests
          contact_name: company.contacts
            ? "Available to subscribers"
            : null,
          social_media: [], // Hide social media for guests
        }));

        return res.json({
          data: limitedCompanies,
          message: "Limited results. Subscribe for full access.",
          total_available: companies.length,
        });
      }

      res.json({ data: companies });
    } catch (error) {
      res.status(400).json({ message: "Invalid filter parameters", error: (error as Error).message });
    }
  });

  // Get single company by ID (requires authentication)
  app.get("/api/companies/:id", authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const company = await storage.getFundedCompany(id);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Hide sensitive data for guests
      if (req.user?.profile?.role === "guest") {
        company.contact_email = null;
        company.contact_name = company.contact_name
          ? "Available to subscribers"
          : null;
        company.social_media = [];
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company", error: (error as Error).message });
    }
  });

  // Create new company (requires subscription)
  app.post(
    "/api/companies",
    authenticateToken,
    requireSubscriber,
    async (req, res) => {
      try {
        const companyData = req.body as InsertFundedCompany;

        // Ensure social_media defaults to empty array
        const payload = {
          ...companyData,
          social_media: companyData.social_media ?? [],
        };

        const company = await storage.createFundedCompany(payload);
        res.status(201).json(company);
      } catch (error) {
        res.status(400).json({
          message: "Invalid company data",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  // Update company (requires subscription)
  app.patch(
    "/api/companies/:id",
    authenticateToken,
    requireSubscriber,
    async (req, res) => {
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
    }
  );

  // Delete company (admin only)
  app.delete(
    "/api/companies/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
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
    }
  );

  // Bulk create companies (admin only)
  app.post(
    "/api/companies/bulk",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
      try {
        const { companies } = req.body;

        if (!Array.isArray(companies)) {
          return res
            .status(400)
            .json({ message: "Expected array of companies" });
        }

        const payload = companies.map((c: InsertFundedCompany) => ({
          ...c,
          social_media: c.social_media ?? [],
        }));

        const createdCompanies = await storage.bulkCreateFundedCompanies(
          payload
        );
        res.status(201).json(createdCompanies);
      } catch (error) {
        res.status(400).json({
          message: "Invalid company data in bulk create",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  /** -----------------------------
   * Dashboard (requires subscription)
   * ----------------------------- */
  app.get(
    "/api/dashboard/stats",
    authenticateToken,
    requireSubscriber,
    async (req, res) => {
      try {
        const stats = await storage.getDashboardStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({
          message: "Failed to fetch dashboard stats",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  );

  /** -----------------------------
   * Export (requires subscription)
   * ----------------------------- */
  app.get(
    "/api/companies/export",
    authenticateToken,
    requireSubscriber,
    async (req, res) => {
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
            stageMap[filters.funding_stage.toLowerCase()] ||
            filters.funding_stage;
        }

        if (filters.status) {
          const statusMap: Record<string, string> = {
            new: "new",
            contacted: "contacted",
            "follow-up": "follow-up",
          };
          normalizedFilters.status =
            statusMap[filters.status.toLowerCase()] || filters.status;
        }

        const companies = await storage.getFilteredFundedCompanies(
          normalizedFilters
        );

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
