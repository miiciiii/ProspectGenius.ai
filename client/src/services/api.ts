import { apiRequest } from "@/lib/queryClient";
import { supabase } from "@/lib/supabaseClient";
import type {
  FundedCompany,
  InsertFundedCompany,
  DashboardStats,
  CompanyFilters,
} from "@shared/schema";

// Get the auth token for API requests
const getAuthToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || null;
};

// Make authenticated API requests
const makeAuthenticatedRequest = async (
  method: string,
  endpoint: string,
  body?: any
) => {
  const token = await getAuthToken();
  console.log("Making API request to", endpoint, "with token:", token);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_URL || ""}${endpoint}`,
    {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response;
};

export class Api {
  /** -----------------------------
   * Companies
   * ----------------------------- */
  static async getCompanies(filters?: CompanyFilters): Promise<{
    data: FundedCompany[];
    message?: string;
    total_available?: number;
  }> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("date_range", filters.date_range);

    // Normalize funding_stage to match backend expectations
    if (filters?.funding_stage) {
      params.append("funding_stage", filters.funding_stage);
    }

    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.status) params.append("status", filters.status);

    const response = await makeAuthenticatedRequest(
      "GET",
      `/api/companies?${params.toString()}`
    );
    const result = await response.json();

    // Handle both old format (array) and new format (object with data property)
    if (Array.isArray(result)) {
      return { data: result };
    }

    return result;
  }

  static async getCompany(id: string): Promise<FundedCompany> {
    const response = await makeAuthenticatedRequest(
      "GET",
      `/api/companies/${id}`
    );
    return await response.json();
  }

  static async createCompany(
    company: InsertFundedCompany
  ): Promise<FundedCompany> {
    const payload = { ...company, social_media: company.social_media ?? [] };
    const response = await makeAuthenticatedRequest(
      "POST",
      "/api/companies",
      payload
    );
    return await response.json();
  }

  static async updateCompany(
    id: string,
    updates: Partial<FundedCompany>
  ): Promise<FundedCompany> {
    const payload = updates.social_media
      ? { ...updates, social_media: updates.social_media }
      : updates;
    const response = await makeAuthenticatedRequest(
      "PATCH",
      `/api/companies/${id}`,
      payload
    );
    return await response.json();
  }

  static async deleteCompany(id: string): Promise<void> {
    await makeAuthenticatedRequest("DELETE", `/api/companies/${id}`);
  }

  static async bulkCreateCompanies(
    companies: InsertFundedCompany[]
  ): Promise<FundedCompany[]> {
    const payload = companies.map((c) => ({
      ...c,
      social_media: c.social_media ?? [],
    }));
    const response = await makeAuthenticatedRequest(
      "POST",
      "/api/companies/bulk",
      { companies: payload }
    );
    return await response.json();
  }

  /** -----------------------------
   * Dashboard
   * ----------------------------- */
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await makeAuthenticatedRequest(
      "GET",
      "/api/dashboard/stats"
    );
    return await response.json();
  }

  /** -----------------------------
   * Export
   * ----------------------------- */
  static async getExportData(
    filters?: CompanyFilters
  ): Promise<{ data: any[] }> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("date_range", filters.date_range);
    if (filters?.funding_stage)
      params.append("funding_stage", filters.funding_stage);
    if (filters?.industry) params.append("industry", filters.industry);
    if (filters?.status) params.append("status", filters.status);

    const response = await makeAuthenticatedRequest(
      "GET",
      `/api/companies/export?${params.toString()}`
    );
    return await response.json();
  }
}
