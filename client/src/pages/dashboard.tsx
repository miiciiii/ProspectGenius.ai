import { useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { HighlightsSection } from "@/components/dashboard/highlights-section";
import { FilterControls } from "@/components/dashboard/filter-controls";
import { CompaniesDataTable } from "@/components/dashboard/companies-data-table";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/use-companies";
import { useExportCSV } from "@/hooks/use-export-csv";
import { useQueryClient } from "@tanstack/react-query";
import type { CompanyFilters } from "@shared/schema";
import MainLayout from "@/pages/main-layout";

export default function Dashboard() {
  const [filters, setFilters] = useState<CompanyFilters>({});
  const queryClient = useQueryClient();
  
  const { data: companies = [], isLoading } = useCompanies(filters);
  const { data: allCompanies = [] } = useCompanies(); // For total count
  const exportCSV = useExportCSV();

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/companies'] });
    queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
  };

  const handleExportCSV = () => {
    exportCSV.mutate(filters);
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">ProspectGenius Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Track newly funded startups and investment opportunities
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline"
              onClick={handleExportCSV}
              disabled={exportCSV.isPending}
              data-testid="button-export-csv"
              className="brand-hover-glow"
            >
              <Upload className="hero-icon mr-2" />
              {exportCSV.isPending ? "Exporting..." : "Export CSV"}
            </Button>
            <Button 
              onClick={handleRefreshData}
              data-testid="button-refresh-data"
              className="btn-gradient"
            >
              <RefreshCw className="hero-icon mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Bug: Stats Overview */}
        {/* <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          <div className="bg-card rounded-lg shadow p-4 border border-border"><StatsOverview /></div>
        </div> */}

        {/* Stats Overview */}
        <div className="bg-card rounded-lg shadow p-4 border border-border">
          <StatsOverview />
        </div>


        {/* Highlights Section */}
        <div className="bg-card rounded-lg shadow p-4 border border-border">
          <HighlightsSection />
        </div>

        {/* Filter Controls */}
        <div className="bg-card rounded-lg shadow p-4 border border-border">
          <FilterControls
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={allCompanies.length}
            filteredCount={companies.length}
          />
        </div>

        {/* Companies Table */}
        <div className="bg-card rounded-lg shadow p-2 md:p-4 border border-border">
          <CompaniesDataTable
            companies={companies}
            isLoading={isLoading}
          />
        </div>
      </div>
    </MainLayout>
  );
}
