import {
  Bell,
  Plus,
  Search,
  LogOut,
  User,
  Settings,
  Crown,
  Menu,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  onMobileSidebarToggle?: () => void;
}

export function Navbar({ onMobileSidebarToggle }: NavbarProps) {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "subscriber":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "guest":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", testId: "nav-dashboard" },
    { path: "/companies", label: "Companies", testId: "nav-companies" },
    { path: "/analytics", label: "Analytics", testId: "nav-analytics" },
    { path: "/sources", label: "Sources", testId: "nav-sources" },
  ];

  // Show login/register if not authenticated
  if (!isAuthenticated) {
    return (
      <nav className="bg-card border-b border-border fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  PG
                </span>
              </div>
              <span className="font-semibold text-lg text-foreground">
                ProspectGenius | AgentGenius.ai
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Mobile menu button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                onMobileSidebarToggle?.();
              }}
              className="lg:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>

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
                  }`}>
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
              data-testid="button-search">
              <Search className="hero-icon" />
            </button>

            {/* Quick Add */}
            <button
              className="flex items-center space-x-1 btn-gradient px-3 py-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-sm font-medium shadow-sm active:translate-y-px"
              data-testid="button-quick-add">
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>

            {/* Notifications */}
            <button
              className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              data-testid="button-notifications">
              <Bell className="hero-icon" />
            </button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-1 rounded-md hover:bg-secondary transition-colors">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground text-sm font-medium">
                      {user ? getInitials(user.full_name || user.email) : "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-foreground">
                      {user?.full_name || user?.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge
                        className={`text-xs px-1.5 py-0.5 ${getRoleColor(
                          user?.role || ""
                        )}`}
                        variant="secondary">
                        {getRoleIcon(user?.role || "")}
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.full_name || user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
