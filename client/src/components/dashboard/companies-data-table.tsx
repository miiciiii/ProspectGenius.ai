import { useState } from "react";
import { ArrowUpDown, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useUpdateCompany } from "@/hooks/use-companies";
import type { FundedCompany, SortConfig } from "@/types/company";
import { cn } from "@/lib/utils";

interface CompaniesDataTableProps {
  companies: FundedCompany[];
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function CompaniesDataTable({ companies, isLoading }: CompaniesDataTableProps) {
  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'fundingDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  
  const updateCompanyMutation = useUpdateCompany();

  // Sort companies
  const sortedCompanies = [...companies].sort((a, b) => {
    const aValue = a[sortConfig.field as keyof FundedCompany];
    const bValue = b[sortConfig.field as keyof FundedCompany];
    
    let comparison = 0;
    
    if (sortConfig.field === 'fundingAmount') {
      comparison = (aValue as number) - (bValue as number);
    } else if (sortConfig.field === 'fundingDate') {
      comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }
    
    return sortConfig.direction === 'desc' ? -comparison : comparison;
  });

  // Paginate companies
  const totalPages = Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = sortedCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (field: keyof FundedCompany) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCompanies(new Set(paginatedCompanies.map(c => c.id)));
    } else {
      setSelectedCompanies(new Set());
    }
  };

  const handleSelectCompany = (id: string, checked: boolean) => {
    const newSelection = new Set(selectedCompanies);
    if (checked) {
      newSelection.add(id);
    } else {
      newSelection.delete(id);
    }
    setSelectedCompanies(newSelection);
  };

  const handleStatusChange = async (company: FundedCompany, newStatus: string) => {
    try {
      await updateCompanyMutation.mutateAsync({
        id: company.id,
        updates: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to update company status:', error);
    }
  };

  const formatFundingAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'contacted':
        return 'secondary';
      case 'follow-up':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStageBadgeColor = (stage: string) => {
    const stageMap: Record<string, string> = {
      'Pre-Seed': 'stage-pre-seed',
      'Seed': 'stage-seed', 
      'Series A': 'stage-series-a',
      'Series B': 'stage-series-b',
      'Series C': 'stage-series-c',
    };
    return stageMap[stage] || 'stage-pre-seed';
  };

  const getCompanyInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Loading companies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Newly Funded Startups</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span data-testid="text-filtered-count">{sortedCompanies.length}</span>
            <span>of</span>
            <span data-testid="text-total-count">{companies.length}</span>
            <span>companies</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Checkbox
                  checked={selectedCompanies.size === paginatedCompanies.length && paginatedCompanies.length > 0}
                  onCheckedChange={handleSelectAll}
                  data-testid="checkbox-select-all"
                />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('companyName')}
                data-testid="header-company"
              >
                <div className="flex items-center">
                  Company
                  <ArrowUpDown className="hero-icon ml-1" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('fundingAmount')}
                data-testid="header-funding"
              >
                <div className="flex items-center">
                  Funding
                  <ArrowUpDown className="hero-icon ml-1" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Stage
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Investors
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Contact
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('fundingDate')}
                data-testid="header-date"
              >
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="hero-icon ml-1" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => (
                <tr 
                  key={company.id} 
                  className="hover:bg-muted/30 transition-colors"
                  data-testid={`row-company-${company.id}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={selectedCompanies.has(company.id)}
                      onCheckedChange={(checked) => handleSelectCompany(company.id, !!checked)}
                      data-testid={`checkbox-company-${company.id}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-accent">
                            {getCompanyInitials(company.companyName)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-foreground">{company.companyName}</div>
                        <div className="text-sm text-muted-foreground">{company.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-foreground">
                      {formatFundingAmount(company.fundingAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs", getStageBadgeColor(company.fundingStage))}
                    >
                      {company.fundingStage}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-foreground">{company.investors}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{company.contactName}</div>
                    <div className="text-sm text-muted-foreground">{company.contactEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {format(new Date(company.fundingDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(company.status)}>
                      {company.status === 'follow-up' ? 'Follow Up' : 
                       company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {company.status === 'new' ? (
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => handleStatusChange(company, 'contacted')}
                        data-testid={`button-contact-${company.id}`}
                      >
                        Contact
                      </Button>
                    ) : (
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => handleStatusChange(company, 'follow-up')}
                        data-testid={`button-follow-up-${company.id}`}
                      >
                        Follow Up
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="ml-2">
                      <MoreHorizontal className="hero-icon" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center">
                  <p className="text-muted-foreground">No companies found matching your criteria</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-card px-6 py-3 flex items-center justify-between border-t border-border">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              data-testid="button-prev-mobile"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              data-testid="button-next-mobile"
            >
              Next
            </Button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, sortedCompanies.length)}</span> of{' '}
                <span className="font-medium">{sortedCompanies.length}</span> results
              </p>
            </div>
            
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-l-md"
                  data-testid="button-prev-desktop"
                >
                  <ChevronLeft className="hero-icon" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => (
                    <>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span key={`ellipsis-${page}`} className="relative inline-flex items-center px-4 py-2 border border-border bg-card text-sm font-medium text-muted-foreground">
                          ...
                        </span>
                      )}
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="rounded-none"
                        data-testid={`button-page-${page}`}
                      >
                        {page}
                      </Button>
                    </>
                  ))
                }
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-r-md"
                  data-testid="button-next-desktop"
                >
                  <ChevronRight className="hero-icon" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
