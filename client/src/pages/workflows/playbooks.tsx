import MainLayout from "@/pages/main-layout";

export default function Playbooks() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-foreground">Playbooks</h1>

        {/* Page Subtitle / Description */}
        <p className="text-muted-foreground mt-1">
          Organize and manage your workflow templates for consistent processes
        </p>

        {/* Placeholder for playbooks components */}
        <div className="mt-6 border border-border rounded-lg p-6 text-center text-muted-foreground">
          Playbooks coming soon...
        </div>
      </div>
    </MainLayout>
  );
}
