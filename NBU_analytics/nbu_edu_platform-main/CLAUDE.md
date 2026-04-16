# CLAUDE.md

## Project

EduPulse — a video coursebook platform with quizzes, flashcards, mental maps, and tests. Content is pre-loaded (no AI generation at runtime, no external APIs). See `design.md` for full spec.

## Stack

- Next.js 16 (App Router), TypeScript strict, Tailwind CSS 4, shadcn/ui
- Framer Motion (animations), ReactFlow (mental maps)
- Drizzle ORM → PostgreSQL 16 (Docker)
- NextAuth.js (Credentials provider, bcrypt)
- pnpm as package manager

## Commands

```bash
docker compose up -d          # start postgres
pnpm dev                      # start dev server on :3000
pnpm build                    # production build
pnpm lint                     # eslint
pnpm typecheck                # tsc --noEmit
pnpm test:course-content      # localized content/data tests
pnpm notebooklm:sync-course   # regenerate Episode 1 NotebookLM artifacts
pnpm db:push                  # push drizzle schema to db
pnpm db:migrate               # run migrations
pnpm db:seed                  # seed sample data
pnpm db:studio                # open drizzle studio
```

Always run `pnpm typecheck` and `pnpm lint` after making changes. Fix all errors before committing.

## Architecture

One Next.js app. One PostgreSQL database. No Redis, no queues, no S3, no external APIs.

```
app/            → pages (App Router) + API route handlers
components/     → React components grouped by feature
lib/db/         → Drizzle schema, connection, migrations, seed
lib/            → auth config, content modules, API client, utils, scoring logic
public/videos/  → static video files served by Next.js
scripts/        → repo-local automation such as NotebookLM sync
```

API routes live in `app/api/` as Next.js route handlers (`route.ts`), not a separate backend.

## Database

6 tables: `users`, `courses`, `videos`, `learning_content`, `enrollments`, `progress`. Schema is in `lib/db/schema.ts` and must match `design.md` Section 5 exactly — same column names, types, and constraints.

`learning_content.content` and `progress.data` are JSONB. Their schemas are defined in `design.md` Section 5 "JSONB Schemas". Do not invent new fields.

## Code Style

- TypeScript strict — never use `any`. Define interfaces for all API responses and component props.
- Use `import type` for type-only imports.
- React components: named exports, function declarations, not arrow functions for top-level components.
- Server components by default. Add `"use client"` only when hooks or browser APIs are needed.
- Drizzle queries go in `lib/db/` or API route handlers, never in components.
- All colors via CSS variables (`var(--accent)`, `var(--text-primary)`) — never hardcode hex values in components.
- Use `cn()` from `lib/utils.ts` to merge Tailwind classes conditionally.

## File Conventions

- Pages: `app/**/page.tsx` — default to server components
- API routes: `app/api/**/route.ts` — export named functions (`GET`, `POST`, `PUT`, `DELETE`)
- Components: PascalCase filenames (`CourseCard.tsx`), one component per file
- Organize components by feature: `components/learning/`, `components/courses/`, `components/admin/`

## Patterns to Follow

**API route handler pattern:**
```typescript
export async function GET(req: NextRequest) {
  try {
    // ... logic
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/endpoint]", error);
    return NextResponse.json({ error: "message" }, { status: 500 });
  }
}
```

**Protected route pattern:**
```typescript
const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
```

**Client data fetching:**
Use `fetch` in client components or server-side `fetch` in server components. No SWR, no React Query — keep dependencies minimal.

## Design System

Aesthetic: "Editorial Knowledge" — warm, refined, textbook-like. See `design.md` Section 4 for full CSS variables.

- Fonts: Playfair Display (headings), Source Sans 3 (body), JetBrains Mono (code/stats)
- Primary accent: copper (`--accent: #c87941`)
- Cards: `shadow-sm` default, `shadow-md` on hover, `radius-md` (12px)
- Animations: Framer Motion for page transitions, flashcard flip, quiz feedback. Keep animations under 300ms for interactions, 500ms for page transitions.
- Loading states: skeleton shimmer, never spinners
- Dark mode: supported via `[data-theme="dark"]` CSS variable overrides

## Do NOT

- Do not add runtime external AI service calls (no OpenAI, no Anthropic API, no runtime NotebookLM usage)
- Do not add Redis, message queues, or background workers
- Do not use Prisma — we use Drizzle ORM
- Do not add SWR, React Query, or tRPC
- Do not hardcode colors — use CSS variables
- Do not use `any` type
- Do not create separate backend server — API routes live in Next.js
- Do not use `pages/` directory — we use App Router only
- Do not store secrets in code — use `.env.local`

## Content Source

Course video and data files are in `../video and data/`:
- `Выпуск-1-ru.mp4` — first episode video (Russian)
- `Scenario_№1_ru.docx` — episode scenario
- `CoverLetter_№1_ru&uz.docx` — cover letter (Russian & Uzbek)
- `booklet_vipusk1.pdf` — episode booklet

NotebookLM reference: https://notebooklm.google.com/notebook/cf83e86d-fd3e-4dee-be64-cef5c306276b

## Build Order

Follow `design.md` Section 11 steps strictly. Each step builds on the previous. Do not skip ahead.

```
Step 1: Skeleton + DB → Step 2: Auth → Step 3: Catalog →
Step 4: Learning Page → Step 5: Dashboard → Step 6: Admin
```

When starting a step, read the corresponding section in `design.md` first.

## Verification

After any change:
1. `pnpm typecheck` passes with zero errors
2. `pnpm lint` passes
3. `pnpm build` succeeds
4. Run focused content tests when touching multilingual course content (`pnpm test:course-content`)
5. Manually verify the affected page renders correctly in browser
6. Test both light and dark mode

## Git

- Branch per feature: `feat/step-1-skeleton`, `feat/step-2-auth`, etc.
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `style:`)
- One logical change per commit — do not bundle unrelated changes
- Run typecheck and lint before every commit
