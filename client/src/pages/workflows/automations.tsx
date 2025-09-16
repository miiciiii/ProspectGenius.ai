import MainLayout from "@/pages/main-layout";

export default function Automation() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-foreground">Automation</h1>

        {/* Page Subtitle / Description */}
        <p className="text-muted-foreground mt-1">
          Configure and manage automated workflows for your business processes
        </p>

        {/* Placeholder for automation components */}
        <div className="mt-6 border border-border rounded-lg p-6 text-center text-muted-foreground">
          Automation coming soon...
        </div>
      </div>
    </MainLayout>
  );
}
