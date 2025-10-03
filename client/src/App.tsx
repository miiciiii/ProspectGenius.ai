import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Landing from '@/pages/Landing';
import SignIn from '@/pages/authentication/SignIn';
import SignUp from '@/pages/authentication/SignUp';
import DashboardLayout from '@/layouts/DashboardLayout';
import CompanyReports from '@/pages/dashboard/CompanyReports';
import CompanyArchives from './pages/dashboard/CompanyArchives';
import AdvancedAnalytics from '@/pages/dashboard/AdvancedAnalytics';
import EssentialFundingAnalytics from '@/pages/dashboard/EssentialFundingAnalytics';
import Settings from '@/pages/dashboard/Settings';
import Billing from '@/pages/payment/Billing';
import TeamManagement from '@/pages/dashboard/TeamManagement';
import NotFound from '@/pages/not-found';
import WaitingListTable from '@/pages/dashboard/WaitingList';
import ProtectedRoute from '@/components/auth/protectedRoute';

import StripeSuccess from './pages/payment/StripeSuccess';
import StripeCancel from './pages/payment/StripeCancel';

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />

      {/* Shared routes (everyone can access) */}
      <Route path="/dashboard/reports/company">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <CompanyReports />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/reports/company/archives">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <CompanyArchives />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/analytics/advanced">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <AdvancedAnalytics />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/analytics/essential">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <EssentialFundingAnalytics />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/settings">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <Settings />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/billing">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <Billing />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>
  
      <Route path="/dashboard/admin/billing/success">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <StripeSuccess />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/billing/cancel">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <StripeCancel />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      <Route path="/dashboard/admin/team">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["guest", "subscriber", "admin"]}>
            <TeamManagement />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

      {/* Admin-only */}
      <Route path="/dashboard/reports/waiting/list">
        <DashboardLayout>
          <ProtectedRoute allowedRoles={["admin"]}>
            <WaitingListTable />
          </ProtectedRoute>
        </DashboardLayout>
      </Route>

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
