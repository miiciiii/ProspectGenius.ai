import { sql } from "drizzle-orm";
import { pgTable, text, varchar, date, bigint, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const fundedCompanies = pgTable("funded_companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: varchar("source", { length: 50 }).notNull(),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }),
  fundingDate: date("funding_date").notNull(),
  fundingStage: varchar("funding_stage", { length: 50 }).notNull(),
  fundingAmount: bigint("funding_amount", { mode: "number" }).notNull(),
  investors: text("investors"),
  contactName: varchar("contact_name", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  twitter: varchar("twitter", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFundedCompanySchema = createInsertSchema(fundedCompanies).omit({
  id: true,
  createdAt: true,
});

export type InsertFundedCompany = z.infer<typeof insertFundedCompanySchema>;
export type FundedCompany = typeof fundedCompanies.$inferSelect;

// Additional schemas for filtering and stats
export const companyFiltersSchema = z.object({
  search: z.string().optional(),
  dateRange: z.enum(["week", "month", "quarter", "all"]).optional(),
  fundingStage: z.string().optional(),
  industry: z.string().optional(),
  status: z.string().optional(),
});

export type CompanyFilters = z.infer<typeof companyFiltersSchema>;

export const dashboardStatsSchema = z.object({
  totalCompanies: z.number(),
  thisWeek: z.number(),
  totalFunding: z.string(),
  contacted: z.number(),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
