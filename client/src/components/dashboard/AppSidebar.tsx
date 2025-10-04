import { useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FileText, BarChart3, Settings as SettingsIcon, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserAccess } from "@/hooks/useUserAccess";

const menuItems = [
  {
    title: "Reports",
    icon: FileText,
    items: [
      { title: "Company Reports", url: "/dashboard/reports/company", allowedRoles: ["guest", "subscriber", "admin"], allowedPlans: ["free", "starter", "professional"] },
      { title: "Company Archives", url: "/dashboard/reports/company/archives", allowedRoles: ["guest", "subscriber", "admin"], allowedPlans: ["starter", "professional"] },
      { title: "Waiting List Reports", url: "/dashboard/reports/waiting/list", allowedRoles: ["admin"], allowedPlans: ["professional"] },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { title: "Advanced Analytics", url: "/dashboard/analytics/advanced", allowedRoles: ["subscriber", "admin"], allowedPlans: ["starter", "professional"] },
      { title: "Essential Funding Analytics", url: "/dashboard/analytics/essential", allowedRoles: ["guest", "subscriber", "admin"], allowedPlans: ["free", "starter", "professional"] },
    ],
  },
  {
    title: "Administration",
    icon: SettingsIcon,
    items: [
      { title: "Settings", url: "/dashboard/admin/settings", allowedRoles: ["guest", "subscriber", "admin"], allowedPlans: ["free", "starter", "professional"] },
      { title: "Billing", url: "/dashboard/admin/billing", allowedRoles: ["subscriber", "admin"], allowedPlans: ["free", "starter", "professional"] },
      { title: "Team Management", url: "/dashboard/admin/team", allowedRoles: ["subscriber", "admin"], allowedPlans: ["professional"] },
    ],
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { user, signOut, loading: authLoading } = useAuth();
  const { role, plan, loading: accessLoading } = useUserAccess(user, authLoading);

  const handleSignOut = async () => {
    await signOut();
    setLocation("/signin");
  };

  const isLoading = authLoading || accessLoading;

  if (isLoading || !user) {
    return (
      <Sidebar>
        <SidebarHeader className="p-6 border-b border-sidebar-border text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="text-lg font-semibold text-gray-700">Loading User...</div>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">guest</span>
            <div className="text-sm text-gray-400 mt-1">ProspectGenius Dashboard</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <p className="text-center text-gray-400 p-4">Loading sidebar...</p>
        </SidebarContent>
      </Sidebar>
    );
  }

  const currentRole = role.toLowerCase();
  const currentPlan = plan.toLowerCase();

  return (
    <Sidebar>
      {/* User Header */}
      <SidebarHeader className="p-6 border-b border-sidebar-border text-center">
        <div className="flex flex-col items-center gap-1">
          <div className="text-lg font-semibold text-gray-900">{user.user_metadata?.full_name ?? user.email}</div>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">{currentRole}</span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">{currentPlan}</span>
          <div className="text-sm text-gray-500 mt-1">ProspectGenius Dashboard</div>
        </div>
      </SidebarHeader>

      {/* Sidebar Menu */}
      <SidebarContent>
        {menuItems.map((group) => {
          const Icon = group.icon;
          const visibleItems = group.items.filter(item => {
            const roles = item.allowedRoles.map(r => r.toLowerCase());
            const plans = item.allowedPlans.map(p => p.toLowerCase());
            return roles.includes(currentRole) && plans.includes(currentPlan);
          });

          if (visibleItems.length === 0) return null;

          return (
            <SidebarGroup key={group.title}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="w-full flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{group.title}</span>
                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {visibleItems.map(item => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton asChild isActive={location === item.url}>
                            <a
                              href={item.url}
                              onClick={(e) => {
                                e.preventDefault();
                                setLocation(item.url);
                              }}
                            >
                              {item.title}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleSignOut}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
