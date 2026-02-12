# Coupons Website (Better Than CouponDunia) — PRD & Execution Plan

## 1. Goal & Vision

Build a **high-performance, SEO-first coupons & deals platform** inspired by CouponDunia, but:

* Faster ⚡
* Cleaner UX 🧼
* Better content quality & freshness 🔁
* Strong admin CMS & automation 🤖
* Scalable monetization (affiliate-first)

Target: Compete with CouponDunia / RetailMeNot-style platforms in India & globally.

---

## 2. Core Value Improvements vs CouponDunia

### UX / Product

* No clutter, fewer ads above the fold
* Real-time coupon validation signals
* Community-driven success/fail voting
* Smart search + filters
* Mobile-first (70%+ traffic expected)

### Tech

* Modern stack (Next.js + Headless CMS)
* ISR/SSG for SEO & speed
* Clean schema.org markup
* Edge caching

### Growth

* Programmatic SEO pages
* Auto-ingestion of deals
* AI-assisted coupon rewriting & expiry detection

---

## 3. Feature Breakdown (Functional Requirements)

### 3.1 User-Facing Features

#### Homepage

* Trending stores
* Top deals today
* Verified coupons
* Categories
* Festival / event banners (Diwali, Sale Days, etc)

#### Store Pages (Core SEO Asset)

* Store details
* Active coupons
* Expired coupons (collapsed)
* Success rate
* Last verified timestamp
* FAQ schema

URL example:

```
/store/amazon
```

#### Coupon Card

* Coupon title
* Code / Deal (no-code)
* Expiry date
* Success %
* "Copy & Go" CTA
* Reveal animation
* Tracking redirect

#### Search

* Store search
* Coupon search
* Category search

#### Categories

* Electronics
* Fashion
* Travel
* Food

#### User Interaction (Optional v2)

* Vote: Worked / Didn’t work
* Comment (logged-in users)

---

### 3.2 CMS / Admin Panel (Very Important)

#### Dashboard

* Total coupons
* Active vs expired
* Clicks
* Revenue (affiliate)

#### Coupon Management

* Add / edit / delete coupons
* Bulk upload (CSV)
* Auto-expiry
* Status: active / expired / scheduled

#### Store Management

* Store logo
* Affiliate tracking URL
* Categories
* SEO meta

#### Category Management

* Slug-based categories

#### SEO Control

* Meta title
* Meta description
* Canonical
* Index / noindex
* Schema toggles

#### Roles

* Admin
* Editor
* Content uploader

---

## 4. Tech Stack (Recommended)

### Frontend

* **Next.js 14 (App Router)**
* TypeScript
* Tailwind CSS
* Shadcn UI
* Framer Motion

### Backend

* **Next.js API routes** OR
* **NestJS** (if scaling big)

### Database

* PostgreSQL (Supabase / Neon)

### CMS (Choose ONE)

#### Option A — Headless CMS (Recommended)

* **Strapi** (self-hosted)
* OR **Sanity** (faster setup)

#### Option B — Custom CMS

* Next.js + Prisma + Admin UI

### Auth

* NextAuth

### Hosting

* Vercel (frontend)
* Supabase / Railway (DB + CMS)

### Analytics

* Google Analytics
* PostHog

### Affiliate Tracking

* Impact
* Admitad
* CJ
* Amazon Associates

---

## 5. Database Schema (Simplified)

### Stores

* id
* name
* slug
* logo
* affiliate_url
* description
* seo_meta

### Coupons

* id
* store_id
* title
* code
* deal_url
* expiry_date
* is_verified
* success_votes
* fail_votes
* status

### Categories

* id
* name
* slug

### Clicks

* id
* coupon_id
* timestamp
* ip

---

## 6. SEO Strategy (Critical)

### On-Page

* Store + coupon schema
* FAQ schema
* Clean URLs
* Internal linking

### Programmatic Pages

* "Amazon Coupons Today"
* "Flipkart Deals on Mobile"

### Performance

* Lighthouse 90+
* Core Web Vitals optimized

---

## 7. Cursor + PRD Driven Development (How YOU Build This)

### Step 1: Setup Repo

```
npx create-next-app coupons-platform
```

### Step 2: Create PRD in Cursor

Create a file:

```
/PRD.md
```

Paste this document inside.

### Step 3: Use Cursor Effectively (Pro Plus)

**Example Prompt inside Cursor:**

```
Build the database schema using Prisma for the Coupons platform as per PRD.md
```

Then:

```
Generate Store pages with SEO schema and ISR
```

Cursor will:

* Read PRD
* Generate production-ready code

### Step 4: CMS Integration

Ask Cursor:

```
Integrate Strapi CMS with Next.js frontend
```

### Step 5: Affiliate Tracking

* Create redirect API route
* Track click → redirect → affiliate URL

### Step 6: Deployment

* Frontend → Vercel
* CMS → Railway / Render
* DB → Supabase

---

## 8. Monetization

* Affiliate commissions
* Sponsored placements
* Email deals
* App (later)

---

## 9. Phase Roadmap

### Phase 1 (MVP – 30 days)

* Stores
* Coupons
* SEO pages
* CMS

### Phase 2

* Voting
* Comments
* Automation

### Phase 3

* AI coupon expiry detection
* Auto content refresh
