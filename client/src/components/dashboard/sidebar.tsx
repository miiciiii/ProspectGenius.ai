import {
  Database,
  Settings,
  Users,
  CreditCard,
  Zap,
  BookOpen,
  BarChart3,
  Building2,
  CrownIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { useAuth, useHasRole } from "@/context/auth-context";
import { useSubscription } from "@/context/subscription-context";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ className, isMobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { canAccessPremiumFeatures, subscription } = useSubscription();
  const isAdmin = useHasRole("admin");

  const isActive = (path: string) => location.pathname === path;

  // Filter sidebar links based on user role and subscription
  const getSidebarLinks = () => {
    const links = [
      {
        section: "Data",
        items: [
          {
            path: "/companies",
            label: "Companies",
            icon: Building2,
            premium: false, // Basic access for all users
          },
          {
            path: "/administration/waiting-list-data",
            label: "Waiting List",
            icon: Database,
            premium: true, // Premium feature
          },
        ],
      },
      {
        section: "Analytics",
        items: [
          {
            path: "/analytics",
            label: "Advanced Analytics",
            icon: BarChart3,
            premium: true,
          },
        ],
      },
      {
        section: "Workflows",
        items: [
          {
            path: "/workflows/automations",
            label: "Automations",
            icon: Zap,
            premium: true,
          },
          {
            path: "/workflows/playbooks",
            label: "Playbooks",
            icon: BookOpen,
            premium: true,
          },
        ],
      },
      {
        section: "Reports",
        items: [
          {
            path: "/reports/company-reports",
            label: "Company Reports",
            icon: Database,
            premium: true,
          },
        ],
      },
      {
        section: "Integrations",
        items: [
          {
            path: "/integrations/api-keys-data-sources",
            label: "API Keys & Data Sources",
            icon: Settings,
            premium: true,
          },
        ],
      },
      {
        section: "Administration",
        items: [
          {
            path: "/administration/team-management",
            label: "Team Management",
            icon: Users,
            premium: true,
            adminOnly: true,
          },
          {
            path: "/administration/billing",
            label: "Billing",
            icon: CreditCard,
            premium: false,
          },
          {
            path: "/administration/settings",
            label: "Settings",
            icon: Settings,
            premium: false,
          },
        ],
      },
    ];

    return links.filter((section) => {
      if (section.section === "Administration" && !isAdmin) {
        return false;
      }
      return true;
    });
  };

  const sidebarLinks = getSidebarLinks();

  const renderUpgradeBanner = () => {
    if (canAccessPremiumFeatures || isAdmin) return null;

    return (
      <div className="mx-3 mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-2">
          <CrownIcon className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-900">
            Upgrade to Pro
          </span>
        </div>
        <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
          Unlock advanced features and unlimited access
        </p>
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs"
          asChild
        >
          <Link to="/pricing">Upgrade Now</Link>
        </Button>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 pt-16 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:flex lg:flex-col",
          className
        )}
      >
        <div className="flex flex-col h-full bg-sidebar/80 backdrop-blur supports-[backdrop-filter]:bg-sidebar/70 border-r border-sidebar-border">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pt-5 px-3">
            <div className="space-y-6">
              {/* Upgrade banner for non-premium users */}
              {renderUpgradeBanner()}

              {sidebarLinks.map((section) => (
                <div key={section.section}>
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {section.section}
                  </h3>
                  <nav className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const hasAccess = !item.premium || canAccessPremiumFeatures;
                      const needsUpgrade = item.premium && !canAccessPremiumFeatures;

                      return (
                        <Link
                          key={item.path}
                          to={hasAccess ? item.path : "/pricing"}
                          className={cn(
                            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all",
                            isActive(item.path)
                              ? "bg-primary/10 text-primary shadow-xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary hover:-translate-y-0.5",
                            needsUpgrade && "opacity-70"
                          )}
                        >
                          <Icon className="hero-icon mr-3" />
                          {item.label}
                          {needsUpgrade && (
                            <div className="ml-auto flex items-center gap-1">
                              <CrownIcon className="w-3 h-3 text-amber-600" />
                              <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                                Pro
                              </span>
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed subscription status at bottom */}
          {user && (
            <div className="flex-shrink-0 px-6 py-4 border-t border-border bg-card">
              <div className="text-xs text-muted-foreground mb-1">
                Signed in as
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">
                    {(user.full_name || user.email)
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {user.full_name || user.email}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {user.role} Account
                  </div>
                </div>
              </div>

              {/* Subscription status */}
              <div className="text-xs">
                <span className="text-muted-foreground">Plan: </span>
                <span
                  className={cn(
                    "font-medium",
                    isAdmin
                      ? "text-purple-600"
                      : canAccessPremiumFeatures
                      ? "text-green-600"
                      : "text-amber-600"
                  )}
                >
                  {isAdmin ? "Admin Access" : subscription?.plan?.name || "Free"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}