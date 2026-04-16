# EduPulse MVP — Design Spec

## What This Is

A beautiful video coursebook platform. Videos, transcripts, and learning materials (quizzes, flashcards, mental maps, tests) **already exist** as content. This platform displays and delivers them. No external APIs. Runs locally, then deploys to a VM.

---

## 1. The Product

```
Student → Browse courses → Enroll → Watch video
  → Sidebar shows: Quiz | Flashcards | Mental Map | Test
  → Take quiz (instant feedback)
  → Flip flashcards (rate difficulty)
  → Explore concept map (interactive graph)
  → Take test (timed, graded)
  → Dashboard tracks all progress

Admin → Create/edit courses → Add videos → Paste transcript
  → Add learning content (JSON) → Publish
```

### What We DON'T Build
- No video upload pipeline or transcoding
- No AI APIs (Whisper, NotebookLM, Claude) — content is pre-made
- No payment/billing
- No mobile apps — responsive web only
- No Redis, no queues, no background workers
- No S3 — videos are static files served by Next.js or nginx

---

## 2. Architecture

```
┌────────────────────────────┐
│     Next.js 15 App         │
│                            │
│  Pages    → /app/...       │
│  API      → /app/api/...   │
│  Videos   → /public/videos │
└──────────┬─────────────────┘
           │
     ┌─────▼─────┐
     │ PostgreSQL │
     │  (Docker)  │
     └───────────┘
```

**One app. One database. Zero external services.**

- Videos: static .mp4 files in /public/videos/ (local dev) or served by nginx (VM)
- Thumbnails: static images in /public/thumbnails/
- All learning content: JSONB columns in PostgreSQL
- Auth: NextAuth.js with Credentials provider (email + bcrypt)

---

## 3. Tech Stack

| Layer       | Choice                       |
|-------------|------------------------------|
| Framework   | Next.js 15 (App Router)      |
| Language    | TypeScript strict             |
| Styling     | Tailwind CSS 4 + shadcn/ui   |
| Animations  | Framer Motion                 |
| Mind Maps   | ReactFlow                     |
| Video       | native <video> element        |
| ORM         | Drizzle ORM                   |
| Database    | PostgreSQL 16                 |
| Auth        | NextAuth.js (Credentials)     |
| Container   | Docker Compose                |

**No substitutions. This is the stack.**

---

## 4. Design Direction — "Editorial Knowledge"

Feels like a beautifully designed textbook. Not a SaaS dashboard. Not generic AI aesthetic.

### Typography
- Display / Headings: **Playfair Display** (serif, elegant, authoritative)
- Body: **Source Sans 3** (clean, highly readable)
- Mono / Stats: **JetBrains Mono**
- Load via next/font/google

### Color Palette
```css
:root {
  /* Backgrounds */
  --bg-primary: #faf7f2;
  --bg-secondary: #f0ece4;
  --bg-card: #ffffff;
  --bg-sidebar: #f5f2eb;
  --bg-code: #f8f5ef;

  /* Text */
  --text-primary: #1a1a17;
  --text-secondary: #4a4a42;
  --text-muted: #8a8a7e;
  --text-inverse: #faf7f2;

  /* Accent */
  --accent: #c87941;
  --accent-hover: #a86230;
  --accent-light: #f4e8db;

  /* Semantic */
  --success: #5a8a5e;
  --success-light: #e8f0e8;
  --error: #c44d4d;
  --error-light: #fce8e8;
  --warning: #d4943a;
  --warning-light: #fef3e0;
  --info: #4a7fb5;
  --info-light: #e6f0fa;

  /* Borders & Shadows */
  --border: #e2dfd8;
  --border-hover: #c8c4ba;
  --shadow-sm: 0 1px 3px rgba(26,26,23,0.05);
  --shadow-md: 0 4px 12px rgba(26,26,23,0.07);
  --shadow-lg: 0 12px 32px rgba(26,26,23,0.10);
  --shadow-glow: 0 0 0 3px rgba(200,121,65,0.15);

  /* Layout */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

[data-theme="dark"] {
  --bg-primary: #141310;
  --bg-secondary: #1e1d19;
  --bg-card: #23221d;
  --bg-sidebar: #1a1916;
  --bg-code: #1e1d19;
  --text-primary: #ede9e0;
  --text-secondary: #b0ab9f;
  --text-muted: #6e6a60;
  --accent: #d4934f;
  --accent-hover: #e8a862;
  --accent-light: #2e2418;
  --border: #33312b;
  --border-hover: #4a473e;
}
```

