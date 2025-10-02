import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Activity, TrendingUp, DollarSign, Target, Calendar, BarChart3, PieChart, Users } from "lucide-react";

export default function AdvancedAnalytics() {
  const [query, setQuery] = useState("");
  const [timeRange, setTimeRange] = useState<'30' | '90' | '180' | 'all'>('90');

  // Dummy metrics for design placeholders
  const analytics = {
    totalQueries: 1250,
    avgResponseTime: 1.2,
    activeUsers: 320,
    successRate: 92.5,
    monthlyTrends: [
      { month: "Apr 2025", queries: 200, resolved: 180 },
      { month: "May 2025", queries: 250, resolved: 230 },
      { month: "Jun 2025", queries: 280, resolved: 260 },
      { month: "Jul 2025", queries: 300, resolved: 280 },
      { month: "Aug 2025", queries: 220, resolved: 200 },
      { month: "Sep 2025", queries: 200, resolved: 180 },
    ],
    topQueries: [
      { query: "Sales by region", count: 120 },
      { query: "Top investors", count: 100 },
      { query: "Funding trends", count: 95 },
    ],
    stageDistribution: { Early: 40, Growth: 30, Late: 20, Unknown: 10 },
    industryDistribution: { SaaS: 50, FinTech: 30, HealthTech: 25, Other: 15 },
    topUsers: [
      { name: "Alice", count: 50 },
      { name: "Bob", count: 45 },
      { name: "Charlie", count: 40 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wide text-gradient bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500">
          Advanced Analytics AI
        </h1>
        <p className="mt-2 text-gray-400 text-lg">
          Ask questions in plain English and get intelligent insights instantly
        </p>
      </header>

      {/* NLP Query Input */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 flex flex-col md:flex-row gap-4 items-center"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Show me last quarter’s sales by region"
          className="flex-1 p-4 text-gray-900 rounded-lg shadow-lg"
        />
        <Button className="px-6 py-4 bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-pink-500">
          Analyze
        </Button>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{analytics.totalQueries}</div>
          <div className="text-sm text-muted-foreground">Total Queries</div>
        </Card>

        <Card className="p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-chart-3" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{analytics.avgResponseTime}s</div>
          <div className="text-sm text-muted-foreground">Avg Response Time</div>
        </Card>

        <Card className="p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-chart-1" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{analytics.activeUsers}</div>
          <div className="text-sm text-muted-foreground">Active Users</div>
        </Card>

        <Card className="p-6 hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-chart-4" />
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{analytics.successRate}%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="mb-8 w-[180px]">
        <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
          <SelectTrigger>
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

      {/* Monthly Trends & Stage Distribution */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Monthly Query Trends
          </h2>
          <div className="space-y-4">
            {analytics.monthlyTrends.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{item.queries} queries</span>
                    <span className="font-bold text-chart-3">{item.resolved} resolved</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full"
                      style={{
                        width: `${(item.queries / Math.max(...analytics.monthlyTrends.map((t) => t.queries))) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-chart-3 h-full"
                      style={{
                        width: `${(item.resolved / Math.max(...analytics.monthlyTrends.map((t) => t.resolved))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Query Stage Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(analytics.stageDistribution).map(([stage, count], index) => {
              const percentage = (count / Object.values(analytics.stageDistribution).reduce((a, b) => a + b)) * 100;
              return (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <Badge variant="secondary">{stage}</Badge>
                  <span className="font-bold">{count}</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Industry Breakdown & Top Queries */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Industry Breakdown
          </h2>
          <div className="space-y-3">
            {Object.entries(analytics.industryDistribution).map(([industry, count], index) => {
              const percentage = (count / Object.values(analytics.industryDistribution).reduce((a, b) => a + b)) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{industry}</span>
                    <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-chart-1 h-full" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Queries
          </h2>
          <div className="space-y-3">
            {analytics.topQueries.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover-elevate transition-all">
                <span className="font-medium">{item.query}</span>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-gray-500 text-sm text-center">
        Advanced Analytics AI • Premium Design Mockup
      </footer>
    </div>
  );
}
