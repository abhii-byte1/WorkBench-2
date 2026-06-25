# Workbench

## Project Overview

Workbench is a modern, enterprise-grade Role-Based Access Control (RBAC) administration panel designed for SaaS teams. It solves the complex problem of managing granular user permissions at scale by providing an intuitive visual interface to build, assign, and audit roles. Built as a complete full-stack application, Workbench enables team administrators to construct dynamic roles using a detailed permission matrix and assign multiple roles to individual users. To ensure predictable and secure access control, the system resolves overlapping permissions using an additive Union Strategy, guaranteeing that users receive the exact sum of all permissions granted across their assigned roles.

## 🔗 Live Demo

[https://work-bench-2.vercel.app](https://work-bench-2.vercel.app)


## 🚀 Features

- **Dashboard Metrics**: High-level overview of total users, roles, and permissions.
- **Permission Matrix**: Visual, interactive grid for selecting granular resource actions.
- **Create Role**: Construct custom roles from scratch with instant validation.
- **Edit Role**: Modify existing role permissions seamlessly.
- **Clone Role**: One-click duplication of complex role configurations.
- **Delete Role**: Safely remove roles with cascading unassignments.
- **Assign Roles**: Grant roles to users via a clean popover interface.
- **Remove Roles**: Revoke access instantly.
- **Multiple Roles per User**: Users can stack multiple roles seamlessly.
- **Effective Permissions**: Automatically calculates the net sum of a user's permissions.
- **Permission Source Visualization**: "Granted By" badges explicitly show which role provided a specific permission.
- **Live Permission Summary**: A sticky sidebar that instantly translates matrix selections into a readable checklist.
- **Search Users**: Real-time client-side filtering for user management.
- **Search Roles**: Instant search across role names and descriptions.
- **Activity Timeline**: An audit log displaying recent systemic changes.
- **Toast Notifications**: Contextual success and error feedback for all mutations.
- **Responsive Design**: Flawlessly adapts to mobile, tablet, and desktop viewports.
- **Seeded Sample Data**: Opens with pre-configured users and roles for immediate exploration.

## ✅ Assignment Coverage

- [x] Backend: Return all permissions organized by resource/action
- [x] Backend: Create roles
- [x] Backend: Update roles
- [x] Backend: Assign roles
- [x] Backend: Unassign roles
- [x] Backend: Resolve effective permissions
- [x] Backend: Support multiple roles per user
- [x] Frontend: Visual Permission Matrix
- [x] Frontend: Create/Edit Role interface
- [x] Frontend: Assign/Unassign Role interface
- [x] Frontend: Effective Permission Viewer
- [x] Permissions: 5 distinct resources with 19 total actions
- [x] Seed Data: 2–4 users, 3+ roles, one user with multiple roles
- [x] Technical: TypeScript strict mode
- [x] Technical: Next.js + API Routes
- [x] Technical: In-memory storage architecture

## 💻 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Data Fetching**: Custom React hooks (SWR-inspired pattern)

### Backend
- **Framework**: Next.js API Routes (Route Handlers)
- **Language**: TypeScript

### Storage
- **Database**: In-memory singleton (`lib/store.ts`) for rapid prototyping

### UI
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (Accessible, unstyled primitives)
- **Icons**: Lucide React

## 📂 Folder Structure

```text
app/
 ├── api/           # Next.js API Routes (Serverless backend)
 ├── roles/         # Role management pages
 ├── users/         # User management pages
 └── layout.tsx     # Root layout & Sidebar
components/
 ├── ui/            # shadcn/ui primitives
 └── ...            # Custom React components (RoleCard, PermissionMatrix, etc.)
hooks/              # Custom data fetching hooks
lib/
 ├── permissions.ts # Core RBAC matrix and logic
 ├── store.ts       # In-memory singleton database
 └── types.ts       # Shared TypeScript interfaces
```

## ⚙️ Setup

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for production:
```bash
npm run build
npm run start
```

## 🔐 Permission Strategy

Workbench utilizes a **Union RBAC Strategy** to calculate effective permissions. 

**Why it was chosen:**
A union strategy is strictly additive—assigning a role can only *grant* access, never revoke it. This additive permission model is a common and predictable approach for modern SaaS RBAC systems because it simplifies reasoning about effective access while avoiding unexpected permission conflicts.

**How overlapping permissions are resolved:**
When a user is assigned multiple roles, their effective permissions are computed by combining all unique actions granted by each role. Overlapping permissions are safely merged without conflicts. To ensure complete transparency, the UI surfaces the origin of every permission via "Granted By" badges, allowing administrators to trace exactly which roles are responsible for a user's access.

## 🔌 API Overview

The application is powered by a set of RESTful Next.js Route Handlers:
- `/api/roles` (GET, POST): Fetch all roles or construct a new role.
- `/api/roles/[id]` (GET, PUT, DELETE): Retrieve, update, or remove a specific role.
- `/api/users` (GET): Retrieve all users.
- `/api/users/[id]` (GET): Retrieve a specific user with fully resolved effective permissions.
- `/api/users/[id]/roles` (POST, DELETE): Assign or unassign a role to a specific user.
- `/api/activities` (GET): Retrieve the chronological system audit log.

## ✨ Project Highlights

- **Product-Focused UX**: Designed with a sleek, OLED dark-mode aesthetic inspired by top-tier developer tools like Vercel and Linear, ensuring the app feels like a premium product rather than an assignment.
- **Permission Source Visualization**: Goes beyond basic arrays by mapping effective permissions back to their parent roles visually in the UI.
- **Live Permission Summary**: A sticky sidebar translates the dense matrix into a highly readable, real-time checklist during role creation.
- **Activity Timeline**: Brings enterprise-grade audit logging to the dashboard to track system mutations.
- **Strong TypeScript Architecture**: Zero `any` types. End-to-end type safety ensures frontend components perfectly mirror the backend models.

## 🔮 Future Improvements

*(Note: These are planned enhancements beyond the scope of the current assignment.)*
- **Database Integration**: Swap the in-memory store for PostgreSQL (via Drizzle or Prisma) for true persistence.
- **Authentication**: Integrate Clerk or NextAuth to secure the dashboard and map roles to authenticated sessions.
- **Optimistic UI Updates**: Implement TanStack Query (React Query) or SWR mutations to make UI interactions feel zero-latency.
- **Role Hierarchy**: Allow base roles (e.g., `Admin`) to automatically inherit all permissions from child roles (e.g., `Member`).
