# College Discovery Platform

A production-oriented MVP for college discovery and decision-making.

## Stack

- Next.js App Router
- React + TypeScript
- TailwindCSS
- Next.js API Routes
- PostgreSQL
- Prisma ORM

## Features

- Searchable college listings with filters, sorting, and pagination
- College detail pages with overview, courses, placements, and reviews
- Side-by-side comparison for 2-3 colleges
- Exam/rank based predictor using cutoff data from the database
- Sign in/sign up with email/password
- Continue with Google via NextAuth
- Save colleges and comparison sets to a user account
- Optional student profile onboarding after signup

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to a PostgreSQL database.
   For local development, you can start the included database:

```bash
docker compose up -d
```

2. Install dependencies:

```bash
npm install
```

3. Push schema and seed data:

```bash
npm run db:push
npm run db:seed
```

4. Start the app:

```bash
npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment steps, production environment variables, Google OAuth callback setup, and database seeding.

## Google OAuth

Add these values to `.env`:

```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="use-a-long-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/callback/google"
```

In Google Cloud Console, add this authorized redirect URI:

```txt
http://localhost:3000/api/auth/callback/google
```

For production, set `NEXTAUTH_URL` to your deployed origin. The Google redirect URI should be:

```txt
https://your-domain.com/api/auth/callback/google
```
