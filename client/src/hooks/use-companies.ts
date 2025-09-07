import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanyService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { 
  FundedCompany, 
  InsertFundedCompany, 
  CompanyFilters, 
  DashboardStats 
} from "@/types/company";

// Query hooks
export function useCompanies(filters?: CompanyFilters) {
  return useQuery({
    queryKey: ['/api/companies', filters],
    queryFn: () => CompanyService.getCompanies(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ['/api/companies', id],
    queryFn: () => CompanyService.getCompany(id),
    enabled: !!id,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => CompanyService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Mutation hooks
export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (company: InsertFundedCompany) => 
      CompanyService.createCompany(company),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: "Company created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create company",
      });
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FundedCompany> }) =>
      CompanyService.updateCompany(id, updates),
    onSuccess: (updatedCompany) => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/companies', updatedCompany.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: "Company updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update company",
      });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => CompanyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: "Company deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete company",
      });
    },
  });
}

export function useBulkCreateCompanies() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (companies: InsertFundedCompany[]) =>
      CompanyService.bulkCreateCompanies(companies),
    onSuccess: (createdCompanies) => {
      queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      toast({
        title: "Success",
        description: `${createdCompanies.length} companies imported successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "Failed to import companies",
      });
    },
  });
}
