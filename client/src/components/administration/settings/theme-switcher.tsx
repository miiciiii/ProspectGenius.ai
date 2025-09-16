import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/theme-context";

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-md border border-border">
      <span className="font-medium text-foreground">Theme</span>
      <Button onClick={toggleTheme} variant="outline">
        {theme === "light" ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </Button>
    </div>
  );
}
