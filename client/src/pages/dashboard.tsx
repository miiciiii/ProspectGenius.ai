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
import { useAuth } from "@/context/auth-context";
import { useSubscription } from "@/context/subscription-context";
import {
  SubscriptionGate,
  FeatureLimit,
} from "@/components/subscription/subscription-gate";
import type { CompanyFilters } from "@shared/schema";
import MainLayout from "@/pages/main-layout";

export default function Dashboard() {
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

  const handleRefreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
    queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
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
            <h1 className="text-2xl font-bold text-foreground">
              ProspectGenius Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track newly funded startups and investment opportunities
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
              description="Export filtered company data to CSV for analysis and reporting"
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

        {/* Stats Overview */}
        <SubscriptionGate
          feature="Advanced Analytics"
          description="Get detailed insights and metrics about funding trends and company data"
          showUpgrade={false}
          fallback={
            <div className="bg-card rounded-lg shadow p-4 border border-border border-dashed border-amber-200">
              <div className="text-center py-8 text-amber-800">
                <h3 className="text-lg font-semibold mb-2">
                  Advanced Analytics - Premium Feature
                </h3>
                <p className="text-sm mb-4">
                  Get detailed insights and metrics about funding trends
                </p>
                <Button variant="default" size="sm">
                  Upgrade to unlock
                </Button>
              </div>
            </div>
          }>
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <StatsOverview />
          </div>
        </SubscriptionGate>

        {/* Highlights Section */}
        <SubscriptionGate
          feature="Daily Highlights"
          description="Stay updated with curated highlights of the most important funding news"
          showUpgrade={false}
          fallback={
            <div className="bg-card rounded-lg shadow p-4 border border-border border-dashed border-amber-200">
              <div className="text-center py-8 text-amber-800">
                <h3 className="text-lg font-semibold mb-2">
                  Daily Highlights - Premium Feature
                </h3>
                <p className="text-sm mb-4">
                  Get curated highlights of important funding news
                </p>
                <Button variant="default" size="sm">
                  Upgrade to unlock
                </Button>
              </div>
            </div>
          }>
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <HighlightsSection />
          </div>
        </SubscriptionGate>

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
            <div className="bg-card rounded-lg shadow p-4 border border-border border-dashed border-amber-200">
              <div className="text-center py-8 text-amber-800">
                <h3 className="text-lg font-semibold mb-2">
                  Advanced Filtering - Premium Feature
                </h3>
                <p className="text-sm mb-4">
                  Filter companies by industry, funding stage, and more
                </p>
                <Button variant="default" size="sm">
                  Upgrade to unlock
                </Button>
              </div>
            </div>
          }>
          <div className="bg-card rounded-lg shadow p-4 border border-border">
            <FilterControls
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={allCompanies.length}
              filteredCount={companies.length}
            />
          </div>
        </SubscriptionGate>

        {/* Companies Table */}
        <div className="bg-card rounded-lg shadow p-2 md:p-4 border border-border">
          <CompaniesDataTable companies={companies} isLoading={isLoading} />
        </div>
      </div>
    </MainLayout>
  );
}
