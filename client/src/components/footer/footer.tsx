import React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "dashboard" | "landing";
  slim?: boolean;
}

export function Footer({ variant = "dashboard", slim = false }: FooterProps) {
  return (
    <footer
      className={cn(
        "bg-card border-t border-border mt-auto",
        variant === "dashboard"
          ? "py-4 lg:ml-64"
          : slim
          ? "py-4"
          : "py-8"
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-sm text-muted-foreground",
          variant === "landing"
            ? "space-y-2 md:space-y-0 md:flex-row md:justify-center md:space-x-6"
            : "space-y-2 md:space-y-0 md:flex-row md:justify-center md:space-x-8"
        )}
      >
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy Policy
        </a>

        <p className="text-center text-xs sm:text-sm">
          &copy; 2025 ProspectGenius | AgentGenius.ai. All rights reserved.
        </p>

        <a href="#" className="hover:text-foreground transition-colors">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
