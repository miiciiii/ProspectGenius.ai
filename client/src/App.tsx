import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
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
import Companies from "@/pages/reports/company-reports";
import Analytics from "@/pages/analytics";
import Sources from "@/pages/sources";
import Settings from "@/pages/administration/settings";
import TeamManagement from "@/pages/administration/team-management";
import Billing from "@/pages/administration/billing";
import ApiKeysDataSources from "@/pages/integrations/api-keys-data-sources";
import Playbooks from "@/pages/workflows/playbooks";
import Automations from "@/pages/workflows/automations";
import NotFound from "@/pages/not-found";


// Landing page
import LandingPage from "@/pages/landing/landing";
import WaitingList from "@/pages/waiting-list";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Routes>
            {/* Public auth routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* Public landing page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/waiting-list" element={<WaitingList />} />

            {/* Protected dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Subscriber and Admin routes */}
            <Route
              path="/companies"
              element={
                <SubscriberRoute>
                  <Companies />
                </SubscriberRoute>
              }
            />
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

            {/* Settings accessible to all authenticated users */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
