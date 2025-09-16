import MainLayout from "@/pages/main-layout";

export default function Sources() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Sources</h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor all your data sources and integrations
        </p>

        {/* Placeholder for sources components */}
        <div className="mt-6 border border-border rounded-lg p-6 text-center text-muted-foreground">
          Sources management coming soon...
        </div>
      </div>
    </MainLayout>
  );
}
