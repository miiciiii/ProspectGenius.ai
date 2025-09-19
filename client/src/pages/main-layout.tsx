import React, { ReactNode } from "react";
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Footer } from "@/components/footer/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Navbar - Fixed */}
      <Navbar />

      {/* Main content with fixed navbar and sidebar */}
      <div className="flex flex-1 pt-16">
        <Sidebar />
        {/* Main content area with left margin for fixed sidebar and top padding for fixed navbar */}
        <main className="flex-1 lg:ml-64 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Footer with left margin for fixed sidebar */}
      <Footer variant="dashboard" />
    </div>
  );
}
