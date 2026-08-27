
# UiA Kraken Esports Platform — v4 / Phase 7

Phase 7 makes the public React website database-driven. The frontend now requests teams, players, matches and news from the Express API/PostgreSQL stack. If the backend is temporarily unavailable during local development, the site clearly switches to bundled fallback demo data instead of breaking.

## Added in Phase 7

- Global React `DataProvider`
- Public API integration for teams, players, matches and news
- PostgreSQL/API data becomes the preferred public data source
- 5-second API timeout and friendly offline handling
- Loading, empty and error states
- Visible data-source indicator and manual refresh control
- Team/player relationship normalization from API responses
- Home, Teams, Team Detail, Player Detail, Matches and News migrated to shared live data
- Bundled fallback data retained only as a development safety net
- Existing Prisma 7.9.1 / TypeScript server fixes preserved
- Clean Kraken logo treatment preserved


Version 3 turns the Kraken front end into a full-stack organization platform.

## Added in this stage

- Express REST API
- PostgreSQL database
- Prisma ORM schema
- Seed data for all five divisions
- JWT administrator authentication
- `/admin` control room
- CRUD API for teams, players, matches and news
- Docker Compose PostgreSQL service
- Environment configuration
- Existing public React site remains intact

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

Change `JWT_SECRET` and `ADMIN_PASSWORD` before using the project outside local development.

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

Change these in `.env` before seeding if desired.

## 6. Start the full stack

```bash
npm run dev
```

- Website: `http://localhost:5173`
- Admin: `http://localhost:5173/admin`
- API: `http://localhost:4000/api`
- API health: `http://localhost:4000/api/health`

## Admin capabilities

The Control Room can currently:

- View database totals
- Add/edit/delete teams
- Add/edit/delete players
- Add/edit/delete matches
- Add/edit/delete news articles
- Authenticate using an 8-hour JWT session

`stats` and `specialties` are JSON fields in the current generic editor. Enter valid JSON when editing them.

## Database tools

Open Prisma Studio:

```bash
npm run db:studio
```

## Architecture

```text
src/
  components/
  data/
  pages/
    Admin.jsx
  services/
    api.js

server/
  prisma/
    schema.prisma
    seed.js
  src/
    middleware/
    routes/
    prisma.js
    server.js
```

## Next recommended stage

Connect the public pages to the API instead of their bundled fallback data, add image uploads/player photography, create a richer match editor, permissions/roles, audit logging, and automated game-data integrations.