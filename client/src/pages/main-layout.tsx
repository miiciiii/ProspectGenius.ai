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
      {/* Top Navbar */}
      <Navbar />

      {/* Main content + sidebar */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Footer always at the bottom */}
      <Footer />
    </div>
  );
}
