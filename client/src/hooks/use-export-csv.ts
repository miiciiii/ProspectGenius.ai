import { useMutation } from "@tanstack/react-query";
import { CompanyService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import type { CompanyFilters } from "@/types/company";

export function useExportCSV() {
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async (filters?: CompanyFilters) => {
      const exportData = await CompanyService.getExportData(filters);
      return exportData;
    },
    onSuccess: (exportData) => {
      // Convert data to CSV format
      const csvContent = convertToCSV(exportData.data);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `deal-genius-companies-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

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

function convertToCSV(data: Array<Record<string, string | number>>): string {
  if (data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Wrap in quotes and escape any quotes inside
        return `"${String(value || '').replace(/"/g, '""')}"`;
      }).join(',')
    )
  ];

  return csvRows.join('\n');
}
