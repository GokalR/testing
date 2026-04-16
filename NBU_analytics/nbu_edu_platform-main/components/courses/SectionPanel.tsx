import type { ReactNode } from "react";

interface SectionPanelProps {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

export function SectionPanel({
  eyebrow,
  title,
  children,
}: SectionPanelProps) {
  return (
    <section className="rounded-[var(--shape-radius-xl)] border border-border bg-card/90 p-6 shadow-[var(--shadow-sm)]">
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-heading text-3xl text-foreground">{title}</h2>
      <div className="mt-5 text-[color:var(--text-secondary)]">{children}</div>
    </section>
  );
}
