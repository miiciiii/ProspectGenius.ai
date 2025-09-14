import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { CompanyFilters } from "@shared/schema"; // ✅ unified schema import

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
  const handleFilterChange = (key: keyof CompanyFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined, // ✅ always undefined, never null
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((value) => value && value !== "");

  return (
    <div className="mb-6">
      <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="hero-icon text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search companies..."
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10 bg-input border-border focus:bg-card focus:border-accent hover:border-accent/50 transition-all duration-200 hover:shadow-md"
              data-testid="input-search-companies"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date Range Filter */}
            <Select
              value={filters.date_range || ""}
              onValueChange={(value) => handleFilterChange("date_range", value)}
            >
              <SelectTrigger className="w-40 bg-input border-border focus:bg-card focus:border-accent hover:border-accent/50 transition-all duration-200 hover:shadow-md" data-testid="select-date-range">
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
              value={filters.funding_stage || ""}
              onValueChange={(value) => handleFilterChange("funding_stage", value)}
            >
              <SelectTrigger className="w-40 bg-input border-border focus:bg-card focus:border-accent hover:border-accent/50 transition-all duration-200 hover:shadow-md" data-testid="select-funding-stage">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="series-a">Series A</SelectItem>
                <SelectItem value="series-b">Series B</SelectItem>
                <SelectItem value="series-c">Series C+</SelectItem>
              </SelectContent>
            </Select>

            {/* Industry Filter */}
            <Select
              value={filters.industry || ""}
              onValueChange={(value) => handleFilterChange("industry", value)}
            >
              <SelectTrigger className="w-40 bg-input border-border focus:bg-card focus:border-accent hover:border-accent/50 transition-all duration-200 hover:shadow-md" data-testid="select-industry">
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
              value={filters.status || ""}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-40 bg-input border-border focus:bg-card focus:border-accent hover:border-accent/50 transition-all duration-200 hover:shadow-md" data-testid="select-status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="follow-up">Follow Up</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center hover:bg-secondary hover:border-accent hover:text-accent transition-all duration-200 hover:scale-105 hover:shadow-md"
                data-testid="button-clear-filters"
              >
                <X className="hero-icon mr-1" />
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
