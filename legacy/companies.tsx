import { useState } from "react";
import { RefreshCw, Upload } from "lucide-react";
import MainLayout from "@/pages/main-layout";
import { FilterControls } from "@/components/dashboard/filter-controls";
import { CompaniesDataTable } from "@/components/dashboard/companies-data-table";
import { Button } from "@/components/ui/button";
import { useCompanies } from "@/hooks/use-companies";
import { useExportCSV } from "@/hooks/use-export-csv";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth-context";
import { useSubscription } from "@/context/subscription-context";
import {
  SubscriptionGate,
  FeatureLimit,
} from "@/components/subscription/subscription-gate";
import type { CompanyFilters } from "@shared/schema";

export default function Companies() {
  const [filters, setFilters] = useState<CompanyFilters>({});
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { canAccessPremiumFeatures } = useSubscription();

  const { data: companiesResponse, isLoading } = useCompanies(filters);
  const { data: allCompaniesResponse } = useCompanies(); // For total count
  const exportCSV = useExportCSV();

  // The API now returns an object with data property, but hook types as FundedCompany[]
  // Handle both formats for backward compatibility
  const companies = Array.isArray(companiesResponse)
    ? companiesResponse
    : (companiesResponse as any)?.data || [];
  const allCompanies = Array.isArray(allCompaniesResponse)
    ? allCompaniesResponse
    : (allCompaniesResponse as any)?.data || [];

  // Check if user hit the free tier limit
  const isLimitedUser = !canAccessPremiumFeatures && user?.role === "guest";
  const totalAvailable =
    (companiesResponse as any)?.total_available || companies.length;
  const hasLimitMessage = (companiesResponse as any)?.message;

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
              {isLimitedUser && totalAvailable > companies.length && (
                <span className="text-amber-600 ml-2">
                  (Showing {companies.length} of {totalAvailable} companies)
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <SubscriptionGate
              feature="CSV Export"
              description="Export company data to CSV for analysis and reporting"
              showUpgrade={false}
              fallback={
                <Button variant="outline" disabled>
                  <Upload className="hero-icon mr-2" />
                  Export CSV (Premium)
                </Button>
              }>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                disabled={exportCSV.isPending}
                data-testid="button-export-csv"
                className="brand-hover-glow">
                <Upload className="hero-icon mr-2" />
                {exportCSV.isPending ? "Exporting..." : "Export CSV"}
              </Button>
            </SubscriptionGate>

            <Button
              onClick={handleRefreshData}
              data-testid="button-refresh-data"
              className="btn-gradient">
              <RefreshCw className="hero-icon mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Feature Limit Warning for Free Users */}
        {isLimitedUser && totalAvailable > companies.length && (
          <FeatureLimit
            current={companies.length}
            limit={totalAvailable}
            feature="Company results"
            unit="companies shown"
          />
        )}

        {/* Filter Controls */}
        <SubscriptionGate
          feature="Advanced Filtering"
          description="Use advanced filters to find companies by industry, funding stage, and more"
          showUpgrade={false}
          fallback={
            <div className="mb-6 p-4 border border-dashed border-amber-200 bg-amber-50 rounded-lg">
              <p className="text-amber-800 text-center">
                Advanced filtering is available for subscribers.
                <Button variant="link" className="p-0 ml-1">
                  Upgrade to unlock
                </Button>
              </p>
            </div>
          }>
          <FilterControls
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={allCompanies.length}
            filteredCount={companies.length}
          />
        </SubscriptionGate>

        {/* Limited Results Message */}
        {hasLimitMessage && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm text-center">
              {hasLimitMessage}
            </p>
          </div>
        )}

        {/* Companies Table */}
        <CompaniesDataTable companies={companies} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
}
