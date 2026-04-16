import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 1. USERS
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    role: varchar("role", { length: 20 })
      .notNull()
      .default("student"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    check(
      "users_role_check",
      sql`${table.role} IN ('admin', 'educator', 'student')`,
    ),
  ],
);

// 2. COURSES
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  category: varchar("category", { length: 100 }),
  educatorName: varchar("educator_name", { length: 255 }),
  isPublished: boolean("is_published").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// 3. VIDEOS (lessons within a course)
export const videos = pgTable(
  "videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description"),
    videoUrl: text("video_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    durationSec: integer("duration_sec"),
    transcript: text("transcript"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [index("idx_videos_course").on(table.courseId)],
);

// 4. LEARNING CONTENT (quiz / flashcards / mental_map / test)
export const learningContent = pgTable(
  "learning_content",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    contentType: varchar("content_type", { length: 20 }).notNull(),
    content: jsonb("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    check(
      "learning_content_type_check",
      sql`${table.contentType} IN ('quiz', 'flashcards', 'mental_map', 'test')`,
    ),
    unique("learning_content_video_id_content_type_unique").on(
      table.videoId,
      table.contentType,
    ),
    index("idx_lc_video").on(table.videoId),
  ],
);

// 5. ENROLLMENTS
export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    enrolledAt: timestamp("enrolled_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    unique("enrollments_user_id_course_id_unique").on(
      table.userId,
      table.courseId,
    ),
    index("idx_enrollments_user").on(table.userId),
  ],
);

// 6. PROGRESS (one table for all progress types)
export const progress = pgTable(
  "progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    videoId: uuid("video_id").references(() => videos.id, {
      onDelete: "cascade",
    }),
    contentId: uuid("content_id").references(() => learningContent.id, {
      onDelete: "cascade",
    }),
    progressType: varchar("progress_type", { length: 20 }).notNull(),
    data: jsonb("data").notNull().default(sql`'{}'`),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    check(
      "progress_type_check",
      sql`${table.progressType} IN ('video', 'quiz', 'test', 'flashcard')`,
    ),
    index("idx_progress_user").on(table.userId),
    index("idx_progress_video").on(table.videoId),
  ],
);

// Inferred types for use elsewhere in the app
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;

export type LearningContent = typeof learningContent.$inferSelect;
export type NewLearningContent = typeof learningContent.$inferInsert;

export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;

export type Progress = typeof progress.$inferSelect;
export type NewProgress = typeof progress.$inferInsert;