### Design Rules
- Generous whitespace — let content breathe
- Cards: subtle shadow (shadow-sm), 12px radius, hover lifts with shadow-md + slight scale
- Page transitions: fade + slide with Framer Motion (AnimatePresence)
- Flashcard flip: 3D perspective transform
- Quiz answers: color wash reveal (green/red background transition)
- Progress bars: animate width on mount with spring easing
- Hover states: all interactive elements have cursor:pointer + subtle transform
- Loading: skeleton shimmer, not spinners
- Empty states: friendly illustration + message, never blank space
- Mobile first: design for 375px, enhance up to 1440px+

---

## 5. Database — 6 Tables

```sql
-- 1. USERS
CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL DEFAULT 'student'
                  CHECK (role IN ('admin', 'educator', 'student')),
    avatar_url    TEXT,
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. COURSES
CREATE TABLE courses (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title         VARCHAR(500) NOT NULL,
    description   TEXT,
    thumbnail_url TEXT,
    category      VARCHAR(100),
    educator_name VARCHAR(255),
    is_published  BOOLEAN DEFAULT false,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. VIDEOS (lessons within a course)
CREATE TABLE videos (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title         VARCHAR(500) NOT NULL,
    description   TEXT,
    video_url     TEXT NOT NULL,
    thumbnail_url TEXT,
    duration_sec  INTEGER,
    transcript    TEXT,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- 4. LEARNING CONTENT (quiz / flashcards / mental_map / test)
CREATE TABLE learning_content (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id      UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    content_type  VARCHAR(20) NOT NULL
                  CHECK (content_type IN ('quiz', 'flashcards', 'mental_map', 'test')),
    content       JSONB NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now(),
    UNIQUE(video_id, content_type)
);

-- 5. ENROLLMENTS
CREATE TABLE enrollments (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id     UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at   TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
);

-- 6. PROGRESS (one table for all progress types)
CREATE TABLE progress (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id      UUID REFERENCES videos(id) ON DELETE CASCADE,
    content_id    UUID REFERENCES learning_content(id) ON DELETE CASCADE,
    progress_type VARCHAR(20) NOT NULL
                  CHECK (progress_type IN ('video', 'quiz', 'test', 'flashcard')),
    data          JSONB NOT NULL DEFAULT '{}',
    created_at    TIMESTAMPTZ DEFAULT now(),
    updated_at    TIMESTAMPTZ DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_videos_course ON videos(course_id);
CREATE INDEX idx_lc_video ON learning_content(video_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_progress_video ON progress(video_id);
```

### JSONB Schemas

**Quiz** (content_type = 'quiz'):
```json
{
  "questions": [
    {
      "id": "q_001",
      "question": "What is the primary purpose of...?",
      "options": { "A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D" },
      "correct": "B",
      "difficulty": "easy",
      "explanation": "Because..."
    }
  ]
}
```

**Flashcards** (content_type = 'flashcards'):
```json
{
  "cards": [
    {
      "id": "fc_001",
      "front": "What is X?",
      "back": "X is defined as...",
      "topic": "Core Concepts"
    }
  ]
}
```

**Mental Map** (content_type = 'mental_map'):
```json
{
  "root": {
    "id": "node_root",
    "label": "Main Topic",
    "children": [
      {
        "id": "node_001",
        "label": "Subtopic A",
        "relationship": "consists of",
        "is_key_takeaway": true,
        "children": [
          {
            "id": "node_001_001",
            "label": "Detail",
            "relationship": "example",
            "is_key_takeaway": false,
            "children": []
          }
        ]
      }
    ]
  }
}
```

