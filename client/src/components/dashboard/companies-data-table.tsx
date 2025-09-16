import { useState, Fragment } from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as RowExpandIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useUpdateCompany } from "@/hooks/use-companies";
import type { FundedCompany } from "@shared/schema";
import { cn } from "@/lib/utils";
import { ContactCompany } from "@/components/dashboard/contact-company";

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
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [contactingCompany, setContactingCompany] = useState<FundedCompany | null>(null);

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

  const toggleRowExpand = (id: string) => {
    const updated = new Set(expandedRows);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedRows(updated);
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
      "Pre-Seed": "bg-purple-100 text-purple-800",
      Seed: "bg-blue-100 text-blue-800",
      "Series A": "bg-green-100 text-green-800",
      "Series B": "bg-yellow-100 text-yellow-800",
      "Series C": "bg-orange-100 text-orange-800",
    };
    return stageMap[stage] || "bg-gray-100 text-gray-800";
  };

  /** -----------------------
   * Render
   * ---------------------- */
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm p-8 text-center text-muted-foreground">
        Loading companies...
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Newly Funded Startups</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{sortedCompanies.length}</span> <span>of</span> <span>{companies.length}</span> <span>companies</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border table-auto">
          <thead className="bg-muted/30 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2">
                <Checkbox
                  checked={selectedCompanies.size === paginatedCompanies.length && paginatedCompanies.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              {[
                { label: "Company", field: "company_name" },
                { label: "Funding", field: "funding_amount" },
                { label: "Stage", field: "funding_stage" },
                { label: "Date", field: "funding_date" },
              ].map(({ label, field }) => (
                <th
                  key={field}
                  className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort(field as keyof FundedCompany)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              ))}
              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => {
                const isExpanded = expandedRows.has(company.id);
                return (
                  <Fragment key={company.id}>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2">
                        <Checkbox
                          checked={selectedCompanies.has(company.id)}
                          onCheckedChange={(checked) => handleSelectCompany(company.id, !!checked)}
                        />
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-foreground">
                        <button onClick={() => toggleRowExpand(company.id)} className="flex items-center gap-2">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <RowExpandIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                          {company.company_name}
                        </button>
                      </td>
                      <td className="px-4 py-2 text-sm font-semibold">{formatFundingAmount(company.funding_amount)}</td>
                      <td className="px-4 py-2">
                        <Badge className={cn("text-xs px-2 py-1", getStageBadgeColor(company.funding_stage))}>
                          {company.funding_stage}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-sm text-muted-foreground">
                        {company.funding_date ? format(new Date(company.funding_date), "MMM dd, yyyy") : "—"}
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={getStatusBadgeVariant(company.status)}>
                          {company.status === "follow-up" ? "Follow Up" : company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-4 py-2 text-right flex gap-1 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setContactingCompany(company)}>
                          Contact
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-muted/20">
                        <td colSpan={7} className="px-4 py-3 text-sm">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="font-semibold text-foreground">Domain</p>
                              <p className="text-muted-foreground">{company.domain || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Industry</p>
                              <p className="text-muted-foreground">{company.industry || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Investors</p>
                              <p className="text-muted-foreground">{company.investors || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Source</p>
                              <p className="text-muted-foreground">{company.source || "—"}</p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Contact</p>
                              <p className="text-muted-foreground">
                                {company.contact_name || "—"} ({company.contact_email || "—"})
                              </p>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Socials</p>
                              <div className="flex flex-wrap gap-1">
                                {company.social_media?.length
                                  ? company.social_media.map((url, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs cursor-pointer hover:bg-muted/50">
                                        {new URL(url).hostname.replace("www.", "")}
                                      </Badge>
                                    ))
                                  : "—"}
                              </div>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">Created At</p>
                              <p className="text-muted-foreground">
                                {company.created_at ? format(new Date(company.created_at), "MMM dd, yyyy") : "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-card px-6 py-3 flex items-center justify-between border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedCompanies.length)} of {sortedCompanies.length} results
          </p>
          <div className="inline-flex space-x-1">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(page)}>
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      {contactingCompany && (
        <ContactCompany companyId={contactingCompany.id} companyName={contactingCompany.company_name ?? ""} onClose={() => setContactingCompany(null)} />
      )}
    </div>
  );
}
