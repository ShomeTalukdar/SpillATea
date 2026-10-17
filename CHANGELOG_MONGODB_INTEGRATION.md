# SpillATea — MongoDB & Express Architecture Migration Log

**Date:** October 17, 2026  
**Status:** Completed & Production Verified  
**Scope:** Backend Transition to Express + MongoDB Atlas with Dual-Environment Database Isolation  

---

## 1. Executive Summary

SpillATea was migrated from an in-browser local storage mock to an enterprise-grade **Node.js Express REST API** powered by **MongoDB Atlas (Mongoose ODM)**. The architecture features automatic dev/prod database isolation, strict pseudonymity enforcement, and authenticated moderator audit trails.

---

## 2. Architecture: Before vs. After

| Dimension | Previous State | New Production Architecture |
|---|---|---|
| **Backend Layer** | None (client-side only) | Node.js Express 5.x REST API (`http://localhost:5000/api`) |
| **Database** | Browser `localStorage` | MongoDB Atlas Cloud (`Mongoose` schemas with indexing) |
| **Data Isolation** | Single local client state | Separate databases: `spillatea_dev` (testing) & `spillatea_prod` (live users) |
| **Privacy Protection** | Client-side data masking | Database-level projection (`select: false`) for author credentials |
| **Audit Logging** | Local mock log array | Immutable MongoDB `AuditLog` collection for moderator actions |
| **Initial Hydration** | Static code fixtures | Auto-seed utility (`npm run seed`) with verification guard |

---

## 3. Files Created & Modified

### New Backend Infrastructure (`/server`)
- [`server/index.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/index.js): Express server entry point, CORS middleware, API route mounting, health checks, and database lifecycle management.
- [`server/config/db.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/config/db.js): Mongoose connection manager with automated environment switching (`NODE_ENV === 'production'` -> `spillatea_prod`; otherwise `spillatea_dev`).
- [`server/models/Confession.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/Confession.js): Mongoose schema with `unique` sequential numbering (`No. 001`), indexing, and private fields (`real_author_name`, `real_author_email`) hidden by default.
- [`server/models/Comment.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/Comment.js): Discussion threads with reference to parent confession.
- [`server/models/Report.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/Report.js): Moderation reports queue and resolution logs.
- [`server/models/AuditLog.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/AuditLog.js): Tamper-resistant log for moderator identity reveals.
- [`server/routes/confessions.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/routes/confessions.js): Confession CRUD, search, categories, and atomic upvote toggling.
- [`server/routes/comments.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/routes/comments.js): Comments retrieval and submission with automated comment count incrementing.
- [`server/routes/reports.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/routes/reports.js): Safety reporting and moderator triage workflow.
- [`server/routes/admin.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/routes/admin.js): Server-authorized identity reveal with mandatory audit recording.
- [`server/routes/stats.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/routes/stats.js): Aggregated real-time metrics for trending sidebars.
- [`server/data/initialData.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/data/initialData.js): Standardized initial campus seed dataset.
- [`server/scripts/seed.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/scripts/seed.js): Database seed and reset CLI runner.

### New & Updated Frontend Layer (`/src`)
- [`src/services/api.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/src/services/api.js): Centralized REST client with timeout handling and error encapsulation.
- [`src/services/db.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/src/services/db.js): Re-architected as a resilient adapter pattern. Directs traffic to Express + MongoDB when available, falling back gracefully to local storage if offline.
- [`src/components/posts/TrendingSidebar.jsx`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/src/components/posts/TrendingSidebar.jsx): Integrated a dynamic **Database Engine Status** badge showing live connection health.

### Configuration & Scripts
- [`.env`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/.env) & [`.env.example`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/.env.example): Configured dual database URIs (`MONGODB_DEV_URI` vs. `MONGODB_PROD_URI`).
- [`package.json`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/package.json): Added `server`, `server:dev`, `seed`, and `dev:all` concurrently workflows.

---

## 4. Dual-Environment Database Isolation

To prevent test actions on localhost from polluting live student data:

```
                  ┌───────────────────────┐
                  │ SpillATea Environment │
                  └───────────┬───────────┘
                              │
             NODE_ENV === "production"?
             ├── YES ──► MONGODB_PROD_URI ──► spillatea_prod (Live Real Users)
             └── NO  ──► MONGODB_DEV_URI  ──► spillatea_dev  (Localhost Testing)
```

- **Development (`spillatea_dev`):** Active on `npm run dev:all`. Allows engineers to create test confessions, delete posts, test report queues, and seed fixtures without affecting production.
- **Production (`spillatea_prod`):** Engaged automatically in production deployments (Vercel / Render / Railway) when `NODE_ENV=production`.

---

## 5. Security & Privacy Validation (Rule 10)

1. **Public Queries Exclude Identities:** `Confession.find()` queries explicitly omit `real_author_name` and `real_author_email`.
2. **Server-Authorized Identity Reveal:** `POST /api/admin/reveal` enforces `role === 'admin'`, logs an immutable entry to `AuditLog`, and only then returns student contact information.
3. **Verified Live:** Automated endpoint validation confirmed `real_author_name` is absent in all public feed payloads.
