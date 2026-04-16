"use client";

import { useState, useRef, useMemo } from "react";
import { FERGANA_PATHS, FERGANA_CENTROIDS } from "@/lib/fergana-paths";
import { KEY_ENTERPRISES, SUBSECTORS } from "@/lib/fergana-enterprises";
import { formatNumber } from "@/lib/utils";

/* ── types ──────────────────────────────────────────── */

export interface DistrictData {
  id: string;
  name: string;
  score: number;
  population: number;
  businesses: number;
  competition: "низкая" | "средняя" | "высокая";
  verdict: string;
}

export interface DistrictHeatmapProps {
  regionName: string;
  businessType: string;
  districts: DistrictData[];
}

/* ── colour helpers ─────────────────────────────────── */

function heatColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 60) return "#2957A2";
  if (score >= 40) return "#D7B56D";
  return "#DC2626";
}

function competitionColor(c: DistrictData["competition"]): string {
  if (c === "низкая") return "#059669";
  if (c === "средняя") return "#D97706";
  return "#DC2626";
}

function labelFill(score: number): string {
  return score >= 60 || score < 40 ? "#fff" : "#193F72";
}

const MAP_LEGEND = [
  { color: "#059669", label: "Отлично", range: "80–100" },
  { color: "#2957A2", label: "Хорошо", range: "60–79" },
  { color: "#D7B56D", label: "Умеренно", range: "40–59" },
  { color: "#DC2626", label: "Слабо", range: "0–39" },
];

/** Short names for map labels to avoid overlap */
const SHORT_NAMES: Record<string, string> = {
  "Марғилон ш.": "Марғилон",
  "Фарғона ш.": "Фарғона",
  "Қувасой ш.": "Қувасой",
  "Қўқон ш.": "Қўқон",
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  production: { label: "Производство", color: "#2957A2" },
  craft: { label: "Ремесло", color: "#D7B56D" },
  fdi: { label: "Иностранные инвестиции", color: "#059669" },
};

/* ── main component ─────────────────────────────────── */

