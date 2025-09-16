import { Bell, Plus, Search } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", testId: "nav-dashboard" },
    { path: "/companies", label: "Companies", testId: "nav-companies" },
    { path: "/analytics", label: "Analytics", testId: "nav-analytics" },
    { path: "/sources", label: "Sources", testId: "nav-sources" },
  ];

  return (
    <nav className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">

            {/* Brand */}
            <a href="/" className="flex items-center gap-2 group">
              <img
                src="/brand/wordmark.jpg"
                alt="ProspectGenius.ai"
                className="h-8 w-auto rounded-md shadow-xs ring-1 ring-transparent group-hover:ring-primary/30 transition-all"
                loading="eager"
                decoding="async"
              />
              <span className="sr-only">ProspectGenius.ai</span>
            </a>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={link.testId}
                  className={`${
                    isActive(link.path)
                      ? "text-primary font-medium border-b-2 border-primary/70 pb-0.5"
                      : "text-muted-foreground hover:text-foreground hover:-translate-y-0.5 transition-all"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              data-testid="button-search"
            >
              <Search className="hero-icon" />
            </button>

            {/* Quick Add */}
            <button
              className="flex items-center space-x-1 btn-gradient px-3 py-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm font-medium shadow-sm active:translate-y-px"
              data-testid="button-quick-add"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>

            {/* Notifications */}
            <button
              className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="hero-icon" />
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-secondary/50 p-2 rounded-md transition-all duration-200 group">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-xs">
                <span className="text-accent-foreground text-sm font-medium">A</span>
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block group-hover:text-accent transition-colors duration-200">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
