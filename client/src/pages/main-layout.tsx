import React, { ReactNode, useState } from "react";
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/footer/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar - Fixed */}
      <Navbar onMobileSidebarToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

      {/* Main content with fixed navbar and sidebar */}
      <div className="flex flex-1 pt-16">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
        />
        {/* Main content area with left margin for fixed sidebar and top padding for fixed navbar */}
        <main className="flex-1 lg:ml-64 overflow-y-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>

      {/* Footer with left margin for fixed sidebar */}
      <Footer variant="dashboard" />
    </div>
  );
}
