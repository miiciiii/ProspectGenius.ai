import { useMutation } from "@tanstack/react-query";
import { Api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { CompanyFilters, FundedCompany } from "@shared/schema";

/**
 * Hook: Export companies to CSV
 * Aligned with Option A: explicit field mapping, clean separation, predictable structure.
 */
export function useExportCSV() {
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async (filters?: CompanyFilters) => {
      // Always request export data from API
      const exportData = await Api.getExportData(filters);
      return exportData;
    },
    onSuccess: (exportData) => {
      // Explicit export schema
      const fields: Array<keyof FundedCompany> = [
        "company_name",
        "domain",
        "funding_amount",
        "funding_stage",
        "funding_date",
        "investors",
        "contact_name",
        "contact_email",
        "status",
      ];

      const csvContent = convertToCSV(exportData.data, fields);

      // Generate downloadable file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `deal-genius-companies-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: "Companies data has been exported to CSV",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error.message || "Failed to export companies data",
      });
    },
  });

  return exportMutation;
}

/**
 * Convert array of companies into CSV string.
 * Handles nulls, quotes, and keeps predictable column order.
 */
function convertToCSV(
  data: FundedCompany[],
  fields: Array<keyof FundedCompany>
): string {
  if (!data || data.length === 0) return "";

  const headers = fields.map((field) => field.toString());

  const rows = data.map((row) =>
    fields
      .map((field) => {
        const value = row[field];
        // Always stringify safely
        return `"${String(value ?? "").replace(/"/g, '""')}"`
      })
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
