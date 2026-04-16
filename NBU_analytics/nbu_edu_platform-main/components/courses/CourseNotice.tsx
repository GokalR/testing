import type { ReactNode } from "react";

interface CourseNoticeProps {
  children: ReactNode;
}

export function CourseNotice({ children }: CourseNoticeProps) {
  return (
    <div className="rounded-[var(--shape-radius-lg)] border border-[color:var(--accent)]/30 bg-[color:var(--accent-light)] px-5 py-4 text-sm leading-7 text-[color:var(--text-secondary)] shadow-[var(--shadow-sm)]">
      {children}
    </div>
  );
}
