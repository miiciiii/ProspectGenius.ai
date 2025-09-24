import React from "react";
import { Link } from "react-router-dom";

const LandingNavbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
            <img
            src="/brand/wordmark.jpg"
            alt="ProspectGenius.ai"
            className="h-10 md:h-12 w-auto rounded-md shadow-xs ring-1 ring-transparent group-hover:ring-primary/30 transition-all"
            loading="eager"
            decoding="async"
            />
          <span className="sr-only">ProspectGenius.ai</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/#features" className="text-sm font-medium hover:text-primary">
            Features
          </Link>
          <Link to="/#pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
          <Link to="/#about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>

        {/* Call to action */}
        <div className="flex items-center gap-4">
          <Link
            to="/auth/login"
            className="text-sm font-medium hover:text-primary"
          >
            Sign in
          </Link>
          <Link
            to="/auth/register"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