**Test** (content_type = 'test'):
```json
{
  "test_title": "Module 1 Assessment",
  "time_limit_minutes": 30,
  "passing_score_percent": 70,
  "questions": [
    {
      "id": "t_001",
      "type": "mcq",
      "question": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct_answer": "C",
      "points": 1,
      "difficulty": "medium"
    },
    {
      "id": "t_002",
      "type": "true_false",
      "question": "...",
      "correct_answer": "true",
      "points": 1
    }
  ]
}
```

**Progress data** (progress.data):
```json
// video
{ "watched_sec": 340, "last_position": 340, "completed": false }

// quiz or test attempt
{ "answers": {"q_001":"A","q_002":"C"}, "score_percent": 80, "passed": true, "time_spent_sec": 120 }

// flashcard review
{ "card_id": "fc_001", "rating": 4 }
```

---

## 6. API Routes (Next.js Route Handlers)

All inside /app/api/.

### Auth
```
POST /api/auth/register     { email, password, full_name, role }
POST /api/auth/login        { email, password } → session cookie
GET  /api/auth/me           → current user
POST /api/auth/logout
```

### Courses
```
GET    /api/courses                ?category=&search=&page=&limit=
GET    /api/courses/[id]
POST   /api/courses                [admin]
PUT    /api/courses/[id]           [admin]
DELETE /api/courses/[id]           [admin]
POST   /api/courses/[id]/enroll    [student]
```

### Videos
```
GET    /api/courses/[id]/videos          → videos in course
GET    /api/videos/[id]                  → video + transcript
POST   /api/videos                       [admin] { course_id, title, video_url, ... }
PUT    /api/videos/[id]                  [admin]
DELETE /api/videos/[id]                  [admin]
```

### Learning Content
```
GET    /api/videos/[id]/content/[type]   → get quiz|flashcards|mental_map|test
POST   /api/videos/[id]/content          [admin] { content_type, content }
PUT    /api/learning-content/[id]        [admin]
DELETE /api/learning-content/[id]        [admin]
```

### Progress
```
POST   /api/progress/video               { video_id, watched_sec, last_position }
POST   /api/progress/quiz                { content_id, answers } → { score, corrections }
POST   /api/progress/test                { content_id, answers } → { score, passed }
POST   /api/progress/flashcard           { content_id, card_id, rating }
GET    /api/me/dashboard                 → enrolled courses + progress + scores
GET    /api/me/flashcards/due            → cards due for review
```

---

## 7. Pages

### Page Map
```
/                                       Landing (hero + featured courses)
/login                                  Login
/register                               Register
/courses                                Catalog (grid, search, filter)
/courses/[id]                           Course detail + enroll
/courses/[id]/learn/[videoId]           THE LEARNING PAGE (video + sidebar)
/dashboard                              Student progress dashboard
/admin                                  Admin: manage courses
/admin/courses/[id]                     Admin: edit course + videos
/admin/courses/[id]/videos/[videoId]    Admin: edit video + learning content
```

### The Learning Page Layout

```
DESKTOP (>=1024px):
┌─────────────────────────────────────────────────────────┐
│  ← Course Title                        Theme Toggle     │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│  ┌────────────────────┐  │  ┌ [Quiz] [Cards] [Map] [Test]
│  │                    │  │  │                            │
│  │   <video>          │  │  │  Active Tab Content        │
│  │   16:9             │  │  │                            │
│  │                    │  │  │  (scrollable)              │
│  └────────────────────┘  │  │                            │
│                          │  │                            │
│  Lesson Title            │  │                            │
│  12:34 • ████░░ 60%     │  │                            │
│                          │  │                            │
│  LESSONS                 │  │                            │
│  ✓ 1. Introduction       │  │                            │
│  ▶ 2. Core Concepts      │  │                            │
│    3. Advanced           │  │                            │
│    4. Summary            │  │                            │
└──────────────────────────┴──────────────────────────────┘

TABLET (768-1023px):
Video full width → tabs below → content below tabs
Lesson list in collapsible panel

MOBILE (<768px):
Video full width → sticky tab bar → content
Lesson list in bottom sheet
```

