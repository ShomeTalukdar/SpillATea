# SPILLATEA — MASTER PRODUCT SPECIFICATION
**Version:** 1.0.0-PROD  
**Status:** Approved for Implementation  
**Role:** Senior Product Strategist, Consumer Social & Anonymous Platforms  
**Target:** Engineering, Trust & Safety, Design, and Product Operations  

---

## 1. PRODUCT VISION & PROBLEM STATEMENT

### 1.1 The Campus Social Paradox
College students experience their most intense, formative, and socially volatile years in dense physical communities. Yet, contemporary digital communication tools fail them in two opposite extremes:
1. **The Identity-Obsessed Platforms (Instagram, LinkedIn, BeReal):** Demand polished performance, social signaling, and permanent reputation stakes. Students self-censor their real struggles, academic failures, mental health concerns, unpopular opinions, and vulnerability out of fear of social or professional fallout.
2. **The Unmoderated Anonymity Platforms (historical Yik Yak, Jodel, Omegle):** Without verified campus boundaries, robust safety architectures, or accountable moderation, these platforms rapidly devolve into toxic havens for targeted bullying, racism, spam, and misinformation, ultimately resulting in campus bans or user abandonment.

### 1.2 The SpillATea Vision
**"The conversations happening after hours."**

SpillATea is an intimate, pseudonymous, high-trust campus social platform. It provides a digital town square where verified college students discuss real campus life, share confessions, debate course rigor, seek candid advice, and laugh over shared experiences without exposing their personal identities to peers.

The platform is designed around four foundational pillars:
- **Intimacy & Culture:** A dark, editorial aesthetic reflecting late-night study lounges, dorm discussions, and authentic student culture.
- **Pseudonymity with Accountability:** Absolute privacy between students; audited, verified accountability for community safety.
- **Content-First Simplicity:** Zero algorithmic vanity games, follower counts, or influencer metrics. High-quality conversations take center stage.
- **Trust & Campus Signal:** Verified `.edu` attendance ensures students are talking with actual campus peers, not outside trolls or commercial actors.

---

## 2. TARGET-USER PROFILES & PRIMARY USE CASES

```
+-------------------------------------------------------------------------------------------------------+
|                                        SPILLATEA USER ECOSYSTEM                                       |
+------------------------------------+------------------------------------+-----------------------------+
| 1. THE LURKER / BROWSER            | 2. THE ANONYMOUS AUTHOR            | 3. THE IDENTIFIED AUTHOR    |
| - Consumes campus news & tea       | - Seeks vulnerable advice          | - Shares study guides       |
| - Browses during study breaks      | - Vents about professors/dining    | - Organizes student groups  |
| - Upvotes relatable content        | - Confesses crushes/blunders       | - Builds peer reputation    |
+------------------------------------+------------------------------------+-----------------------------+
| 4. THE STUDENT MODERATOR           | 5. THE PLATFORM ADMINISTRATOR                                    |
| - Evaluates flagged reports        | - Manages role assignments & university tenants                  |
| - Removes toxic/harassing content  | - Audits moderator identity-reveal access                        |
| - Issues warnings & suspensions    | - Enforces legal compliance & safety policies                    |
+------------------------------------+------------------------------------------------------------------+
```

### 2.1 Persona 1: The Campus Lurker (65% of Active Base)
- **Profile:** Second-year undergraduate studying engineering. Rarely posts on social media due to peer anxiety.
- **Needs:** Needs to know what is actually happening on campus—curve averages, library hours, dining hall warnings, campus humor.
- **Key Workflows:** Opens the app late at night or between classes, browses "For You" and "Trending", filters by "Academics" or "Confessions", upvotes relatable posts, shares links with roommates.
- **Frustrations:** Hates clickbait, fake activity notifications, and aggressive advertisements.

### 2.2 Persona 2: The Anonymous Contributor (25% of Active Base)
- **Profile:** First-year student overwhelmed by college transition, dating dilemmas, or academic pressure.
- **Needs:** Needs a safe, cathartic outlet to seek guidance or vent without roommates, professors, or future employers tracing the post back to their personal identity.
- **Key Workflows:** Clicks "Spill Something", toggles to "Anonymous", writes candid narrative, selects "Confessions" or "Advice", tracks anonymous community replies in real time.
- **Frustrations:** Terrified of accidental identity leaks, metadata deanonymization, or public call-outs.

