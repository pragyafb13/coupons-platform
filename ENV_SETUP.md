# Environment Variables Setup for Vercel

## Required Environment Variables

To make login work, you need to set the following environment variables in your Vercel project:

### 1. Database
- `DATABASE_URL` - Your PostgreSQL connection string

### 2. NextAuth Authentication
- `AUTH_SECRET` - A random secret string (generate with: `openssl rand -base64 32`)
- `GITHUB_ID` - Your GitHub OAuth App Client ID
- `GITHUB_SECRET` - Your GitHub OAuth App Client Secret

## How to Set Up GitHub OAuth

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: DealStack Admin (or any name)
   - **Homepage URL**: `https://coupons-platform.vercel.app`
   - **Authorization callback URL**: `https://coupons-platform.vercel.app/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**
6. Add these to Vercel environment variables

## How to Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add each variable:
   - `AUTH_SECRET` - Generate a random string
   - `GITHUB_ID` - From GitHub OAuth App
   - `GITHUB_SECRET` - From GitHub OAuth App
   - `DATABASE_URL` - Your database connection string
4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application after adding variables

## Generate AUTH_SECRET

Run this command to generate a secure AUTH_SECRET:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## Verify Setup

After setting up environment variables:
1. Redeploy your application
2. Visit `/login`
3. Click "Continue with GitHub"
4. You should be redirected to GitHub for authorization
5. After authorizing, you'll be redirected back to `/admin`
