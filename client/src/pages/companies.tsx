import { useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import MainLayout from "@/pages/main-layout";
import { FilterControls } from "@/components/dashboard/filter-controls";
import { CompaniesDataTable } from "@/components/dashboard/companies-data-table";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/use-companies";
import { useExportCSV } from "@/hooks/use-export-csv";
import { useQueryClient } from "@tanstack/react-query";
import type { CompanyFilters } from "@shared/schema";

export default function Companies() {
  const [filters, setFilters] = useState<CompanyFilters>({});
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useCompanies(filters);
  const { data: allCompanies = [] } = useCompanies(); // For total count
  const exportCSV = useExportCSV();

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
  };

  const handleExportCSV = () => {
    exportCSV.mutate(filters);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Companies</h1>
            <p className="text-muted-foreground mt-1">
              Manage and explore all funded companies
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={exportCSV.isPending}
              data-testid="button-export-csv"
            >
              <Upload className="hero-icon mr-2" />
              {exportCSV.isPending ? "Exporting..." : "Export CSV"}
            </Button>
            <Button onClick={handleRefreshData} data-testid="button-refresh-data">
              <RefreshCw className="hero-icon mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFiltersChange={setFilters}
          totalCount={allCompanies.length}
          filteredCount={companies.length}
        />

        {/* Companies Table */}
        <CompaniesDataTable companies={companies} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}