### Component Behaviors

**QuizView:**
- One question at a time, animated transition between questions
- Select answer → background color fades to green (correct) or red (wrong)
- Show explanation text after answering
- Next button slides in next question
- Final screen: score circle animation (e.g. 8/10) + retry button

**FlashcardDeck:**
- Large card centered, 3D flip animation (Framer Motion rotateY)
- Front: question. Back: answer
- After flipping, rating buttons appear below: [Again] [Hard] [Good] [Easy]
- Top: progress bar (cards reviewed / total)
- Subtle stack effect behind current card (2 cards peeking)

**MentalMap:**
- ReactFlow canvas, auto-layout from JSONB tree structure
- Root node centered, children radiate outward
- Key takeaway nodes: accent color border + badge
- Click node → detail panel slides in from right
- Zoom/pan + minimap in bottom-right
- Smooth edge animations on load

**TestView:**
- All questions visible, scrollable
- Sticky timer bar at top (countdown, turns red at < 5 min)
- MCQ: radio buttons with hover highlight
- True/False: styled toggle switch
- Short Answer: text input with character count
- Submit Test button at bottom (confirm dialog)
- Results: score bar + pass/fail badge + question-by-question review

**VideoPlayer:**
- Native <video> with custom styled controls (play/pause, seek, volume, fullscreen, speed)
- Playback speed: [0.5x] [1x] [1.25x] [1.5x] [2x]
- Auto-resume from last_position
- Mark completed when > 90% watched
- Keyboard shortcuts: space=play/pause, arrows=seek, f=fullscreen

---

## 8. Folder Structure

```
edupulse/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── courses/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── learn/
│   │           └── [videoId]/
│   │               └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── courses/
│   │       └── [id]/
│   │           ├── page.tsx
│   │           └── videos/
│   │               └── [videoId]/
│   │                   └── page.tsx
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   ├── me/route.ts
│       │   └── logout/route.ts
│       ├── courses/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       ├── enroll/route.ts
│       │       └── videos/route.ts
│       ├── videos/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       └── content/
│       │           └── [type]/route.ts
│       ├── learning-content/
│       │   └── [id]/route.ts
│       ├── progress/
│       │   ├── video/route.ts
│       │   ├── quiz/route.ts
│       │   ├── test/route.ts
│       │   └── flashcard/route.ts
│       └── me/
│           ├── dashboard/route.ts
│           └── flashcards/
│               └── due/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   ├── CourseGrid.tsx
│   │   └── EnrollButton.tsx
│   ├── learning/
│   │   ├── VideoPlayer.tsx
│   │   ├── AISidebar.tsx
│   │   ├── QuizView.tsx
│   │   ├── FlashcardDeck.tsx
│   │   ├── MentalMap.tsx
│   │   ├── TestView.tsx
│   │   ├── LessonList.tsx
│   │   └── ProgressRing.tsx
│   ├── dashboard/
│   │   ├── CourseProgress.tsx
│   │   ├── ScoreHistory.tsx
│   │   └── DueCards.tsx
│   ├── admin/
│   │   ├── CourseForm.tsx
│   │   ├── VideoForm.tsx
│   │   └── ContentEditor.tsx
│   └── ui/
├── lib/
│   ├── db/
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   ├── migrate.ts
│   │   └── seed.ts
│   ├── auth.ts
│   ├── api.ts
│   ├── scoring.ts
│   └── utils.ts
├── public/
│   ├── videos/
│   │   └── course-1/
│   │       ├── lesson-1.mp4
│   │       └── lesson-2.mp4
│   └── thumbnails/
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── docker-compose.yml
├── Dockerfile
├── .env.local
└── .env.example
```

