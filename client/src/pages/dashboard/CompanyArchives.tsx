import React, { useState, useMemo, Fragment, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  ArrowUpDown,
} from 'lucide-react';

interface CompanyReport {
  id: string;
  url: string | null;
  news_url: string | null;
  company_name: string | null;
  description: string | null;
  funding_round: string | null;
  funding_amount: number | null;
  funding_date: string | null;
  investors: string[] | null;
  markets: string[] | null;
  hq: string | null;
  founded_year: number | null;
  website: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  crunchbase: string | null;
  pitchbook: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const PAGE_SIZE = 10;

export default function CompanyArchives() {
  const [searchTerm, setSearchTerm] = useState('');
  const [fundingRoundFilter, setFundingRoundFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleRow = (id: string) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // --- Fetch data from Supabase with logs ---
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/company-reports'],
    queryFn: async () => {
      console.log('Fetching company_reports from Supabase...');
      const { data, error } = await supabase
        .from('company_reports')
        .select('*')
        .neq('company_name', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      console.log('Raw data from Supabase:', data);

      // Convert funding_amount to number
      const normalizedData = data.map(d => ({
        ...d,
        funding_amount: d.funding_amount !== null ? Number(d.funding_amount) : null,
      }));

      console.log('Normalized data:', normalizedData);
      return normalizedData as CompanyReport[];
    },
    refetchInterval: 30000,
  });

  // --- Debug useEffect ---
  useEffect(() => {
    if (isLoading) console.log('Loading data...');
    if (error) console.error('useQuery error:', error);
    if (data) console.log('useQuery data:', data);
  }, [data, error, isLoading]);

  // --- Analytics ---
  const analytics = useMemo(() => {
    if (!data) return { totalCompanies: 0, totalFunding: 0, totalMarkets: 0, totalNews: 0 };

    const totalCompanies = data.length;
    const totalFunding = data.reduce((sum, c) => sum + (c.funding_amount || 0), 0);
    const totalMarkets = data.reduce((sum, c) => sum + (c.markets?.length || 0), 0);
    const totalNews = data.filter(c => c.news_url).length;

    console.log('Analytics:', { totalCompanies, totalFunding, totalMarkets, totalNews });
    return { totalCompanies, totalFunding, totalMarkets, totalNews };
  }, [data]);

  // --- Filter & Sort ---
  const filteredAndSortedCompanies = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter(company => {
      const matchesSearch =
        company.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.markets?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFundingRound = fundingRoundFilter === 'all' || company.funding_round === fundingRoundFilter;
      return matchesSearch && matchesFundingRound;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = (new Date(a.funding_date || 0).getTime() - new Date(b.funding_date || 0).getTime());
      } else if (sortBy === 'amount') {
        comparison = (a.funding_amount || 0) - (b.funding_amount || 0);
      } else {
        comparison = (a.company_name || '').localeCompare(b.company_name || '');
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    console.log('Filtered & sorted companies:', filtered);
    return filtered;
  }, [data, searchTerm, fundingRoundFilter, sortBy, sortOrder]);

  // --- Pagination ---
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const pageData = filteredAndSortedCompanies.slice(start, start + PAGE_SIZE);
    console.log(`Paginated data (page ${currentPage}):`, pageData);
    return pageData;
  }, [filteredAndSortedCompanies, currentPage]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedCompanies.length / PAGE_SIZE) || 1, [filteredAndSortedCompanies]);

  const formatAmount = (amount: number | null) => {
    if (!amount) return 'N/A';
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
    return `$${amount}`;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data: {JSON.stringify(error)}</div>;

  return (
    <div className="relative min-h-screen p-8 bg-gray-50 text-gray-900">

      {/* --- Analytics Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm">Total Companies</span>
          <span className="text-2xl font-bold">{analytics.totalCompanies}</span>
        </Card>
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm">Total Funding</span>
          <span className="text-2xl font-bold">{formatAmount(analytics.totalFunding)}</span>
        </Card>
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm">Total Markets</span>
          <span className="text-2xl font-bold">{analytics.totalMarkets}</span>
        </Card>
        <Card className="p-4 bg-white shadow rounded-xl flex flex-col items-start">
          <span className="text-gray-500 text-sm">News Entries</span>
          <span className="text-2xl font-bold">{analytics.totalNews}</span>
        </Card>
      </div>

      {/* --- Filters --- */}
      <Card className="p-6 mb-6 border border-gray-200 shadow-lg rounded-2xl bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Search companies, markets..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-gray-100 text-gray-900 placeholder-gray-500"
          />
          <Select value={fundingRoundFilter} onValueChange={v => setFundingRoundFilter(v)}>
            <SelectTrigger className="bg-gray-100 text-gray-900">
              <SelectValue placeholder="Filter by Funding Round" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rounds</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Series A">Series A</SelectItem>
              <SelectItem value="Series B">Series B</SelectItem>
              <SelectItem value="Series C">Series C</SelectItem>
              <SelectItem value="Series D+">Series D+</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={v => setSortBy(v as 'date' | 'amount' | 'name')}>
            <SelectTrigger className="bg-gray-100 text-gray-900">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Funding Amount</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
            <ArrowUpDown className="w-4 h-4 mr-2" />
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </div>
      </Card>

      {/* --- Company Table --- */}
      <Card className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Funding Round</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Funding Amount</th>
              <th className="px-4 py-3">Markets</th>
              <th className="px-4 py-3">Investors</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompanies.map(company => {
              const isExpanded = expandedRows.includes(company.id);
              return (
                <Fragment key={company.id}>
                  <tr className={`${isExpanded ? 'bg-gray-50' : ''}`}>
                    <td className="px-4 py-2 font-semibold">{company.company_name}</td>
                    <td className="px-4 py-2">{company.funding_round || 'N/A'}</td>
                    <td className="px-4 py-2">{company.funding_date ? format(new Date(company.funding_date), 'MMM dd, yyyy') : 'N/A'}</td>
                    <td className="px-4 py-2">{formatAmount(company.funding_amount)}</td>
                    <td className="px-4 py-2">{company.markets?.join(', ') || 'N/A'}</td>
                    <td className="px-4 py-2">{company.investors?.slice(0,2).join(', ')}{company.investors && company.investors.length > 2 ? ` +${company.investors.length-2} more` : ''}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toggleRow(company.id)}>DETAILS</Button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-gray-100">
                      <td colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {company.description && (
                            <div>
                              <h3 className="font-semibold text-lg border-b border-gray-300 pb-1 mb-2">Description</h3>
                              <p>{company.description}</p>
                            </div>
                          )}

                          <div className="flex flex-col gap-2">
                            {company.website && (
                              <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-blue-600">
                                <Globe className="w-4 h-4" /> Website
                              </a>
                            )}
                            {company.linkedin && <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><Linkedin className="w-4 h-4" />LinkedIn</a>}
                            {company.twitter && <a href={company.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><Twitter className="w-4 h-4" />Twitter</a>}
                            {company.instagram && <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><Instagram className="w-4 h-4" />Instagram</a>}
                            {company.facebook && <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline"><Facebook className="w-4 h-4" />Facebook</a>}
                          </div>
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
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
          <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
          <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
        </div>
      </Card>
    </div>
  );
}
