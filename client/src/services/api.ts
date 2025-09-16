import { apiRequest } from "@/lib/queryClient";
import type { 
  FundedCompany, 
  InsertFundedCompany, 
  DashboardStats, 
  CompanyFilters 
} from "@shared/schema";

export class Api {
  /** -----------------------------
   * Companies
   * ----------------------------- */
  static async getCompanies(filters?: CompanyFilters): Promise<FundedCompany[]> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("dateRange", filters.date_range);

    // Normalize funding_stage to match DB values exactly
    if (filters?.funding_stage) {
      const stageMap: Record<string, string> = {
        "pre-seed": "Pre-Seed",
        "seed": "Seed",
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
        "new": "new",
        "contacted": "contacted",
        "follow-up": "follow-up",
      };
      const status = statusMap[filters.status.toLowerCase()] || filters.status;
      params.append("status", status);
    }

    const response = await apiRequest("GET", `/api/companies?${params.toString()}`);
    const data: FundedCompany[] = await response.json();

    // Safety filter in case backend ignores query params
    const filteredData = data.filter((company) => {
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

    return filteredData;
  }

  static async getCompany(id: string): Promise<FundedCompany> {
    const response = await apiRequest("GET", `/api/companies/${id}`);
    return await response.json();
  }

  static async createCompany(company: InsertFundedCompany): Promise<FundedCompany> {
    const payload = { ...company, social_media: company.social_media ?? [] };
    const response = await apiRequest("POST", "/api/companies", payload);
    return await response.json();
  }

  static async updateCompany(id: string, updates: Partial<FundedCompany>): Promise<FundedCompany> {
    const payload = updates.social_media ? { ...updates, social_media: updates.social_media } : updates;
    const response = await apiRequest("PATCH", `/api/companies/${id}`, payload);
    return await response.json();
  }

  static async deleteCompany(id: string): Promise<void> {
    await apiRequest("DELETE", `/api/companies/${id}`);
  }

  static async bulkCreateCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]> {
    const payload = companies.map((c) => ({ ...c, social_media: c.social_media ?? [] }));
    const response = await apiRequest("POST", "/api/companies/bulk", { companies: payload });
    return await response.json();
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
        "seed": "Seed",
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
        "new": "new",
        "contacted": "contacted",
        "follow-up": "follow-up",
      };
      const status = statusMap[filters.status.toLowerCase()] || filters.status;
      params.append("status", status);
    }

    const response = await apiRequest("GET", `/api/companies/export?${params.toString()}`);
    const data: FundedCompany[] = await response.json();

    // Safety filter to ensure frontend only sees exact matches
    const filteredData = data.filter((company) => {
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

    return { data: filteredData }; // Wrap in object
  }
}
