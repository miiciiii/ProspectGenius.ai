import {
  Database,
  Settings,
  Users,
  CreditCard,
  Zap,
  BookOpen,
  BarChart3,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useHasRole } from "@/context/auth-context";
import { GuestUpgradeBanner } from "@/components/auth/protected-route";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = useHasRole("admin");
  const isSubscriberOrAbove = useHasRole(["admin", "subscriber"]);

  const isActive = (path: string) => location.pathname === path;

  // Filter sidebar links based on user role
  const getSidebarLinks = () => {
    const links = [
      {
        section: "Integrations",
        items: [
          {
            path: "/integrations",
            label: "API Keys & Data Sources",
            icon: Database,
            roles: ["admin", "subscriber"], // Only admin and subscriber can see this
          },
        ],
      },
      {
        section: "Workflows",
        items: [
          {
            path: "/automations",
            label: "Automations",
            icon: Zap,
            roles: ["admin", "subscriber"],
          },
          {
            path: "/playbooks",
            label: "Playbooks",
            icon: BookOpen,
            roles: ["admin", "subscriber"],
          },
        ],
      },
      {
        section: "Reports",
        items: [
          {
            path: "/analytics",
            label: "Advanced Analytics",
            icon: BarChart3,
            roles: ["admin", "subscriber"],
          },
          {
            path: "/companies",
            label: "Company Reports",
            icon: Building2,
            roles: ["admin", "subscriber"],
          },
        ],
      },
      {
        section: "Administration",
        items: [
          {
            path: "/settings",
            label: "Settings",
            icon: Settings,
            roles: ["admin", "subscriber", "guest"], // All roles can access settings
          },
          {
            path: "/team",
            label: "User Management",
            icon: Users,
            roles: ["admin"], // Only admin can manage users
          },
          {
            path: "/billing",
            label: "Billing & Plans",
            icon: CreditCard,
            roles: ["admin"], // Only admin can see billing
          },
        ],
      },
    ];

    // Filter sections and items based on user role
    return links
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) => !user || item.roles.includes(user.role)
        ),
      }))
      .filter((section) => section.items.length > 0);
  };

  const sidebarLinks = getSidebarLinks();

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16",
        className
      )}>
      <div className="flex flex-col h-full bg-card border-r border-border">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pt-5 px-3">
          <div className="space-y-6">
            {/* Guest upgrade banner */}
            <div className="px-3">
              <GuestUpgradeBanner />
            </div>

            {sidebarLinks.map((section) => (
              <div key={section.section}>
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const hasAccess = !user || item.roles.includes(user.role);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                          isActive(item.path)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary",
                          !hasAccess && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={(e) => {
                          if (!hasAccess) {
                            e.preventDefault();
                          }
                        }}>
                        <Icon className="hero-icon mr-3" />
                        {item.label}
                        {!hasAccess && (
                          <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
                            Upgrade
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed role indicator at bottom */}
        {user && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-card">
            <div className="text-xs text-muted-foreground mb-1">
              Signed in as
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {user.role} Account
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