### 2.3 Persona 3: The Identified Contributor (8% of Active Base)
- **Profile:** Student club leader, teaching assistant, or outspoken campus organizer.
- **Needs:** Wants to share official campus tips, recommend open study desks, organize organic chemistry tutoring sessions, or build authentic campus recognition.
- **Key Workflows:** Creates posts with "Public" toggled on, displaying their verified name; participates in comment threads with verified identity.
- **Frustrations:** Being dismissed as spam or drowned out by toxic noise.

### 2.4 Persona 4: The Peer Moderator (1.5% of Active Base)
- **Profile:** Vetted senior student or student council representative trained on campus speech and safety standards.
- **Needs:** Fast, information-dense report queue to assess flagged posts, categorize violations, remove hate speech/harassment, and escalate severe threats.
- **Key Workflows:** Reviews queue by violation severity, reads context, clicks "Approve", "Remove", or "Issue Warning". In extreme doxxing/threat cases, submits an audited justification to inspect author identity.
- **Frustrations:** Slow moderation dashboards, ambiguous policies, lack of audit trails that expose moderators to false accusations of bias.

### 2.5 Persona 5: The University / Platform Administrator (0.5% of Base)
- **Profile:** Campus safety liaison or lead platform engineer.
- **Needs:** Complete oversight of platform health, moderator accountability, immutable audit log review, and emergency intervention protocols.
- **Key Workflows:** Audits identity-reveal logs, manages suspensions, reviews appeals, tunes automated keyword/safety filters, provisions campus instances.

---

## 3. CORE USER JOURNEYS

### Journey A: The Late-Night Confession (Anonymous Posting)
```
[Student opens SpillATea at 1:15 AM]
        |
        v
[Views Feed -> "Campus Feed / After Hours"]
        |
        v
[Clicks "+ Spill Something" in Sidebar]
        |
        v
[Composer Opens -> Default: "Posting Anonymously" (Masked as Anonymous Student #XX)]
        |
        v
[Enters Title: "I accidentally submitted my rough draft with notes for my professor"]
[Enters Body -> Selects Category: "Confessions"]
        |
        v
[Client Validation -> Checks character limits (Title <= 120, Content <= 5000)]
        |
        v
[Submits -> Pre-Publish Automated Safety Gate checks for severe PII/Threats]
        |
        v
[Success -> Assigned Sequential Serial #01 -> Rendered on Campus Feed]
```

### Journey B: Discussion & Peer Support (Community Interaction)
```
[Student reads Post #01]
        |
        v
[Clicks Upvote -> Counter updates instantly (optimistic UI), saved to DB]
        |
        v
[Clicks into Post Detail (/post/1) -> Enters clean discussion view]
        |
        v
[Types Reply -> Toggles "Post Anonymously" -> Submits]
        |
        v
[Comment appends to threaded discussion with vertical hairline connector]
```

### Journey C: Safety Intervention & Audited Identity Reveal (Moderation)
```
[Malicious user posts targeted harassment containing another student's phone number]
        |
        v
[Multiple students click "Report" -> Reason: "Exposed Personal Information"]
        |
        v
[Post automatically quarantined -> Moved to Moderator Pending Review Queue]
        |
        v
[Moderator logs in -> Reviews Report #882 in Moderation Console]
        |
        v
[Moderator clicks "Remove Post" -> Status changed to 'removed']
        |
        v
[Moderator assesses danger -> Clicks "View Hidden Profile"]
        |
        v
[Privileged Access Modal prompts: "State formal investigation reason"]
[Moderator enters: "Emergency: Doxxing victim with phone number and dorm address"]
        |
        v
[Backend Verifies: Session active + Role IN ('moderator','admin')]
[Backend Writes IMMUTABLE AUDIT LOG: (Mod ID, Target Post, Reason, Timestamp)]
[Backend Returns Private Author Info: "John Doe (j.doe@college.edu)"]
        |
        v
[Moderator issues 7-day suspension -> Audit trail signed and locked]
```

---

## 4. FUNCTIONAL REQUIREMENTS

### 4.1 Authentication & Account Management
| ID | Requirement | Description |
|---|---|---|
| **FR-AUTH-01** | College Domain Verification | Users must authenticate with an approved university email address (e.g. `@*.edu`). |
| **FR-AUTH-02** | Passwordless / Secure Auth | Support magic link or secure credentials with session token persistence. |
| **FR-AUTH-03** | User Profiles | Each user account maintains: `id` (UUID), `display_name` (string), `college_email` (string), `role` (`student`, `moderator`, `admin`), `status` (`active`, `warned`, `suspended`). |
| **FR-AUTH-04** | Role Persistence | Role privileges must be validated on the backend via Row Level Security (RLS) and server functions, never trusting client state. |

