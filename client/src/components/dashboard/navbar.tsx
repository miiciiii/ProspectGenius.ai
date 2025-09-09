import { Bell } from "lucide-react";

export function Navbar() {
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DG</span>
              </div>
              <span className="font-semibold text-lg text-foreground">DealGenius | AgentGenius.ai</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a 
                href="#" 
                className="text-primary font-medium border-b-2 border-primary pb-0.5"
                data-testid="nav-dashboard"
              >
                Dashboard
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-companies"
              >
                Companies
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-analytics"
              >
                Analytics
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-sources"
              >
                Sources
              </a>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button 
              className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-secondary transition-colors"
              data-testid="button-notifications"
            >
              <Bell className="hero-icon" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-sm font-medium">A</span>
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
