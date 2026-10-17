# ☕ SpillATea — Anonymous Campus Social Platform

> **"The conversations happening after hours."**  
> An intimate, pseudonymous college social board combining editorial minimalism, underground campus culture, and enterprise-grade privacy engineering.

---

## 🧭 Table of Contents
- [1. Overview & Vision](#1-overview--vision)
- [2. System Architecture](#2-system-architecture)
- [3. How We Built This Project (Engineering Journey)](#3-how-we-built-this-project-engineering-journey)
- [4. Dual-Environment Database Strategy](#4-dual-environment-database-strategy)
- [5. Core Features](#5-core-features)
- [6. Technology Stack](#6-technology-stack)
- [7. Getting Started](#7-getting-started)
- [8. API Reference](#8-api-reference)
- [9. Privacy, Security & Moderation](#9-privacy-security--moderation)
- [10. License](#10-license)

---

## 1. Overview & Vision

College students experience their most intense, formative, and volatile years in dense physical communities. Yet modern social platforms fail them in two opposite extremes:
1. **Vanity-Driven Networks (Instagram, LinkedIn):** Demand polished performance, permanent reputation stakes, and curated personas. Students self-censor their real struggles, mental health, and unpopular opinions.
2. **Toxic Anonymity Boards (Historical Yik Yak, Jodel):** Without campus boundaries, verified attendance, or accountable moderation, these apps rapidly devolve into harassment hubs.

**SpillATea bridges this gap.** It provides a safe, curated, editorial town square where verified students discuss campus life, share confessions, seek vulnerable advice, debate course rigor, and connect with peer empathy without exposing their identity to classmates.

---

## 2. System Architecture

```
                                  ┌──────────────────────────────┐
                                  │      Client (Browser)        │
                                  │   React 19 + Vite + Tailwind │
                                  └──────────────┬───────────────┘
                                                 │
                                           REST API Calls
                                     (JSON over HTTP/HTTPS)
                                                 │
                                                 ▼
                                  ┌──────────────────────────────┐
                                  │    Node.js Express Server    │
                                  │   Routes, CORS, Moderation   │
                                  └──────────────┬───────────────┘
                                                 │
                                  ┌──────────────┴───────────────┐
                                  │   Mongoose Data Layer        │
                                  │   Strict Projection & Hooks  │
                                  └──────────────┬───────────────┘
                                                 │
                        ┌────────────────────────┴────────────────────────┐
                        │                                                 │
       NODE_ENV !== "production"                         NODE_ENV === "production"
                        ▼                                                 ▼
        ┌──────────────────────────────┐                  ┌──────────────────────────────┐
        │   spillatea_dev Database     │                  │   spillatea_prod Database    │
        │   (Localhost Tests & Dummy)  │                  │   (Live Verified Users)      │
        └──────────────────────────────┘                  └──────────────────────────────┘
```

---

## 3. How We Built This Project (Engineering Journey)

The development of SpillATea followed a disciplined, five-phase product engineering lifecycle:

### Phase 1: Design Identity & Anti-AI Aesthetics
- **Editorial Typography & Hierarchy:** Avoided generic SaaS card-grids, neon glow outlines, and rainbow gradients. Designed a restrained monochrome palette (#050506 dark charcoal, subtle 7% white borders, and focused `#F06A3A` terracotta accent).
- **Sequential Indexing:** Introduced catalog-style serial numbers (`No. 001`, `No. 002`) and timeline day dividers to make confessions feel like a daily literary publication rather than an algorithmic slot machine.

### Phase 2: Frontend Architecture & Resilient Adapters
- Implemented a decoupled architecture where all UI components interact with a unified interface ([`src/services/db.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/src/services/db.js)).
- Engineered an **Adapter Pattern** that allows the frontend to run with live Express/MongoDB while gracefully falling back to local persistence during offline testing or cold boots.

### Phase 3: Transition to Express & MongoDB Atlas
- Replaced mock client persistence with a production **Node.js Express 5.x** backend.
- Designed schema models with Mongoose ([`Confession`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/Confession.js), [`Comment`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/Comment.js), [`Report`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/Report.js), [`AuditLog`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/models/AuditLog.js)).
- Implemented high-performance atomic database operations: `$inc` for like counters, `$regex` indexing for fast multi-field search, and relational child comment aggregation.

### Phase 4: Dual-Environment Database Isolation
- Structured environment configurations to cleanly segregate testing data from live production data.
- Built automated connection switching: localhost testing writes strictly to `spillatea_dev`, while production builds communicate with `spillatea_prod`.
- Developed an automated seeding utility ([`server/scripts/seed.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/scripts/seed.js)) ensuring empty dev clusters hydrate instantly with realistic campus discussions.

### Phase 5: Privacy Engineering & Audit Governance
- Implemented strict database-level pseudonymity: real student identities are excluded from normal queries via Mongoose `select: false`.
- Built server-authenticated moderator reveal protocols with tamper-evident audit records.

---

## 4. Dual-Environment Database Strategy

A primary engineering priority was ensuring **localhost testing never corrupts real student data**.

| Environment | Database Target | Trigger | Purpose |
|---|---|---|---|
| **Local Development** | `spillatea_dev` | `NODE_ENV=development` (Default) | Safe testing, mock submissions, bug reproductions, automated tests. |
| **Production** | `spillatea_prod` | `NODE_ENV=production` | Verified student confessions, permanent records, live engagement. |

### How It Works:
The connection manager ([`server/config/db.js`](file:///c:/Users/satya/OneDrive/Desktop/SpillATea/server/config/db.js)) dynamically resolves target URIs on startup:
```javascript
const uri = isProd
  ? (process.env.MONGODB_PROD_URI || process.env.MONGODB_URI)
  : (process.env.MONGODB_DEV_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/spillatea_dev');
```

---

## 5. Core Features

- 🎭 **Strict Pseudonymity:** Normal students only see `Anonymous Student` with their public serial number. Real author metadata is stripped at the database query level.
- 📜 **Daily Confession Board:** Clean chronological timelines grouped by day with category navigation (*Crushes*, *Academics*, *Late Night*, *Lost & Found*, *Advice*).
- 💬 **Threaded Comments:** Direct student discussions with real-time comment counting and auto-moderation filters.
- ⚡ **Micro-Interactions & Keyboard Navigation:**
  - `J` / `K` — Navigate between confessions
  - `L` — Toggle reaction upvote
  - `C` — Open comment thread
  - `Esc` — Close dialogs
- 🛡️ **Campus Safety & Report Queue:** Student report submission workflow with dedicated moderator resolution dashboards.
- 🔍 **Audited Identity Reveal:** In emergency safety situations (e.g., self-harm or violent threats), authorized campus moderators can request identity verification through a server-audited process that logs every reveal event permanently.
- 📊 **Real-Time Board Analytics:** Aggregated counts of confessions, active categories, and popular daily threads.

---

## 6. Technology Stack

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Styling:** [TailwindCSS 4](https://tailwindcss.com/) with Custom CSS Design Tokens
- **Icons:** Original SVG Iconography (Zero external icon-pack bloat)

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) (v20+)
- **Server Framework:** [Express 5](https://expressjs.com/)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) (Cloud Cluster)
- **ODM:** [Mongoose 9](https://mongoosejs.com/)
- **Security & Utilities:** `cors`, `dotenv`, `concurrently`

---

## 7. Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- A free [MongoDB Atlas](https://cloud.mongodb.com/) cluster (or local MongoDB daemon)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/SpillATea.git
cd SpillATea
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Mode: 'development' (localhost) or 'production' (live website)
NODE_ENV=development

# 🟢 DUMMY / DEV DATABASE (Localhost testing)
MONGODB_DEV_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/spillatea_dev?retryWrites=true&w=majority

# 🔴 PRODUCTION DATABASE (Live users)
MONGODB_PROD_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/spillatea_prod?retryWrites=true&w=majority

# Fallback URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/spillatea_dev?retryWrites=true&w=majority

# Server & Client Ports
PORT=5000
VITE_API_URL=http://localhost:5000/api
```

### 3. Run Application
Run both the Express backend and React Vite frontend concurrently with one command:
```bash
npm run dev:all
```

Your app will be available at:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Database Seeding CLI
The database automatically seeds on first launch if empty. You can also manually seed or reset your test database anytime:
```bash
npm run seed          # Seeds initial campus data if empty
npm run seed -- --force # Resets collections and seeds fresh fixtures
```

---

## 8. API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/health` | Service and MongoDB status | No |
| `GET` | `/api/confessions` | Filter, search, and paginate confessions | No |
| `GET` | `/api/confessions/:id` | Retrieve single confession by ID or number | No |
| `POST` | `/api/confessions` | Submit new confession with sequential numbering | No |
| `POST` | `/api/confessions/:id/like` | Atomic reaction upvote toggle | No |
| `DELETE` | `/api/confessions/:id` | Remove confession and associated comments | Author / Admin |
| `GET` | `/api/comments/:postId` | Fetch all comments for a confession | No |
| `POST` | `/api/comments/:postId` | Add a comment to a confession | No |
| `POST` | `/api/reports` | Submit a moderation report | No |
| `GET` | `/api/reports` | Retrieve moderation review queue | Moderator |
| `PATCH` | `/api/reports/:id/action` | Resolve or dismiss a moderation report | Moderator |
| `POST` | `/api/admin/reveal` | Secure student identity lookup with audit log | Admin Only |
| `GET` | `/api/admin/audit-logs` | Retrieve moderation reveal audit trail | Admin Only |
| `GET` | `/api/stats/today` | Real-time board statistics and category counts | No |

---

## 9. Privacy, Security & Moderation

SpillATea was engineered around the **Master Project Rules (Rule 10: Anonymous Identity & Security)**:

1. **Zero Client-Side Deanonymization:** Unlike generic templates that send real user IDs and hide them with CSS, SpillATea strips author identities on the server with Mongoose projection (`select: false`).
2. **Separation of Roles:** Normal students cannot retrieve private author information through network inspection, API tools, or console inspection.
3. **Accountability Through Audit Logs:** To prevent abuse of power, campus moderators cannot silently peek at author identities. Every identity reveal request requires server verification and writes an immutable record to the `AuditLog` collection.

---

## 10. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
