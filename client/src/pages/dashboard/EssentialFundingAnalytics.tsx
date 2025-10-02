import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Activity,
  PieChart,
  Users,
  DollarSign,
  Calendar,
  Target,
  AlertCircle,
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';

interface FundedCompany {
  id: string;
  source: string;
  company_name: string;
  domain: string | null;
  funding_date: string | null;
  funding_stage: string | null;
  funding_amount: number | null;
  investors: string[] | null;
  contacts: any;
  industry: string | null;
  status: string;
  social_media: string[] | null;
  created_at: string;
}

export default function EssentialFundingAnalytics() {
  const [timeRange, setTimeRange] = useState<'30' | '90' | '180' | 'all'>('90');

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funded_companies_production')
        .select('*')
        .order('funding_date', { ascending: false });

      if (error) throw error;
      return data as FundedCompany[];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    if (timeRange === 'all') return companies;

    const daysAgo = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    return companies.filter((c) => {
      if (!c.funding_date) return false;
      return new Date(c.funding_date) >= cutoffDate;
    });
  }, [companies, timeRange]);

  const analytics = useMemo(() => {
    if (!filteredCompanies.length) {
      return {
        totalCompanies: 0,
        totalFunding: 0,
        avgFunding: 0,
        successRate: 0,
        stageDistribution: {},
        industryDistribution: {},
        sourceDistribution: {},
        statusDistribution: {},
        monthlyTrends: [],
        topInvestors: [],
      };
    }

    const totalFunding = filteredCompanies.reduce(
      (sum, c) => sum + (c.funding_amount || 0),
      0
    );

    // Stage distribution
    const stageDistribution = filteredCompanies.reduce((acc, c) => {
      const stage = c.funding_stage || 'Unknown';
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Industry distribution
    const industryDistribution = filteredCompanies.reduce((acc, c) => {
      const industry = c.industry || 'Unknown';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Source distribution
    const sourceDistribution = filteredCompanies.reduce((acc, c) => {
      acc[c.source] = (acc[c.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Status distribution
    const statusDistribution = filteredCompanies.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Monthly trends
    const monthlyData: Record<string, { count: number; funding: number }> = {};
    filteredCompanies.forEach((c) => {
      if (c.funding_date) {
        const monthKey = format(parseISO(c.funding_date), 'MMM yyyy');
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { count: 0, funding: 0 };
        }
        monthlyData[monthKey].count += 1;
        monthlyData[monthKey].funding += c.funding_amount || 0;
      }
    });

    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .slice(-6)
      .reverse();

    // Top investors
    const investorCounts: Record<string, number> = {};
    filteredCompanies.forEach((c) => {
      if (c.investors) {
        c.investors.forEach((investor) => {
          investorCounts[investor] = (investorCounts[investor] || 0) + 1;
        });
      }
    });

    const topInvestors = Object.entries(investorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Success rate (companies with funding vs total)
    const companiesWithFunding = filteredCompanies.filter(
      (c) => c.funding_amount && c.funding_amount > 0
    ).length;
    const successRate = (companiesWithFunding / filteredCompanies.length) * 100;

    return {
      totalCompanies: filteredCompanies.length,
      totalFunding,
      avgFunding: totalFunding / filteredCompanies.length,
      successRate,
      stageDistribution,
      industryDistribution,
      sourceDistribution,
      statusDistribution,
      monthlyTrends,
      topInvestors,
    };
  }, [filteredCompanies]);

  const formatAmount = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(2)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  if (error) {
    return (
      <div className="p-8">
        <Card className="p-6 border-destructive">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Database Connection Error</h3>
              <p className="text-sm mt-1">
                Unable to fetch analytics data. Please check your Supabase configuration.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            Deep insights into funding trends, investor activity, and market patterns
          </p>
        </div>
        <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
          <SelectTrigger className="w-[180px]" data-testid="select-timerange">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Last 30 Days</SelectItem>
            <SelectItem value="90">Last 90 Days</SelectItem>
            <SelectItem value="180">Last 180 Days</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6" data-testid="card-metric-0">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" data-testid="text-metric-value-0">
            {analytics.totalCompanies}
          </div>
          <div className="text-sm text-muted-foreground">Total Companies</div>
        </Card>

        <Card className="p-6" data-testid="card-metric-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-chart-3" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" data-testid="text-metric-value-1">
            {formatAmount(analytics.totalFunding)}
          </div>
          <div className="text-sm text-muted-foreground">Total Funding</div>
        </Card>

        <Card className="p-6" data-testid="card-metric-2">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-chart-1" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" data-testid="text-metric-value-2">
            {formatAmount(analytics.avgFunding)}
          </div>
          <div className="text-sm text-muted-foreground">Avg Round Size</div>
        </Card>

        <Card className="p-6" data-testid="card-metric-3">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-chart-4" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1" data-testid="text-metric-value-3">
            {analytics.successRate.toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Funding Success Rate</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trends */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Funding Trends
          </h2>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((item, index) => (
              <div key={index} className="space-y-2" data-testid={`chart-item-${index}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.count} deals</span>
                    <span className="font-bold text-chart-3">
                      {formatAmount(item.funding)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${(item.count / Math.max(...analytics.monthlyTrends.map((t) => t.count))) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-chart-3 h-full"
                      style={{
                        width: `${(item.funding / Math.max(...analytics.monthlyTrends.map((t) => t.funding))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Funding Stage Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Funding Stage Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(analytics.stageDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([stage, count], index) => (
                <div
                  key={stage}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                  data-testid={`stage-${index}`}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{stage}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {((count / analytics.totalCompanies) * 100).toFixed(1)}%
                    </span>
                    <span className="font-bold">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Industry Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Industry Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(analytics.industryDistribution)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([industry, count], index) => {
                const percentage = (count / analytics.totalCompanies) * 100;
                return (
                  <div key={industry} className="space-y-2" data-testid={`industry-${index}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{industry}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                        <span className="font-bold">{count}</span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-chart-1 h-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>

        {/* Top Investors */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Most Active Investors
          </h2>
          <div className="space-y-3">
            {analytics.topInvestors.map((investor, index) => (
              <div
                key={investor.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover-elevate transition-all"
                data-testid={`investor-${index}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">#{index + 1}</span>
                  </div>
                  <span className="font-medium">{investor.name}</span>
                </div>
                <Badge variant="secondary">{investor.count} investments</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Data Source Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
          <div className="space-y-3">
            {Object.entries(analytics.sourceDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([source, count], index) => (
                <div
                  key={source}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                  data-testid={`source-${index}`}
                >
                  <span className="font-medium">{source}</span>
                  <Badge variant="outline">{count} companies</Badge>
                </div>
              ))}
          </div>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Status Overview</h2>
          <div className="space-y-3">
            {Object.entries(analytics.statusDistribution)
              .sort((a, b) => b[1] - a[1])
              .map(([status, count], index) => {
                const percentage = (count / analytics.totalCompanies) * 100;
                return (
                  <div key={status} className="space-y-2" data-testid={`status-${index}`}>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={status === 'new' ? 'destructive' : 'secondary'}
                        className="uppercase"
                      >
                        {status}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </span>
                        <span className="font-bold">{count}</span>
                      </div>
                    </div>
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${status === 'new' ? 'bg-destructive' : 'bg-chart-2'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </Card>
      </div>
    </div>
  );
}
