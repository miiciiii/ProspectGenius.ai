import { apiRequest } from "@/lib/queryClient";
import { supabase } from "@/lib/supabaseClient";
import type {
  FundedCompany,
  InsertFundedCompany,
  DashboardStats,
  CompanyFilters,
  Contact,
  CompanyReport,
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
  const url = `${import.meta.env.VITE_API_URL || ""}${endpoint}`;
  console.log("[api] request:", method, url, "token:", !!token);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // Network/CORS error
    console.error("[api] network error:", err);
    throw new Error("Network error while calling API");
  }

  // Try to parse JSON if possible (safe)
  let parsed: any = null;
  try {
    parsed = await response.json();
  } catch {
    // no-op: body is not JSON
  }

  if (!response.ok) {
    const message = (parsed && parsed.message) || response.statusText || `HTTP ${response.status}`;
    console.error("[api] error response:", response.status, message, parsed);
    throw new Error(message);
  }

  // Return parsed JSON if available, otherwise return raw response
  return parsed ?? response;
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

    if (filters?.funding_stage) {
      const stageMap: Record<string, string> = {
        "pre-seed": "Pre-Seed",
        "seed": "Seed",
        "series-a": "Series A",
        "series-b": "Series B",
        "series-c": "Series C",
      };
      const stage = stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
      // use snake_case to match server expectation
      params.append("funding_stage", stage);
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

    // makeAuthenticatedRequest now returns parsed JSON when possible
    const json = await makeAuthenticatedRequest(
      "GET",
      `/api/companies?${params.toString()}`
    );

    // server returns { data: [...], message?, total_available? } — handle both shapes
    const raw = Array.isArray(json) ? json : (json?.data ?? []);
    const data: FundedCompany[] = raw as FundedCompany[];

    // Normalize arrays and contacts
    const normalizedData = data
      .map((company) => ({
        ...company,
        investors: company.investors ?? [],
        social_media: company.social_media ?? [],
        contacts: Array.isArray(company.contacts) ? company.contacts : [],
      }))
      // Safety filter — still useful if you want double-check
      .filter((company) => {
        const stageFilter = filters?.funding_stage
          ? company.funding_stage === (params.get("funding_stage") || "")
          : true;
        const industryFilter = filters?.industry
          ? company.industry === filters.industry
          : true;
        const statusFilter = filters?.status
          ? company.status === (params.get("status") || "")
          : true;
        return stageFilter && industryFilter && statusFilter;
      });

    return { data: normalizedData, message: json?.message, total_available: json?.total_available };
  }


  static async getCompany(id: string): Promise<FundedCompany> {
    const response = await makeAuthenticatedRequest("GET", `/api/companies/${id}`);
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
    const response = await makeAuthenticatedRequest("POST", "/api/companies", payload);
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
    const response = await makeAuthenticatedRequest("PATCH", `/api/companies/${id}`, payload);
    const updated: FundedCompany = await response.json();
    return {
      ...updated,
      investors: updated.investors ?? [],
      social_media: updated.social_media ?? [],
      contacts: Array.isArray(updated.contacts) ? updated.contacts : [],
    };
  }

  static async deleteCompany(id: string): Promise<void> {
    await makeAuthenticatedRequest("DELETE", `/api/companies/${id}`);
  }

  static async bulkCreateCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]> {
    const payload = companies.map((c) => ({
      ...c,
      social_media: c.social_media ?? [],
      investors: c.investors ?? [],
      contacts: c.contacts ?? [],
    }));
    const response = await makeAuthenticatedRequest("POST", "/api/companies/bulk", { companies: payload });
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
    return await makeAuthenticatedRequest("GET", "/api/dashboard/stats");
  }


  /** -----------------------------
   * Export
   * ----------------------------- */
  static async getExportData(
    filters?: CompanyFilters
  ): Promise<{ data: FundedCompany[] }> {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.date_range) params.append("date_range", filters.date_range);

    if (filters?.funding_stage) {
      const stageMap: Record<string, string> = {
        "pre-seed": "Pre-Seed",
        seed: "Seed",
        "series-a": "Series A",
        "series-b": "Series B",
        "series-c": "Series C",
      };
      const stage = stageMap[filters.funding_stage.toLowerCase()] || filters.funding_stage;
      params.append("funding_stage", stage);
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

    const json = await makeAuthenticatedRequest(
      "GET",
      `/api/companies/export?${params.toString()}`
    );

    const raw = Array.isArray(json) ? json : (json?.data ?? []);
    const data: FundedCompany[] = raw as FundedCompany[];

    const normalizedData = data.map((company) => ({
      ...company,
      investors: company.investors ?? [],
      social_media: company.social_media ?? [],
      contacts: Array.isArray(company.contacts) ? company.contacts : [],
    }));

    const filteredData = normalizedData.filter((company) => {
      const stageFilter = filters?.funding_stage
        ? company.funding_stage === (params.get("funding_stage") || "")
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
