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
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PG</span>
              </div>
              <span className="font-semibold text-lg text-foreground">
                ProspectGenius | AgentGenius.ai
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={link.testId}
                  className={`${
                    isActive(link.path)
                      ? "text-primary font-medium border-b-2 border-primary pb-0.5"
                      : "text-muted-foreground hover:text-foreground transition-colors"
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
              className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary transition-colors"
              data-testid="button-search"
            >
              <Search className="hero-icon" />
            </button>

            {/* Quick Add */}
            <button
              className="flex items-center space-x-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              data-testid="button-quick-add"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>

            {/* Notifications */}
            <button
              className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="hero-icon" />
            </button>

            {/* User menu */}
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-secondary/50 p-2 rounded-md transition-all duration-200 group">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-200">
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
