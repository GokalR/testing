"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface VideoFormProps {
  video: {
    id: string;
    courseId: string;
    title: string;
    description: string | null;
    videoUrl: string;
    thumbnailUrl: string | null;
    durationSec: number | null;
    transcript: string | null;
    sortOrder: number | null;
  };
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export function VideoForm({ video }: VideoFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description ?? "");
  const [videoUrl, setVideoUrl] = useState(video.videoUrl);
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnailUrl ?? "");
  const [durationSec, setDurationSec] = useState(video.durationSec ?? 0);
  const [sortOrder, setSortOrder] = useState(video.sortOrder ?? 0);
  const [transcript, setTranscript] = useState(video.transcript ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl || null,
          duration_sec: durationSec || null,
          sort_order: sortOrder,
          transcript: transcript || null,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to save");
      }

      setFeedback({ type: "success", message: "Video saved successfully." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setFeedback({ type: "error", message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this video? This action cannot be undone."))
      return;

    setDeleting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete");
      }

      router.push(`/admin/courses/${video.courseId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setFeedback({ type: "error", message });
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Feedback */}
      {feedback && (
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-sm font-medium",
            feedback.type === "success"
              ? "bg-[var(--success-light)] text-[var(--success)]"
              : "bg-[var(--error-light)] text-[var(--error)]"
          )}
        >
          {feedback.message}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="video-title" className={labelClass}>
          Title <span className="text-[var(--error)]">*</span>
        </label>
        <input
          id="video-title"
          type="text"
          required
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="video-description" className={labelClass}>
          Description
        </label>
        <textarea
          id="video-description"
          rows={3}
          className={cn(inputClass, "resize-y")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Video description"
        />
      </div>

      {/* Video URL */}
      <div>
        <label htmlFor="video-url" className={labelClass}>
          Video URL <span className="text-[var(--error)]">*</span>
        </label>
        <input
          id="video-url"
          type="text"
          required
          className={inputClass}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="/videos/episode-1.mp4"
        />
      </div>

      {/* Thumbnail URL */}
      <div>
        <label htmlFor="video-thumbnail" className={labelClass}>
          Thumbnail URL
        </label>
        <input
          id="video-thumbnail"
          type="text"
          className={inputClass}
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://example.com/thumbnail.jpg"
        />
      </div>

      {/* Duration & Sort Order — side by side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="video-duration" className={labelClass}>
            Duration (seconds)
          </label>
          <input
            id="video-duration"
            type="number"
            min={0}
            className={inputClass}
            value={durationSec}
            onChange={(e) => setDurationSec(Number(e.target.value))}
            placeholder="0"
          />
        </div>

        <div>
          <label htmlFor="video-sort-order" className={labelClass}>
            Sort Order
          </label>
          <input
            id="video-sort-order"
            type="number"
            min={0}
            className={inputClass}
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            placeholder="0"
          />
        </div>
      </div>

      {/* Transcript */}
      <div>
        <label htmlFor="video-transcript" className={labelClass}>
          Transcript
        </label>
        <textarea
          id="video-transcript"
          rows={8}
          className={cn(inputClass, "resize-y font-mono text-sm")}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Video transcript text…"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          disabled={saving || deleting}
          className={cn(
            "rounded-lg px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors",
            saving || deleting
              ? "bg-primary/60 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90"
          )}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={saving || deleting}
          className={cn(
            "rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors",
            saving || deleting
              ? "text-destructive/40 cursor-not-allowed"
              : "text-destructive hover:bg-[var(--error-light)]"
          )}
        >
          {deleting ? "Deleting…" : "Delete Video"}
        </button>
      </div>
    </form>
  );
}