### 4.2 Anonymous & Public Posting System
| ID | Requirement | Description |
|---|---|---|
| **FR-POST-01** | Dual Identity Mode | Author can toggle between `Anonymous` (default) and `Public` on every post. |
| **FR-POST-02** | Public Sequential Numbering | Every post receives an incremental, human-readable serial number (`#01`, `#02` ... `#100`) for campus discourse. |
| **FR-POST-03** | Anonymity Wall | When `is_anonymous = true`, the public API/View MUST return `author_name = 'Anonymous Student'` and `author_id = NULL`. |
| **FR-POST-04** | Title & Body Validation | Title: 3–120 characters. Content: 1–5,000 characters. Both trimmed of leading/trailing whitespace. |
| **FR-POST-05** | Category Assignment | Must select exactly one valid category: `Confessions`, `College Life`, `Academics`, `Relationships`, `Rants`, `Memes & Fun`, `Advice`. |

### 4.3 Campus Feed & Content Discovery
| ID | Requirement | Description |
|---|---|---|
| **FR-FEED-01** | Feed Tabs | Supports `For You` (engagement/recency blend), `Most Recent` (chronological), `Trending` (velocity score in 24h), and `Following` (when followed creators exist). |
| **FR-FEED-02** | Category Filtering | Single-click horizontal category bar filtering the feed without full page reload. |
| **FR-FEED-03** | Feed Performance | Feed results paginated (20 posts per batch) with cursor or offset-based loading. |
| **FR-FEED-04** | Clean Visual Sequence | Each feed item displays Author, Timestamp, Serial Number (`#01`), Category badge, Title, Content snippet, and Engagement row. |

### 4.4 Search & Discovery
| ID | Requirement | Description |
|---|---|---|
| **FR-SRCH-01** | Full-Text Search | Search query debounced (200–300ms) matching titles and post narrative bodies. |
| **FR-SRCH-02** | Search Anonymity | Search endpoints must query against the sanitized public view to prevent search-based identity correlation attacks. |
| **FR-SRCH-03** | Tag Filtering | One-click search shortcuts for common campus topics (`#Midterms`, `#Library`, `#DiningHall`, `#Roommates`). |

### 4.5 Discussions & Threaded Replies
| ID | Requirement | Description |
|---|---|---|
| **FR-COMM-01** | Comment Threading | Posts support hierarchical replies with parent-child linkage. |
| **FR-COMM-02** | Anonymous Comments | Commenters can choose to reply anonymously or under their public display name. |
| **FR-COMM-03** | Thread Hierarchy Display | Display replies with clean vertical hairline connector lines rather than nested heavy cards. |
| **FR-COMM-04** | Real-Time Counter | Increments `comment_count` on parent post transactionally. |

### 4.6 Reactions (Voting System)
| ID | Requirement | Description |
|---|---|---|
| **FR-VOTE-01** | Upvote / Downvote | Users can upvote (+1) or downvote a post. |
| **FR-VOTE-02** | Idempotence & Toggle | Clicking an active upvote removes it; switching to downvote decrements upvote and applies downvote in a single atomic transaction. |
| **FR-VOTE-03** | Duplicate Prevention | Enforced via unique constraint on `(post_id, user_id)`. |

### 4.7 Sharing & Reporting
| ID | Requirement | Description |
|---|---|---|
| **FR-SHAR-01** | Canonical Link Copy | Generates clean URL `/post/:post_number` and writes to user clipboard with visual toast confirmation. |
| **FR-SHAR-02** | Multi-Option Report | Report modal requires category selection: `Harassment or Bullying`, `Hate Speech`, `Exposed Personal Information (Doxxing)`, `Threats or Violence`, `Spam`, `Academic Dishonesty`. |
| **FR-SHAR-03** | Auto-Quarantine Threshold | If a post accumulates >= 5 distinct reports within 2 hours, status automatically shifts from `published` to `pending_review`. |

