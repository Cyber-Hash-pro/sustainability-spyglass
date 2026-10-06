# Verdant Ledger

**Corporate Carbon Footprint Intelligence Platform**

Verdant Ledger is an enterprise-grade carbon accounting platform built for precision, traceability, and auditability. It helps organizations measure Scope 1, 2, and 3 emissions across every facility with strict role-based access and an immutable audit trail.

**Live Application:** [sustainability-spyglass.lovable.app](https://sustainability-spyglass.lovable.app)

## Key Features

- **Multi-entity Architecture:** Manage complex organizational structures including facilities, departments, and strict reporting boundaries with complete tenant isolation.
- **Strict Role-Based Access (RBAC):** Separate views and capabilities for Super Admins, Org Admins, ESG Managers, Data Contributors, and Auditors—enforced at the database level using Row Level Security (RLS).
- **Uncompromising Traceability:** Version-controlled emission factors (e.g., DEFRA) and an immutable audit trail for every single change. Give your auditors read-only access to verify facts.
- **AI-Assisted Insights:** AI surfaces reduction opportunities and anomalies, but commentary is kept strictly separate from calculated facts. AI never overwrites carbon numbers.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Routing:** TanStack Router (File-based routing)
- **Styling:** Tailwind CSS, Shadcn UI (Radix UI primitives)
- **Icons:** Lucide React
- **Backend & Database:** Supabase (PostgreSQL, GoTrue Auth, Row Level Security)
- **State Management:** TanStack Query

## Project Structure

- `/src/routes/_public`: Public marketing and landing pages (Home, Features, Pricing, About, etc.)
- `/src/routes/_authenticated`: Protected application dashboard and modules.
- `/src/components/ui`: Reusable UI components (buttons, dialogs, inputs).
- `/src/lib`: Core utilities (RBAC, Supabase client, Organization Context).

## Presentation & Demo Mode

For presentation purposes, the public login screen (`/auth`) includes a **Presentation Quick Login** section. 

Because the backend enforces strict email verification, these quick-login buttons are mapped to actual, verified Google aliases under the hood (e.g. `cyberhashpro+role@gmail.com`). 
This allows you to present the platform with professional-looking emails (e.g. `admin@verdantledger.com`) in the UI, while still satisfying the backend's strict security requirements.

## Development Setup

To run this project locally:

1. Ensure you have Node.js and `npm` installed.
2. Clone the repository:
   ```sh
   git clone <repository-url>
   cd sustainability-spyglass
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up your `.env` variables for Supabase (URL and Anon Key).
5. Start the development server:
   ```sh
   npm run dev
   ```

---
*Built with [Lovable](https://lovable.dev).*
