"use client";

import { useState, useRef, useMemo } from "react";
import {
  MARGILAN_PATHS,
  MARGILAN_CENTROIDS,
  MARGILAN_OUTLINE,
  MARGILAN_VIEWBOX,
  MARGILAN_MAHALLAS,
} from "@/lib/margilan-paths";
import { formatNumber } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

/* ── colour helpers ─────────────────────────────────── */

function heatColor(score: number): string {
  if (score >= 85) return "#059669";
  if (score >= 75) return "#2957A2";
  if (score >= 60) return "#D7B56D";
  return "#DC2626";
}

function competitionColor(c: string): string {
  if (c === "низкая") return "#059669";
  if (c === "средняя") return "#D97706";
  return "#DC2626";
}

function labelFill(score: number): string {
  return score >= 75 || score < 60 ? "#fff" : "#193F72";
}

/* ── Subsectors for educational courses ─────────────── */
const SUBSECTORS = {
  ru: [
    { name: "IT и программирование", share: 32, color: "#2957A2" },
    { name: "Иностранные языки", share: 25, color: "#059669" },
    { name: "Подготовка к ОТМ", share: 18, color: "#D7B56D" },
    { name: "Бухгалтерия / бизнес", share: 15, color: "#7C3AED" },
    { name: "Дизайн и ремёсла", share: 10, color: "#EC4899" },
  ],
  uz: [
    { name: "IT ва дастурлаш", share: 32, color: "#2957A2" },
    { name: "Хорижий тиллар", share: 25, color: "#059669" },
    { name: "ОТМга тайёргарлик", share: 18, color: "#D7B56D" },
    { name: "Бухгалтерия / бизнес", share: 15, color: "#7C3AED" },
    { name: "Дизайн ва ҳунармандчилик", share: 10, color: "#EC4899" },
  ],
};

const HEATMAP_T = {
  ru: {
    title: "Тепловая карта возможностей — Маргилан",
    sub: "Потенциал каждой махалли для образовательных курсов",
    source: "Источник: OSM + NBU Data Office",
    popLabel: "Население города",
    avgLabel: "Ср. балл",
    centersLabel: "Учебных центров",
    bestLabel: "★ Лучшая махалля",
    bestBadge: "★ ЛУЧШИЙ ВАРИАНТ",
    subsectorsLabel: "Направления курсов",
    rankingTitle: "Рейтинг махаллей",
    popCol: "Население",
    compCol: "Конкуренция",
    scoreCol: "Балл",
    entLabel: "Предприятий",
    legend: [
      { color: "#059669", label: "Отлично", range: "85–100" },
      { color: "#2957A2", label: "Хорошо", range: "75–84" },
      { color: "#D7B56D", label: "Умеренно", range: "60–74" },
      { color: "#DC2626", label: "Слабо", range: "0–59" },
    ],
  },
  uz: {
    title: "Имкониятлар иссиқлик хартаси — Марғилон",
    sub: "Ҳар бир маҳалланинг таълим курслари учун потенциали",
    source: "Манба: OSM + NBU Data Office",
    popLabel: "Шаҳар аҳолиси",
    avgLabel: "Ўрт. балл",
    centersLabel: "Ўқув марказлари",
    bestLabel: "★ Энг яхши маҳалла",
    bestBadge: "★ ЭНГ ЯХШИ ВАРИАНТ",
    subsectorsLabel: "Курс йўналишлари",
    rankingTitle: "Маҳаллалар рейтинги",
    popCol: "Аҳоли",
    compCol: "Рақобат",
    scoreCol: "Балл",
    entLabel: "Корхоналар",
    legend: [
      { color: "#059669", label: "Аъло", range: "85–100" },
      { color: "#2957A2", label: "Яхши", range: "75–84" },
      { color: "#D7B56D", label: "Ўртача", range: "60–74" },
      { color: "#DC2626", label: "Паст", range: "0–59" },
    ],
  },
};

/* ── main component ─────────────────────────────────── */