### 4.8 User Profile & Personal Activity
| ID | Requirement | Description |
|---|---|---|
| **FR-PROF-01** | Personal View Separation | User can view their own history: `My Posts`, `My Replies`, `Upvotes Received`. |
| **FR-PROF-02** | Self-Anonymity Privacy | In the user's private view, their anonymous posts are marked with a private badge (`[🔒 Anonymous • Only visible to you]`). Other users cannot view this ledger. |
| **FR-PROF-03** | Settings Decoupling | Account settings (Display name, email notifications) are isolated from public profile presentation. |

### 4.9 Moderation Console & Workflow
| ID | Requirement | Description |
|---|---|---|
| **FR-MOD-01** | RBAC Authorization | Only authenticated users with `role IN ('moderator', 'admin')` can access `/admin`. Unauthorized requests return a 403 / restricted view. |
| **FR-MOD-02** | Queue Categorization | Dedicated tabs: `Reports`, `Pending Review`, `Warnings`, `Suspensions`, `Recent Actions`. |
| **FR-MOD-03** | Action Execution | Moderators can: `Approve` (clears flags), `Remove` (requires confirmation modal, sets status to `removed`), `Issue Warning`. |
| **FR-MOD-04** | Destructive Action Dialog | Destructive removals require confirmation showing post number and reason. |

### 4.10 Privileged Identity Reveal Protocol
| ID | Requirement | Description |
|---|---|---|
| **FR-REV-01** | Server-Side Gating | Real author details are NEVER sent in feed or post payloads. |
| **FR-REV-02** | Mandatory Justification | Moderator must submit an investigation reason (minimum 10 characters) prior to decryption. |
| **FR-REV-03** | Immutable Audit Generation | The reveal transaction atomically writes an audit record before returning author display name and email. |
| **FR-REV-04** | Data Minimization | Authorized reveal exposes ONLY: Full Name, College Email, and Account Status. Internal credentials, passwords, or unrelated device identifiers are NEVER returned. |

---

## 5. NON-FUNCTIONAL REQUIREMENTS

```
+-------------------------------------------------------------------------------------------------------+
|                                    NON-FUNCTIONAL ARCHITECTURE PILLARS                                |
+------------------------------------+------------------------------------+-----------------------------+
| PERFORMANCE & SPEED                | PRIVACY & SECURITY                 | RELIABILITY & UPTIME        |
| - Feed TTFB < 180ms                | - RLS Database Enforcement         | - 99.9% availability        |
| - Bundle Size < 120kB gzip         | - Cryptographic Audit Log Trail    | - Offline-first preview     |
| - Zero layout shift (CLS = 0)      | - Strict Sanitization of Inputs    | - Graceful error boundaries |
+------------------------------------+------------------------------------+-----------------------------+
```

### 5.1 Security & Cryptographic Privacy
- **Zero Client-Side Privacy Logic:** Any privacy model that relies on frontend `if (!isModerator) delete post.author` is considered a catastrophic vulnerability. All sanitization occurs at the PostgreSQL database view / API gateway level.
- **Service-Role Key Protection:** Supabase `service_role` keys must never be packaged into frontend bundles or client scripts.
- **SQL Injection & XSS Immunity:** All queries parameterized through ORM/query builder. All post bodies sanitized against script injection and rendered as text nodes.

### 5.2 Performance & Rendering
- **First Contentful Paint (FCP):** < 0.8 seconds on standard 4G networks.
- **Time to Interactive (TTI):** < 1.2 seconds.
- **Asset Overhead:** Zero heavy animation libraries (Framer Motion, Three.js) for basic UI states; pure CSS transitions for transform/opacity.
- **Static Assets:** Monochromatic noise texture rendered via lightweight SVG data URI; custom inline SVG icons (< 1kB each).

### 5.3 Accessibility & Responsiveness
- **WCAG 2.1 AA Compliance:** Minimum contrast ratio of 4.5:1 for normal text (`#F5F5F5` against `#050506` provides 18.2:1 contrast).
- **Responsive Layout:** 
  - Mobile (< 768px): Sticky top header, full-width stream, bottom navigation bar with 48px touch targets.
  - Tablet (768px–1024px): Compact sidebar rail, centered feed.
  - Desktop (> 1024px): Three-zone editorial architecture (Navigation Rail 240px, Main Feed 640px, Discovery Panel 320px).
- **Reduced Motion:** Full support for `prefers-reduced-motion: reduce` disabling transitions.

---

## 6. MVP FEATURES VERSUS LATER FEATURES

To maintain engineering discipline and deliver a production-ready application without scope bloat, features are divided into strict phases based on existing repository capabilities.

