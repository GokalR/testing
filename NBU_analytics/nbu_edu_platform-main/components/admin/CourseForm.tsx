"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CourseFormProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    category: string | null;
    educatorName: string | null;
    isPublished: boolean | null;
    sortOrder: number | null;
  };
}

const inputClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const labelClass = "block text-sm font-medium text-foreground mb-1.5";

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(course.thumbnailUrl ?? "");
  const [category, setCategory] = useState(course.category ?? "");
  const [educatorName, setEducatorName] = useState(course.educatorName ?? "");
  const [sortOrder, setSortOrder] = useState(course.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(course.isPublished ?? false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          thumbnail_url: thumbnailUrl || null,
          category: category || null,
          educator_name: educatorName || null,
          is_published: isPublished,
          sort_order: sortOrder,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to save");
      }

      setFeedback({ type: "success", message: "Course saved successfully." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      setFeedback({ type: "error", message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this course? This action cannot be undone.")) return;

    setDeleting(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/courses/${course.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete");
      }

      router.push("/admin");
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
        <label htmlFor="title" className={labelClass}>
          Title <span className="text-[var(--error)]">*</span>
        </label>
        <input
          id="title"
          type="text"
          required
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course title"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={cn(inputClass, "resize-y")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course description"
        />
      </div>

      {/* Thumbnail URL */}
      <div>
        <label htmlFor="thumbnailUrl" className={labelClass}>
          Thumbnail URL
        </label>
        <input
          id="thumbnailUrl"
          type="text"
          className={inputClass}
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className={labelClass}>
          Category
        </label>
        <input
          id="category"
          type="text"
          className={inputClass}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Programming, Design"
        />
      </div>

      {/* Educator Name */}
      <div>
        <label htmlFor="educatorName" className={labelClass}>
          Educator Name
        </label>
        <input
          id="educatorName"
          type="text"
          className={inputClass}
          value={educatorName}
          onChange={(e) => setEducatorName(e.target.value)}
          placeholder="Instructor full name"
        />
      </div>

      {/* Sort Order */}
      <div>
        <label htmlFor="sortOrder" className={labelClass}>
          Sort Order
        </label>
        <input
          id="sortOrder"
          type="number"
          className={inputClass}
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          min={0}
        />
      </div>

      {/* Published toggle */}
      <div className="flex items-center gap-3">
        <input
          id="isPublished"
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-border accent-primary"
          checked={isPublished}
          onChange={(e) => setIsPublished(e.target.checked)}
        />
        <label htmlFor="isPublished" className="text-sm font-medium text-foreground cursor-pointer">
          Published
        </label>
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
          {deleting ? "Deleting…" : "Delete Course"}
        </button>
      </div>
    </form>
  );
}
