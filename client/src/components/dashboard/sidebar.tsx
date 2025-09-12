import { 
  Database, 
  Settings, 
  Users, 
  CreditCard, 
  Zap,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("hidden lg:flex lg:w-64 lg:flex-col", className)}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto bg-card border-r border-border">
        <div className="flex-1 px-3 space-y-6">

          {/* Integrations */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Integrations
            </h3>
            <nav className="space-y-1">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-apis"
              >
                <Database className="hero-icon mr-3" />
                API Keys & Data Sources
              </a>
            </nav>
          </div>

          {/* Workflows & Automations */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Workflows
            </h3>
            <nav className="space-y-1">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <Zap className="hero-icon mr-3" />
                Automations
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
              >
                <BookOpen className="hero-icon mr-3" />
                Playbooks
              </a>
            </nav>
          </div>

          {/* Administration */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Administration
            </h3>
            <nav className="space-y-1">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-settings"
              >
                <Settings className="hero-icon mr-3" />
                Settings
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md"
                data-testid="sidebar-team"
              >
                <Users className="hero-icon mr-3" />
                Team Management
              </a>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
