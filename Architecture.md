# Architecture — Workbench

## Stack

### Next.js 14+ (App Router)
Single repo for both frontend and API. File-based routing maps cleanly to the resource model. No separate Express server, no CORS config, no deployment split. App Router enables server components on read pages for faster initial load.

### TypeScript
Strict mode throughout. Types defined once in `lib/types.ts` and imported everywhere — API handlers, components, hooks, and utility functions all share the same interfaces. Zero `any` types enforced by tsconfig.

### Tailwind CSS + shadcn/ui
Tailwind for layout and spacing. shadcn/ui for accessible primitives (Dialog, Tooltip, Toast, Popover) that are unstyled enough to fully customize. No component library opinions fighting the design direction.

### In-memory store
A module-level singleton in `lib/store.ts`. Sufficient for a prototype — data persists across API requests within a server session. Replacing it with a real database only requires changing the store module; all API routes are already decoupled from storage internals.

## Permission Resolution Strategy

Effective permissions are computed as the **union** of all permissions across all roles assigned to a user. This is implemented as a pure function, `resolveEffectivePermissions()`, in `lib/permissions.ts`.

The result type is `EffectivePermission[]`, which extends `Permission` with a `grantedBy: string[]` field listing every role that grants each permission. This powers the "Granted by: X, Y" tooltip in the UI, making the logic visually auditable.

**Why union?**
Union is additive: roles can only grant, never revoke. This matches user expectations — assigning more roles should never reduce someone's access. It is predictable (any admin can compute a user's access by hand from their role list), consistent with how GitHub, Notion, and Linear handle RBAC, and safe to audit because permission sources are always traceable.

## Trade-offs

**No persistence** — Server restart resets all data. Acceptable for a prototype. Migration path: replace `lib/store.ts` with a DB adapter.

**No auth** — Any visitor can manage roles and users. Out of scope per the assignment brief.

**No optimistic updates** — All mutations await the API before updating UI. Keeps state consistent at the cost of a small latency UX overhead. Could be improved with SWR's optimistic mutation API.

## Future Improvements

- Add role hierarchy (some roles inherit from others)
- Permission deny-list (explicitly block a permission regardless of role)
- Audit log of all permission changes
- Role templates for common team types
- Export roles as JSON for cross-workspace sharing