export function DistrictHeatmap({
  regionName,
  businessType,
  districts,
}: DistrictHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tip, setTip] = useState({ x: 0, y: 0 });

  const sorted = useMemo(
    () => [...districts].sort((a, b) => b.score - a.score),
    [districts],
  );

  const best = sorted[0];

  const hovered = hoveredId
    ? districts.find((d) => d.id === hoveredId) ?? null
    : null;

  const totalPop = useMemo(
    () => districts.reduce((s, d) => s + d.population, 0),
    [districts],
  );
  const totalBiz = useMemo(
    () => districts.reduce((s, d) => s + d.businesses, 0),
    [districts],
  );
  const avgScore = useMemo(
    () => Math.round(districts.reduce((s, d) => s + d.score, 0) / districts.length),
    [districts],
  );

  const maxScore = best.score;

  return (
    <div className="space-y-8">
      {/* ── Header + Legend ────────────────────────── */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-sans text-[22px] font-bold text-carbon">
            Тепловая карта возможностей — {regionName}
          </h2>
          <p className="font-sans text-[15px] font-normal text-gray-600 mt-1">
            Потенциал каждого района для направления «{businessType}» · {districts.length} районов
          </p>
        </div>
        <div className="flex items-center gap-5 shrink-0 pt-1">
          {MAP_LEGEND.map((l) => (
            <div key={l.label} className="flex items-center gap-[6px]">
              <span
                className="w-[10px] h-[10px] rounded-[3px] shrink-0"
                style={{ background: l.color }}
              />
              <span className="font-sans text-[12px] text-gray-600 whitespace-nowrap">
                {l.range}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Map + Stats ───────────────────────────── */}
      <div className="flex gap-6">
        {/* SVG Map */}
        <div
          ref={containerRef}
          className="relative flex-1 min-w-0 bg-[#F8F9FC] rounded-[10px] border border-border/60 p-4"
          onMouseMove={(e) => {
            if (!containerRef.current) return;
            const r = containerRef.current.getBoundingClientRect();
            setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
          }}
        >
          <svg
            viewBox="0 0 700 500"
            className="w-full h-auto"
            style={{ minHeight: 340 }}
          >
            <defs>
              <filter id="hover-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
              </filter>
            </defs>

            {districts.map((d) => {
              const path = FERGANA_PATHS[d.id];
              const centroid = FERGANA_CENTROIDS[d.id];
              if (!path || !centroid) return null;

              const isBest = d.id === best.id;
              const isHov = d.id === hoveredId;
              const isExclave = d.id === "sux";
              const color = heatColor(d.score);
              const shortName = SHORT_NAMES[d.name] ?? d.name;

              return (
                <g
                  key={d.id}
                  onMouseEnter={() => setHoveredId(d.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                  style={{ filter: isHov ? "url(#hover-shadow)" : "none" }}
                >
                  <path
                    d={path}
                    fill={color}
                    fillOpacity={isExclave ? 0.4 : isHov ? 0.95 : 0.75}
                    stroke={isHov ? "#193F72" : isExclave ? "#999" : "#fff"}
                    strokeWidth={isHov ? 2.5 : 1.5}
                    strokeDasharray={isExclave && !isHov ? "4 3" : "none"}
                    style={{
                      transition: "fill-opacity 150ms ease, stroke 150ms ease, stroke-width 150ms ease",
                    }}
                  />

                  {isBest && !isHov && (
                    <path
                      d={path}
                      fill="none"
                      stroke="#D7B56D"
                      strokeWidth={2.5}
                      strokeDasharray="8 4"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;24"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>
                  )}

                  <text
                    x={centroid[0]}
                    y={centroid[1] - 5}
                    textAnchor="middle"
                    fill={labelFill(d.score)}
                    fillOpacity={isExclave ? 0.6 : 1}
                    fontSize={9}
                    fontFamily="'Inter', sans-serif"
                    fontWeight={600}
                    style={{ pointerEvents: "none" }}
                  >
                    {shortName}
                  </text>

                  <text
                    x={centroid[0]}
                    y={centroid[1] + 11}
                    textAnchor="middle"
                    fill={labelFill(d.score)}
                    fillOpacity={isExclave ? 0.6 : 1}
                    fontSize={13}
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight={700}
                    style={{ pointerEvents: "none" }}
                  >
                    {d.score}
                  </text>
                </g>
              );
            })}

            {/* Exclave label for So'x */}
            {FERGANA_CENTROIDS["sux"] && (
              <text
                x={FERGANA_CENTROIDS["sux"][0]}
                y={FERGANA_CENTROIDS["sux"][1] + 26}
                textAnchor="middle"
                fill="#999"
                fontSize={8}
                fontFamily="'Inter', sans-serif"
                fontWeight={500}
                style={{ pointerEvents: "none" }}
              >
                (эксклав)
              </text>
            )}
          </svg>

          {/* Hover tooltip */}
          {hovered && (
            <div
              className="absolute z-10 pointer-events-none"
              style={{
                left: Math.min(tip.x + 16, (containerRef.current?.offsetWidth ?? 400) - 270),
                top: tip.y < 200 ? tip.y + 24 : tip.y - 8,
                transform: tip.y < 200 ? "none" : "translateY(-100%)",
              }}
            >
              <div
                className="bg-white rounded-[10px] py-4 px-5 border border-border/50"
                style={{
                  boxShadow: "0 12px 32px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
                  minWidth: 240,
                  maxWidth: 290,
                }}
              >
                {hovered.id === best.id && (
                  <div className="font-sans text-[11px] font-bold text-gold-500 mb-1 tracking-wide">
                    ★ ЛУЧШИЙ ВАРИАНТ
                  </div>
                )}
                <div className="font-sans text-[15px] font-bold text-carbon">
                  {hovered.name}
                </div>
                <div
                  className="font-mono text-[22px] font-bold mt-1"
                  style={{ color: heatColor(hovered.score) }}
                >
                  {hovered.score}/100
                </div>
                <div className="space-y-[5px] mt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[12px] text-steel-500">Население</span>
                    <span className="font-mono text-[12px] font-medium text-carbon">
                      {formatNumber(hovered.population)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[12px] text-steel-500">Предприятий</span>
                    <span className="font-mono text-[12px] font-medium text-carbon">
                      ~{hovered.businesses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[12px] text-steel-500">Конкуренция</span>
                    <span
                      className="font-sans text-[12px] font-semibold"
                      style={{ color: competitionColor(hovered.competition) }}
                    >
                      {hovered.competition}
                    </span>
                  </div>
                </div>
                <div className="font-sans text-[12px] italic text-gray-600 mt-3 pt-3 border-t border-border leading-[1.45]">
                  {hovered.verdict}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        <div className="w-[180px] shrink-0 space-y-4">
          <div className="bg-[#F8F9FC] rounded-[10px] border border-border/60 p-4 space-y-4">
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">
                Всего предприятий
              </div>
              <div className="font-mono text-[22px] font-bold text-navy-900 mt-[2px]">
                855
              </div>
              <div className="font-sans text-[10px] text-steel-500">
                stat.uz, 2021
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">
                Ср. балл
              </div>
              <div className="font-mono text-[22px] font-bold mt-[2px]" style={{ color: heatColor(avgScore) }}>
                {avgScore}
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">
                Население
              </div>
              <div className="font-mono text-[14px] font-bold text-carbon mt-[2px]">
                {formatNumber(totalPop)}
              </div>
            </div>
          </div>

          {/* Best district */}
          <div
            className="rounded-[10px] p-4"
            style={{
              background: "linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.02))",
              border: "1px solid rgba(5,150,105,0.2)",
            }}
          >
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-green-600">
              ★ Лучший район
            </div>
            <div className="font-sans text-[14px] font-bold text-carbon mt-1">
              {best.name}
            </div>
            <div className="font-mono text-[18px] font-bold mt-[2px]" style={{ color: heatColor(best.score) }}>
              {best.score}/100
            </div>
          </div>

          {/* Sub-sector breakdown */}
          <div className="bg-[#F8F9FC] rounded-[10px] border border-border/60 p-4">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 mb-3">
              Подотрасли
            </div>
            <div className="space-y-[6px]">
              {SUBSECTORS.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-[2px]">
                    <span className="font-sans text-[11px] text-gray-600">{s.name}</span>
                    <span className="font-mono text-[11px] font-semibold text-carbon">{s.share}%</span>
                  </div>
                  <div className="h-[4px] bg-border/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${s.share}%`, background: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Ranking bar chart ─────────────────────── */}
      <div>
        <h3 className="font-sans text-[16px] font-bold text-carbon mb-4">
          Рейтинг районов
        </h3>
        <div className="space-y-[6px]">
          {sorted.map((d, i) => {
            const barWidth = Math.max((d.score / maxScore) * 100, 8);
            const color = heatColor(d.score);
            const isTop3 = i < 3;
            return (
              <div
                key={d.id}
                className="flex items-center gap-3 group"
                onMouseEnter={() => setHoveredId(d.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <span className="font-mono text-[12px] font-medium text-steel-500 w-[18px] text-right shrink-0">
                  {i + 1}
                </span>
                <span
                  className="font-sans text-[13px] font-medium text-carbon w-[110px] shrink-0 truncate"
                  style={{ fontWeight: isTop3 ? 600 : 400 }}
                >
                  {d.name}
                </span>
                <div className="flex-1 h-[20px] bg-gray-100 rounded-[4px] overflow-hidden">
                  <div
                    className="h-full rounded-[4px] flex items-center justify-end pr-2 transition-all duration-300 group-hover:opacity-90"
                    style={{ width: `${barWidth}%`, background: color }}
                  >
                    <span className="font-mono text-[11px] font-bold text-white">
                      {d.score}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-steel-500 w-[70px] shrink-0 text-right">
                  {formatNumber(d.population)}
                </span>
                <span
                  className="font-sans text-[11px] font-semibold w-[65px] shrink-0 text-right"
                  style={{ color: competitionColor(d.competition) }}
                >
                  {d.competition}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-8 mt-2 pt-2 border-t border-border/50">
          <span className="font-sans text-[10px] text-steel-500">Балл</span>
          <span className="font-sans text-[10px] text-steel-500 w-[70px] text-right">Население</span>
          <span className="font-sans text-[10px] text-steel-500 w-[65px] text-right">Конкуренция</span>
        </div>
      </div>

      {/* ── Key enterprises ───────────────────────── */}
      <div>
        <h3 className="font-sans text-[16px] font-bold text-carbon mb-4">
          Ключевые предприятия региона
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {KEY_ENTERPRISES.map((e) => {
            const t = TYPE_LABELS[e.type];
            return (
              <div
                key={e.name}
                className="bg-[#F8F9FC] rounded-[10px] border border-border/60 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="font-sans text-[10px] font-bold uppercase tracking-[0.5px] py-[2px] px-[6px] rounded-[4px]"
                    style={{ color: t.color, background: t.color + "12" }}
                  >
                    {t.label}
                  </span>
                  <span className="font-sans text-[11px] text-steel-500">
                    {e.district}
                  </span>
                </div>
                <div className="font-sans text-[14px] font-bold text-carbon leading-snug">
                  {e.name}
                </div>
                <div className="font-mono text-[12px] font-semibold text-navy-900 mt-1">
                  {formatNumber(e.workers)} сотрудников
                </div>
                <div className="font-sans text-[12px] text-gray-600 mt-1 leading-[1.4]">
                  {e.detail}
                </div>
                <div className="font-sans text-[10px] text-steel-500 mt-2">
                  Источник: {e.source}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
