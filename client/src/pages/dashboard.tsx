import { useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { HighlightsSection } from "@/components/dashboard/highlights-section";
import { FilterControls } from "@/components/dashboard/filter-controls";
import { CompaniesDataTable } from "@/components/dashboard/companies-data-table";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/use-companies";
import { useExportCSV } from "@/hooks/use-export-csv";
import { useQueryClient } from "@tanstack/react-query";
import type { CompanyFilters } from "@shared/schema";

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex h-screen">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">DealGenius Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Track newly funded startups and investment opportunities
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline"
                    onClick={handleExportCSV}
                    disabled={exportCSV.isPending}
                    className="hover:bg-secondary hover:border-accent hover:text-accent transition-all duration-200 hover:scale-105 hover:shadow-md"
                    data-testid="button-export-csv"
                  >
                    <Upload className="hero-icon mr-2" />
                    {exportCSV.isPending ? "Exporting..." : "Export CSV"}
                  </Button>
                  <Button 
                    onClick={handleRefreshData}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    data-testid="button-refresh-data"
                  >
                    <RefreshCw className="hero-icon mr-2" />
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <StatsOverview />

            {/* Highlights Section */}
            <HighlightsSection />

            {/* Filter Controls */}
            <FilterControls
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={allCompanies.length}
              filteredCount={companies.length}
            />

            {/* Companies Table */}
            <CompaniesDataTable
              companies={companies}
              isLoading={isLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
