# Deploying College Compass on Vercel

## 1. Create a Production PostgreSQL Database

Use Neon, Supabase, Railway, Render, or Vercel Postgres/Storage.

Copy the production connection string. It should look like:

```txt
postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

## 2. Add Vercel Environment Variables

In Vercel:

```txt
Project -> Settings -> Environment Variables
```

Add:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
NEXTAUTH_SECRET="generate-a-long-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="https://your-vercel-domain.vercel.app/api/auth/callback/google"
```

`GOOGLE_CALLBACK_URL` is only documentation for this app. NextAuth uses:

```txt
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

## 3. Configure Google OAuth

In Google Cloud Console, add this authorized redirect URI:

```txt
https://your-vercel-domain.vercel.app/api/auth/callback/google
```

For local development, also keep:

```txt
http://localhost:3000/api/auth/callback/google
```

## 4. Push Schema and Seed Data to Production DB

Temporarily set your terminal `DATABASE_URL` to the production database URL, then run:

```bash
npm run db:push
npm run db:import:colleges
```

This creates the Prisma tables and imports the 100-college dataset.

## 5. Deploy

If deploying from GitHub:

1. Push this folder to GitHub.
2. Import the repo in Vercel.
3. Keep Framework Preset as `Next.js`.
4. Build Command should be:

```bash
npm run build
```

5. Deploy.

If using Vercel CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

## 6. After Deployment

Update these values if your final domain changes:

```bash
NEXTAUTH_URL="https://your-final-domain.com"
GOOGLE_CALLBACK_URL="https://your-final-domain.com/api/auth/callback/google"
```

Also add the final callback URL in Google Cloud Console:

```txt
https://your-final-domain.com/api/auth/callback/google
```
