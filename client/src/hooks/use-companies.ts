import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { FundedCompany, InsertFundedCompany, CompanyFilters } from "@shared/schema";

// Queries
export function useCompanies(filters?: CompanyFilters) {
  return useQuery({
    queryKey: ['/api/companies', filters],
    queryFn: async () => {
      const companies = await Api.getCompanies(filters);
      return companies as FundedCompany[];
    },
    staleTime: 5 * 60 * 1000,
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
    staleTime: 2 * 60 * 1000,
  });
}

// Mutations
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
      toast({ variant: "destructive", title: "Error", description: error.message }),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FundedCompany> }) =>
      Api.updateCompany(id, updates),
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies", updatedCompany.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({ title: "Success", description: "Company updated successfully" });
    },
    onError: (error: Error) =>
      toast({ variant: "destructive", title: "Error", description: error.message }),
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
      toast({ variant: "destructive", title: "Error", description: error.message }),
  });
}

export function useBulkCreateCompanies() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (companies: InsertFundedCompany[]) => Api.bulkCreateCompanies(companies),
    onSuccess: (createdCompanies) => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `${createdCompanies.length} companies imported successfully`,
      });
    },
    onError: (error: Error) =>
      toast({ variant: "destructive", title: "Import Failed", description: error.message }),
  });
}
