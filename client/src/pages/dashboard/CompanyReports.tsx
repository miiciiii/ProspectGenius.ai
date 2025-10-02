import React, { useState, useMemo, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import {
  Globe,
  Mail,
  Linkedin,
  Twitter,
  Flame,
  ArrowUpDown,
} from 'lucide-react';

interface ContactSource {
  uri: string;
  domain: string;
}

interface Contact {
  type: string;
  email: string | null;
  sources: ContactSource[];
  twitter: string | null;
  linkedin: string | null;
  position: string | null;
  full_name: string;
  seniority: string | null;
  department: string | null;
  phone_number: string | null;
}

interface FundedCompany {
  id: string;
  company_name: string;
  domain: string | null;
  funding_date: string | null;
  funding_stage: string | null;
  funding_amount: number | null;
  investors: string[] | null;
  contacts: Contact[] | null;
  social_media: string[] | null;
  industry: string | null;
  status: string;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function CompanyReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [groupBy, setGroupBy] = useState<'none' | 'industry' | 'stage'>('none');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const { data: companies } = useQuery({
    queryKey: ['/api/funded-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funded_companies_production')
        .select('*')
        .eq('status', 'new')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as FundedCompany[];
    },
    refetchInterval: 30000,
  });

  // --- Helper function for hot leads ---
  const isHotLeadCompany = (company: FundedCompany) =>
    (company.funding_amount || 0) >= 1e7 && (company.contacts?.length || 0) >= 3;

  // --- Analytics ---
  const analytics = useMemo(() => {
    if (!companies) return { newThisWeek: 0, total: 0, hotLeads: 0, totalContacts: 0 };

    const now = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const newThisWeek = companies.filter(c => new Date(c.created_at) >= weekAgo).length;
    const total = companies.length;
    const hotLeads = companies.filter(isHotLeadCompany).length;
    const totalContacts = companies.reduce((acc, c) => acc + (c.contacts?.length || 0), 0);

    return { newThisWeek, total, hotLeads, totalContacts };
  }, [companies]);

  // --- Filter & Sort ---
  const filteredAndSortedCompanies = useMemo(() => {
    if (!companies) return [];
    let filtered = companies.filter(company => {
      const matchesSearch =
        company.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStage = stageFilter === 'all' || company.funding_stage === stageFilter;
      return matchesSearch && matchesStage;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison =
          (new Date(a.funding_date || 0).getTime() -
            new Date(b.funding_date || 0).getTime());
      } else if (sortBy === 'amount') {
        comparison = (a.funding_amount || 0) - (b.funding_amount || 0);
      } else {
        comparison = a.company_name.localeCompare(b.company_name);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [companies, searchTerm, stageFilter, sortBy, sortOrder]);

  // --- Pagination ---
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedCompanies.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedCompanies, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedCompanies.length / PAGE_SIZE) || 1;
  }, [filteredAndSortedCompanies]);

  // --- Utilities ---
  const formatAmount = (amount: number | null) => {
    if (!amount) return 'N/A';
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
    return `$${amount}`;
  };

  const getStageBadgeVariant = (stage: string | null) => {
    if (!stage) return 'outline';
    const lower = stage.toLowerCase();
    if (lower.includes('seed')) return 'secondary';
    if (lower.includes('series a')) return 'default';
    if (lower.includes('series b') || lower.includes('series c')) return 'default';
    return 'outline';
  };

  return (
    <div className="relative min-h-screen p-8 bg-gray-50 text-gray-900">

      {/* --- Analytics Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm">New This Week</span>
          <span className="text-2xl font-bold">{analytics.newThisWeek}</span>
        </Card>
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm">Total Companies</span>
          <span className="text-2xl font-bold">{analytics.total}</span>
        </Card>
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm flex items-center gap-1">
            Hot Leads <Flame className="w-4 h-4 text-orange-500" />
          </span>
          <span className="text-2xl font-bold">{analytics.hotLeads}</span>
        </Card>
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm">Total Contacts</span>
          <span className="text-2xl font-bold">{analytics.totalContacts}</span>
        </Card>
      </div>

      {/* --- Filters --- */}
      <Card className="p-6 mb-6 border border-gray-200 shadow-lg rounded-2xl bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Search companies, industries..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-gray-100 text-gray-900 placeholder-gray-500"
          />
          <Select value={stageFilter} onValueChange={v => setStageFilter(v as string)}>
            <SelectTrigger className="bg-gray-100 text-gray-900">
              <SelectValue placeholder="Filter by Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Series A">Series A</SelectItem>
              <SelectItem value="Series B">Series B</SelectItem>
              <SelectItem value="Series C">Series C</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={v => setSortBy(v as 'date' | 'amount' | 'name')}>
            <SelectTrigger className="bg-gray-100 text-gray-900">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
          <Select value={groupBy} onValueChange={v => setGroupBy(v as 'none' | 'industry' | 'stage')}>
            <SelectTrigger className="bg-gray-100 text-gray-900">
              <SelectValue placeholder="Group By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="industry">Industry</SelectItem>
              <SelectItem value="stage">Stage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* --- Companies Table --- */}
      <Card className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3">Investors</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompanies.map(company => {
              const isExpanded = expandedRows.includes(company.id);
              const isHotLead = isHotLeadCompany(company);

              return (
                <Fragment key={company.id}>
                  <tr className={`${isExpanded ? 'bg-gray-50' : ''}`}>
                    <td className="px-4 py-2 font-semibold flex items-center gap-2">
                      {company.company_name}
                      {isHotLead && <Flame className="w-5 h-5 text-orange-500" />}
                    </td>
                    <td className="px-4 py-2">{company.funding_stage && <Badge variant={getStageBadgeVariant(company.funding_stage)}>{company.funding_stage}</Badge>}</td>
                    <td className="px-4 py-2">{company.created_at ? format(new Date(company.created_at), 'MMM dd, yyyy') : 'N/A'}</td>
                    <td className="px-4 py-2">{formatAmount(company.funding_amount)}</td>
                    <td className="px-4 py-2">{company.industry || 'N/A'}</td>
                    <td className="px-4 py-2">{company.investors?.slice(0,2).join(', ')}{company.investors && company.investors.length > 2 ? ` +${company.investors.length-2} more` : ''}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" variant="default">ENGAGE</Button>
                      <Button size="sm" variant="outline" onClick={() => toggleRow(company.id)}>DETAILS</Button>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {isExpanded && (
                    <tr className="bg-gray-100">
                      <td colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                          {/* Contacts Section */}
                          {company.contacts?.length ? (
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg border-b border-gray-300 pb-1 mb-2">Contacts</h3>
                              {company.contacts.map((c, idx) => (
                                <Card key={idx} className="p-3 bg-white rounded-xl shadow">
                                  <p className="font-semibold">{c.full_name} {c.position ? `- ${c.position}` : ''}</p>
                                  <p className="text-sm text-gray-600">{c.department ? `${c.department} Department` : ''}</p>
                                  {c.email && <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{c.email}</p>}
                                  {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><Linkedin className="w-4 h-4" />LinkedIn</a>}
                                  {c.twitter && <a href={c.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><Twitter className="w-4 h-4" />Twitter</a>}
                                  {c.sources?.length ? <p className="text-xs text-gray-400 mt-1">Sources: {c.sources.map(s => s.domain).join(', ')}</p> : null}
                                </Card>
                              ))}
                            </div>
                          ) : null}

                          {/* Socials Section */}
                          {company.social_media?.length ? (
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg border-b border-gray-300 pb-1 mb-2">Social Media</h3>
                              <div className="flex flex-wrap gap-2">
                                {company.social_media.map((s, idx) => (
                                  <Card key={idx} className="flex items-center gap-2 p-2 bg-white rounded-xl shadow">
                                    {s.toLowerCase().includes('linkedin') && <Linkedin className="w-4 h-4" />}
                                    {s.toLowerCase().includes('twitter') && <Twitter className="w-4 h-4" />}
                                    <span className="text-sm">{s}</span>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          {/* Domain */}
                          {company.domain && (
                            <div className="flex items-center gap-2 mt-2">
                              <Globe className="w-4 h-4" />
                              <a href={`https://${company.domain}`} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                                {company.domain}
                              </a>
                            </div>
                          )}

                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-4 mt-4 p-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </Button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </Button>
        </div>

      </Card>
    </div>
  );
}
