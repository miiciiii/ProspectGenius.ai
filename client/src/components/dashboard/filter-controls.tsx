import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { CompanyFilters } from "@shared/schema";

interface FilterControlsProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  totalCount: number;
  filteredCount: number;
}

export function FilterControls({
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: FilterControlsProps) {
  // Maps for normalization
  const fundingStageMap: Record<string, string> = {
    "pre-seed": "Pre-Seed",
    "seed": "Seed",
    "series-a": "Series A",
    "series-b": "Series B",
    "series-c": "Series C",
  };

  const statusMap: Record<string, string> = {
    "new": "new",
    "contacted": "contacted",
    "follow-up": "follow-up",
  };

  const handleFilterChange = (key: keyof CompanyFilters, value: string | undefined) => {
    let normalizedValue = value;

    if (key === "funding_stage" && value) {
      // Convert display value back to internal key
      const keyEntry = Object.entries(fundingStageMap).find(([, display]) => display === value);
      normalizedValue = keyEntry ? keyEntry[0] : value;
    }

    if (key === "status" && value) {
      const keyEntry = Object.entries(statusMap).find(([, display]) => display === value);
      normalizedValue = keyEntry ? keyEntry[0] : value;
    }

    onFiltersChange({
      ...filters,
      [key]: normalizedValue || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value && value !== "");

  return (
    <div className="mb-6">
      <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search companies..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
              data-testid="input-search-companies"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Range Filter */}
            <Select
              value={filters.date_range || ""}
              onValueChange={(value) => handleFilterChange("date_range", value)}
            >
              <SelectTrigger className="w-40" data-testid="select-date-range">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            {/* Funding Stage Filter */}
            <Select
              value={filters.funding_stage ? fundingStageMap[filters.funding_stage] : ""}
              onValueChange={(value) => handleFilterChange("funding_stage", value)}
            >
              <SelectTrigger className="w-40" data-testid="select-funding-stage">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(fundingStageMap).map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Industry Filter */}
            <Select
              value={filters.industry || ""}
              onValueChange={(value) => handleFilterChange("industry", value)}
            >
              <SelectTrigger className="w-40" data-testid="select-industry">
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Fintech">Fintech</SelectItem>
                <SelectItem value="SaaS">SaaS</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="EdTech">EdTech</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select
              value={filters.status ? statusMap[filters.status] : ""}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-40" data-testid="select-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(statusMap).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center"
                data-testid="button-clear-filters"
              >
                <X className="mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground" data-testid="text-filter-results">
              Showing {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} companies
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
