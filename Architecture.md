# Workbench Architecture

## 1. System Overview

Workbench is a full-stack, Role-Based Access Control (RBAC) administration panel built to demonstrate robust permission management capabilities. The application enables users to create highly granular roles, assign multiple roles to individual users, and automatically calculate effective permissions based on an additive union model. 

The architecture is built entirely within the Next.js App Router ecosystem. It leverages a decoupled, prototype-first approach where the frontend communicates exclusively with backend Route Handlers via REST-style APIs, which in turn manipulate an in-memory data store. This architecture was chosen because it cleanly separates presentation logic from business logic, allowing the application to be evaluated as a complete full-stack product while remaining lightweight and easily deployable.

## 2. System Architecture Diagram

```text
       Client (Next.js UI)
               ↓
    Custom Hooks (Data Fetching)
               ↓
       Next.js API Routes
               ↓
         Business Logic
               ↓
        In-Memory Store
```

## 3. Tech Stack Decisions

- **Next.js (App Router)**: Selected as the core framework because it allows seamless collocation of backend API routes and frontend UI within a single repository. It provides excellent developer ergonomics and eliminates the need for complex CORS configurations or separate backend deployments.
- **TypeScript**: Adopted in strict mode to ensure end-to-end type safety. By sharing interfaces (`Role`, `User`, `Permission`) between the API and the client, the architecture guarantees runtime predictability and eliminates an entire class of data-mapping errors.
- **Tailwind CSS**: Chosen for rapid, utility-first styling. It enables precise control over the application's visual hierarchy and dark-mode aesthetics without shipping bloated, pre-compiled CSS files.
- **shadcn/ui**: Selected over traditional component libraries (like Material-UI) because it provides highly accessible, unstyled primitives (such as Popovers and Dialogs) that can be fully customized to match the product's specific design language.
- **Next.js API Routes**: Used to simulate a standalone backend service. Rather than mutating state directly inside React components, all data mutations travel through the network layer. This enforces a strict separation of concerns.
- **In-Memory Store**: A module-level singleton acts as the database for this assignment. It was chosen to keep the setup friction at absolute zero for reviewers while simulating realistic asynchronous data operations. 

## 4. API Design

The application exposes a set of REST-style API routes (e.g., `GET /api/roles`, `POST /api/users/[id]/roles`). 

This deliberate separation between the UI and the backend ensures that the frontend remains purely a presentation layer. React components never interact directly with the database or business logic functions. API Routes were preferred because they inherently enforce network-level boundaries, proving that the architecture is fully prepared for future scalability. If the application outgrows the monolithic Next.js backend, these API endpoints can be seamlessly swapped for a dedicated external microservice without requiring a rewrite of the React frontend.

## 5. Data Flow

The application follows a strictly unidirectional data flow to ensure predictable state mutations:

1. **User Action**: The user initiates a mutation in the browser (e.g., assigning a role).
2. **React Components**: The component captures the interaction and triggers an asynchronous function.
3. **Custom Hooks**: Abstractions in the `hooks/` directory manage the fetch lifecycle (loading, error, success).
4. **API Routes**: The network request is intercepted by the Next.js backend.
5. **Business Logic**: The route validates the payload and enforces application rules (e.g., verifying a role exists).
6. **Store**: The validated data mutates the in-memory singleton and logs the event to the system activity timeline.
7. **Response**: The API returns the updated entity (or an error).
8. **UI Update**: The custom hooks trigger a revalidation, seamlessly syncing the React UI with the new backend state.

## 6. Permission Resolution Strategy

Workbench implements a **Union RBAC Strategy** to calculate effective permissions when a user is assigned multiple roles. 

Union-based permission models are a common and predictable approach for modern SaaS RBAC systems. Under this strategy, permissions are strictly additive. A user receives the exact mathematical union of all permissions granted by every role they hold. 

This model was selected for the assignment because it is fundamentally easier for administrators to understand and audit. Assigning a new role will never unexpectedly revoke existing access. Furthermore, the logic is highly transparent; the system can directly map every granted permission back to its parent role, a critical requirement for enterprise security compliance.

## 7. Component Architecture

The repository is structured to prioritize maintainability and separation of concerns:

- `app/`: Contains Next.js file-system routing. Responsible for assembling page layouts and exposing API endpoints.
- `components/`: Houses reusable, domain-specific UI features (e.g., `RoleCard`, `DashboardSummary`, `PermissionMatrix`).
- `components/ui/`: Contains low-level, generic structural primitives (e.g., `Button`, `Badge`) generated by shadcn.
- `hooks/`: Isolates data-fetching and mutation logic away from the UI components.
- `lib/`: Contains all pure, framework-agnostic business logic, including the permission resolver, typescript interfaces, and the in-memory store.
- `api/` (within `app/`): Acts as the strictly typed controller layer between the network and the `lib/` directory.

## 8. Product Decisions

Several architectural choices were driven explicitly by the desire to create a premium, product-focused user experience:

- **Dashboard Metrics**: Implemented to provide immediate, high-level context regarding system utilization upon login.
- **Search**: Built with instantaneous client-side filtering to ensure managing large lists of roles and users feels fluid.
- **Permission Source Visualization**: Instead of simply listing what a user can do, "Granted By" badges were added to explicitly answer *why* they have that access, dramatically improving auditability.
- **Live Permission Summary**: A sticky sidebar translates the dense visual permission matrix into a real-time, human-readable checklist during role creation to reduce cognitive load.
- **Activity Timeline**: Added as a read-only audit log to demonstrate that the system captures and persists critical systemic mutations.

## 9. Trade-offs

To deliver a highly polished assignment within a reasonable timeframe, several intentional engineering trade-offs were made:

- **In-Memory Storage over a Database**: Setting up an external database (like PostgreSQL) requires environment variables, migrations, and docker containers. An in-memory store was chosen to guarantee the application runs instantly for reviewers via `npm run dev` with zero configuration overhead.
- **No Authentication**: User authentication was intentionally omitted to focus purely on the core RBAC logic requested by the assignment brief.
- **No Optimistic Updates**: The UI waits for network resolution before updating. While optimistic updates (e.g., via React Query) would eliminate perceived latency, they introduce significant caching complexity. A traditional loading state was deemed safer and more reliable for a prototype.
- **Prototype-First Architecture**: The monolithic nature of the Next.js app router is perfect for an assignment, though an enterprise deployment might decouple the frontend from the API into distinct microservices.

## 10. Scalability

The current architecture is specifically designed to facilitate future scaling with minimal refactoring:

- **Database Replacement**: Because the API routes interact with the store via abstracted function calls, migrating to PostgreSQL (using an ORM like Drizzle or Prisma) only requires replacing the contents of `lib/store.ts`.
- **Authentication**: A provider like Clerk or NextAuth can be wrapped around the root layout, securely passing JWT claims down to the API routes.
- **RBAC Middleware**: Next.js Middleware can be implemented to read user roles on the edge and block unauthorized route access before rendering.
- **Audit Logs**: The existing in-memory `ActivityTimeline` can easily be routed to an external logging service (e.g., Datadog) for persistent enterprise auditing.
- **Caching & Optimistic Updates**: The custom hooks can be cleanly replaced with SWR or React Query to handle complex client-side caching strategies.

## 11. Conclusion

The Workbench architecture intentionally balances simplicity, maintainability, and scalability. By enforcing strict TypeScript boundaries, decoupling the frontend from a simulated backend API, and utilizing an additive union permission strategy, the project fully satisfies the assignment requirements while demonstrating the engineering rigor expected of a production-quality software application.
