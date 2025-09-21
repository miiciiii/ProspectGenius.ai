import { apiRequest } from "@/lib/queryClient";
import type {
  FundedCompany,
  InsertFundedCompany,
  DashboardStats,
  CompanyFilters,
  Contact,
  CompanyReport,
} from "@shared/schema";

export class Api {
  /** -----------------------------
   * Companies
   * ----------------------------- */
  static async getCompanies(filters?: CompanyFilters): Promise<FundedCompany[]> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("dateRange", filters.date_range);

    if (filters?.funding_stage) {
      const stageMap: Record<string, string> = {
        "pre-seed": "Pre-Seed",
        seed: "Seed",
        "series-a": "Series A",
        "series-b": "Series B",
        "series-c": "Series C",
      };
      const stage = stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
      params.append("fundingStage", stage);
    }

    if (filters?.industry) params.append("industry", filters.industry);

    if (filters?.status) {
      const statusMap: Record<string, string> = {
        new: "new",
        contacted: "contacted",
        "follow-up": "follow-up",
      };
      const status = statusMap[filters.status.toLowerCase()] || filters.status;
      params.append("status", status);
    }

    const response = await apiRequest("GET", `/api/companies?${params.toString()}`);
    const data: FundedCompany[] = await response.json();

    // Normalize arrays and contacts
    return data
      .map((company) => ({
        ...company,
        investors: company.investors ?? [],
        social_media: company.social_media ?? [],
        contacts: Array.isArray(company.contacts) ? company.contacts : [],
      }))
      // Safety filter
      .filter((company) => {
        const stageFilter = filters?.funding_stage
          ? company.funding_stage === (params.get("fundingStage") || "")
          : true;
        const industryFilter = filters?.industry
          ? company.industry === filters.industry
          : true;
        const statusFilter = filters?.status
          ? company.status === (params.get("status") || "")
          : true;
        return stageFilter && industryFilter && statusFilter;
      });
  }

  static async getCompany(id: string): Promise<FundedCompany> {
    const response = await apiRequest("GET", `/api/companies/${id}`);
    const company: FundedCompany = await response.json();
    return {
      ...company,
      investors: company.investors ?? [],
      social_media: company.social_media ?? [],
      contacts: Array.isArray(company.contacts) ? company.contacts : [],
    };
  }

  static async createCompany(company: InsertFundedCompany): Promise<FundedCompany> {
    const payload: InsertFundedCompany = {
      ...company,
      social_media: company.social_media ?? [],
      investors: company.investors ?? [],
      contacts: company.contacts ?? [],
    };
    const response = await apiRequest("POST", "/api/companies", payload);
    const created: FundedCompany = await response.json();
    return {
      ...created,
      investors: created.investors ?? [],
      social_media: created.social_media ?? [],
      contacts: Array.isArray(created.contacts) ? created.contacts : [],
    };
  }

  static async updateCompany(
    id: string,
    updates: Partial<FundedCompany>
  ): Promise<FundedCompany> {
    const payload = {
      ...updates,
      social_media: updates.social_media ?? [],
      investors: updates.investors ?? [],
      contacts: updates.contacts ?? [],
    };
    const response = await apiRequest("PATCH", `/api/companies/${id}`, payload);
    const updated: FundedCompany = await response.json();
    return {
      ...updated,
      investors: updated.investors ?? [],
      social_media: updated.social_media ?? [],
      contacts: Array.isArray(updated.contacts) ? updated.contacts : [],
    };
  }

  static async deleteCompany(id: string): Promise<void> {
    await apiRequest("DELETE", `/api/companies/${id}`);
  }

  static async bulkCreateCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]> {
    const payload = companies.map((c) => ({
      ...c,
      social_media: c.social_media ?? [],
      investors: c.investors ?? [],
      contacts: c.contacts ?? [],
    }));
    const response = await apiRequest("POST", "/api/companies/bulk", { companies: payload });
    const data: FundedCompany[] = await response.json();
    return data.map((c) => ({
      ...c,
      investors: c.investors ?? [],
      social_media: c.social_media ?? [],
      contacts: Array.isArray(c.contacts) ? c.contacts : [],
    }));
  }

  /** -----------------------------
   * Dashboard
   * ----------------------------- */
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiRequest("GET", "/api/dashboard/stats");
    return await response.json();
  }

  /** -----------------------------
   * Export
   * ----------------------------- */
  static async getExportData(filters?: CompanyFilters): Promise<{ data: FundedCompany[] }> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("dateRange", filters.date_range);

    if (filters?.funding_stage) {
      const stageMap: Record<string, string> = {
        "pre-seed": "Pre-Seed",
        seed: "Seed",
        "series-a": "Series A",
        "series-b": "Series B",
        "series-c": "Series C",
      };
      const stage = stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
      params.append("fundingStage", stage);
    }

    if (filters?.industry) params.append("industry", filters.industry);

    if (filters?.status) {
      const statusMap: Record<string, string> = {
        new: "new",
        contacted: "contacted",
        "follow-up": "follow-up",
      };
      const status = statusMap[filters.status.toLowerCase()] || filters.status;
      params.append("status", status);
    }

    const response = await apiRequest("GET", `/api/companies/export?${params.toString()}`);
    const data: FundedCompany[] = await response.json();

    const normalizedData = data.map((company) => ({
      ...company,
      investors: company.investors ?? [],
      social_media: company.social_media ?? [],
      contacts: Array.isArray(company.contacts) ? company.contacts : [],
    }));

    const filteredData = normalizedData.filter((company) => {
      const stageFilter = filters?.funding_stage
        ? company.funding_stage === (params.get("fundingStage") || "")
        : true;
      const industryFilter = filters?.industry
        ? company.industry === filters.industry
        : true;
      const statusFilter = filters?.status
        ? company.status === (params.get("status") || "")
        : true;
      return stageFilter && industryFilter && statusFilter;
    });

    return { data: filteredData };
  }

  /** -----------------------------
   * Company Reports
   * ----------------------------- */
  static async getCompanyReports(): Promise<CompanyReport[]> {
    try {
      const res = await apiRequest("GET", "/api/company-reports");

      // Read the raw text first
      const text = await res.text();

      // Try to parse JSON, otherwise throw an informative error
      let data: CompanyReport[];
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Non-JSON response from /api/company-reports:", text);
        throw new Error("Invalid JSON response from API");
      }

      // Normalize arrays
      return data.map((r) => ({
        ...r,
        investors: Array.isArray(r.investors) ? r.investors : [],
        markets: Array.isArray(r.markets) ? r.markets : [],
      }));
    } catch (err) {
      console.error("Error fetching company reports:", err);
      throw err;
    }
  }
}
