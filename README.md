# Workbench

Role and permission builder for SaaS teams.

## Features
- Create and edit custom roles with a visual permission matrix
- Assign multiple roles to users
- View effective permissions for any user (union of all assigned roles)
- "Granted by" tooltip on each permission shows which role(s) granted it
- Clone, edit, and delete roles
- Seeded with sample data — never opens empty

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Stack
Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · In-memory store

## Permission Logic
Union RBAC — a user receives every permission granted by any of their roles. See Architecture.md for full rationale.
