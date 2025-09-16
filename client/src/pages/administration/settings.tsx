import MainLayout from "@/pages/main-layout";
import { ThemeSwitcher } from "@/components/administration/settings/theme-switcher";
import { NotificationSettings } from "@/components/administration/settings/notification-settings";
import { AccountPreferences } from "@/components/administration/settings/account-preference";

export default function Settings() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure account, preferences, and application settings
          </p>
        </div>

        <ThemeSwitcher />
        <NotificationSettings />
        <AccountPreferences />
      </div>
    </MainLayout>
  );
}
