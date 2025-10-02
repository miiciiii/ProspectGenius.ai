import { useLocation } from 'wouter';
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
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  FileText,
  BarChart3,
  Settings as SettingsIcon,
  ChevronDown,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

const menuItems = [
  {
    title: 'Reports',
    icon: FileText,
    items: [
      { title: 'Company Reports', url: '/dashboard/reports/company', allowedRoles: ['guest', 'subscriber', 'admin'] },
      { title: 'Company Archives', url: '/dashboard/reports/company/archives', allowedRoles: ['guest', 'subscriber', 'admin'] },
      { title: 'Waiting List Reports', url: '/dashboard/reports/waiting/list', allowedRoles: ['admin'] },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    items: [
      { title: 'Advanced Analytics', url: '/dashboard/analytics/advanced', allowedRoles: ['guest', 'subscriber', 'admin'] },
      { title: 'Essential Funding Analytics', url: '/dashboard/analytics/essential', allowedRoles: ['guest', 'subscriber', 'admin'] },
    ],
  },
  {
    title: 'Administration',
    icon: SettingsIcon,
    items: [
      { title: 'Settings', url: '/dashboard/admin/settings', allowedRoles: ['guest', 'subscriber', 'admin'] },
      { title: 'Billing', url: '/dashboard/admin/billing', allowedRoles: ['guest', 'subscriber', 'admin'] },
      { title: 'Team Management', url: '/dashboard/admin/team', allowedRoles: ['guest', 'subscriber', 'admin'] },
    ],
  },
];

export function AppSidebar() {
  const [location, setLocation] = useLocation();
  const { signOut, user } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  const handleSignOut = async () => {
    await signOut();
    setLocation('/signin');
  };

  // Show placeholder while role is loading or user is null
  if (!user || roleLoading) {
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

  const currentRole: string = role ?? 'guest';

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-sidebar-border text-center">
        <div className="flex flex-col items-center gap-1">
          {/* User full name */}
          <div className="text-lg font-semibold text-gray-900">
            {user.user_metadata?.full_name ?? user.email}
          </div>

          {/* Role badge */}
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
            {currentRole}
          </span>

          {/* Dashboard subtitle */}
          <div className="text-sm text-gray-500 mt-1">ProspectGenius Dashboard</div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => {
          const Icon = group.icon;
          const visibleItems = group.items.filter((item) =>
            item.allowedRoles.includes(currentRole)
          );

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
                      {visibleItems.map((item) => (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={location === item.url}
                          >
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

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
