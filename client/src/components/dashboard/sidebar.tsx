import { Database, Settings, Users, CreditCard, Zap, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const sidebarLinks = [
    {
      section: "Integrations",
      items: [
        { path: "/integrations", label: "API Keys & Data Sources", icon: Database },
      ],
    },
    {
      section: "Workflows",
      items: [
        { path: "/automations", label: "Automations", icon: Zap },
        { path: "/playbooks", label: "Playbooks", icon: BookOpen },
      ],
    },
    {
      section: "Administration",
      items: [
        { path: "/settings", label: "Settings", icon: Settings },
        { path: "/team", label: "Team Management", icon: Users },
      ],
    },
  ];

  return (
    <aside className={cn("hidden lg:flex lg:w-64 lg:flex-col", className)}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto bg-sidebar border-r border-sidebar-border">
        <div className="flex-1 px-3 space-y-6">
          {sidebarLinks.map((section) => (
            <div key={section.section}>
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.section}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <Icon className="hero-icon mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
