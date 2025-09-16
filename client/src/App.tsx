import React from "react";
import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Dashboard from "@/pages/dashboard";
import Companies from "@/pages/companies";
import Analytics from "@/pages/analytics";
import Sources from "@/pages/sources";
import Settings from "@/pages/administration/settings";
import TeamManagement from "@/pages/administration/team-management";
import ApiKeysDataSources from "@/pages/integrations/api-keys-data-sources";
import Playbooks from "@/pages/workflows/playbooks";
import Automations from "@/pages/workflows/automations";



import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/sources" element={<Sources />} />

          <Route path="/integrations" element={<ApiKeysDataSources />} />


          <Route path="/playbooks" element={<Playbooks />} />
          <Route path="/automations" element={<Automations />} />


          <Route path="/settings" element={<Settings />} />
          <Route path="/team" element={<TeamManagement />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
