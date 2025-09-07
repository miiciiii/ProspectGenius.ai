import type { FundedCompany, InsertFundedCompany, CompanyFilters, DashboardStats } from "@shared/schema";

export type { FundedCompany, InsertFundedCompany, CompanyFilters, DashboardStats };

export interface CompanyTableProps {
  companies: FundedCompany[];
  isLoading?: boolean;
  onStatusUpdate?: (id: string, status: string) => void;
  onContact?: (company: FundedCompany) => void;
}

export interface ExportData {
  data: Array<Record<string, string | number>>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SortConfig {
  field: keyof FundedCompany;
  direction: 'asc' | 'desc';
}
