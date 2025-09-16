import MainLayout from "@/pages/main-layout";

export default function TeamManagement() {
  return (
    <MainLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-foreground">Team Management</h1>

        {/* Page Subtitle / Description */}
        <p className="text-muted-foreground mt-1">
          Manage your team members, roles, and permissions
        </p>

        {/* Placeholder for page components */}
        <div className="mt-6 border border-border rounded-lg p-6 text-center text-muted-foreground">
          Team Management coming soon...
        </div>
      </div>
    </MainLayout>
  );
}
