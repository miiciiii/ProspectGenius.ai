// import { supabase } from "./supabaseClient";
// import {
//   type FundedCompany,
//   type InsertFundedCompany,
//   type CompanyFilters,
//   type DashboardStats,
// } from "@shared/schema";

// export interface IStorage {
//   getFundedCompany(id: string): Promise<FundedCompany | undefined>;
//   getAllFundedCompanies(): Promise<FundedCompany[]>;
//   getFilteredFundedCompanies(filters: CompanyFilters): Promise<FundedCompany[]>;
//   createFundedCompany(company: InsertFundedCompany): Promise<FundedCompany>;
//   updateFundedCompany(
//     id: string,
//     updates: Partial<FundedCompany>
//   ): Promise<FundedCompany>;
//   deleteFundedCompany(id: string): Promise<void>;
//   getDashboardStats(): Promise<DashboardStats>;
//   bulkCreateFundedCompanies(
//     companies: InsertFundedCompany[]
//   ): Promise<FundedCompany[]>;
// }

// export class SupabaseStorage implements IStorage {
//   async getFundedCompany(id: string) {
//     const { data, error } = await supabase
//       .from("funded_companies")
//       .select("*")
//       .eq("id", id)
//       .maybeSingle();

//     if (error) throw error;
//     return data ?? undefined;
//   }

//   async getAllFundedCompanies(filters?: Partial<FundedCompany>) {
//     let query = supabase.from("funded_companies").select("*").order("funding_date", { ascending: false });

//     if (filters) {
//       Object.entries(filters).forEach(([key, value]) => {
//         if (value !== undefined) {
//           query = query.eq(key, value as any);
//         }
//       });
//     }

//     const { data, error } = await query;
//     if (error) throw error;
//     return (data ?? []) as FundedCompany[];
//   }


//   async getFilteredFundedCompanies(filters: CompanyFilters) {
//     let query = supabase.from("funded_companies").select("*");

//     if (filters.search) {
//       query = query.ilike("company_name", `%${filters.search}%`);
//     }
//     if (filters.funding_stage) {
//       query = query.eq("funding_stage", filters.funding_stage);
//     }
//     if (filters.industry) {
//       query = query.eq("industry", filters.industry);
//     }
//     if (filters.status) {
//       query = query.eq("status", filters.status);
//     }

//     const { data, error } = await query.order("funding_date", { ascending: false });
//     if (error) throw error;
//     return (data ?? []) as FundedCompany[];
//   }

//   async createFundedCompany(company: InsertFundedCompany) {
//     const { data, error } = await supabase
//       .from("funded_companies")
//       .insert(company)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as FundedCompany;
//   }

//   async updateFundedCompany(id: string, updates: Partial<FundedCompany>) {
//     const { data, error } = await supabase
//       .from("funded_companies")
//       .update(updates)
//       .eq("id", id)
//       .select()
//       .single();

//     if (error) throw error;
//     return data as FundedCompany;
//   }

//   async deleteFundedCompany(id: string) {
//     const { error } = await supabase.from("funded_companies").delete().eq("id", id);
//     if (error) throw error;
//   }

//   async getDashboardStats(): Promise<DashboardStats> {
//     const { data, error } = await supabase.from("funded_companies").select("*");
//     if (error) throw error;

//     const companies = (data ?? []) as FundedCompany[];
//     const now = new Date();
//     const oneWeekAgo = new Date();
//     oneWeekAgo.setDate(now.getDate() - 7);

//     const thisWeekCompanies = companies.filter(
//       (c) => new Date(c.funding_date) >= oneWeekAgo
//     );

//     const totalFunding = companies.reduce(
//       (sum, c) => sum + (c.funding_amount ?? 0),
//       0
//     );

//     const contactedCount = companies.filter(
//       (c) => c.status === "contacted" || c.status === "follow-up"
//     ).length;

//     return {
//       total_companies: companies.length,
//       this_week: thisWeekCompanies.length,
//       total_funding: this.formatFunding(totalFunding),
//       contacted: contactedCount,
//     };
//   }

//   private formatFunding(amount: number): string {
//     if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
//     if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
//     if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
//     return `$${amount}`;
//   }

//   async bulkCreateFundedCompanies(companies: InsertFundedCompany[]) {
//     const { data, error } = await supabase
//       .from("funded_companies")
//       .insert(companies)
//       .select();

//     if (error) throw error;
//     return (data ?? []) as FundedCompany[];
//   }
// }

// export const storage = new SupabaseStorage();
import { supabase } from "./supabaseClient";
import {
  type FundedCompany,
  type InsertFundedCompany,
  type CompanyFilters,
  type DashboardStats,
} from "@shared/schema";

export interface IStorage {
  getFundedCompany(id: string): Promise<FundedCompany | undefined>;
  getAllFundedCompanies(): Promise<FundedCompany[]>;
  getFilteredFundedCompanies(filters: CompanyFilters): Promise<FundedCompany[]>;
  createFundedCompany(company: InsertFundedCompany): Promise<FundedCompany>;
  updateFundedCompany(
    id: string,
    updates: Partial<FundedCompany>
  ): Promise<FundedCompany>;
  deleteFundedCompany(id: string): Promise<void>;
  getDashboardStats(): Promise<DashboardStats>;
  bulkCreateFundedCompanies(
    companies: InsertFundedCompany[]
  ): Promise<FundedCompany[]>;
}

export class SupabaseStorage implements IStorage {
  async getFundedCompany(id: string) {
    const { data, error } = await supabase
      .from("funded_companies_dev")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ?? undefined;
  }

  async getAllFundedCompanies(filters?: Partial<FundedCompany>) {
    let query = supabase.from("funded_companies_dev").select("*").order("funding_date", { ascending: false });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value as any);
        }
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as FundedCompany[];
  }


  async getFilteredFundedCompanies(filters: CompanyFilters) {
    let query = supabase.from("funded_companies_dev").select("*");

    if (filters.search) {
      query = query.ilike("company_name", `%${filters.search}%`);
    }
    if (filters.funding_stage) {
      query = query.eq("funding_stage", filters.funding_stage);
    }
    if (filters.industry) {
      query = query.eq("industry", filters.industry);
    }
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("funding_date", { ascending: false });
    if (error) throw error;
    return (data ?? []) as FundedCompany[];
  }

  async createFundedCompany(company: InsertFundedCompany) {
    const { data, error } = await supabase
      .from("funded_companies_dev")
      .insert(company)
      .select()
      .single();

    if (error) throw error;
    return data as FundedCompany;
  }

  async updateFundedCompany(id: string, updates: Partial<FundedCompany>) {
    const { data, error } = await supabase
      .from("funded_companies_dev")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as FundedCompany;
  }

  async deleteFundedCompany(id: string) {
    const { error } = await supabase.from("funded_companies_dev").delete().eq("id", id);
    if (error) throw error;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const { data, error } = await supabase.from("funded_companies_dev").select("*");
    if (error) throw error;

    const companies = (data ?? []) as FundedCompany[];
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const thisWeekCompanies = companies.filter(
      (c) => new Date(c.funding_date) >= oneWeekAgo
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
      .from("funded_companies_dev")
      .insert(companies)
      .select();

    if (error) throw error;
    return (data ?? []) as FundedCompany[];
  }
}

export const storage = new SupabaseStorage();
