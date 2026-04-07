# MindLog

A minimal local-first daily diary web app. One rich-text note per day, organized into named diaries.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4
- **Editor**: `luxe-edit` (rich text, stores content as JSON)
- **State**: Zustand
- **Database**: PostgreSQL (via Supabase) using Prisma 7 with `@prisma/adapter-pg`
- **Package manager**: pnpm

## Environment Setup

Copy `.env.example` to `.env` and fill in Supabase connection strings:

- `DATABASE_URL` — pooled connection (pgBouncer, port 6543) — used at runtime
- `DIRECT_URL` — direct connection (port 5432) — used for migrations only
- `NEXT_PUBLIC_APP_VERSION` — auto-set from `package.json` during `dev`/`build`

## Common Commands

```bash
pnpm dev           # Start dev server
pnpm build         # Production build
pnpm lint          # ESLint

pnpm db:generate   # Regenerate Prisma client after schema changes
pnpm db:migrate    # Run migrations (uses DIRECT_URL)
pnpm db:studio     # Open Prisma Studio
```

## Data Model

```
Diary
  id        cuid (PK)
  name      String
  createdAt DateTime

Note
  id        cuid (PK)
  diaryId   String (FK → Diary, cascade delete)
  day       String  -- ISO date "YYYY-MM-DD"
  content   Json    -- luxe-edit document format
  createdAt DateTime
  updatedAt DateTime
  UNIQUE(diaryId, day)
```

Notes are **upserted** by `(diaryId, day)` — saving the same day again updates in place.

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/diaries` | List all diaries |
| POST | `/api/diaries` | Create diary `{ name? }` |
| DELETE | `/api/diaries?id=` | Delete diary + cascade notes |
| GET | `/api/notes?diaryId=&day=YYYY-MM-DD` | Fetch note for a day |
| POST | `/api/notes` | Upsert note `{ diaryId, day, content }` |

## Project Structure

```
app/
  page.tsx          Landing page
  calendar/         Monthly calendar view
  dashboard/        Stats/overview
  settings/         App settings
  api/diaries/      Diary CRUD
  api/notes/        Note upsert/fetch
components/
  ClientShell.tsx   Client wrapper (theme, navbar)
  Navbar.tsx
  ThemeToggle.tsx
  calendar/         Calendar components
  dashboard/        Dashboard components
  ui/               Shared UI primitives
lib/
  prisma.ts         Prisma client singleton (pooled connection)
prisma/
  schema.prisma     DB schema
  migrations/       Migration history
prisma.config.ts    Prisma config (uses DIRECT_URL for migrations)
```

## Theme

Dark/light mode is stored in `localStorage` under `mindlog-theme` and applied via an inline script in `<head>` before hydration to prevent flash. Values: `"dark"` | `"light"` | (unset = system preference).
