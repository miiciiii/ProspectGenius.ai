import MainLayout from "@/pages/main-layout";

export default function ApiKeysDataSources() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-foreground">API Keys & Data Sources</h1>

        {/* Page Subtitle / Description */}
        <p className="text-muted-foreground mt-1">
          Manage and monitor all your API keys, integrations, and data sources
        </p>

        {/* Placeholder for sources components */}
        <div className="mt-6 border border-border rounded-lg p-6 text-center text-muted-foreground">
          API Keys & Data Sources coming soon...
        </div>
      </div>
    </MainLayout>
  );
}
