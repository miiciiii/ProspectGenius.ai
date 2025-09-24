import { ReactNode } from "react";
import LandingNavbar from "@/components/landing/navbar";
import { Footer } from "@/components/footer/footer";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header / Navbar */}
      <LandingNavbar />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer variant="landing" />
    </div>
  );
}
