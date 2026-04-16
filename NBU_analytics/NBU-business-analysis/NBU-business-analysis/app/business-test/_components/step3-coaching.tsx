"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, BarChart3, AlertTriangle, Lightbulb, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

interface CoachingItem { type: "strength" | "market" | "warning" | "recommendation"; title: string; text: string; }

const ITEMS = {
  ru: [
    { type: "strength" as const, title: "Кредитная нагрузка", text: "Нет действующих кредитов — ваша кредитная нагрузка нулевая. Это значительно повышает шансы на одобрение кредита." },
    { type: "strength" as const, title: "Стабильность бизнеса", text: "Юридическое лицо (ООО) с опытом 3–5 лет — банк оценит стабильность и историю вашего бизнеса." },
    { type: "market" as const, title: "Конкуренция и спрос", text: "В Маргилане 31 действующий учебный центр. Спрос растёт: город планирует обучить 1,604 безработных и подготовить 650 IT-специалистов в 2026 году." },
    { type: "market" as const, title: "Целевая аудитория", text: "54% населения Маргилана — молодёжь до 30 лет (141,500 чел.). Это значительная потенциальная аудитория для образовательных курсов." },
    { type: "warning" as const, title: "Платёжеспособность", text: "Средняя зарплата в Маргилане — 3,974 тыс. сум/мес. Учитывайте ценовую доступность при формировании стоимости курсов." },
    { type: "warning" as const, title: "Сезонность", text: "Образовательные курсы подвержены сезонности — летом поток снижается. Рассмотрите онлайн-формат для стабилизации дохода круглый год." },
    { type: "recommendation" as const, title: "Фокус на IT-направления", text: "AI, data science, кибербезопасность — эти направления совпадают со стратегией развития города и программой IT-Park (инвестиции 5.0 млрд сум)." },
    { type: "recommendation" as const, title: "Подходящий кредитный продукт", text: "«Бизнес прогресс» — 15% годовых, до 2 млрд сум, срок до 84 мес., льготный период до 24 мес. Оптимально для расширения вашего бизнеса." },
  ],
  uz: [
    { type: "strength" as const, title: "Кредит юки", text: "Амалдаги кредитлар йўқ — кредит юкингиз нолга тенг. Бу кредит тасдиқланиш имкониятини сезиларли оширади." },
    { type: "strength" as const, title: "Бизнес барқарорлиги", text: "Юридик шахс (МЧЖ) 3–5 йиллик тажриба билан — банк бизнесингизнинг барқарорлиги ва тарихини баҳолайди." },
    { type: "market" as const, title: "Рақобат ва талаб", text: "Марғилонда 31 та фаолиятдаги ўқув маркази бор. Талаб ўсмоқда: шаҳар 2026 йилда 1,604 ишсизни ўқитиш ва 650 IT-мутахассис тайёрлашни режалаштирмоқда." },
    { type: "market" as const, title: "Мақсадли аудитория", text: "Марғилон аҳолисининг 54% — 30 ёшгача бўлган ёшлар (141,500 киши). Бу ўқув курслари учун катта потенциал аудитория." },
    { type: "warning" as const, title: "Тўлов қобилияти", text: "Марғилонда ўртача маош — 3,974 минг сўм/ой. Курс нархини белгилашда нарх мавжудлигини ҳисобга олинг." },
    { type: "warning" as const, title: "Мавсумийлик", text: "Таълим курслари мавсумийликка бўйсунади — ёзда оқим камаяди. Йил давомида даромадни барқарорлаштириш учун онлайн форматни кўриб чиқинг." },
    { type: "recommendation" as const, title: "IT йўналишларига урғу беринг", text: "AI, data science, кибер хавфсизлик — бу йўналишлар шаҳарни ривожлантириш стратегияси ва IT-Park дастури (5.0 млрд сўм инвестиция) билан мос келади." },
    { type: "recommendation" as const, title: "Мос кредит маҳсулоти", text: "«Бизнес прогресс» — йиллик 15%, 2 млрд сўмгача, муддати 84 ойгача, имтиёзли давр 24 ойгача. Бизнесингизни кенгайтириш учун оптимал." },
  ],
};

