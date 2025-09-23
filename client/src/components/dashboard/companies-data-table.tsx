import { useState, Fragment } from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as RowExpandIcon,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useUpdateCompany } from "@/hooks/use-companies";
import type { FundedCompany, Contact } from "@shared/schema";
import { cn } from "@/lib/utils";
import { ContactCompany } from "@/components/dashboard/contact-company";

interface CompaniesDataTableProps {
  companies: FundedCompany[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;
const UNDECLARED = "Undeclared";

/* Utilities */
const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

const socialIconMap: Record<string, any> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  website: Globe,
};

/* Premium contact card — full width, no domain/company name shown on the card
   When "Contact" is clicked it calls the onContact callback (parent opens ContactCompany) */
function ContactCard({ contact, onContact }: { contact: Contact; onContact: () => void }) {
  const name = (contact?.full_name ?? contact?.name ?? UNDECLARED) as string;
  const position = (contact?.position ?? contact?.role ?? "") as string | undefined;
  const email = (contact?.email ?? "") as string | undefined;

  const initials =
    (name
      .split(" ")
      .map((s) => (s ? s[0] : ""))
      .filter(Boolean)
      .slice(0, 2)
      .join("") || "?").toUpperCase();

  return (
    <div className="w-full rounded-xl border border-border bg-card p-5 shadow-md hover:shadow-lg transition-transform transform-gpu hover:-translate-y-0.5">
      <div className="flex gap-4 items-start">
        <div className="flex-none w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-base font-semibold text-foreground whitespace-normal break-words">{name}</div>
              {position ? (
                <div className="text-sm text-muted-foreground whitespace-normal break-words">{position}</div>
              ) : null}
            </div>

            {/* Contact button (delegates to parent modal via onContact) */}
            <div className="flex-shrink-0 ml-2">
              <Button size="sm" variant="outline" onClick={onContact}>
                Contact
              </Button>
            </div>
          </div>

          <div className="mt-3 text-sm font-mono text-muted-foreground whitespace-normal break-words">
            {email ? email : UNDECLARED}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Social media card — premium aesthetic with icon, platform label and link */
function SocialCard({ url }: { url: string }) {
  const href = String(url);
  let host = href;
  try {
    host = new URL(href).hostname.replace("www.", "");
  } catch {
    host = href;
  }

  // detect platform key from hostname
  const hostLower = host.toLowerCase();
  let platformKey = "website";
  if (hostLower.includes("linkedin")) platformKey = "linkedin";
  else if (hostLower.includes("twitter")) platformKey = "twitter";
  else if (hostLower.includes("facebook")) platformKey = "facebook";
  else if (hostLower.includes("instagram")) platformKey = "instagram";
  else if (hostLower.includes("youtube") || hostLower.includes("youtu.be")) platformKey = "youtube";

  const Icon = socialIconMap[platformKey] ?? socialIconMap.website;
  const platformLabel = platformKey === "website" ? "Website" : capitalize(platformKey);

  return (
    <div className="w-full rounded-2xl border border-border bg-gradient-to-br from-background/40 to-background/10 backdrop-blur-md p-4 shadow-lg hover:shadow-xl transition-transform transform-gpu hover:-translate-y-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-none w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center">
            <Icon className="h-6 w-6 text-foreground/90" />
          </div>

          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{platformLabel}</div>
            <div className="mt-1 text-xs text-muted-foreground break-words max-w-[60ch]">{href}</div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              try {
                window.open(href, "_blank", "noopener,noreferrer");
              } catch {
                // fallback - should rarely happen
                window.location.href = href;
              }
            }}
          >
            Visit
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CompaniesDataTable({ companies, isLoading }: CompaniesDataTableProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ field: keyof FundedCompany; direction: "asc" | "desc" }>(
    { field: "created_at" as keyof FundedCompany, direction: "desc" }
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [contactingCompany, setContactingCompany] = useState<FundedCompany | null>(null);

  // retained hook; if unused by linter you can remove or integrate later
  const updateCompanyMutation = useUpdateCompany();

  /* Formatting helpers */
  const formatValue = (value: unknown) => {
    if (value === null || value === undefined) return UNDECLARED;
    if (typeof value === "string") return value.trim() === "" ? UNDECLARED : value;
    if (typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.length ? value.join(", ") : UNDECLARED;
    return String(value);
  };

  const formatFundingAmount = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return UNDECLARED;
    const val = amount;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
    return `$${val}`;
  };

  const formatDate = (value?: string | number | Date | null) => {
    if (!value && value !== 0) return UNDECLARED;
    try {
      return format(new Date(value as any), "MMM dd, yyyy");
    } catch {
      return UNDECLARED;
    }
  };

  // NEW: returns the year only (used in the Date Added column)
  const formatYear = (value?: string | number | Date | null) => {
    if (!value && value !== 0) return UNDECLARED;
    try {
      return format(new Date(value as any), "yyyy");
    } catch {
      return UNDECLARED;
    }
  };

  const getStatusBadgeVariant = (status: string | null | undefined) => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      "follow-up": "destructive",
    };
    return status ? map[status] || "outline" : "outline";
  };

  const getStageBadgeColor = (stage: string | null | undefined) => {
    const stageMap: Record<string, string> = {
      "Pre-Seed": "bg-purple-100 text-purple-800",
      Seed: "bg-blue-100 text-blue-800",
      "Series A": "bg-green-100 text-green-800",
      "Series B": "bg-yellow-100 text-yellow-800",
      "Series C": "bg-orange-100 text-orange-800",
    };
    return stage ? stageMap[stage] || "bg-gray-100 text-gray-800" : "bg-gray-100 text-gray-800";
  };

  /* Sorting + paging */
  const sortedCompanies = [...companies].sort((a, b) => {
    const field = sortConfig.field;
    const aValue = (a as any)[field];
    const bValue = (b as any)[field];

    if (field === "funding_amount") {
      const aNum = typeof aValue === "number" ? aValue : Number(aValue ?? 0);
      const bNum = typeof bValue === "number" ? bValue : Number(bValue ?? 0);
      const cmp = aNum - bNum;
      return sortConfig.direction === "desc" ? -cmp : cmp;
    }

    if (field === "funding_date" || field === "created_at") {
      const aTime = aValue ? new Date(aValue).getTime() : 0;
      const bTime = bValue ? new Date(bValue).getTime() : 0;
      const cmp = aTime - bTime;
      return sortConfig.direction === "desc" ? -cmp : cmp;
    }

    const cmp = String(aValue ?? "").localeCompare(String(bValue ?? ""));
    return sortConfig.direction === "desc" ? -cmp : cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = sortedCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /* Handlers */
  const handleSort = (field: keyof FundedCompany) => {
    setSortConfig((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    setSelectedCompanies(isChecked ? new Set(paginatedCompanies.map((c) => c.id)) : new Set());
  };

  const handleSelectCompany = (id: string, checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    const newSelection = new Set(selectedCompanies);
    isChecked ? newSelection.add(id) : newSelection.delete(id);
    setSelectedCompanies(newSelection);
  };

  const toggleRowExpand = (id: string) => {
    const updated = new Set(expandedRows);
    updated.has(id) ? updated.delete(id) : updated.add(id);
    setExpandedRows(updated);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm p-8 text-center text-muted-foreground">
        Loading companies...
      </div>
    );
  }

  const columns: Array<{ label: string; field: keyof FundedCompany }> = [
    { label: "Company", field: "company_name" as keyof FundedCompany },
    { label: "Funding", field: "funding_amount" as keyof FundedCompany },
    { label: "Stage", field: "funding_stage" as keyof FundedCompany },
    { label: "Date Added", field: "created_at" as keyof FundedCompany },
  ];

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

              {columns.map(({ label, field }) => {
                const isActive = sortConfig.field === field;
                return (
                  <th
                    key={String(field)}
                    className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort(field)}
                    role="button"
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center gap-2 select-none">
                      <span>{label}</span>
                      <span className="flex items-center gap-1">
                        <ArrowUpDown
                          className={cn(
                            "h-3 w-3 transform transition-transform",
                            isActive && sortConfig.direction === "asc" ? "rotate-180" : ""
                          )}
                        />
                        {isActive ? <span className="text-[10px] text-muted-foreground">{sortConfig.direction === "asc" ? "▲" : "▼"}</span> : null}
                      </span>
                    </div>
                  </th>
                );
              })}

              <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => {
                const isExpanded = expandedRows.has(company.id);
                const companyDomain = company.domain ? String(company.domain) : undefined;

                return (
                  <Fragment key={company.id}>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2 align-top">
                        <Checkbox checked={selectedCompanies.has(company.id)} onCheckedChange={(checked) => handleSelectCompany(company.id, checked)} />
                      </td>

                      <td className="px-4 py-2 text-sm font-medium text-foreground align-top">
                        <button onClick={() => toggleRowExpand(company.id)} className="flex items-center gap-2" aria-expanded={isExpanded}>
                          {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <RowExpandIcon className="h-4 w-4 text-muted-foreground" />}
                          {formatValue(company.company_name)}
                        </button>
                      </td>

                      <td className="px-4 py-2 text-sm font-semibold align-top">
                        {company.funding_amount === null || company.funding_amount === undefined ? UNDECLARED : formatFundingAmount(company.funding_amount)}
                      </td>

                      <td className="px-4 py-2 align-top">
                        <Badge className={cn("text-xs px-2 py-1", getStageBadgeColor(company.funding_stage))}>
                          {company.funding_stage ? String(company.funding_stage) : UNDECLARED}
                        </Badge>
                      </td>

                      {/* Date Added (year only) with tooltip on hover of the cell */}
                      <td className="px-4 py-2 text-sm text-muted-foreground align-top relative group">
                        {company.created_at ? (
                          <>
                            <span className="font-medium">{formatYear(company.created_at)}</span>
                            {/* Screen-reader gets the full formatted date */}
                            <span className="sr-only">Full date: {formatDate(company.created_at)}</span>

                            {/* Tooltip: shows on hover of the cell */}
                            <div
                              role="tooltip"
                              className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 pointer-events-none"
                            >
                              <div className="rounded-md px-3 py-1 text-xs bg-black text-white whitespace-nowrap shadow">
                                Disclaimer this is only an estimate date
                              </div>
                            </div>
                          </>
                        ) : (
                          UNDECLARED
                        )}
                      </td>

                      <td className="px-4 py-2 align-top">
                        <Badge variant={getStatusBadgeVariant(String(company.status ?? undefined))}>
                          {company.status ? (company.status === "follow-up" ? "Follow Up" : String(company.status).charAt(0).toUpperCase() + String(company.status).slice(1)) : UNDECLARED}
                        </Badge>
                      </td>

                      <td className="px-4 py-2 text-right flex gap-1 justify-end items-start">
                        <Button variant="ghost" size="sm" onClick={() => setContactingCompany(company)}>
                          Contact
                        </Button>
                        <Button variant="ghost" size="sm" aria-label="More actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>

                    {/* Expanded futuristic card with stacked, full-width premium cards */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-4 py-4">
                          <div
                            className={cn(
                              "mt-2 rounded-2xl border border-border bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-xl shadow-lg p-8",
                              "transition-transform transform-gpu"
                            )}
                            role="region"
                            aria-labelledby={`company-details-${company.id}`}
                          >
                            {/* Header (company name + full date + domain highlight) */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h3 id={`company-details-${company.id}`} className="text-lg font-semibold text-foreground">
                                  {formatValue(company.company_name)}
                                </h3>
                                {/* Keep full date in expanded details for clarity */}
                                <div className="text-sm text-muted-foreground mt-1">{formatDate(company.created_at)}</div>
                              </div>

                              {/* Domain highlight kept in header only (not on the cards) */}
                              <div className="mt-2 md:mt-0">
                                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                                  {companyDomain ?? UNDECLARED}
                                </span>
                              </div>
                            </div>

                            {/* Core details (two-column on medium) */}
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Industry</p>
                                  <p className="mt-1 whitespace-normal break-words">{formatValue(company.industry)}</p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Investors</p>
                                  <p className="mt-1 whitespace-normal break-words">{company.investors && company.investors.length ? company.investors.join(", ") : UNDECLARED}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Source</p>
                                  <p className="mt-1 whitespace-normal break-words">{formatValue(company.source)}</p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Funding Amount</p>
                                  <p className="mt-1 whitespace-normal break-words">{company.funding_amount === null || company.funding_amount === undefined ? UNDECLARED : formatFundingAmount(company.funding_amount)}</p>
                                </div>
                              </div>
                            </div>

                            {/* Contacts: vertical, full-width premium business cards */}
                            <div className="mt-8">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-foreground">Contacts</p>
                                <p className="text-xs text-muted-foreground">{company.contacts?.length ?? 0} contact(s)</p>
                              </div>

                              <div className="mt-4 flex flex-col gap-4">
                                {company.contacts && company.contacts.length > 0 ? (
                                  company.contacts.map((c, idx) => (
                                    <ContactCard
                                      key={c.email ?? c.full_name ?? `contact-${idx}`}
                                      contact={c}
                                      onContact={() => setContactingCompany(company)}
                                    />
                                  ))
                                ) : (
                                  <p className="text-muted-foreground">{UNDECLARED}</p>
                                )}
                              </div>
                            </div>

                            {/* Socials: premium cards with icons */}
                            <div className="mt-8">
                              <p className="text-sm font-semibold text-foreground mb-3">Social Media</p>
                              <div className="flex flex-col gap-4">
                                {company.social_media && company.social_media.length ? (
                                  company.social_media.map((url, idx) => (
                                    <SocialCard key={`${company.id}-social-${idx}`} url={String(url)} />
                                  ))
                                ) : (
                                  <p className="text-muted-foreground">{UNDECLARED}</p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 flex items-center justify-end gap-2">
                              <Button size="sm" variant="ghost" onClick={() => setContactingCompany(company)}>
                                Contact
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const updated = new Set(expandedRows);
                                  updated.delete(company.id);
                                  setExpandedRows(updated);
                                }}
                              >
                                Close
                              </Button>
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
          <div className="inline-flex space-x-1 items-center">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Compact pager */}
            {(() => {
              const pages: (number | "ellipsis")[] = [];
              const maxButtons = 7;
              const half = Math.floor(maxButtons / 2);
              let start = Math.max(1, currentPage - half);
              let end = Math.min(totalPages, start + maxButtons - 1);
              if (end - start + 1 < maxButtons) start = Math.max(1, end - maxButtons + 1);

              if (start > 1) {
                pages.push(1);
                if (start > 2) pages.push("ellipsis");
              }
              for (let p = start; p <= end; p++) pages.push(p);
              if (end < totalPages) {
                if (end < totalPages - 1) pages.push("ellipsis");
                pages.push(totalPages);
              }
              return pages.map((p, idx) =>
                p === "ellipsis" ? (
                  <span key={`ell-${idx}`} className="px-2 text-muted-foreground">
                    …
                  </span>
                ) : (
                  <Button key={p} variant={currentPage === p ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(p as number)}>
                    {p}
                  </Button>
                )
              );
            })()}

            <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Company-level Contact modal (kept as-is) */}
      {contactingCompany && (
        <ContactCompany companyId={contactingCompany.id} companyName={contactingCompany.company_name ?? ""} contacts={contactingCompany.contacts ?? []} onClose={() => setContactingCompany(null)} />
      )}
    </div>
  );
}
