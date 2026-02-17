# Environment Variables Setup for Vercel

## Required Environment Variables

To make login work, you need to set the following environment variables in your Vercel project:

### 1. Database
- `DATABASE_URL` - Your PostgreSQL connection string
  - **Important**: For Vercel deployments, use a **connection pooler URL** (not direct connection)
  - **For Supabase**: Use **Session pooler** (not Transaction pooler) for Prisma
    - Transaction pooler doesn't support prepared statements (Prisma requirement)
    - Session pooler works with Prisma but requires proper connection management
    - Connection string format: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
  - **For Neon**: Use the "Pooled connection" URL (includes `?pgbouncer=true`)
  - **For other providers**: Ensure the connection string includes pooling parameters
  - This prevents "MaxClientsInSessionMode" errors during build/prerendering

### 2. NextAuth Authentication (NextAuth v5)
- `AUTH_SECRET` or `NEXTAUTH_SECRET` - A random secret string (generate with: `openssl rand -base64 32`)
  - **Note**: NextAuth v5 prefers `AUTH_SECRET`, but also accepts `NEXTAUTH_SECRET` for compatibility
- `GITHUB_ID` - Your GitHub OAuth App Client ID
- `GITHUB_SECRET` - Your GitHub OAuth App Client Secret
- `NEXTAUTH_URL` (optional but recommended) - Your production URL: `https://coupons-platform.vercel.app`

## How to Set Up GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App" (or edit existing)
3. Fill in:
   - **Application name**: DealStack Admin (or any name)
   - **Homepage URL**: `https://coupons-platform.vercel.app`
   - **Authorization callback URL**: `https://coupons-platform.vercel.app/api/auth/callback/github`
4. Click "Register application" (or "Update application")
5. Copy the **Client ID** and generate a **Client Secret**
6. Add these to Vercel environment variables

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - `AUTH_SECRET` or `NEXTAUTH_SECRET` - Generate a random string (see below)
   - `GITHUB_ID` - From GitHub OAuth App (e.g., `0v231iU9GjaMaspCKMkr`)
   - `GITHUB_SECRET` - From GitHub OAuth App (starts with `9cd8363e...`)
   - `DATABASE_URL` - Your database connection string
   - `NEXTAUTH_URL` (optional) - `https://coupons-platform.vercel.app`
4. **IMPORTANT**: Make sure to add them for **Production**, **Preview**, and **Development** environments
5. **Redeploy your application** after adding/updating variables

## Generate AUTH_SECRET

Run this command to generate a secure AUTH_SECRET:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

**Copy the generated string and add it to Vercel as `AUTH_SECRET` (or `NEXTAUTH_SECRET`).**

## Troubleshooting Login Issues

If you see "Authentication is not properly configured" error:

1. **Check Vercel Environment Variables**:
   - Go to Vercel → Settings → Environment Variables
   - Verify all required variables are set:
     - `AUTH_SECRET` or `NEXTAUTH_SECRET` ✅
     - `GITHUB_ID` ✅
     - `GITHUB_SECRET` ✅
     - `DATABASE_URL` ✅

2. **Verify GitHub OAuth App Settings**:
   - Callback URL must be: `https://coupons-platform.vercel.app/api/auth/callback/github`
   - Homepage URL must be: `https://coupons-platform.vercel.app`
   - Make sure the Client ID and Secret match what's in Vercel

3. **Redeploy After Changes**:
   - After adding/updating environment variables, you MUST redeploy
   - Go to Vercel → Deployments → Click "..." → "Redeploy"

4. **Check Vercel Logs**:
   - Go to Vercel → Logs
   - Look for errors like "AUTH_SECRET is missing" or "GITHUB_ID is missing"
   - These will tell you exactly which variable is missing

5. **Verify Variable Names**:
   - Make sure variable names match exactly (case-sensitive):
     - `AUTH_SECRET` (not `auth_secret` or `AUTH_SECRET_`)
     - `GITHUB_ID` (not `GITHUBID` or `github_id`)
     - `GITHUB_SECRET` (not `GITHUBSECRET` or `github_secret`)

## Verify Setup

After setting up environment variables:
1. **Redeploy your application** (important!)
2. Visit `https://coupons-platform.vercel.app/login`
3. Click "Continue with GitHub"
4. You should be redirected to GitHub for authorization
5. After authorizing, you'll be redirected back to `/admin`
