import { apiRequest } from "@/lib/queryClient";
import type { 
  FundedCompany, 
  InsertFundedCompany, 
  DashboardStats, 
  CompanyFilters 
} from "@shared/schema";

export class Api {
  static async getCompanies(filters?: CompanyFilters): Promise<FundedCompany[]> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("dateRange", filters.date_range);
    if (filters?.funding_stage) params.append("fundingStage", filters.funding_stage);
    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.status) params.append("status", filters.status);

    const response = await apiRequest("GET", `/api/companies?${params.toString()}`);
    return await response.json();
  }

  static async getCompany(id: string): Promise<FundedCompany> {
    const response = await apiRequest("GET", `/api/companies/${id}`);
    return await response.json();
  }

  static async createCompany(company: InsertFundedCompany): Promise<FundedCompany> {
    const response = await apiRequest("POST", "/api/companies", company);
    return await response.json();
  }

  static async updateCompany(id: string, updates: Partial<FundedCompany>): Promise<FundedCompany> {
    const response = await apiRequest("PATCH", `/api/companies/${id}`, updates);
    return await response.json();
  }

  static async deleteCompany(id: string): Promise<void> {
    await apiRequest("DELETE", `/api/companies/${id}`);
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiRequest("GET", "/api/dashboard/stats");
    return await response.json();
  }

  static async bulkCreateCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]> {
    const response = await apiRequest("POST", "/api/companies/bulk", { companies });
    return await response.json();
  }

  static async getExportData(filters?: CompanyFilters): Promise<{ data: FundedCompany[] }> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("dateRange", filters.date_range);
    if (filters?.funding_stage) params.append("fundingStage", filters.funding_stage);
    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.status) params.append("status", filters.status);

    const response = await apiRequest("GET", `/api/companies/export?${params.toString()}`);
    return await response.json();
  }
}
