# ProspectGenius - Startup Funding Intelligence Platform

## Overview

ProspectGenius is a comprehensive startup funding intelligence platform built to track and analyze newly funded startups from multiple data sources. The application provides investment professionals and entrepreneurs with real-time insights into funding activities, company details, and market trends. The platform features a modern dashboard interface with advanced filtering, sorting, and export capabilities to help users identify investment opportunities and track market dynamics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a component-based architecture. The application uses Vite as the build tool for fast development and optimized production builds. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. The styling is handled through Tailwind CSS with a custom design token system for consistent theming.

**State Management & Data Fetching**: TanStack Query (React Query) is used for server state management, providing caching, synchronization, and background updates. The application implements custom hooks for API operations, following the separation of concerns principle.

**Routing**: The application uses Wouter for lightweight client-side routing, providing navigation between different views while maintaining a small bundle size.

**Component Structure**: Components are organized in a hierarchical structure with reusable UI components in the `components/ui` directory and domain-specific components in feature-specific directories like `components/dashboard`.

### Backend Architecture
The backend follows a REST API architecture built with Express.js and TypeScript. The server implements a clean separation between routing, storage, and business logic.

**API Layer**: RESTful endpoints are organized in the `server/routes.ts` file, handling CRUD operations for companies and dashboard statistics. The API includes comprehensive error handling and request validation using Zod schemas.

**Storage Layer**: The application implements an interface-based storage pattern with `IStorage`, allowing for flexible data persistence strategies. Currently uses an in-memory storage implementation with sample data for development, but the architecture supports easy migration to database-backed storage.

**Development Setup**: The development environment integrates Vite's middleware mode for hot module replacement and seamless full-stack development experience.

### Data Storage Solutions
The application is designed to work with PostgreSQL as the primary database, using Drizzle ORM for type-safe database operations and migrations. The database schema defines a `funded_companies` table with comprehensive company information including funding details, contact information, and status tracking.

**Schema Design**: The database schema uses UUID primary keys, proper indexing for performance, and includes fields for funding stages, amounts, investor information, and company metadata.

**Development Storage**: For development and demonstration purposes, the application includes a memory-based storage implementation with realistic sample data covering various funding stages and company types.

### External Dependencies
**UI Framework**: The application leverages an extensive set of Radix UI components for accessibility-compliant interface elements, including dialogs, dropdowns, tables, and form controls.

**Database Integration**: Neon Database serverless PostgreSQL is configured as the production database solution, with Drizzle ORM handling migrations and query building.

**Development Tools**: The project includes comprehensive development tooling with TypeScript for type safety, ESBuild for production builds, and Replit-specific plugins for cloud development environment integration.

**Styling System**: Tailwind CSS provides utility-first styling with a custom configuration that includes design tokens for consistent spacing, colors, and typography across the application.