export function MargilanHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tip, setTip] = useState({ x: 0, y: 0 });
  const { lang } = useLang();
  const ht = HEATMAP_T[lang];
  const subsectors = SUBSECTORS[lang];

  const sorted = useMemo(
    () => [...MARGILAN_MAHALLAS].sort((a, b) => b.score - a.score),
    [],
  );

  const best = sorted[0];

  const hovered = hoveredId
    ? MARGILAN_MAHALLAS.find((d) => d.id === hoveredId) ?? null
    : null;

  const totalPop = useMemo(
    () => MARGILAN_MAHALLAS.reduce((s, d) => s + d.population, 0),
    [],
  );
  const avgScore = useMemo(
    () => Math.round(MARGILAN_MAHALLAS.reduce((s, d) => s + d.score, 0) / MARGILAN_MAHALLAS.length),
    [],
  );

  const maxScore = best.score;

  return (
    <div className="space-y-8">
      {/* ── Header + Legend ────────────────────────── */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h2 className="font-sans text-[22px] font-bold text-carbon">
            {ht.title}
          </h2>
          <p className="font-sans text-[15px] font-normal text-gray-600 mt-1">
            {ht.sub} · {MARGILAN_MAHALLAS.length} {lang === "uz" ? "маҳалла" : "махаллей"} · {ht.source}
          </p>
        </div>
        <div className="flex items-center gap-5 shrink-0 pt-1">
          {ht.legend.map((l) => (
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
            viewBox={MARGILAN_VIEWBOX}
            className="w-full h-auto"
            style={{ minHeight: 340 }}
          >
            <defs>
              <filter id="mhover-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.2" />
              </filter>
            </defs>

            {/* Faint city outline as background */}
            <path
              d={MARGILAN_OUTLINE}
              fill="#e8eef4"
              stroke="#c0cdd8"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Mahalla zones */}
            {MARGILAN_MAHALLAS.map((d) => {
              const path = MARGILAN_PATHS[d.id];
              const centroid = MARGILAN_CENTROIDS[d.id];
              if (!path || !centroid) return null;

              const isBest = d.id === best.id;
              const isHov = d.id === hoveredId;
              const color = heatColor(d.score);

              return (
                <g
                  key={d.id}
                  onMouseEnter={() => setHoveredId(d.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer"
                  style={{ filter: isHov ? "url(#mhover-shadow)" : "none" }}
                >
                  <path
                    d={path}
                    fill={color}
                    fillOpacity={isHov ? 0.95 : 0.75}
                    stroke={isHov ? "#193F72" : "#fff"}
                    strokeWidth={isHov ? 2.5 : 1.5}
                    style={{
                      transition: "fill-opacity 150ms ease, stroke 150ms ease, stroke-width 150ms ease",
                    }}
                  />

                  {/* Best district animated border */}
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

                  {/* District name */}
                  <text
                    x={centroid[0]}
                    y={centroid[1] - 5}
                    textAnchor="middle"
                    fill={labelFill(d.score)}
                    fontSize={9}
                    fontFamily="'Inter', sans-serif"
                    fontWeight={600}
                    style={{ pointerEvents: "none" }}
                  >
                    {d.name}
                  </text>

                  {/* Score */}
                  <text
                    x={centroid[0]}
                    y={centroid[1] + 11}
                    textAnchor="middle"
                    fill={labelFill(d.score)}
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
                    {ht.bestBadge}
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
                    <span className="font-sans text-[12px] text-steel-500">{ht.popCol}</span>
                    <span className="font-mono text-[12px] font-medium text-carbon">
                      {formatNumber(hovered.population)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[12px] text-steel-500">{ht.entLabel}</span>
                    <span className="font-mono text-[12px] font-medium text-carbon">
                      ~{hovered.businesses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-sans text-[12px] text-steel-500">{ht.compCol}</span>
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
                {ht.popLabel}
              </div>
              <div className="font-mono text-[22px] font-bold text-navy-900 mt-[2px]">
                261,948
              </div>
              <div className="font-sans text-[10px] text-steel-500">
                stat.uz, 2024
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">
                {ht.avgLabel}
              </div>
              <div className="font-mono text-[22px] font-bold mt-[2px]" style={{ color: heatColor(avgScore) }}>
                {avgScore}
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">
                {ht.centersLabel}
              </div>
              <div className="font-mono text-[14px] font-bold text-carbon mt-[2px]">
                31
              </div>
              <div className="font-sans text-[10px] text-steel-500">
                NBU Data Office
              </div>
            </div>
          </div>

          {/* Best mahalla */}
          <div
            className="rounded-[10px] p-4"
            style={{
              background: "linear-gradient(135deg, rgba(5,150,105,0.06), rgba(5,150,105,0.02))",
              border: "1px solid rgba(5,150,105,0.2)",
            }}
          >
            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.5px] text-green-600">
              {ht.bestLabel}
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
              {ht.subsectorsLabel}
            </div>
            <div className="space-y-[6px]">
              {subsectors.map((s) => (
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
          {ht.rankingTitle}
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
          <span className="font-sans text-[10px] text-steel-500">{ht.scoreCol}</span>
          <span className="font-sans text-[10px] text-steel-500 w-[70px] text-right">{ht.popCol}</span>
          <span className="font-sans text-[10px] text-steel-500 w-[65px] text-right">{ht.compCol}</span>
        </div>
      </div>
    </div>
  );
}