---

## 9. Docker & Environment

### docker-compose.yml
```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: edupulse
      POSTGRES_PASSWORD: edupulse
      POSTGRES_DB: edupulse
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### .env.local
```env
DATABASE_URL=postgresql://edupulse:edupulse@localhost:5432/edupulse
NEXTAUTH_SECRET=change-this-to-a-random-64-char-string
NEXTAUTH_URL=http://localhost:3000
```

### VM Dockerfile
```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

---

## 10. Seed Data

```
Users:
  admin@edupulse.io / admin123 (admin)
  student@edupulse.io / student123 (student)

Courses:
  "Introduction to Machine Learning" (4 videos)
  "Web Development Fundamentals" (3 videos)
  "Data Structures & Algorithms" (3 videos)

Each video has:
  - transcript (500 words)
  - quiz (5 questions)
  - flashcards (8 cards)
  - mental_map (root + 4 branches, 2-3 children each)
  - test (8 questions: 4 MCQ + 2 true_false + 2 short_answer)

Student enrolled in "Intro to ML" with progress:
  - Video 1: completed
  - Video 2: 60% watched
  - Quiz 1: scored 80%
  - 3 flashcard reviews
```

---

## 11. Build Steps (In Order)

### Step 1 — Skeleton + DB
```
□ create-next-app with App Router + TypeScript
□ Install: tailwindcss, @shadcn/ui, drizzle-orm, pg, framer-motion, @xyflow/react
□ docker-compose.yml (Postgres only)
□ Drizzle schema matching Section 5
□ Migration + seed
□ Root layout: Playfair Display + Source Sans 3 fonts
□ globals.css with CSS variables from Section 4
□ ThemeToggle (light/dark)
□ Verify: pnpm dev loads, DB connected, seed data works
```

### Step 2 — Auth
```
□ NextAuth.js Credentials provider
□ Register page → bcrypt hash → insert user → auto-login
□ Login page → verify → session
□ /api/auth/me
□ Auth middleware (getSession, requireAuth, requireAdmin)
□ Header: user name when logged in, login button when not
□ Protect /dashboard and /admin routes
```

### Step 3 — Catalog
```
□ Landing page: hero + 3 featured courses
□ /courses: CourseGrid with CourseCards
□ Search (ILIKE) + category filter
□ CourseCard: thumbnail, title, educator, hover animation
□ /courses/[id]: description, video list, Enroll button
□ Enroll API
```

### Step 4 — Learning Page (Core)
```
□ /courses/[id]/learn/[videoId] layout
□ VideoPlayer: native <video>, custom controls, speed, resume
□ LessonList: sidebar, checkmarks, navigation
□ AISidebar: 4 tabs with animated indicator
□ QuizView: one-at-a-time, feedback, score
□ FlashcardDeck: 3D flip, rating
□ MentalMap: ReactFlow from JSONB tree
□ TestView: timer, all questions, grading
□ Progress saving
□ Responsive layout
```

### Step 5 — Dashboard
```
□ Enrolled courses with progress %
□ Recent scores
□ Due flashcards + Review button
□ Continue watching link
```

### Step 6 — Admin + Polish
```
□ Course CRUD
□ Video management
□ Content JSON editor
□ Loading skeletons
□ Empty states
□ Error boundaries
□ Mobile audit
□ Meta tags
```

---

## 12. Code Generation Rules

1. **Folder structure** from Section 8
2. **Tech stack** from Section 3 — no substitutions
3. **SQL schema** from Section 5 — exact columns
4. **API routes** from Section 6 — exact paths
5. **JSONB schemas** from Section 5
6. **CSS variables** from Section 4 — no hardcoded colors
7. **Build in step order**
8. **No placeholder code**
9. **TypeScript strict** — no any
10. **Design quality** — Section 4, Framer Motion, hover states
11. **Mobile responsive** from step 1
12. **No external APIs** — everything local
