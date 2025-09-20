import { useCompanies } from "@/hooks/use-companies";
import { subDays, isAfter } from "date-fns";
import type { FundedCompany, CompanyFilters } from "@shared/schema";

export function HighlightsSection() {
  const { data: newThisWeek = [] } = useCompanies({ date_range: "week" });
  const { data: followUpRequired = [] } = useCompanies({ status: "follow-up" });

  /** -----------------------
   * Recent Updates
   * ---------------------- */
  const recentUpdates = [...newThisWeek, ...followUpRequired]
    .filter((c) => c.source)
    .sort((a, b) => {
      const aDate = a.funding_date ? new Date(a.funding_date).getTime() : 0;
      const bDate = b.funding_date ? new Date(b.funding_date).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 3)
    .map((c) => {
      const fundingAmount = c.funding_amount ?? 0;
      const description = fundingAmount
        ? `Raised $${(fundingAmount / 1_000_000).toFixed(1)}M`
        : "Funding info pending";
      const timestamp = c.funding_date
        ? `${Math.floor((Date.now() - new Date(c.funding_date).getTime()) / (1000 * 60 * 60))} hrs ago`
        : "Date TBD";
      return {
        source: c.source ?? "Unknown source",
        description,
        timestamp,
      };
    });

  const highlightSections = [
    {
      title: "New This Week",
      count: newThisWeek.length,
      companies: newThisWeek.slice(0, 3),
      bgColor: "bg-accent",
      textColor: "text-accent-foreground",
      dotColor: "bg-accent",
      testId: "highlights-new-week",
    },
    {
      title: "Follow Up Required",
      count: followUpRequired.length,
      companies: followUpRequired.slice(0, 3),
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      dotColor: "bg-orange-500",
      testId: "highlights-follow-up",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">Highlights</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {highlightSections.map((section) => (
          <div
            key={section.title}
            className="bg-card rounded-lg p-6 border border-border shadow-sm"
            data-testid={section.testId}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-2 h-2 ${section.dotColor} rounded-full`} />
              <h3 className="font-medium text-foreground">{section.title}</h3>
              <span className={`${section.bgColor} ${section.textColor} text-xs font-medium px-2 py-1 rounded-full`}>
                {section.count}
              </span>
            </div>
            <div className="space-y-3">
              {section.companies.length > 0 ? (
                section.companies.map((company) => (
                  <CompanyHighlightItem
                    key={company.id}
                    company={company}
                    showFollowUp={section.title === "Follow Up Required"}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No companies in this category</p>
              )}
            </div>
          </div>
        ))}

        {/* Recent Updates */}
        <div
          className="bg-card rounded-lg p-6 border border-border shadow-sm"
          data-testid="highlights-data-updates"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="font-medium text-foreground">Recent Updates</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {recentUpdates.length}
            </span>
          </div>
          <div className="space-y-3">
            {recentUpdates.length > 0 ? (
              recentUpdates.map((update, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
                  data-testid={`update-${index}`}
                >
                  <div className="max-w-[70%]">
                    <p
                      className="font-medium text-sm text-foreground truncate hover:whitespace-normal hover:overflow-visible hover:break-words cursor-pointer"
                      title={update.source}
                    >
                      {update.source}
                    </p>
                    <p className="text-xs text-muted-foreground">{update.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{update.timestamp}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent updates</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CompanyHighlightItemProps {
  company: FundedCompany;
  showFollowUp?: boolean;
}

function CompanyHighlightItem({ company, showFollowUp }: CompanyHighlightItemProps) {
  const fundingDate = company.funding_date ? new Date(company.funding_date) : null;
  const daysAgo = fundingDate
    ? Math.floor((Date.now() - fundingDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const timeAgo =
    daysAgo === null ? "Date TBD" : daysAgo === 0 ? "Today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;

  const fundingAmount = company.funding_amount ?? 0;
  const fundingStage = company.funding_stage ?? "—";

  return (
    <div
      className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
      data-testid={`company-highlight-${company.id}`}
    >
      <div>
        <p className="font-medium text-sm text-foreground">{company.company_name ?? "Unknown"}</p>
        <p className="text-xs text-muted-foreground">
          {showFollowUp
            ? `Contacted ${timeAgo}`
            : `${fundingStage} • ${fundingAmount ? `$${(fundingAmount / 1_000_000).toFixed(1)}M` : "Amount TBD"}`}
        </p>
      </div>
      {showFollowUp ? (
        <button className="text-xs text-primary hover:underline" data-testid={`button-follow-up-${company.id}`}>
          Follow up
        </button>
      ) : (
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      )}
    </div>
  );
}
