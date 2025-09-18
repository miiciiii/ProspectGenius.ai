import React from "react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-4 mt-auto lg:ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-sm text-muted-foreground space-y-2 md:space-y-0 md:flex-row md:justify-center md:space-x-8">
        {/* Privacy Policy link */}
        <a href="#" className="hover:text-foreground transition-colors">
          Privacy Policy
        </a>

        {/* Copyright in the center */}
        <p className="text-center">
          &copy; 2025 ProspectGenius | AgentGenius.ai. All rights reserved.
        </p>

        {/* Terms of Service link */}
        <a href="#" className="hover:text-foreground transition-colors">
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