```
+----------------------------------------------------------------------------------------------------+
|                                      FEATURE ROADMAP PHASING                                       |
+---------------------------------------------------+------------------------------------------------+
| PHASE 1: CORE MVP (Existing / Immediate Target)    | PHASE 2: CAMPUS EXPANSION (Post-MVP)           |
+---------------------------------------------------+------------------------------------------------+
| [x] Verified .edu Authentication Architecture     | [ ] Multi-Campus University Isolation          |
| [x] Pitch-Black Editorial Design System           | [ ] Native Mobile App (React Native/Capacitor) |
| [x] Dual Identity Posting (Anon vs Public)        | [ ] Real-Time WebSockets for Live Discussions  |
| [x] Sequential Public Post Serial Numbers (#01)   | [ ] Student Organization Verified Badges       |
| [x] Category & Multi-Tab Campus Feed              | [ ] Direct Peer Messaging (Pseudonymous DMs)   |
| [x] Full Threaded Commenting System               | [ ] Push Notifications (FCM / APNS)            |
| [x] Atomic Upvote/Downvote Engine                 | [ ] Automated AI Threat Analysis Pipeline      |
| [x] 6-Category Content Reporting Flow             | [ ] Cryptographic Zero-Knowledge Identity Proofs|
| [x] Moderator Review Queue & Quarantining         | [ ] University Administration Escalation Portal|
| [x] Audited Privileged Identity Reveal & Logs     | [ ] End-of-Semester "Best of Campus" Digest    |
+---------------------------------------------------+------------------------------------------------+
```

### Existing Codebase Capabilities Matrix
| Feature Area | Current Status in Repo | MVP Gap / Required Refinement |
|---|---|---|
| **Design System** | Complete (`#050506`, DM Sans, IBM Plex Mono, hairline borders) | Remove stray AI-like dots and subtitles (Completed). |
| **Database Schema** | Schema migration drafted in `supabase/migrations/01_init.sql` | Needs cloud instance provisioning and verified RLS deployment. |
| **Feed & Filtering** | Fully functional in `src/pages/HomePage.jsx` and `db.js` | Add infinite scroll pagination for large production feeds. |
| **Moderator Identity** | Automated decryption implemented with unique authors | Formally lock reveal behind explicit reason modal in cloud mode. |
| **Reporting & Audit** | Full audit logging implemented in `db.js` and `AdminPage.jsx` | Connect to immutable Supabase audit table in production. |

---

## 7. TRUST AND SAFETY POLICY

### 7.1 Community Code of Conduct
SpillATea exists to facilitate honest campus discussion. The following behaviors are strictly prohibited and result in immediate content removal and graduated account sanctions:

1. **Targeted Harassment & Bullying:** Directly attacking a named individual, posting defamatory claims about specific students, or encouraging peer dogpiling.
2. **Doxxing & Personal Information Exposure:** Publishing phone numbers, dorm room numbers, personal social handles, private photos, or academic records.
3. **Threats of Harm or Violence:** Any expression of intent to commit physical harm, violence, self-harm, or campus disruption.
4. **Hate Speech:** Demeaning language or slurs targeting race, ethnicity, religion, gender, sexual orientation, disability, or nationality.
5. **Academic Fraud & Blackmail:** Selling exam answer keys, offering money for exam completion, or blackmailing instructors/students.
6. **Commercial Spam & Bot Advertising:** Promoting commercial venues, fake housing links, crypto, or third-party escort/gambling services.

### 7.2 Graduated Enforcement Framework
```
+----------------------------------------------------------------------------------------+
|                                ENFORCEMENT PROGRESSION                                 |
+----------------------------------------------------------------------------------------+
| Level 1: Content Removal + Educational Notice (First minor infraction)                 |
|         |                                                                              |
|         v                                                                              |
| Level 2: Official Moderator Warning (Logged to user account history)                  |
|         |                                                                              |
|         v                                                                              |
| Level 3: 48-Hour Temporary Posting Suspension (Can browse, cannot post or reply)       |
|         |                                                                              |
|         v                                                                              |
| Level 4: 7-Day Campus Ban (Full account lockdown; escalated to Trust & Safety)         |
|         |                                                                              |
|         v                                                                              |
| Level 5: Permanent University Account Blacklist + Referral (Zero Tolerance for Threats)|
+----------------------------------------------------------------------------------------+
```

---

