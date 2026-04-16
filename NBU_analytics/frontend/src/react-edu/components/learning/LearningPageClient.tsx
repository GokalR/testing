
import { useCallback } from "react";
import type { ReactNode } from "react";
import { VideoPlayer } from "./VideoPlayer";
import { LessonList } from "./LessonList";
import { AISidebar } from "./AISidebar";

interface LearningVideo {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  durationSec: number | null;
}

interface LearningLesson {
  id: string;
  title: string;
  durationSec: number | null;
  sortOrder: number | null;
}

interface LearningPageClientProps {
  video: LearningVideo;
  lessons: LearningLesson[];
  courseId: string;
  completedVideoIds: string[];
  initialPosition: number;
  lessonsLabel?: string;
  /** Maps video DB IDs to URL slugs for clean URLs */
  videoSlugMap?: Record<string, string>;
  /** Content rendered below video info (e.g. transcript) */
  children?: ReactNode;
  /** Replaces AISidebar when provided */
  sidebarSlot?: ReactNode;
}

export function LearningPageClient({
  video,
  lessons,
  courseId,
  completedVideoIds,
  initialPosition,
  lessonsLabel,
  videoSlugMap,
  children,
  sidebarSlot,
}: LearningPageClientProps) {
  const onProgress = useCallback(
    (watchedSec: number, lastPosition: number) => {
      void fetch("/api/progress/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: video.id,
          watched_sec: watchedSec,
          last_position: lastPosition,
        }),
      });
    },
    [video.id]
  );

  const onComplete = useCallback(() => {
    void fetch("/api/progress/video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        video_id: video.id,
        completed: true,
      }),
    });
  }, [video.id]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
      {/* Left column: Video + info + lesson list */}
      <div className="space-y-6">
        <VideoPlayer
          src={video.videoUrl}
          title={video.title}
          durationSec={video.durationSec ?? 0}
          initialPosition={initialPosition}
          onProgress={onProgress}
          onComplete={onComplete}
        />

        {/* Video info */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground leading-tight">
            {video.title}
          </h1>
          {video.description && (
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {video.description}
            </p>
          )}
        </div>

        {/* Lesson list */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <LessonList
            lessons={lessons}
            currentVideoId={video.id}
            courseId={courseId}
            completedVideoIds={completedVideoIds}
            lessonsLabel={lessonsLabel}
            videoSlugMap={videoSlugMap}
          />
        </div>

        {/* Additional content sections (transcript, quiz, flashcards, etc.) */}
        {children}
      </div>

      {/* Right column: Sidebar — sticky on desktop */}
      <div className="lg:sticky lg:top-[4.5rem] lg:h-[calc(100vh-5.5rem)]">
        {sidebarSlot ?? <AISidebar videoId={video.id} className="h-full" />}
      </div>
    </div>
  );
}
