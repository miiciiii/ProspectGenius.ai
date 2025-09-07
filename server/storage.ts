import { type FundedCompany, type InsertFundedCompany, type CompanyFilters, type DashboardStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Company CRUD operations
  getFundedCompany(id: string): Promise<FundedCompany | undefined>;
  getAllFundedCompanies(): Promise<FundedCompany[]>;
  getFilteredFundedCompanies(filters: CompanyFilters): Promise<FundedCompany[]>;
  createFundedCompany(company: InsertFundedCompany): Promise<FundedCompany>;
  updateFundedCompany(id: string, updates: Partial<FundedCompany>): Promise<FundedCompany>;
  deleteFundedCompany(id: string): Promise<void>;
  
  // Dashboard stats
  getDashboardStats(): Promise<DashboardStats>;
  
  // Bulk operations for data integration
  bulkCreateFundedCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]>;
}

export class MemStorage implements IStorage {
  private companies: Map<string, FundedCompany>;

  constructor() {
    this.companies = new Map();
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleCompanies: InsertFundedCompany[] = [
      {
        source: "Y Combinator",
        companyName: "TechFlow AI",
        domain: "techflow.ai",
        fundingDate: "2024-12-15",
        fundingStage: "Series A",
        fundingAmount: 12000000,
        investors: "Sequoia Capital, Andreessen Horowitz",
        contactName: "Sarah Johnson",
        contactEmail: "s.johnson@techflow.ai",
        linkedin: "https://linkedin.com/in/sarahjohnson",
        twitter: "https://twitter.com/sarahjohnson",
        industry: "AI/ML",
        status: "new",
      },
      {
        source: "CzechStartups",
        companyName: "GreenSpace",
        domain: "greenspace.com",
        fundingDate: "2024-12-14",
        fundingStage: "Seed",
        fundingAmount: 3200000,
        investors: "FirstRound Capital, GV",
        contactName: "Michael Chen",
        contactEmail: "m.chen@greenspace.com",
        linkedin: "https://linkedin.com/in/michaelchen",
        industry: "SaaS",
        status: "contacted",
      },
      {
        source: "Datagma API",
        companyName: "DataVault",
        domain: "datavault.io",
        fundingDate: "2024-12-12",
        fundingStage: "Pre-Seed",
        fundingAmount: 1800000,
        investors: "Y Combinator, Techstars, Index Ventures",
        contactName: "Alex Rodriguez",
        contactEmail: "alex@datavault.io",
        linkedin: "https://linkedin.com/in/alexrodriguez",
        industry: "Fintech",
        status: "new",
      },
      {
        source: "Latest Startup News API",
        companyName: "BuilderBot",
        domain: "builderbot.ai",
        fundingDate: "2024-12-10",
        fundingStage: "Series A",
        fundingAmount: 8500000,
        investors: "Benchmark Capital, Accel Partners",
        contactName: "Emma Davis",
        contactEmail: "emma@builderbot.ai",
        linkedin: "https://linkedin.com/in/emmadavis",
        industry: "AI/ML",
        status: "follow-up",
      },
    ];

    sampleCompanies.forEach(company => {
      const id = randomUUID();
      const fullCompany: FundedCompany = {
        ...company,
        id,
        domain: company.domain || null,
        investors: company.investors || null,
        contactName: company.contactName || null,
        contactEmail: company.contactEmail || null,
        linkedin: company.linkedin || null,
        twitter: company.twitter || null,
        industry: company.industry || null,
        status: company.status || "new",
        createdAt: new Date(),
      };
      this.companies.set(id, fullCompany);
    });
  }

  async getFundedCompany(id: string): Promise<FundedCompany | undefined> {
    return this.companies.get(id);
  }

  async getAllFundedCompanies(): Promise<FundedCompany[]> {
    return Array.from(this.companies.values()).sort((a, b) => 
      new Date(b.fundingDate).getTime() - new Date(a.fundingDate).getTime()
    );
  }

  async getFilteredFundedCompanies(filters: CompanyFilters): Promise<FundedCompany[]> {
    let companies = Array.from(this.companies.values());

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      companies = companies.filter(company =>
        company.companyName.toLowerCase().includes(searchLower) ||
        company.domain?.toLowerCase().includes(searchLower) ||
        company.contactName?.toLowerCase().includes(searchLower)
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "all":
        default:
          filterDate.setFullYear(2020); // Far back date
          break;
      }

      companies = companies.filter(company =>
        new Date(company.fundingDate) >= filterDate
      );
    }

    // Apply funding stage filter
    if (filters.fundingStage) {
      companies = companies.filter(company =>
        company.fundingStage.toLowerCase().includes(filters.fundingStage!.toLowerCase())
      );
    }

    // Apply industry filter
    if (filters.industry) {
      companies = companies.filter(company =>
        company.industry?.toLowerCase() === filters.industry!.toLowerCase()
      );
    }

    // Apply status filter
    if (filters.status) {
      companies = companies.filter(company =>
        company.status === filters.status
      );
    }

    return companies.sort((a, b) => 
      new Date(b.fundingDate).getTime() - new Date(a.fundingDate).getTime()
    );
  }

  async createFundedCompany(insertCompany: InsertFundedCompany): Promise<FundedCompany> {
    const id = randomUUID();
    const company: FundedCompany = {
      ...insertCompany,
      id,
      domain: insertCompany.domain || null,
      investors: insertCompany.investors || null,
      contactName: insertCompany.contactName || null,
      contactEmail: insertCompany.contactEmail || null,
      linkedin: insertCompany.linkedin || null,
      twitter: insertCompany.twitter || null,
      industry: insertCompany.industry || null,
      status: insertCompany.status || "new",
      createdAt: new Date(),
    };
    this.companies.set(id, company);
    return company;
  }

  async updateFundedCompany(id: string, updates: Partial<FundedCompany>): Promise<FundedCompany> {
    const existingCompany = this.companies.get(id);
    if (!existingCompany) {
      throw new Error(`Company with id ${id} not found`);
    }

    const updatedCompany: FundedCompany = {
      ...existingCompany,
      ...updates,
      id: existingCompany.id, // Prevent ID changes
      createdAt: existingCompany.createdAt, // Prevent createdAt changes
    };

    this.companies.set(id, updatedCompany);
    return updatedCompany;
  }

  async deleteFundedCompany(id: string): Promise<void> {
    if (!this.companies.has(id)) {
      throw new Error(`Company with id ${id} not found`);
    }
    this.companies.delete(id);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const companies = Array.from(this.companies.values());
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const thisWeekCompanies = companies.filter(company =>
      new Date(company.fundingDate) >= oneWeekAgo
    );

    const totalFunding = companies.reduce((sum, company) => sum + company.fundingAmount, 0);
    const contactedCount = companies.filter(company => 
      company.status === "contacted" || company.status === "follow-up"
    ).length;

    return {
      totalCompanies: companies.length,
      thisWeek: thisWeekCompanies.length,
      totalFunding: this.formatFunding(totalFunding),
      contacted: contactedCount,
    };
  }

  private formatFunding(amount: number): string {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  }

  async bulkCreateFundedCompanies(companies: InsertFundedCompany[]): Promise<FundedCompany[]> {
    const createdCompanies: FundedCompany[] = [];

    for (const company of companies) {
      const createdCompany = await this.createFundedCompany(company);
      createdCompanies.push(createdCompany);
    }

    return createdCompanies;
  }
}

export const storage = new MemStorage();
