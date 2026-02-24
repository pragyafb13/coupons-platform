# Database Connection Setup for Vercel

## Problem: "MaxClientsInSessionMode: max clients reached"

This error occurs when your database connection pool is exhausted. On Vercel (serverless), each request can spawn a new instance, and each instance opens database connections. With many concurrent users or page reloads, you quickly hit the database's connection limit.

## Fixes Applied in Code

1. **`connection_limit=1`** – Automatically appended to `DATABASE_URL` on Vercel. Each serverless instance uses at most 1 connection.

2. **Caching** – Footer stats and header categories are cached for 60 seconds to reduce database queries.

## Additional Setup Required (Important)

### If using Neon

Use the **pooled connection string** (Transaction mode), not the direct Session mode string.

- In Neon dashboard: Connection Details → **Pooled connection**
- The pooled URL often uses a different host or port
- Add `?connection_limit=1` if not already in the URL (the app adds this on Vercel)

### If using Supabase

Use the **connection pooler** (port 6543), not the direct connection (port 5432).

- Direct: `postgresql://...@db.xxx.supabase.co:5432/postgres`
- Pooled: `postgresql://...@db.xxx.supabase.co:5432/postgres?pgbouncer=true`
- Or use the "Transaction" pooler URL from Supabase dashboard

### If using another PostgreSQL provider

Check your provider's docs for:
- Connection pooling / PgBouncer
- Transaction mode (preferred for serverless) vs Session mode
- Recommended connection limit for serverless (usually 1)

## Why Counts Show Zero

When the connection pool is exhausted, Prisma queries fail. The error handling returns empty arrays and 0 counts, so the UI shows "0 Active Coupons" and "0 Top Stores". Fixing the connection limit and using a pooler resolves this.
