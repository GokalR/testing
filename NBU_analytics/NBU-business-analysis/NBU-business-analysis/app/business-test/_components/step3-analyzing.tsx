"use client";

import { useEffect, useState } from "react";
import { Brain, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

const CRITERIA = {
  ru: [
    { label: "Личный профиль", threshold: 15 },
    { label: "Региональный рынок", threshold: 30 },
    { label: "Финансовые возможности", threshold: 45 },
    { label: "Бизнес-модель", threshold: 60 },
    { label: "Анализ конкуренции", threshold: 78 },
    { label: "Бизнес-план", threshold: 95 },
  ],
  uz: [
    { label: "Шахсий профил", threshold: 15 },
    { label: "Минтақавий бозор", threshold: 30 },
    { label: "Молиявий имкониятлар", threshold: 45 },
    { label: "Бизнес-модель", threshold: 60 },
    { label: "Рақобат таҳлили", threshold: 78 },
    { label: "Бизнес-план", threshold: 95 },
  ],
};

const T = {
  ru: {
    title: "AI анализ выполняется",
    sub: "Ваши данные обрабатываются — подождите немного",
    back: "← Вернуться к рекомендациям",
  },
  uz: {
    title: "AI таҳлил бажарилмоқда",
    sub: "Маълумотларингиз қайта ишланмоқда — бир оз кутинг",
    back: "← Тавсияларга қайтиш",
  },
};

const DURATION_MS = 8000;
const STEP_MS = 80;
const FINALIZE_DELAY_MS = 500;

interface Step3Props {
  onBack: () => void;
  onComplete: () => void;
}

export function Step3Analyzing({ onBack, onComplete }: Step3Props) {
  const [percent, setPercent] = useState(0);
  const [finalizing, setFinalizing] = useState(false);
  const { lang } = useLang();
  const t = T[lang];
  const criteria = CRITERIA[lang];

  useEffect(() => {
    const id = setInterval(() => {
      setPercent((p) => Math.min(100, p + (100 / (DURATION_MS / STEP_MS))));
    }, STEP_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (percent < 100) return;
    const t1 = setTimeout(() => setFinalizing(true), 0);
    const t2 = setTimeout(() => onComplete(), FINALIZE_DELAY_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [percent, onComplete]);

  const displayPercent = Math.min(100, Math.round(percent));

  return (
    <div className="flex flex-col items-center">
      <div className={cn("w-full bg-white border border-border rounded-[16px] py-12 px-12 animate-fade-in-up", "shadow-[0_2px_8px_rgba(0,0,0,0.06)]", "transition-opacity duration-300", finalizing && "opacity-85")}>
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-navy-900 opacity-10 animate-pulse-outer" />
            <div className="absolute inset-2 rounded-full border-2 border-gold-500 opacity-20 animate-pulse-middle" />
            <div className="absolute inset-4 rounded-full bg-gold-500 opacity-[0.15] animate-pulse-inner" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain size={24} strokeWidth={2} className="text-navy-900 animate-slow-spin" />
            </div>
          </div>
        </div>

        <h1 className="font-sans text-[24px] font-bold text-carbon text-center mt-7">{t.title}</h1>
        <p className="font-sans text-[15px] font-normal text-gray-600 text-center mt-2">{t.sub}</p>

        <div className="flex items-center gap-4 mt-8">
          <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${displayPercent}%`, transition: `width ${STEP_MS}ms linear`, background: "linear-gradient(90deg, #193F72, #D7B56D)" }} />
          </div>
          <span className="font-mono text-[13px] font-semibold text-gold-500 tabular-nums w-10 text-right">{displayPercent}%</span>
        </div>

        <div className="grid grid-cols-6 gap-2 mt-10">
          {criteria.map((criterion, i) => {
            const isCompleted = displayPercent >= criterion.threshold;
            const previousDone = i === 0 ? true : displayPercent >= criteria[i - 1].threshold;
            const isActive = !isCompleted && previousDone;
            return (
              <div key={criterion.label} className="flex flex-col items-center gap-2">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                  isCompleted && "bg-green-600 text-white",
                  isActive && "bg-gold-500 text-white animate-subtle-pulse",
                  !isCompleted && !isActive && "bg-gray-100 text-steel-500")}>
                  {isCompleted ? (
                    <span key="check" className="animate-pop-in inline-flex items-center justify-center"><Check size={18} strokeWidth={3} /></span>
                  ) : (
                    <span key="num" className="font-mono text-[13px] font-bold">{i + 1}</span>
                  )}
                </div>
                <span className={cn("font-sans text-[11px] font-medium text-center leading-[1.3] max-w-[72px]", isCompleted ? "text-green-600" : "text-steel-500", "transition-colors duration-300")}>
                  {criterion.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button type="button" onClick={onBack} className="mt-6 font-sans text-[14px] font-medium text-navy-700 hover:bg-navy-900/[0.04] rounded-[8px] py-2 px-3 transition-colors duration-150">
        {t.back}
      </button>
    </div>
  );
}
