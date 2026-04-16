"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContentItem {
  id: string;
  contentType: string;
  content: unknown;
}

interface ContentEditorProps {
  videoId: string;
  existingContent: ContentItem[];
}

type ContentTab = "quiz" | "flashcards" | "mental_map" | "test";

interface TabConfig {
  id: ContentTab;
  label: string;
}

const TABS: TabConfig[] = [
  { id: "quiz", label: "Quiz" },
  { id: "flashcards", label: "Flashcards" },
  { id: "mental_map", label: "Mental Map" },
  { id: "test", label: "Test" },
];

// ── Per-tab state ─────────────────────────────────────────────────────────────

interface TabState {
  jsonText: string;
  saving: boolean;
  deleting: boolean;
  feedback: { type: "success" | "error"; message: string } | null;
}

function buildInitialTabState(
  existingContent: ContentItem[]
): Record<ContentTab, TabState> {
  const result = {} as Record<ContentTab, TabState>;
  for (const tab of TABS) {
    const item = existingContent.find((c) => c.contentType === tab.id);
    result[tab.id] = {
      jsonText: item ? JSON.stringify(item.content, null, 2) : "",
      saving: false,
      deleting: false,
      feedback: null,
    };
  }
  return result;
}

// ── Shared input/label styles ─────────────────────────────────────────────────

const textareaClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y font-mono text-sm min-h-[300px]";

// ── Main Component ────────────────────────────────────────────────────────────

export function ContentEditor({ videoId, existingContent }: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>("quiz");
  const [tabStates, setTabStates] = useState<Record<ContentTab, TabState>>(
    () => buildInitialTabState(existingContent)
  );

  // Track which content IDs exist so we can update the map after create/delete
  const [contentIds, setContentIds] = useState<Partial<Record<ContentTab, string>>>(
    () => {
      const map: Partial<Record<ContentTab, string>> = {};
      for (const item of existingContent) {
        const tab = item.contentType as ContentTab;
        map[tab] = item.id;
      }
      return map;
    }
  );

  function updateTabState(tab: ContentTab, patch: Partial<TabState>) {
    setTabStates((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], ...patch },
    }));
  }

  async function handleSave(tab: ContentTab) {
    const state = tabStates[tab];
    const existingId = contentIds[tab];

    // Validate JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(state.jsonText);
    } catch {
      updateTabState(tab, {
        feedback: { type: "error", message: "Invalid JSON — please fix syntax errors before saving." },
      });
      return;
    }

    updateTabState(tab, { saving: true, feedback: null });

    try {
      let res: Response;

      if (existingId) {
        // Update existing
        res = await fetch(`/api/learning-content/${existingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: parsed }),
        });
      } else {
        // Create new
        res = await fetch(`/api/videos/${videoId}/content`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content_type: tab, content: parsed }),
        });
      }

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to save");
      }

      const saved = (await res.json()) as { id: string };

      // Update the content ID map if it was a create
      if (!existingId) {
        setContentIds((prev) => ({ ...prev, [tab]: saved.id }));
      }

      updateTabState(tab, {
        feedback: { type: "success", message: "Content saved successfully." },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      updateTabState(tab, { feedback: { type: "error", message } });
    } finally {
      updateTabState(tab, { saving: false });
    }
  }

  async function handleDelete(tab: ContentTab) {
    const existingId = contentIds[tab];
    if (!existingId) return;

    if (!window.confirm(`Delete ${tab} content? This action cannot be undone.`))
      return;

    updateTabState(tab, { deleting: true, feedback: null });

    try {
      const res = await fetch(`/api/learning-content/${existingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Failed to delete");
      }

      // Remove from ID map and clear textarea
      setContentIds((prev) => {
        const next = { ...prev };
        delete next[tab];
        return next;
      });
      updateTabState(tab, {
        jsonText: "",
        feedback: { type: "success", message: "Content deleted." },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      updateTabState(tab, { feedback: { type: "error", message } });
    } finally {
      updateTabState(tab, { deleting: false });
    }
  }

  const state = tabStates[activeTab];
  const existingId = contentIds[activeTab];
  const hasContent = Boolean(existingId);

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex border-b border-border mb-6"
        role="tablist"
        aria-label="Learning content type tabs"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasExisting = Boolean(contentIds[tab.id]);
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
                isActive
                  ? "text-primary border-b-2 border-primary -mb-px"
                  : "text-muted-foreground hover:text-foreground border-b-2 border-transparent -mb-px"
              )}
            >
              {tab.label}
              {hasExisting && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="has content" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      <div role="tabpanel">
        {/* Feedback */}
        {state.feedback && (
          <div
            className={cn(
              "mb-4 rounded-lg px-4 py-3 text-sm font-medium",
              state.feedback.type === "success"
                ? "bg-[var(--success-light)] text-[var(--success)]"
                : "bg-[var(--error-light)] text-[var(--error)]"
            )}
          >
            {state.feedback.message}
          </div>
        )}

        {hasContent || state.jsonText ? (
          <>
            {/* JSON textarea */}
            <div className="mb-4">
              <label
                htmlFor={`content-json-${activeTab}`}
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                {TABS.find((t) => t.id === activeTab)?.label} JSON
                {!hasContent && (
                  <span className="ml-2 text-xs text-muted-foreground font-normal">(unsaved)</span>
                )}
              </label>
              <textarea
                id={`content-json-${activeTab}`}
                className={textareaClass}
                value={state.jsonText}
                onChange={(e) =>
                  updateTabState(activeTab, { jsonText: e.target.value, feedback: null })
                }
                placeholder={`Paste ${activeTab} JSON here…`}
                spellCheck={false}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSave(activeTab)}
                disabled={state.saving || state.deleting}
                className={cn(
                  "rounded-lg px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors",
                  state.saving || state.deleting
                    ? "bg-primary/60 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                )}
              >
                {state.saving ? "Saving…" : hasContent ? "Save Changes" : "Create"}
              </button>

              {hasContent && (
                <button
                  type="button"
                  onClick={() => void handleDelete(activeTab)}
                  disabled={state.saving || state.deleting}
                  className={cn(
                    "rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors",
                    state.saving || state.deleting
                      ? "text-destructive/40 cursor-not-allowed"
                      : "text-destructive hover:bg-[var(--error-light)]"
                  )}
                >
                  {state.deleting ? "Deleting…" : "Delete"}
                </button>
              )}
            </div>
          </>
        ) : (
          /* No content state */
          <div className="flex flex-col items-center justify-center gap-4 py-14 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              No {TABS.find((t) => t.id === activeTab)?.label.toLowerCase()} content yet for this video.
            </p>
            <button
              type="button"
              onClick={() =>
                updateTabState(activeTab, { jsonText: "{\n  \n}", feedback: null })
              }
              className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
            >
              Create
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
