// components/reports/company-reports/company-reports-table.tsx
import React, { useState, Fragment, useMemo } from "react";
import { format } from "date-fns";
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
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { CompanyReport } from "@shared/schema";

interface Props {
  data: CompanyReport[];
  isLoading?: boolean;
  itemsPerPage?: number; // default 20
}

const ITEMS_PER_PAGE_DEFAULT = 20;
const UNDECLARED = "Undeclared";

const socialIconMap: Record<string, any> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  website: Globe,
};

/* Helpers */
const capitalize = (s?: string | null) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const formatValue = (value: unknown) => {
  if (value === null || value === undefined) return UNDECLARED;
  if (typeof value === "string") {
    const t = value.trim();
    return t === "" ? UNDECLARED : t;
  }
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.length ? value.join(", ") : UNDECLARED;
  return String(value);
};

const formatFundingAmount = (amount?: number | null): string => {
  if (amount === null || amount === undefined) return UNDECLARED;
  const val = amount;
  if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}K`;
  return `$${val}`;
};

const formatDate = (value?: string | null) => {
  if (!value) return UNDECLARED;
  try {
    return format(new Date(value), "MMM dd, yyyy");
  } catch {
    return UNDECLARED;
  }
};

/* Social card used inside expanded view */
function SocialCard({ url }: { url?: string | null }) {
  if (!url) return <div className="text-sm text-muted-foreground">{UNDECLARED}</div>;

  const href = String(url);
  let host = href;
  try {
    host = new URL(href).hostname.replace("www.", "");
  } catch {}

  const hostLower = host.toLowerCase();
  let key = "website";
  if (hostLower.includes("linkedin")) key = "linkedin";
  else if (hostLower.includes("twitter")) key = "twitter";
  else if (hostLower.includes("facebook")) key = "facebook";
  else if (hostLower.includes("instagram")) key = "instagram";

  const Icon = socialIconMap[key] ?? socialIconMap.website;
  const label = key === "website" ? "Website" : capitalize(key);

  return (
    <div className="w-full rounded-2xl border border-border bg-gradient-to-br from-background/40 to-background/10 backdrop-blur-md p-4 shadow-lg hover:shadow-xl transition-transform transform-gpu hover:-translate-y-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-none w-10 h-10 rounded-lg bg-muted/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-foreground/90" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{label}</div>
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

export function CompanyReportsTable({ data, isLoading, itemsPerPage }: Props) {
  const ITEMS_PER_PAGE = itemsPerPage ?? ITEMS_PER_PAGE_DEFAULT;

  const [sortConfig, setSortConfig] = useState<{
    field: keyof CompanyReport;
    direction: "asc" | "desc";
  }>({
    field: "funding_date",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Memoized sorted data
  const sorted = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => {
      const field = sortConfig.field;
      const aVal = (a as any)[field];
      const bVal = (b as any)[field];

      if (field === "funding_amount") {
        const an = typeof aVal === "number" ? aVal : Number(aVal ?? 0);
        const bn = typeof bVal === "number" ? bVal : Number(bVal ?? 0);
        const cmp = an - bn;
        return sortConfig.direction === "desc" ? -cmp : cmp;
      }

      if (field === "funding_date") {
        const at = aVal ? new Date(aVal).getTime() : 0;
        const bt = bVal ? new Date(bVal).getTime() : 0;
        const cmp = at - bt;
        return sortConfig.direction === "desc" ? -cmp : cmp;
      }

      const cmp = String(aVal ?? "").localeCompare(String(bVal ?? ""));
      return sortConfig.direction === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [data, sortConfig]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE)), [
    sorted.length,
    ITEMS_PER_PAGE,
  ]);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = useMemo(
    () => sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE),
    [sorted, startIndex, ITEMS_PER_PAGE]
  );

  const handleSort = (field: keyof CompanyReport) => {
    setSortConfig((cur) => ({
      field,
      direction: cur.field === field && cur.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleExpandByKey = (rowKey: string) => {
    setExpanded((cur) => {
      const next = new Set(cur);
      next.has(rowKey) ? next.delete(rowKey) : next.add(rowKey);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm p-8 text-center text-muted-foreground">
        Loading reports...
      </div>
    );
  }

  const columns: Array<{ label: string; field: keyof CompanyReport }> = [
    { label: "Company", field: "company_name" },
    { label: "Funding", field: "funding_amount" },
    { label: "Round", field: "funding_round" },
    { label: "Date", field: "funding_date" },
  ];

  const rowKeyFor = (report: CompanyReport, absoluteIndex: number) =>
    `${report.company_name ?? "company"}-${absoluteIndex}`;

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm relative">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
          <span>{sorted.length}</span>
          <span className="text-muted-foreground">reports</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border table-auto">
          <thead className="bg-muted/30 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2" />
              {columns.map(({ label, field }) => {
                const isActive = sortConfig.field === field;
                return (
                  <th
                    key={String(field)}
                    className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSort(field)}
                    role="button"
                  >
                    <div className="flex items-center gap-2 select-none">
                      <span>{label}</span>
                      <ArrowUpDown
                        className={cn(
                          "h-3 w-3 transform transition-transform",
                          isActive && sortConfig.direction === "asc" ? "rotate-180" : ""
                        )}
                      />
                    </div>
                  </th>
                );
              })}
              <th className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Markets
              </th>
              <th className="px-4 py-2" />
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {paginated.length > 0 ? (
              paginated.map((report, idx) => {
                const absoluteIndex = startIndex + idx;
                const rowKey = rowKeyFor(report, absoluteIndex);
                const isExpanded = expanded.has(rowKey);

                return (
                  <Fragment key={rowKey}>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2 align-top">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpandByKey(rowKey)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <RowExpandIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </td>

                      <td className="px-4 py-3 text-sm font-medium text-foreground align-top">
                        <div className="min-w-0">
                          <div className="truncate max-w-[28ch]">
                            {formatValue(report.company_name)}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[28ch]">
                            {report.website ?? UNDECLARED}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm font-semibold text-foreground align-top">
                        {report.funding_amount == null
                          ? UNDECLARED
                          : formatFundingAmount(report.funding_amount)}
                      </td>

                      <td className="px-4 py-3 align-top">
                        <Badge className="text-xs px-2 py-1 bg-gray-100 text-gray-800">
                          {report.funding_round ?? UNDECLARED}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground align-top">
                        {report.funding_date ? formatDate(report.funding_date) : UNDECLARED}
                      </td>

                      <td className="px-4 py-3 text-sm text-foreground align-top">
                        {report.markets && report.markets.length ? (
                          <div className="flex flex-wrap gap-1 items-center">
                            {report.markets.slice(0, 3).map((m, i) => (
                              <Badge
                                key={`${rowKey}-market-${i}`}
                                className="px-2 py-0.5 text-xs"
                              >
                                {m}
                              </Badge>
                            ))}
                            {report.markets.length > 3 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                +{report.markets.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          UNDECLARED
                        )}
                      </td>

                      <td className="px-4 py-3 text-right flex gap-1 justify-end items-start">
                        <Button variant="ghost" size="sm" onClick={() => toggleExpandByKey(rowKey)}>
                          Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="px-4 py-6">
                          <div className="mt-2 rounded-2xl border border-border bg-gradient-to-br from-background/60 to-background/30 backdrop-blur-xl shadow-lg p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                              <div className="min-w-0">
                                <h3 className="text-lg font-semibold text-foreground">
                                  {formatValue(report.company_name)}
                                </h3>
                                <div className="mt-2 text-sm text-muted-foreground max-w-[80ch]">
                                  {report.description ?? UNDECLARED}
                                </div>
                              </div>

                              <div className="flex-shrink-0 ml-auto flex items-center gap-2">
                                {((report as any).news_url) ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      window.open((report as any).news_url, "_blank", "noopener,noreferrer")
                                    }
                                  >
                                    Open Article
                                  </Button>
                                ) : null}
                                {((report as any).url) ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      window.open((report as any).url, "_blank", "noopener,noreferrer")
                                    }
                                  >
                                    Source
                                  </Button>
                                ) : null}
                              </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Investors</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {report.investors && report.investors.length ? (
                                      report.investors.map((inv, i) => (
                                        <Badge
                                          key={`${rowKey}-inv-${i}`}
                                          className="px-2 py-1 text-sm"
                                        >
                                          {inv}
                                        </Badge>
                                      ))
                                    ) : (
                                      <div className="text-muted-foreground">{UNDECLARED}</div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Markets</p>
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {report.markets && report.markets.length ? (
                                      report.markets.map((m, i) => (
                                        <Badge
                                          key={`${rowKey}-mkt-${i}`}
                                          className="px-2 py-1 text-sm"
                                        >
                                          {m}
                                        </Badge>
                                      ))
                                    ) : (
                                      <div className="text-muted-foreground">{UNDECLARED}</div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Headquarters</p>
                                  <div className="mt-1">{report.hq ?? UNDECLARED}</div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Founded</p>
                                  <div className="mt-1">{report.founded_year ?? UNDECLARED}</div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs text-muted-foreground">Funding Amount</p>
                                  <div className="mt-1">
                                    {report.funding_amount == null
                                      ? UNDECLARED
                                      : formatFundingAmount(report.funding_amount)}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Funding Round</p>
                                  <div className="mt-1">{report.funding_round ?? UNDECLARED}</div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Crunchbase / Pitchbook</p>
                                  <div className="mt-2 flex flex-col gap-2">
                                    {report.crunchbase ? <SocialCard url={report.crunchbase} /> : null}
                                    {report.pitchbook ? <SocialCard url={report.pitchbook} /> : null}
                                    {!report.crunchbase && !report.pitchbook && (
                                      <div className="text-muted-foreground">{UNDECLARED}</div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Socials</p>
                                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <SocialCard url={report.website} />
                                    <SocialCard url={report.linkedin} />
                                    <SocialCard url={report.twitter} />
                                    <SocialCard url={report.facebook} />
                                    <SocialCard url={report.instagram} />
                                  </div>
                                </div>
                              </div>
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
                <td colSpan={8} className="px-4 py-6 text-center text-muted-foreground">
                  No company reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI from first code */}
      {totalPages > 1 && (
        <div className="bg-card px-6 py-3 flex items-center justify-between border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, sorted.length)} of {sorted.length} reports
          </p>
          <div className="inline-flex space-x-1 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Compact pager with ellipsis (like first code) */}
            {(() => {
              const pages: (number | "ellipsis")[] = [];
              const maxButtons = 7;
              const half = Math.floor(maxButtons / 2);
              let start = Math.max(1, currentPage - half);
              let end = Math.min(totalPages, start + maxButtons - 1);
              if (end - start + 1 < maxButtons) {
                start = Math.max(1, end - maxButtons + 1);
              }

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
                  <span
                    key={`ell-${idx}`}
                    className="px-2 text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={p}
                    variant={currentPage === p ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(p as number)}
                  >
                    {p}
                  </Button>
                )
              );
            })()}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