## 8. ABUSE CASES & MITIGATIONS

```
+---------------------------------------------------------------------------------------------------+
| ABUSE VECTOR                  | VULNERABILITY                     | SPILLATEA MITIGATION          |
+-------------------------------+-----------------------------------+-------------------------------+
| 1. The Dorm Room Doxxer       | Anonymous author posts peer dorm  | Automated regex pattern filter|
|                               | room number and private phone.    | flags numbers before publish; |
|                               |                                   | immediate quarantine upon 1   |
|                               |                                   | report; audited identity unmask|
+-------------------------------+-----------------------------------+-------------------------------+
| 2. The Rogue Moderator        | Moderator uses privileged access  | Reason modal mandatory;       |
|                               | to voyeuristically unmask         | immutable audit logs visible to|
|                               | peers who post confessions.       | admins; automated alerts if a |
|                               |                                   | mod reveals >3 IDs in 24 hours|
+-------------------------------+-----------------------------------+-------------------------------+
| 3. The Bot Astroturfer        | Commercial entity scripts 500     | Verified university email gate|
|                               | fake housing posts via API.       | with rate-limiting (max 5     |
|                               |                                   | posts/hour per user); captcha |
+-------------------------------+-----------------------------------+-------------------------------+
| 4. The Downvote Mob           | Fraternity coordinates brigade to | Idempotent reaction table;    |
|                               | downvote competing club's post.   | IP + User ID correlation; max |
|                               |                                   | negative score floor (-15)    |
+-------------------------------+-----------------------------------+-------------------------------+
```

---

## 9. PRIVACY AND DATA-RETENTION REQUIREMENTS

### 9.1 The Three-Tier Identity Isolation Architecture
```
+---------------------------------------------------------------------------------------------------+
| TIER 1: PUBLIC PEER VIEW (What normal students see)                                              |
| - Display Name: "Anonymous Student"                                                               |
| - Public Serial Number: #01, #02...                                                               |
| - NO author_id, NO email, NO profile avatar, NO correlation across posts                         |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| TIER 2: INTERNAL USER VIEW (What the author sees)                                                 |
| - Own post history ledger marked [🔒 Anonymous • Only visible to you]                             |
| - Upvote / reply notifications delivered to private user queue                                   |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| TIER 3: PRIVILEGED AUDIT VIEW (What authorized moderators see under formal safety review)        |
| - Real Name & College Email revealed ONLY via signed RPC procedure                                |
| - Reason recorded to immutable audit_logs table before disclosure                                 |
+---------------------------------------------------------------------------------------------------+
```

### 9.2 Honest Anonymity Disclosure
SpillATea practices ethical transparency. The platform **must never promise absolute, military-grade untraceability** to students:
> *"Your identity stays private from other students. Our moderation system helps keep the community safe without exposing who you are to peers. If severe threats, sexual violence, or illegal acts occur, authorized safety moderators can inspect author records to protect campus safety."*

### 9.3 Data Retention & Purging Policies
- **Active Posts & Comments:** Maintained while status is `published`.
- **Soft-Deleted Content:** Retained in `removed` state for 30 days for safety appeals and law enforcement compliance if required, then scrubbed from active tables.
- **Audit Logs:** Retained for a minimum of 365 days in append-only storage to guarantee moderator accountability.
- **Account Deletion:** If a student requests account termination, their private profile is deleted immediately. Historical anonymous posts have their internal author foreign key disconnected (`SET NULL`), breaking any link between the post and the former student.

---

## 10. SUCCESS METRICS & KPIS

```
+---------------------------------------------------------------------------------------------------+
| CATEGORY          | PRIMARY KPI                     | TARGET BENCHMARK (CAMPUS LAUNCH)            |
+-------------------+---------------------------------+---------------------------------------------+
| 1. ENGAGEMENT     | DAU / MAU Ratio                 | > 42% (High-stickiness daily campus habit)  |
|                   | Median Daily Time in App        | > 11 minutes per active student             |
|                   | Content Consumption Depth       | > 14 discussions browsed per session        |
+-------------------+---------------------------------+---------------------------------------------+
| 2. PARTICIPATION  | Daily Active Spills (Posts)     | 25-50 posts per 1,000 enrolled students     |
|                   | Reply-to-Post Multiplier        | > 5.5 replies per discussion thread         |
|                   | Upvote Participation Rate       | > 60% of daily active users cast >=1 vote   |
+-------------------+---------------------------------+---------------------------------------------+
| 3. TRUST & SAFETY | Median Report Resolution Time   | < 25 minutes from user flag to mod action   |
|                   | Repeat Violation Rate           | < 4% after level 1 moderator warning        |
|                   | Unauthorized Identity Unmasking | 0 incidents (100% justified & audited)      |
+-------------------+---------------------------------+---------------------------------------------+
```

