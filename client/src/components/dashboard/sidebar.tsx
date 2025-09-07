import { LayoutDashboard, Building, Database, Globe, Download, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("hidden lg:flex lg:w-64 lg:flex-col", className)}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto bg-card border-r border-border">
        <div className="flex-1 px-3 space-y-1">
          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Overview
            </h3>
            <nav className="space-y-1">
              <a
                href="#"
                className="bg-primary text-primary-foreground group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-dashboard"
              >
                <LayoutDashboard className="hero-icon mr-3" />
                Dashboard
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-companies"
              >
                <Building className="hero-icon mr-3" />
                All Companies
              </a>
            </nav>
          </div>

          <div className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Data Sources
            </h3>
            <nav className="space-y-1">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-apis"
              >
                <Database className="hero-icon mr-3" />
                APIs
                <span className="ml-auto bg-accent text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                  4
                </span>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-directories"
              >
                <Globe className="hero-icon mr-3" />
                Public Directories
                <span className="ml-auto bg-secondary text-secondary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                  2
                </span>
              </a>
            </nav>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Tools
            </h3>
            <nav className="space-y-1">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-export"
              >
                <Download className="hero-icon mr-3" />
                Export Data
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-filters"
              >
                <Filter className="hero-icon mr-3" />
                Filters
              </a>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
