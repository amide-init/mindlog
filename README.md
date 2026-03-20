# MindLog

A local-first diary: **one note per day**, organized by **diary** and **date**.

- **Local-first**: data is stored in a local SQLite database (via Prisma)
- **Multiple diaries**: switch diaries from the navbar
- **Calendar day view**: `/calendar/YYYY-MM-DD` shows the entry for that day

**Links:** [Documentation](https://amide-init.github.io/mindlog/) · [GitHub](https://github.com/amide-init/mindlog)

## Requirements

- **Node.js**: >= 22.5
- **pnpm**

If you use nvm:

```bash
nvm use
# or: nvm install 22 && nvm use 22
```

## Setup

Install dependencies:

```bash
pnpm install
```

Set up the local database (creates/updates your SQLite DB and Prisma client):

```bash
pnpm db:migrate
```

## Run

Start the dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Useful commands

```bash
pnpm db:migrate    # run prisma migrations (dev)
pnpm db:studio     # open Prisma Studio
pnpm docs:dev      # run docs site locally (http://localhost:5173)
pnpm docs:build    # build docs for deployment
pnpm lint
pnpm build
pnpm start
```

## Notes

- **Deleting a diary** (from Settings) deletes all notes in that diary (cascade delete).
- **Time zone** can be set in Settings. Default is your system time zone.

## License

MIT — see [LICENSE](https://github.com/amide-init/mindlog/blob/main/LICENSE).
