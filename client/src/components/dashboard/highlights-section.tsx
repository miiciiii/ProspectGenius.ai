import { useCompanies } from "@/hooks/use-companies";
import type { FundedCompany } from "@shared/schema";

export function HighlightsSection() {
  const { data: newThisWeek = [] } = useCompanies({ date_range: "week" });
  const { data: followUpRequired = [] } = useCompanies({ status: "follow-up" });
  const { data: allCompanies = [] } = useCompanies();

  /** -----------------------
   * Recent Updates (top 3 most recent companies)
   * ---------------------- */
  const recentUpdates = allCompanies
    .sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 3);

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
              <span
                className={`${section.bgColor} ${section.textColor} text-xs font-medium px-2 py-1 rounded-full`}
              >
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
                <p className="text-muted-foreground text-sm">
                  No companies in this category
                </p>
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
              recentUpdates.map((company) => (
                <CompanyHighlightItem key={company.id} company={company} />
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

function CompanyHighlightItem({
  company,
  showFollowUp,
}: CompanyHighlightItemProps) {
  const fundingDate = company.created_at ? new Date(company.created_at) : null;
  const daysAgo = fundingDate
    ? Math.floor((Date.now() - fundingDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const timeAgo =
    daysAgo === null
      ? "Date TBD"
      : daysAgo === 0
      ? "Today"
      : daysAgo === 1
      ? "1 day ago"
      : `${daysAgo} days ago`;

  const fundingAmount = company.funding_amount ?? 0;
  const fundingStage = company.funding_stage ?? "—";

  return (
    <div
      className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
      data-testid={`company-highlight-${company.id}`}
    >
      <div>
        <p className="font-medium text-sm text-foreground">
          {company.company_name ?? "Unknown"}
        </p>
        <p className="text-xs text-muted-foreground">
          {showFollowUp
            ? `Contacted ${timeAgo}`
            : `${fundingStage} • ${
                fundingAmount
                  ? `$${(fundingAmount / 1_000_000).toFixed(1)}M`
                  : "Amount TBD"
              }`}
        </p>
      </div>
      {showFollowUp ? (
        <button
          className="text-xs text-primary hover:underline"
          data-testid={`button-follow-up-${company.id}`}
        >
          Follow up
        </button>
      ) : (
        <span className="text-xs text-muted-foreground">{timeAgo}</span>
      )}
    </div>
  );
}
