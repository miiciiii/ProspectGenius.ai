import { Building, TrendingUp, DollarSign, Mail } from "lucide-react";
import { useDashboardStats } from "@/hooks/use-companies";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsOverview() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="ml-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <p className="text-destructive">Failed to load dashboard statistics</p>
        </div>
      </div>
    );
  }

  // Stat cards
  const statCards = [
    {
      title: "Total Companies",
      value: (stats.total_companies ?? 0).toLocaleString(),
      icon: Building,
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      testId: "stat-total-companies",
    },
    {
      title: "This Week",
      value: (stats.this_week ?? 0).toLocaleString(),
      icon: TrendingUp,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      testId: "stat-this-week",
    },
    {
      title: "Total Funding",
      value: stats.total_funding ?? "$0",
      icon: DollarSign,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      testId: "stat-total-funding",
    },
    {
      title: "Contacted",
      value: (stats.contacted ?? 0).toLocaleString(),
      icon: Mail,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      testId: "stat-contacted",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-card rounded-lg p-6 border border-border shadow-sm"
            data-testid={stat.testId}
          >
            <div className="flex items-center">
              <div className={`p-2 ${stat.iconBg} rounded-lg`}>
                <Icon className={`hero-icon-lg ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
