import { useState } from "react";
import { ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useUpdateCompany } from "@/hooks/use-companies";
import type { FundedCompany } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CompaniesDataTableProps {
  companies: FundedCompany[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function CompaniesDataTable({ companies, isLoading }: CompaniesDataTableProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ field: keyof FundedCompany; direction: "asc" | "desc" }>({
    field: "funding_date",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const updateCompanyMutation = useUpdateCompany();

  /** -----------------------
   * Derived Data
   * ---------------------- */
  const sortedCompanies = [...companies].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    let comparison = 0;
    if (sortConfig.field === "funding_amount") {
      comparison = (aValue as number) - (bValue as number);
    } else if (sortConfig.field === "funding_date") {
      comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
    } else {
      comparison = String(aValue ?? "").localeCompare(String(bValue ?? ""));
    }

    return sortConfig.direction === "desc" ? -comparison : comparison;
  });

  const totalPages = Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = sortedCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /** -----------------------
   * Handlers
   * ---------------------- */
  const handleSort = (field: keyof FundedCompany) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCompanies(checked ? new Set(paginatedCompanies.map((c) => c.id)) : new Set());
  };

  const handleSelectCompany = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedCompanies);
    checked ? newSelection.add(id) : newSelection.delete(id);
    setSelectedCompanies(newSelection);
  };

  const handleStatusChange = async (company: FundedCompany, newStatus: string) => {
    try {
      await updateCompanyMutation.mutateAsync({
        id: company.id,
        updates: { status: newStatus },
      });
    } catch (error) {
      console.error("Failed to update company status:", error);
    }
  };

  /** -----------------------
   * Utils
   * ---------------------- */
  const formatFundingAmount = (amount: number): string => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getStatusBadgeVariant = (status: string) => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      "follow-up": "destructive",
    };
    return map[status] || "outline";
  };

  const getStageBadgeColor = (stage: string) => {
    const stageMap: Record<string, string> = {
      "Pre-Seed": "stage-pre-seed",
      Seed: "stage-seed",
      "Series A": "stage-series-a",
      "Series B": "stage-series-b",
      "Series C": "stage-series-c",
    };
    return stageMap[stage] || "stage-pre-seed";
  };

  const getCompanyInitials = (name?: string | null): string => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  /** -----------------------
   * Render
   * ---------------------- */
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Newly Funded Startups</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span data-testid="text-filtered-count">{sortedCompanies.length}</span>
          <span>of</span>
          <span data-testid="text-total-count">{companies.length}</span>
          <span>companies</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3">
                <Checkbox
                  checked={selectedCompanies.size === paginatedCompanies.length && paginatedCompanies.length > 0}
                  onCheckedChange={handleSelectAll}
                  data-testid="checkbox-select-all"
                />
              </th>
              {[
                { label: "Company", field: "company_name" },
                { label: "Funding", field: "funding_amount" },
                { label: "Date", field: "funding_date" },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort(field as keyof FundedCompany)}
                >
                  <div className="flex items-center">
                    {label}
                    <ArrowUpDown className="hero-icon ml-1" />
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Investors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <Checkbox
                      checked={selectedCompanies.has(company.id)}
                      onCheckedChange={(checked) => handleSelectCompany(company.id, !!checked)}
                    />
                  </td>
                  {/* Company Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-accent">
                          {getCompanyInitials(company.company_name)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{company.company_name}</div>
                        <div className="text-sm text-muted-foreground">{company.domain}</div>
                      </div>
                    </div>
                  </td>
                  {/* Funding */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                    {formatFundingAmount(company.funding_amount)}
                  </td>
                  {/* Stage */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary" className={cn("text-xs", getStageBadgeColor(company.funding_stage))}>
                      {company.funding_stage}
                    </Badge>
                  </td>
                  {/* Investors */}
                  <td className="px-6 py-4 text-sm text-foreground">{company.investors}</td>
                  {/* Contact */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{company.contact_name}</div>
                    <div className="text-sm text-muted-foreground">{company.contact_email}</div>
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {company.funding_date ? format(new Date(company.funding_date), "MMM dd, yyyy") : "—"}
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(company.status)}>
                      {company.status === "follow-up"
                        ? "Follow Up"
                        : company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                    </Badge>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {company.status === "new" ? (
                      <Button variant="link" size="sm" onClick={() => handleStatusChange(company, "contacted")}>
                        Contact
                      </Button>
                    ) : (
                      <Button variant="link" size="sm" onClick={() => handleStatusChange(company, "follow-up")}>
                        Follow Up
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="ml-2">
                      <MoreHorizontal className="hero-icon" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center">
                  <p className="text-muted-foreground">No companies found matching your criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-card px-6 py-3 flex items-center justify-between border-t border-border">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, sortedCompanies.length)}</span> of{" "}
              <span className="font-medium">{sortedCompanies.length}</span> results
            </p>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="rounded-l-md"
              >
                <ChevronLeft className="hero-icon" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                .map((page, index, array) => (
                  <>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span
                        key={`ellipsis-${page}`}
                        className="px-4 py-2 border border-border bg-card text-sm text-muted-foreground"
                      >
                        ...
                      </span>
                    )}
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="rounded-none"
                    >
                      {page}
                    </Button>
                  </>
                ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="rounded-r-md"
              >
                <ChevronRight className="hero-icon" />
              </Button>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