---

## 11. ACCEPTANCE CRITERIA FOR EVERY MVP FEATURE

### AC-01: Anonymous Post Creation
- **Given** an authenticated student on the `/create` page,
- **When** the user writes a valid title (3–120 chars) and body (1–5000 chars) with `Anonymous` toggled on,
- **Then** the post is created in `public.posts` with `is_anonymous = true`,
- **And** the user is redirected to `/post/:post_number`,
- **And** on the public feed, the post displays `Anonymous Student` with an anonymous avatar and serial `#XX`,
- **And** ordinary HTTP GET requests to `/api/posts` return `author_name: "Anonymous Student"` and `author_id: null`.

### AC-02: Voting & Reaction Idempotency
- **Given** an authenticated student viewing Post `#04` with 10 likes and 0 dislikes,
- **When** the student clicks the Upvote button,
- **Then** the like count immediately increments to 11 and the button turns brand orange (`#F06A3A`),
- **When** the student clicks the Upvote button a second time,
- **Then** the vote is cancelled, like count returns to 10, and orange highlight is removed,
- **When** the student clicks Downvote while Upvote is active,
- **Then** like count decrements to 10, dislike count increments to 1, and only Downvote is active.

### AC-03: Threaded Conversation View
- **Given** a post with 5 replies,
- **When** a user opens `/post/:post_number`,
- **Then** the original post renders with full editorial typography,
- **And** replies are listed sequentially with vertical hairline connector lines (`border-l-2 border-white/[0.07]`),
- **And** each reply displays author pseudonym, relative timestamp, and body without bulky card containers.

### AC-04: Report Submission & Quarantining
- **Given** an inappropriate discussion on the feed,
- **When** a student clicks the Report icon, selects "Harassment or Bullying", and clicks "Submit Report",
- **Then** a record is created in `public.reports` with status `pending`,
- **And** a confirmation toast appears: *"Report submitted to campus safety team."*,
- **And** when the report count for that post reaches 5, the post status automatically shifts to `pending_review` and disappears from public student feeds.

### AC-05: Privileged Moderator Identity Reveal
- **Given** an authenticated moderator viewing flagged Post `#02` in `/admin`,
- **When** the moderator clicks "View Hidden Profile",
- **Then** an authorized modal opens warning that the action is privileged and audited,
- **When** the moderator enters an investigation reason >= 10 characters and confirms,
- **Then** a record is written to `public.audit_logs` containing `(moderator_id, post_id, reason, timestamp)`,
- **And** the modal displays the decrypted student's verified name and university email,
- **And** regular students attempting to query the unmask endpoint receive a `403 Forbidden` error.

---

## 12. OPEN ARCHITECTURAL QUESTIONS

| # | Question | Current Assessment & Recommendation |
|---|---|---|
| **1** | **Supabase Cloud vs Self-Hosted Postgres** | For initial campus rollout, **Supabase Cloud Managed** is strongly recommended to leverage built-in Auth, Row Level Security, instant SSL, and automated point-in-time backups without server maintenance overhead. |
| **2** | **Multi-Campus Data Partitioning** | Should universities share a single table partitioned by `campus_id` or maintain isolated database schemas? **Recommendation:** Single unified schema with a strict `campus_id` foreign key on profiles, posts, and feeds. This allows cross-campus trending discovery in future phases while maintaining simple maintenance. |
| **3** | **Real-Time Notification Delivery** | WebSockets vs polling? **Recommendation:** Polling with SWR / React Query (every 60s) for feed updates; Supabase Realtime WebSocket subscriptions exclusively for active discussion threads (`/post/:id`) to prevent mobile battery drain. |
| **4** | **Hardware / Cryptographic Immutability for Audit Logs** | How to prove moderators did not tamper with audit history? **Recommendation:** Configure PostgreSQL table privileges so that `audit_logs` permits `INSERT` and `SELECT` only. Revoke `UPDATE` and `DELETE` permissions from all database roles including the service role. |

---

*SpillATea Product Specification — Reviewed and approved for engineering execution.*
