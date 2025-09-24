import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { SubscriptionProvider } from "@/context/subscription-context";
import {
  ProtectedRoute,
  AdminRoute,
  SubscriberRoute,
} from "@/components/auth/protected-route";

// Auth pages
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";
import ForgotPassword from "@/pages/auth/forgot-password";
import ResetPassword from "@/pages/auth/reset-password";

// Dashboard pages
import Dashboard from "@/pages/dashboard";
import Companies from "@/pages/companies";
import Analytics from "@/pages/analytics";
import Sources from "@/pages/sources";
import Settings from "@/pages/administration/settings";
import TeamManagement from "@/pages/administration/team-management";
import Billing from "@/pages/administration/billing";
import ApiKeysDataSources from "@/pages/integrations/api-keys-data-sources";
import Playbooks from "@/pages/workflows/playbooks";
import Automations from "@/pages/workflows/automations";
import Pricing from "@/pages/pricing";
import SubscriptionManagement from "@/pages/subscription";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              {/* Public auth routes */}
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route
                path="/auth/forgot-password"
                element={<ForgotPassword />}
              />
              <Route path="/auth/reset-password" element={<ResetPassword />} />

              {/* Public pricing page */}
              <Route path="/pricing" element={<Pricing />} />

              {/* Protected dashboard routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Basic access routes - all authenticated users can view */}
              <Route
                path="/companies"
                element={
                  <ProtectedRoute>
                    <Companies />
                  </ProtectedRoute>
                }
              />

              {/* Subscriber and Admin routes */}
              <Route
                path="/analytics"
                element={
                  <SubscriberRoute>
                    <Analytics />
                  </SubscriberRoute>
                }
              />
              <Route
                path="/sources"
                element={
                  <SubscriberRoute>
                    <Sources />
                  </SubscriberRoute>
                }
              />
              <Route
                path="/integrations"
                element={
                  <SubscriberRoute>
                    <ApiKeysDataSources />
                  </SubscriberRoute>
                }
              />
              <Route
                path="/playbooks"
                element={
                  <SubscriberRoute>
                    <Playbooks />
                  </SubscriberRoute>
                }
              />
              <Route
                path="/automations"
                element={
                  <SubscriberRoute>
                    <Automations />
                  </SubscriberRoute>
                }
              />

              {/* Settings and subscription management accessible to all authenticated users */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscription"
                element={
                  <ProtectedRoute>
                    <SubscriptionManagement />
                  </ProtectedRoute>
                }
              />

              {/* Admin-only routes */}
              <Route
                path="/team"
                element={
                  <AdminRoute>
                    <TeamManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <AdminRoute>
                    <Billing />
                  </AdminRoute>
                }
              />

              {/* 404 fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
