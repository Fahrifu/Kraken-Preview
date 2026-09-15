# UiA Kraken Esports Platform — Phase 8

Kraken is a full-stack esports organization platform built with React, Express, Prisma and PostgreSQL. The public site prefers live API/database data and falls back to bundled demo data when the API is unavailable during local development.

## Current Phase 8 hardening

- Global React `DataProvider`
- Public API integration for teams, players, matches and news
- 5-second configurable API timeout
- Loading, empty and error states across public organization pages
- Production-aware CORS configuration through `CLIENT_ORIGIN`
- Safer admin CRUD validation and error handling
- Defensive public rendering for incomplete records
- Public API query/id validation
- Admin login input normalization and length limits
- Production JWT secret guardrails
- Database-backed readiness endpoint

## Platform features

- React public website
- Five competitive divisions
- Team and player detail pages
- Match center and match detail pages
- News
- Partners
- Staff
- Achievements
- Tournaments
- Roster history
- Express REST API
- PostgreSQL database
- Prisma ORM
- JWT administrator authentication
- `/admin` control room
- CRUD management for organization data
- Competitive-data sync infrastructure
- Docker Compose PostgreSQL service

## Requirements

- Node.js
- npm
- Docker Desktop (recommended), or a local PostgreSQL server

## 1. Install

```bash
npm install
```

## 2. Configure environment

Copy `.env.example` to `.env`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

macOS/Linux:

```bash
cp .env.example .env
```

For local development, the example values can be used as a starting point.

For production:

- set a unique `JWT_SECRET` with at least 32 characters
- set a strong `ADMIN_PASSWORD`
- set `CLIENT_ORIGIN` to the deployed frontend origin; multiple origins can be comma-separated
- configure `DATABASE_URL` for the production PostgreSQL database
- set `VITE_API_URL` to the deployed API URL

The server refuses to start in production when the example/weak JWT secret is used or when `CLIENT_ORIGIN` is missing.

## 3. Start PostgreSQL

```bash
docker compose up -d
```

## 4. Create the database schema

```bash
npm run db:generate
npm run db:push
```

## 5. Seed Kraken data

```bash
npm run db:seed
```

Default local admin credentials come from `.env.example`:

- Email: `admin@kraken.local`
- Password: `ChangeMe123!`

Do not use the default credentials outside local development.

## 6. Start the full stack

```bash
npm run dev
```

- Website: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`
- API: `http://localhost:4000/api`
- Liveness: `http://localhost:4000/api/health`
- Database readiness: `http://localhost:4000/api/ready`

`/api/health` confirms that the API process is running. `/api/ready` also checks PostgreSQL connectivity and returns HTTP 503 when the database is unavailable.

## Admin capabilities

The Control Room can currently manage:

- Teams
- Players
- Matches
- News
- Sponsors
- Staff
- Achievements
- Tournaments
- Opponents
- Match maps
- Match lineups
- Match player stats
- Roster history
- Integration configuration
- Sync runs
- External matches

Admin authentication uses an 8-hour JWT session.

Some admin fields contain JSON data. Enter valid JSON when editing fields such as `stats`, `specialties`, `socials`, `settings`, `metadata`, and `raw`.

## Database tools

Open Prisma Studio:

```bash
npm run db:studio
```

## Architecture

```text
src/
  components/
  context/
  data/
  hooks/
  pages/
  services/

server/
  generated/
  prisma/
    schema.prisma
    seed.ts
  src/
    integrations/
    middleware/
    routes/
    utils/
    prisma.ts
    server.ts
```

## Next stage

The next production-focused work should cover richer admin-form validation, role/permission design, audit logging, production database migration strategy, media storage/upload handling, automated testing, and deployment configuration for the API/database layer.
