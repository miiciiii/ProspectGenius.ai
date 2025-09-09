import { useCompanies } from "@/hooks/use-companies";
import { subDays, isAfter } from "date-fns";
import type { FundedCompany, CompanyFilters } from "@shared/schema";

export function HighlightsSection() {
  // Instead of fetching ALL companies, fetch targeted subsets
  const { data: newThisWeek = [] } = useCompanies({ date_range: "week" });
  const { data: followUpRequired = [] } = useCompanies({ status: "follow-up" });

  // Mock data updates - keep for now
  const dataUpdates = [
    { source: "Y Combinator", description: "45 new companies added", timestamp: "1hr ago" },
    { source: "Datagma API", description: "Contact data enriched", timestamp: "3hrs ago" },
    { source: "CzechStartups", description: "8 new entries synchronized", timestamp: "6hrs ago" },
  ];

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
        
        {/* New This Week & Follow Up sections */}
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

        {/* Data Updates section */}
        <div
          className="bg-card rounded-lg p-6 border border-border shadow-sm"
          data-testid="highlights-data-updates"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h3 className="font-medium text-foreground">Recent Updates</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {dataUpdates.length}
            </span>
          </div>
          <div className="space-y-3">
            {dataUpdates.map((update, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
                data-testid={`update-${index}`}
              >
                <div>
                  <p className="font-medium text-sm text-foreground">{update.source}</p>
                  <p className="text-xs text-muted-foreground">{update.description}</p>
                </div>
                <span className="text-xs text-muted-foreground">{update.timestamp}</span>
              </div>
            ))}
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
  const daysAgo = Math.floor((Date.now() - new Date(company.funding_date).getTime()) / (1000 * 60 * 60 * 24));
  const timeAgo =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;

  return (
    <div
      className="flex items-center justify-between p-3 bg-secondary/50 rounded-md"
      data-testid={`company-highlight-${company.id}`}
    >
      <div>
        <p className="font-medium text-sm text-foreground">{company.company_name}</p>
        <p className="text-xs text-muted-foreground">
          {showFollowUp
            ? `Contacted ${timeAgo}`
            : `${company.funding_stage} • ${
                company.funding_amount
                  ? `$${(company.funding_amount / 1000000).toFixed(1)}M`
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
