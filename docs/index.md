# MindLog

MindLog is a local-first diary: **one note per day**, organized by **diary** and **date**.

## Download

> No release published yet. Builds will be available on [GitHub Releases](https://github.com/amide-init/mindlog/releases) once ready.

| Platform | Download |
| -------- | -------- |
| macOS    | Coming soon |

## Getting started (developers)

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

Open `http://localhost:3000`.

## Features

- Multiple diaries (switch from the navbar)
- Calendar day view (`/calendar/YYYY-MM-DD`)
- Local SQLite database (Prisma)
- Settings: manage diaries + time zone

## License

MindLog is open source under the **MIT License**.  
See [LICENSE](https://github.com/amide-init/mindlog/blob/main/LICENSE) in the repository.