const TYPE_CONFIG = {
  ru: {
    strength: { label: "СИЛЬНАЯ СТОРОНА", borderColor: "border-l-emerald-500", bgColor: "bg-emerald-50", iconColor: "text-emerald-600", labelColor: "text-emerald-600" },
    market: { label: "РЫНОК", borderColor: "border-l-blue-500", bgColor: "bg-blue-50", iconColor: "text-blue-600", labelColor: "text-blue-600" },
    warning: { label: "ОБРАТИТЕ ВНИМАНИЕ", borderColor: "border-l-amber-500", bgColor: "bg-amber-50", iconColor: "text-amber-600", labelColor: "text-amber-600" },
    recommendation: { label: "РЕКОМЕНДАЦИЯ", borderColor: "border-l-[#193F72]", bgColor: "bg-[#193F72]/[0.04]", iconColor: "text-[#193F72]", labelColor: "text-[#193F72]" },
  },
  uz: {
    strength: { label: "КУЧЛИ ТОМОН", borderColor: "border-l-emerald-500", bgColor: "bg-emerald-50", iconColor: "text-emerald-600", labelColor: "text-emerald-600" },
    market: { label: "БОЗОР", borderColor: "border-l-blue-500", bgColor: "bg-blue-50", iconColor: "text-blue-600", labelColor: "text-blue-600" },
    warning: { label: "ЭЪТИБОР БЕРИНГ", borderColor: "border-l-amber-500", bgColor: "bg-amber-50", iconColor: "text-amber-600", labelColor: "text-amber-600" },
    recommendation: { label: "ТАВСИЯ", borderColor: "border-l-[#193F72]", bgColor: "bg-[#193F72]/[0.04]", iconColor: "text-[#193F72]", labelColor: "text-[#193F72]" },
  },
};

const TYPE_ICONS: Record<CoachingItem["type"], LucideIcon> = {
  strength: CheckCircle2, market: BarChart3, warning: AlertTriangle, recommendation: Lightbulb,
};

const T = {
  ru: { stepBadge: "ШАГ 3 ИЗ 5", title: "AI Рекомендации", sub: "На основе ваших ответов мы подготовили ключевые наблюдения и советы", typing: "AI анализирует данные...", back: "Назад", next: "Запустить полный анализ" },
  uz: { stepBadge: "3-ҚАДАМ (5 ТАДАН)", title: "AI Тавсиялар", sub: "Жавобларингизга асосланиб асосий кузатувлар ва маслаҳатларни тайёрладик", typing: "AI маълумотларни таҳлил қилмоқда...", back: "Орқага", next: "Тўлиқ таҳлилни бошлаш" },
};

interface Step3CoachingProps { onBack: () => void; onNext: () => void; }

export function Step3Coaching({ onBack, onNext }: Step3CoachingProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const { lang } = useLang();
  const t = T[lang];
  const items = ITEMS[lang];
  const typeConfig = TYPE_CONFIG[lang];

  useEffect(() => {
    if (visibleCount >= items.length) return;
    const timeout = setTimeout(() => setVisibleCount((c) => c + 1), visibleCount === 0 ? 400 : 350);
    return () => clearTimeout(timeout);
  }, [visibleCount, items.length]);

  const allVisible = visibleCount >= items.length;

  return (
    <div className="bg-white border border-border rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-10 px-12 animate-fade-in-up">
      <div>
        <span className="inline-flex items-center font-sans text-[12px] font-semibold text-gold-500 bg-gold-500/[0.08] rounded-[6px] py-1 px-3">{t.stepBadge}</span>
        <h1 className="font-sans text-[28px] font-bold text-carbon mt-4">{t.title}</h1>
        <p className="font-sans text-[15px] font-normal text-gray-600 leading-[1.5] mt-2">{t.sub}</p>
      </div>

      <div className="mt-8 space-y-4">
        {items.map((item, i) => {
          const config = typeConfig[item.type];
          const Icon = TYPE_ICONS[item.type];
          const isVisible = i < visibleCount;
          return (
            <div key={item.title} className={cn("border-l-[3px] rounded-[10px] p-5 transition-all duration-500", config.borderColor, config.bgColor, isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}>
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-white/70">
                  <Icon size={18} strokeWidth={2} className={config.iconColor} />
                </div>
                <div className="min-w-0">
                  <span className={cn("font-sans text-[10px] font-bold uppercase tracking-[0.8px]", config.labelColor)}>{config.label}</span>
                  <h3 className="font-sans text-[15px] font-semibold text-carbon mt-1">{item.title}</h3>
                  <p className="font-sans text-[14px] font-normal text-gray-600 leading-[1.6] mt-1">{item.text}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!allVisible && (
        <div className="flex items-center gap-2 mt-4 ml-1">
          <div className="flex gap-1">
            <span className="w-[6px] h-[6px] rounded-full bg-gold-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-[6px] h-[6px] rounded-full bg-gold-500 animate-bounce [animation-delay:150ms]" />
            <span className="w-[6px] h-[6px] rounded-full bg-gold-500 animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="font-sans text-[13px] text-steel-500">{t.typing}</span>
        </div>
      )}

      <div className={cn("mt-10 flex items-center justify-between transition-opacity duration-500", allVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <button type="button" onClick={onBack} className="inline-flex items-center font-sans text-[14px] font-medium text-steel-500 hover:text-navy-900 transition-colors duration-200">
          <ArrowLeft size={16} strokeWidth={2} className="mr-1" />
          {t.back}
        </button>
        <button type="button" onClick={onNext} className="inline-flex items-center font-sans text-[15px] font-semibold text-white bg-navy-900 hover:bg-navy-700 rounded-[10px] py-[14px] px-10 transition-colors duration-200">
          {t.next}
          <ArrowRight size={18} strokeWidth={2.25} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
