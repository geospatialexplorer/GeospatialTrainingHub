# GeoSpatial Academy - Full-Stack Web Application

## Overview

GeoSpatial Academy is a comprehensive web application for a geospatial education platform. The application features a public-facing website showcasing courses and allowing user registration, along with an admin dashboard for managing registrations and viewing analytics. Built with modern web technologies, it provides a seamless experience for both students and administrators.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture pattern with clear separation between frontend and backend concerns:

- **Frontend**: React with TypeScript, built using Vite
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Development Environment**: Optimized for Replit with hot reload support

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application with client-side routing using Wouter
- **Component Structure**: Organized into reusable UI components, page components, and feature-specific sections
- **State Management**: React Query (TanStack Query) for server state, React hooks for local state
- **UI Components**: shadcn/ui component library for consistent design system
- **Styling**: Tailwind CSS with custom design tokens for geospatial theme

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging, authentication, and error handling
- **Route Organization**: Centralized route registration with clean separation of concerns
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **Session Management**: Built-in session handling for admin authentication

### Database Schema
- **Users**: Admin authentication with role-based access
- **Registrations**: Student course registrations with status tracking
- **Contact Messages**: Contact form submissions
- **Courses**: Course catalog with enrollment tracking

### Authentication & Authorization
- **Session-based Auth**: Simple session management for admin access
- **Role-based Access**: Admin-only routes protected by middleware
- **Public API**: Course browsing and registration available without authentication

## Data Flow

1. **Public Flow**: Users browse courses → register for courses → submit contact forms
2. **Admin Flow**: Admins log in → view dashboard with analytics → manage registrations
3. **Data Management**: All data flows through the storage abstraction layer to the database
4. **Real-time Updates**: React Query provides optimistic updates and cache invalidation

## External Dependencies

### Core Framework Dependencies
- **React 18**: Modern React with hooks and concurrent features
- **Express**: Node.js web framework for API server
- **Drizzle ORM**: Type-safe database operations with PostgreSQL
- **Neon Database**: Serverless PostgreSQL hosting (@neondatabase/serverless)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library
- **Chart.js**: Data visualization for admin dashboard

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Fast bundling for production builds

## Deployment Strategy

### Development
- **Replit Integration**: Optimized for Replit development environment
- **Hot Reload**: Vite development server with Express integration
- **Environment Variables**: Database URL and other config through environment

### Production Build
- **Client Build**: Vite builds React app to static files
- **Server Build**: ESBuild bundles Express server with external dependencies
- **Single Deploy**: Combined client and server deployment

### Database Management
- **Drizzle Kit**: Database migrations and schema management
- **PostgreSQL**: Production database with connection pooling
- **Schema Evolution**: Version-controlled database changes through migrations

The application architecture prioritizes developer experience with hot reload, type safety, and modern tooling while maintaining production readiness with proper error handling, logging, and deployment strategies.