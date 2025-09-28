import { supabase } from "./supabaseClient";
import {
  type FundedCompany,
  type InsertFundedCompany,
  type CompanyFilters,
  type DashboardStats,
  type CompanyReport,
} from "@shared/schema";

export interface IStorage {
  getFundedCompany(id: string): Promise<FundedCompany | undefined>;
  getAllFundedCompanies(filters?: Partial<FundedCompany>): Promise<FundedCompany[]>;
  getFilteredFundedCompanies(filters: CompanyFilters): Promise<FundedCompany[]>;
  createFundedCompany(company: InsertFundedCompany): Promise<FundedCompany>;
  updateFundedCompany(id: string, updates: Partial<FundedCompany>): Promise<FundedCompany>;
  deleteFundedCompany(id: string): Promise<void>;
  getDashboardStats(): Promise<DashboardStats>;
  bulkCreateFundedCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]>;
  getCompanyReports(): Promise<CompanyReport[]>; // NEW
}

export class SupabaseStorage implements IStorage {
  async getFundedCompany(id: string) {
    const { data, error } = await supabase
      .from("funded_companies_production")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ?? undefined;
  }

  async getAllFundedCompanies(filters?: Partial<FundedCompany>) {
    let query = supabase
      .from("funded_companies_production")
      .select("*")
      .order("funding_date", { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) query = query.eq(key, value as any);
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as FundedCompany[];
  }

  async getFilteredFundedCompanies(filters: CompanyFilters) {
    let query = supabase.from("funded_companies_production").select("*");

    if (filters.search) query = query.ilike("company_name", `%${filters.search}%`);
    if (filters.funding_stage) query = query.eq("funding_stage", filters.funding_stage);
    if (filters.industry) query = query.eq("industry", filters.industry);
    if (filters.status) query = query.eq("status", filters.status);

    const { data, error } = await query.order("funding_date", { ascending: false });
    if (error) throw error;
    return (data ?? []) as FundedCompany[];
  }

  async createFundedCompany(company: InsertFundedCompany) {
    const { data, error } = await supabase
      .from("funded_companies_production")
      .insert(company)
      .select()
      .single();
    if (error) throw error;
    return data as FundedCompany;
  }

  async updateFundedCompany(id: string, updates: Partial<FundedCompany>) {
    const { data, error } = await supabase
      .from("funded_companies_production")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as FundedCompany;
  }

  async deleteFundedCompany(id: string) {
    const { error } = await supabase.from("funded_companies_production").delete().eq("id", id);
    if (error) throw error;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const { data, error } = await supabase.from("funded_companies_production").select("*");
    if (error) throw error;

    const companies = (data ?? []) as FundedCompany[];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const thisWeekCompanies = companies.filter(
      (c) => new Date(c.created_at) >= oneWeekAgo
    );

    const totalFunding = companies.reduce(
      (sum, c) => sum + (c.funding_amount ?? 0),
      0
    );

    const contactedCount = companies.filter(
      (c) => c.status === "contacted" || c.status === "follow-up"
    ).length;

    return {
      total_companies: companies.length,
      this_week: thisWeekCompanies.length,
      total_funding: this.formatFunding(totalFunding),
      contacted: contactedCount,
    };
  }

  private formatFunding(amount: number): string {
    if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
    return `$${amount}`;
  }

  async bulkCreateFundedCompanies(companies: InsertFundedCompany[]) {
    const { data, error } = await supabase
      .from("funded_companies_production")
      .insert(companies)
      .select();
    if (error) throw error;
    return (data ?? []) as FundedCompany[];
  }

  async getCompanyReports(): Promise<CompanyReport[]> {
    const { data, error } = await supabase
      .from("company_reports")
      .select("*")
      .not("company_name", "is", null)
      .order("funding_date", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((r) => ({
      ...r,
      investors: Array.isArray(r.investors) ? r.investors : [],
      markets: Array.isArray(r.markets) ? r.markets : [],
    }));
  }
}

export const storage = new SupabaseStorage();
