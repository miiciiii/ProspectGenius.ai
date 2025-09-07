import { apiRequest } from "@/lib/queryClient";
import type { 
  FundedCompany, 
  InsertFundedCompany, 
  CompanyFilters, 
  DashboardStats,
  ExportData 
} from "@/types/company";

export class CompanyService {
  static async getCompanies(filters?: CompanyFilters): Promise<FundedCompany[]> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateRange) params.append('dateRange', filters.dateRange);
    if (filters?.fundingStage) params.append('fundingStage', filters.fundingStage);
    if (filters?.industry) params.append('industry', filters.industry);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiRequest('GET', `/api/companies?${params.toString()}`);
    return await response.json();
  }

  static async getCompany(id: string): Promise<FundedCompany> {
    const response = await apiRequest('GET', `/api/companies/${id}`);
    return await response.json();
  }

  static async createCompany(company: InsertFundedCompany): Promise<FundedCompany> {
    const response = await apiRequest('POST', '/api/companies', company);
    return await response.json();
  }

  static async updateCompany(id: string, updates: Partial<FundedCompany>): Promise<FundedCompany> {
    const response = await apiRequest('PATCH', `/api/companies/${id}`, updates);
    return await response.json();
  }

  static async deleteCompany(id: string): Promise<void> {
    await apiRequest('DELETE', `/api/companies/${id}`);
  }

  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiRequest('GET', '/api/dashboard/stats');
    return await response.json();
  }

  static async bulkCreateCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]> {
    const response = await apiRequest('POST', '/api/companies/bulk', { companies });
    return await response.json();
  }

  static async getExportData(filters?: CompanyFilters): Promise<ExportData> {
    const params = new URLSearchParams();
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateRange) params.append('dateRange', filters.dateRange);
    if (filters?.fundingStage) params.append('fundingStage', filters.fundingStage);
    if (filters?.industry) params.append('industry', filters.industry);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiRequest('GET', `/api/companies/export?${params.toString()}`);
    return await response.json();
  }
}
