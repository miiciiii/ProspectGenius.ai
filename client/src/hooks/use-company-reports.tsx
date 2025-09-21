import { useQuery } from "@tanstack/react-query";
import { Api } from "@/services/api";
import type { CompanyReport } from "@shared/schema";

export type NormalizedCompanyReport = {
  id: string;
  company_name: string | null;
  description: string | null;
  funding_round: string | null;
  funding_amount: number | null;
  funding_date: string | null;
  investors: string[];
  markets: string[];
  hq: string | null;
  founded_year: number | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  crunchbase: string | null;
  pitchbook: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export function useCompanyReports() {
  return useQuery<NormalizedCompanyReport[]>({
    queryKey: ["/api/company-reports"],
    queryFn: async () => {
      const data: CompanyReport[] = await Api.getCompanyReports();

      const normalizedData: NormalizedCompanyReport[] = data.map((report) => ({
        id: report.id,
        company_name: report.company_name ?? null,
        description: report.description ?? null,
        funding_round: report.funding_round ?? null,
        funding_amount: report.funding_amount
          ? Number(report.funding_amount)
          : null,
        funding_date: report.funding_date ?? null,
        investors: report.investors ?? [],
        markets: report.markets ?? [],
        hq: report.hq ?? null,
        founded_year: report.founded_year ?? null,
        website: report.website ?? null,
        linkedin: report.linkedin ?? null,
        twitter: report.twitter ?? null,
        instagram: report.instagram ?? null,
        facebook: report.facebook ?? null,
        crunchbase: report.crunchbase ?? null,
        pitchbook: report.pitchbook ?? null,
        created_at: (report as any).created_at ?? null,
        updated_at: (report as any).updated_at ?? null,
      }));

      return normalizedData;
    },
    staleTime: 5 * 60 * 1000,
  });
}
