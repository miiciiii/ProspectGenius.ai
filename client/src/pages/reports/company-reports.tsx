import React from "react";
import { useCompanyReports } from "@/hooks/use-company-reports";
import { CompanyReportsTable } from "@/components/reports/company-reports/company-reports-table";
import { Loading } from "@/components/reports/company-reports/loading";
import { Error } from "@/components/reports/company-reports/error";
import MainLayout from "@/pages/main-layout";

export default function CompanyReportsPage() {
  const { data, isLoading, error } = useCompanyReports();

  if (isLoading) return <Loading />;

  if (error) {
    const message =
      error && typeof error === "object" && "message" in error
        ? (error as { message: string }).message
        : "Failed to fetch company reports.";

    return <Error message={message} />;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Company Reports</h1>
        {data && data.length > 0 ? (
          <CompanyReportsTable data={data} />
        ) : (
          <p className="text-gray-500">No company reports available.</p>
        )}
      </div>
    </MainLayout>
  );
}
