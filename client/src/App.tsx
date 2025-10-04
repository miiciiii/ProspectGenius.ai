import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "@/pages/Landing";
import SignIn from "@/pages/authentication/SignIn";
import SignUp from "@/pages/authentication/SignUp";
import DashboardLayout from "@/layouts/DashboardLayout";

import CompanyReports from "@/pages/dashboard/CompanyReports";
import CompanyArchives from "@/pages/dashboard/CompanyArchives";
import AdvancedAnalytics from "@/pages/dashboard/AdvancedAnalytics";
import EssentialFundingAnalytics from "@/pages/dashboard/EssentialFundingAnalytics";
import Settings from "@/pages/dashboard/Settings";
import Billing from "@/pages/payment/Billing";
import TeamManagement from "@/pages/dashboard/TeamManagement";
import WaitingListTable from "@/pages/dashboard/WaitingList";
import ProtectedRoute from "@/components/auth/protectedRoute";

import StripeSuccess from "@/pages/payment/StripeSuccess";
import StripeCancel from "@/pages/payment/StripeCancel";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />

      {/* Dashboard routes */}
      <Route path="/dashboard/reports/waiting/list">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["admin"]} allowedPlans={["professional"]}>
            <WaitingListTable />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/reports/company">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["guest", "subscriber", "admin"]}
            allowedPlans={["free", "starter", "professional"]}
          >
            <CompanyReports />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/reports/company/archives">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["guest", "subscriber", "admin"]}
            allowedPlans={["free", "starter", "professional"]}
          >
            <CompanyArchives />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/analytics/advanced">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["subscriber", "admin"]}
            allowedPlans={["starter", "professional"]}
          >
            <AdvancedAnalytics />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/analytics/essential">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["guest", "subscriber", "admin"]}
            allowedPlans={["free", "starter", "professional"]}
          >
            <EssentialFundingAnalytics />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/settings">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["guest", "subscriber", "admin"]}
            allowedPlans={["free", "starter", "professional"]}
          >
            <Settings />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/billing">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["subscriber", "admin"]}
            allowedPlans={["free", "starter", "professional"]}
          >
            <Billing />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/billing/success">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["subscriber", "admin"]}
            allowedPlans={["free", "starter", "professional"]}
          >
            <StripeSuccess />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/billing/cancel">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["subscriber", "admin"]}
            allowedPlans={["free", "starter", "professional"]}
          >
            <StripeCancel />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/team">
        <DashboardLayout>
          <ProtectedRoute
            allowedRoles={["subscriber", "admin"]}
            allowedPlans={["professional"]}
          >
            <TeamManagement />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
