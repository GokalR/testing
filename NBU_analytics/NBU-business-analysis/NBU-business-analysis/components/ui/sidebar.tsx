"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { RegionSummary } from "@/lib/types";

interface SidebarProps {
  regions: RegionSummary[];
  defaultActiveId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function Sidebar({
  regions,
  defaultActiveId,
  onSelect,
  className,
}: SidebarProps) {
  const [active, setActive] = useState<string>(
    defaultActiveId ?? regions[0]?.id ?? "",
  );
  const [query, setQuery] = useState("");

  const filtered = regions.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <aside
      className={cn(
        "w-[280px] bg-navy-900 flex flex-col",
        className,
      )}
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск региона..."
            className={cn(
              "w-full h-10 pl-9 pr-3 rounded-input font-sans text-[14px] text-white",
              "bg-white/[0.08] border border-white/[0.12]",
              "placeholder:text-white/40",
              "focus:outline-none focus:border-gold-500 focus:ring-[3px] focus:ring-gold-500/20",
              "transition-[border-color,box-shadow] duration-150",
            )}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {filtered.length === 0 && (
          <div className="p-4 font-sans text-[13px] text-white/50">
            Ничего не найдено
          </div>
        )}
        {filtered.map((r) => {
          const isActive = active === r.id;
          return (
            <button
              key={r.id}
              onClick={() => {
                setActive(r.id);
                onSelect?.(r.id);
              }}
              className={cn(
                "w-full text-left py-3 px-4 flex items-start justify-between",
                "border-l-[3px] transition-colors duration-150",
                isActive
                  ? "bg-white/[0.08] border-gold-500"
                  : "border-transparent hover:bg-white/[0.05]",
              )}
            >
              <div className="min-w-0">
                <div className="font-sans text-[14px] font-medium text-white truncate">
                  {r.name}
                </div>
                <div className="font-sans text-[12px] font-medium text-white/50 mt-[2px]">
                  <span className="font-mono">{r.population}</span>
                  <span className="mx-1">·</span>
                  безработица{" "}
                  <span className="font-mono">{r.unemployment}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
