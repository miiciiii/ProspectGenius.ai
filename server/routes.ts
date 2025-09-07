import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { companyFiltersSchema, insertFundedCompanySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all companies with optional filters
  app.get("/api/companies", async (req, res) => {
    try {
      const filters = companyFiltersSchema.parse(req.query);
      const companies = await storage.getFilteredFundedCompanies(filters);
      res.json(companies);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid filter parameters",
        error: error instanceof Error ? error.message : "Unknown error"
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
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create new company
  app.post("/api/companies", async (req, res) => {
    try {
      const companyData = insertFundedCompanySchema.parse(req.body);
      const company = await storage.createFundedCompany(companyData);
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid company data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update company
  app.patch("/api/companies/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const company = await storage.updateFundedCompany(id, updates);
      res.json(company);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ message: error.message });
      }
      res.status(400).json({ 
        message: "Failed to update company",
        error: error instanceof Error ? error.message : "Unknown error"
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
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to fetch dashboard stats",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Bulk create companies (for data integration)
  app.post("/api/companies/bulk", async (req, res) => {
    try {
      const { companies } = req.body;
      
      if (!Array.isArray(companies)) {
        return res.status(400).json({ message: "Expected array of companies" });
      }

      const validatedCompanies = companies.map(company => 
        insertFundedCompanySchema.parse(company)
      );
      
      const createdCompanies = await storage.bulkCreateFundedCompanies(validatedCompanies);
      res.status(201).json(createdCompanies);
    } catch (error) {
      res.status(400).json({ 
        message: "Invalid company data in bulk create",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Export companies as CSV data
  app.get("/api/companies/export", async (req, res) => {
    try {
      const filters = companyFiltersSchema.parse(req.query);
      const companies = await storage.getFilteredFundedCompanies(filters);
      
      // Return CSV data structure for frontend to process
      const csvData = companies.map(company => ({
        "Company Name": company.companyName,
        "Domain": company.domain || "",
        "Funding Date": company.fundingDate,
        "Funding Stage": company.fundingStage,
        "Funding Amount": company.fundingAmount,
        "Investors": company.investors || "",
        "Contact Name": company.contactName || "",
        "Contact Email": company.contactEmail || "",
        "LinkedIn": company.linkedin || "",
        "Twitter": company.twitter || "",
        "Industry": company.industry || "",
        "Status": company.status,
        "Source": company.source,
      }));

      res.json({ data: csvData });
    } catch (error) {
      res.status(500).json({ 
        message: "Failed to export companies",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
