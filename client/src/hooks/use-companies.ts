import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type {
  FundedCompany,
  InsertFundedCompany,
  CompanyFilters,
} from "@shared/schema";

/** -----------------------------
 * Normalize filter values to match DB/API
 * ----------------------------- */
function normalizeFilters(
  filters?: CompanyFilters
): CompanyFilters | undefined {
  if (!filters) return undefined;

  const fundingStageMap: Record<string, string> = {
    "pre-seed": "Pre-Seed",
    seed: "Seed",
    "series-a": "Series A",
    "series-b": "Series B",
    "series-c": "Series C",
  };

  const statusMap: Record<string, string> = {
    new: "new",
    contacted: "contacted",
    "follow-up": "follow-up",
  };

  return {
    ...filters,
    funding_stage: filters.funding_stage
      ? fundingStageMap[filters.funding_stage.toLowerCase()] ??
        filters.funding_stage
      : undefined,
    status: filters.status
      ? statusMap[filters.status.toLowerCase()] ?? filters.status
      : undefined,
  };
}

/** -----------------------------
 * Queries
 * ----------------------------- */
export function useCompanies(filters?: CompanyFilters) {
  const normalizedFilters = normalizeFilters(filters);

  return useQuery({
    queryKey: ["/api/companies", normalizedFilters],
    queryFn: async () => {
      const result = await Api.getCompanies(normalizedFilters);
      // Api.getCompanies returns { data: FundedCompany[] }, so we extract the data
      return result.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["/api/companies", id],
    queryFn: () => (id ? Api.getCompany(id) : null),
    enabled: !!id,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: () => Api.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/** -----------------------------
 * Mutations
 * ----------------------------- */
export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (company: InsertFundedCompany) => Api.createCompany(company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Company created successfully" });
    },
    onError: (error: Error) =>
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      }),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<FundedCompany>;
    }) => Api.updateCompany(id, updates),
    onSuccess: (updatedCompany: FundedCompany) => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/companies", updatedCompany.id],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Company updated successfully" });
    },
    onError: (error: Error) =>
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      }),
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => Api.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Company deleted successfully" });
    },
    onError: (error: Error) =>
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      }),
  });
}

export function useBulkCreateCompanies() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (companies: InsertFundedCompany[]) =>
      Api.bulkCreateCompanies(companies),
    onSuccess: (createdCompanies: FundedCompany[]) => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `${createdCompanies.length} companies imported successfully`,
      });
    },
    onError: (error: Error) =>
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message,
      }),
  });
}
