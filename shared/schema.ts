export interface FundedCompany {
  id: string;
  source: string;
  company_name: string;
  domain?: string | null;
  funding_date: string; // ISO date string (YYYY-MM-DD)
  funding_stage: string;
  funding_amount: number;
  investors?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  social_media?: string[] | null;
  industry?: string | null;
  status: 'new' | 'contacted' | 'follow-up' | string;
  created_at: string; // ISO timestamp
}

export type InsertFundedCompany = Omit<FundedCompany, 'id' | 'created_at'>;

export interface CompanyFilters {
  search?: string;
  date_range?: 'week' | 'month' | 'quarter' | 'all';
  funding_stage?: string;
  industry?: string;
  status?: string;
}

export interface DashboardStats {
  total_companies: number;
  this_week: number;
  total_funding: string;
  contacted: number;
}
