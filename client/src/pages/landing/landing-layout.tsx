import React, { ReactNode, useEffect, useRef } from "react";
import LandingNavbar from "@/components/landing/navbar";
import { Footer } from "@/components/footer/footer";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const setHeaderHeightVar = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      document.documentElement.style.setProperty(
        "--landing-header-height",
        `${headerHeight}px`
      );
    };
    setHeaderHeightVar();
    window.addEventListener("resize", setHeaderHeightVar);
    return () => window.removeEventListener("resize", setHeaderHeightVar);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Sticky Navbar */}
      <div ref={headerRef} className="sticky top-0 z-50">
        <LandingNavbar />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      {/* Footer */}
      <Footer variant="landing" slim />
    </div>
  );
}
