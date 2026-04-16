"use client";

import { useState } from "react";
import { Rocket, Building2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import type { BusinessPath } from "./types";

const T = {
  ru: {
    badge: "AI БИЗНЕС-СОВЕТНИК",
    heading: "С чего начнём?",
    sub: "Выберите свой путь — и мы зададим правильные вопросы, чтобы дать вам точный анализ",
    cta: "Начать",
    trust: "Ваши данные не передаются третьим лицам и используются только для анализа",
    paths: [
      {
        title: "Хочу начать бизнес",
        subtitle: "У меня есть идея, и я хочу понять — стоит ли начинать",
        bullets: [
          "Анализ рынка в вашем районе",
          "Расчёт стартовых затрат",
          "Оценка конкуренции",
          "Подбор кредитных продуктов NBU",
          "Пошаговый план действий",
        ],
      },
      {
        title: "У меня уже есть бизнес",
        subtitle: "Хочу развить, расширить или решить проблему",
        bullets: [
          "Диагностика текущего состояния",
          "Анализ финансовых показателей",
          "Выявление точек роста",
          "Подбор подходящих кредитов NBU",
          "Стратегия масштабирования",
        ],
      },
    ],
  },
  uz: {
    badge: "AI БИЗНЕС-МАСЛАҲАТЧИ",
    heading: "Нимадан бошлаймиз?",
    sub: "Ўз йўлингизни танланг — ва биз сизга аниқ таҳлил бериш учун тўғри саволлар берамиз",
    cta: "Бошлаш",
    trust: "Маълумотларингиз учинчи шахсларга берилмайди ва фақат таҳлил учун ишлатилади",
    paths: [
      {
        title: "Бизнес бошламоқчиман",
        subtitle: "Менда ғоя бор ва тушунмоқчиман — бошлашга арзийдими",
        bullets: [
          "Ҳудудингиздаги бозор таҳлили",
          "Бошланғич харажатлар ҳисоби",
          "Рақобат баҳоси",
          "NBU кредит маҳсулотларини танлаш",
          "Босқичма-босқич ҳаракат режаси",
        ],
      },
      {
        title: "Менда бизнес бор",
        subtitle: "Ривожлантириш, кенгайтириш ёки муаммони ҳал қилмоқчиман",
        bullets: [
          "Жорий ҳолатни ташхислаш",
          "Молиявий кўрсаткичлар таҳлили",
          "Ўсиш нуқталарини аниқлаш",
          "NBU мос кредитларини танлаш",
          "Кенгайтириш стратегияси",
        ],
      },
    ],
  },
};

interface Step0Props {
  onSelect: (path: BusinessPath) => void;
}

const PATH_IDS: BusinessPath[] = ["new", "existing"];
const PATH_STYLES = [
  { gradient: "from-navy-900 to-[#2957A2]", iconBg: "bg-navy-900/10", iconColor: "text-navy-900" },
  { gradient: "from-gold-500 to-[#C4A35A]", iconBg: "bg-gold-500/10", iconColor: "text-gold-500" },
];
const PATH_ICONS = [Rocket, Building2];

export function Step0PathSelect({ onSelect }: Step0Props) {
  const [selected, setSelected] = useState<BusinessPath | null>(null);
  const [hoveredId, setHoveredId] = useState<BusinessPath | null>(null);
  const { lang } = useLang();
  const t = T[lang];

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center font-sans text-[12px] font-semibold text-gold-500 bg-gold-500/[0.08] rounded-[6px] py-1 px-3">
          {t.badge}
        </span>
        <h1 className="font-sans text-[32px] font-bold text-carbon mt-4 tracking-[-0.5px]">
          {t.heading}
        </h1>
        <p className="font-sans text-[16px] font-normal text-gray-600 leading-[1.5] mt-2 max-w-[520px] mx-auto">
          {t.sub}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-5">
        {PATH_IDS.map((id, idx) => {
          const Icon = PATH_ICONS[idx];
          const style = PATH_STYLES[idx];
          const p = t.paths[idx];
          const isSelected = selected === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                "relative text-left rounded-[14px] border-[2px] p-8 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40",
                isSelected
                  ? "border-navy-900 bg-white shadow-[0_4px_20px_rgba(25,63,114,0.12)]"
                  : "border-border bg-white hover:border-steel-500/50 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
              )}
            >
              {/* Selection indicator */}
              <div
                className={cn(
                  "absolute top-5 right-5 w-[22px] h-[22px] rounded-full border-[2px] transition-all duration-200 flex items-center justify-center",
                  isSelected ? "border-navy-900 bg-navy-900" : "border-border bg-white",
                )}
              >
                {isSelected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {/* Icon */}
              <div className={cn("w-[52px] h-[52px] rounded-[12px] flex items-center justify-center mb-5", style.iconBg)}>
                <Icon size={26} strokeWidth={1.75} className={style.iconColor} />
              </div>

              {/* Title & subtitle */}
              <h2 className="font-sans text-[20px] font-bold text-carbon">{p.title}</h2>
              <p className="font-sans text-[14px] font-normal text-gray-600 mt-1">{p.subtitle}</p>

              {/* Bullet points */}
              <ul className="mt-5 space-y-[10px]">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-[10px]">
                    <span className={cn("w-[6px] h-[6px] rounded-full mt-[6px] shrink-0", isSelected ? "bg-navy-900" : "bg-steel-500/50")} />
                    <span className="font-sans text-[13px] text-gray-600 leading-[1.4]">{b}</span>
                  </li>
                ))}
              </ul>

              {/* Bottom gradient line */}
              <div
                className={cn(
                  "absolute bottom-0 left-4 right-4 h-[3px] rounded-full transition-opacity duration-200",
                  isSelected ? "opacity-100" : "opacity-0",
                )}
                style={{
                  background: `linear-gradient(90deg, ${id === "new" ? "#193F72, #2957A2" : "#D7B56D, #C4A35A"})`,
                }}
              />
            </button>
          );
        })}
      </div>

      {/* CTA Button */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
          className={cn(
            "inline-flex items-center font-sans text-[15px] font-semibold rounded-[10px] py-[14px] px-10 transition-all duration-200",
            selected
              ? "text-white bg-navy-900 hover:bg-navy-700 cursor-pointer"
              : "text-steel-500 bg-gray-100 cursor-not-allowed",
          )}
        >
          {t.cta}
          <ArrowRight size={18} strokeWidth={2.25} className={cn("ml-2 transition-transform", selected && "group-hover:translate-x-1")} />
        </button>
      </div>

      {/* Trust note */}
      <p className="text-center font-sans text-[12px] text-steel-500 mt-4">
        {t.trust}
      </p>
    </div>
  );
}
