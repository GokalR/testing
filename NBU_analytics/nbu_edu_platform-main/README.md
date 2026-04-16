# EduPulse

EduPulse is a local-first video coursebook platform for pre-authored learning content. The product combines videos, transcripts, quizzes, flashcards, mental maps, and tests inside a single Next.js app backed by PostgreSQL.

## Stack

- Next.js 16 App Router
- TypeScript strict mode
- Tailwind CSS 4 and shadcn/ui
- Drizzle ORM with PostgreSQL 16
- NextAuth credentials auth

## Local Development

```bash
pnpm install
docker compose up -d
pnpm dev
```

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm test:audit
pnpm test:course-content
```

## Notes

- The product spec lives in `design.md`.
- Project conventions and architecture constraints live in `CLAUDE.md` and `AGENTS.md`.
- The audit suite in `tests/architecture.test.mjs` is intended to catch starter-template regressions while the app is under active development.
- The first real course now lives under `/ru`, `/uz`, and `/en` as a Russian-first multilingual series.
- `pnpm notebooklm:sync-course` regenerates the Episode 1 NotebookLM artifacts into `lib/course-content/generated/episode-1/`.
