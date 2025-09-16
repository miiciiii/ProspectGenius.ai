import MainLayout from "@/pages/main-layout";
import { StatsOverview } from "@/components/dashboard/stats-overview";

export default function Analytics() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Insights and performance metrics for your companies and pipeline
          </p>
        </div>

        {/* Stats / Charts */}
        <StatsOverview />
      </div>
    </MainLayout>
  );
}
