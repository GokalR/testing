import { KpiCard } from "@/components/ui/kpi-card";
import { DataTable } from "@/components/ui/data-table";
import { ScoreRing } from "@/components/ui/score-ring";
import { StatusTag } from "@/components/ui/status-tag";
import { InsightBox } from "@/components/ui/insight-box";
import { StepProgress } from "@/components/ui/step-progress";
import { ScoringCriteria } from "@/components/ui/scoring-criteria";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { Header } from "@/components/ui/header";
import { Sidebar } from "@/components/ui/sidebar";
import { SAMPLE_REGIONS } from "@/lib/constants";
import type { Column } from "@/lib/types";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <h2 className="font-sans text-[18px] font-bold text-carbon">{title}</h2>
        {subtitle && (
          <p className="font-sans text-[13px] font-medium text-gray-600 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  textOnDark = false,
}: {
  name: string;
  hex: string;
  textOnDark?: boolean;
}) {
  return (
    <div className="bg-white border border-border rounded-card shadow-card overflow-hidden">
      <div
        className="h-20 flex items-end p-3"
        style={{ background: hex }}
      >
        <span
          className={`font-mono text-[11px] font-semibold ${
            textOnDark ? "text-white/80" : "text-carbon/70"
          }`}
        >
          {hex}
        </span>
      </div>
      <div className="py-2 px-3">
        <div className="font-sans text-[13px] font-semibold text-carbon">
          {name}
        </div>
      </div>
    </div>
  );
}

const ECONOMIC_COLUMNS: Column[] = [
  { key: "indicator", label: "Показатель", align: "left", type: "text" },
  { key: "y2021", label: "2021", align: "right", type: "number" },
  { key: "y2022", label: "2022", align: "right", type: "number" },
  { key: "y2023", label: "2023", align: "right", type: "number" },
  { key: "y2024", label: "2024", align: "right", type: "number" },
  { key: "y2025", label: "2025", align: "right", type: "number" },
  { key: "trend", label: "Тренд", align: "right", type: "trend" },
];

const ECONOMIC_ROWS = [
  {
    indicator: "ВРП (млрд сум)",
    y2021: "1\u2009934",
    y2022: "2\u2009404",
    y2023: "2\u2009991",
    y2024: "3\u2009075",
    y2025: "3\u2009616",
    trend: { value: "+87%", tone: "positive" as const },
  },
  {
    indicator: "Промышленность",
    y2021: "914",
    y2022: "1\u2009023",
    y2023: "1\u2009124",
    y2024: "1\u2009350",
    y2025: "1\u2009576",
    trend: { value: "+72%", tone: "positive" as const },
  },
  {
    indicator: "Услуги",
    y2021: "443",
    y2022: "588",
    y2023: "732",
    y2024: "870",
    y2025: "1\u2009072",
    trend: { value: "+142%", tone: "positive" as const },
  },
  {
    indicator: "Строительство",
    y2021: "547",
    y2022: "651",
    y2023: "873",
    y2024: "618",
    y2025: "668",
    trend: { value: "+22%", tone: "neutral" as const },
  },
  {
    indicator: "Сельское хоз.",
    y2021: "31",
    y2022: "142",
    y2023: "261",
    y2024: "237",
    y2025: "300",
    trend: { value: "+868%", tone: "positive" as const },
  },
  {
    indicator: "Инвестиции",
    y2021: "337",
    y2022: "183",
    y2023: "385",
    y2024: "292",
    y2025: "883",
    trend: { value: "+162%", tone: "positive" as const },
  },
  {
    indicator: "Занятые (чел.)",
    y2021: "24\u2009066",
    y2022: "24\u2009503",
    y2023: "25\u2009818",
    y2024: "27\u2009754",
    y2025: "29\u2009537",
    trend: { value: "+23%", tone: "positive" as const },
  },
  {
    indicator: "Миграция (чел.)",
    y2021: "4\u2009474",
    y2022: "4\u2009875",
    y2023: "5\u2009213",
    y2024: "5\u2009566",
    y2025: "6\u2009936",
    trend: { value: "+55%", tone: "negative" as const },
  },
  {
    indicator: "Безработица (%)",
    y2021: "10,4",
    y2022: "8,4",
    y2023: "6,7",
    y2024: "5,2",
    y2025: "3,9",
    trend: { value: "−6,5 пп", tone: "positive" as const },
  },
  {
    indicator: "Бедные семьи",
    y2021: "~1\u2009050",
    y2022: "~920",
    y2023: "~780",
    y2024: "652",
    y2025: "537",
    trend: { value: "−49%", tone: "positive" as const },
  },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header activeLabel="" />
      <main className="max-w-[1440px] mx-auto px-10 py-10">
        <div className="mb-10">
          <h1 className="font-sans text-[32px] font-bold text-carbon tracking-[-0.5px] leading-[1.15]">
            Дизайн-система
          </h1>
          <p className="font-sans text-[13px] font-medium text-gray-600 mt-2">
            Библиотека UI-компонентов NBU — эталон визуального языка платформы
          </p>
        </div>

        {/* 1. Colors */}
        <Section
          title="Цветовая палитра"
          subtitle="Строгий набор цветов. Никаких других оттенков в интерфейсе."
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Swatch name="Navy 900" hex="#193F72" textOnDark />
            <Swatch name="Navy 700" hex="#2957A2" textOnDark />
            <Swatch name="Gold 500" hex="#D7B56D" />
          </div>
          <div className="grid grid-cols-6 gap-4 mb-4">
            <Swatch name="Carbon" hex="#2B2A29" textOnDark />
            <Swatch name="Gray 600" hex="#898989" textOnDark />
            <Swatch name="Steel 500" hex="#7688A1" textOnDark />
            <Swatch name="Gray 100" hex="#F1F2F7" />
            <Swatch name="White" hex="#FEFEFE" />
            <Swatch name="Border" hex="#D9DADA" />
          </div>
          <div className="grid grid-cols-6 gap-4">
            <Swatch name="Green 600" hex="#059669" textOnDark />
            <Swatch name="Green 50" hex="#ECFDF5" />
            <Swatch name="Red 600" hex="#DC2626" textOnDark />
            <Swatch name="Red 50" hex="#FEF2F2" />
            <Swatch name="Amber 600" hex="#D97706" textOnDark />
            <Swatch name="Amber 50" hex="#FFFBEB" />
          </div>
        </Section>

        {/* 2. Typography */}
        <Section
          title="Типографика"
          subtitle="Inter — UI и заголовки, JetBrains Mono — все числа, DM Serif Display — акцентные заголовки"
        >
          <div className="bg-white border border-border rounded-card shadow-card p-8 space-y-6">
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                Заголовок страницы · Inter 32/700
              </div>
              <div className="font-sans text-[32px] font-bold text-carbon tracking-[-0.5px]">
                Региональная аналитика
              </div>
            </div>
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                Заголовок секции · Inter 18/700
              </div>
              <div className="font-sans text-[18px] font-bold text-carbon">
                Экономические показатели Когона
              </div>
            </div>
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                Заголовок карточки · Inter 14/600
              </div>
              <div className="font-sans text-[14px] font-semibold text-carbon">
                Валовой региональный продукт
              </div>
            </div>
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                Основной текст · Inter 14/500
              </div>
              <div className="font-sans text-[14px] font-medium text-carbon">
                ВРП региона вырос на 87% за последние пять лет. Основной вклад
                внесли сектор услуг и промышленность.
              </div>
            </div>
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                Подпись / подзаголовок · Inter 13/500 · gray-600
              </div>
              <div className="font-sans text-[13px] font-medium text-gray-600">
                Данные за 2025 год, относительно 2021 года
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                  KPI крупный · Mono 28/700
                </div>
                <div className="font-mono text-[28px] font-bold text-carbon tracking-[-0.5px] leading-[1.1]">
                  3&#8239;616
                </div>
              </div>
              <div>
                <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                  KPI средний · Mono 22/700
                </div>
                <div className="font-mono text-[22px] font-bold text-carbon tracking-[-0.5px] leading-[1.1]">
                  66&#8239;100
                </div>
              </div>
              <div>
                <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                  KPI малый · Mono 16/600
                </div>
                <div className="font-mono text-[16px] font-semibold text-carbon">
                  3,9%
                </div>
              </div>
            </div>
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500 mb-2">
                Метка / caption · Inter 11/600 · UPPERCASE · tracking 0.8px
              </div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-steel-500">
                НАСЕЛЕНИЕ РЕГИОНА
              </div>
            </div>
          </div>
        </Section>

        {/* 3. KPI Cards */}
        <Section
          title="KPI карточки"
          subtitle="Цвет верхней границы — статус. Все числа моноширинные."
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <KpiCard
              label="Население"
              value={"66\u2009100"}
              subtitle="2025 г. (+6,1% за 5 лет)"
              trend={{ direction: "up", value: "+6,1%" }}
              status="positive"
            />
            <KpiCard
              label="Площадь"
              value="~20 км²"
              subtitle="Компактный городской район"
              status="neutral"
            />
            <KpiCard
              label="ВРП"
              value={"3\u2009616 млрд"}
              subtitle="сум, 2025 г."
              trend={{ direction: "up", value: "+87%" }}
              status="positive"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <KpiCard
              label="Ср. зарплата"
              value={"~4\u2009000 тыс"}
              subtitle="сум/мес (ниже среднего)"
              trend={{ direction: "down", value: "ниже среднего" }}
              status="negative"
            />
            <KpiCard
              label="Занятость"
              value={"29\u2009811"}
              subtitle="человек (+24% за 5 лет)"
              trend={{ direction: "up", value: "+24%" }}
              status="positive"
            />
            <KpiCard
              label="Безработица"
              value="3,9%"
              subtitle="снижение с 10,4% в 2021 г."
              trend={{ direction: "up", value: "снижение" }}
              status="positive"
            />
          </div>
        </Section>

        {/* 4. Data table */}
        <Section
          title="Таблица данных"
          subtitle="Экономические показатели Когона за 5 лет"
        >
          <DataTable columns={ECONOMIC_COLUMNS} rows={ECONOMIC_ROWS} />
        </Section>

        {/* 5. Score ring */}
        <Section
          title="Кольцо оценки"
          subtitle="Цвет меняется по диапазону: 0–39 красный, 40–59 янтарный, 60–79 бирюзовый, 80–100 зелёный"
        >
          <div className="bg-white border border-border rounded-card shadow-card p-8">
            <div className="flex items-end justify-start gap-16">
              <ScoreRing score={45} size="sm" label="Умеренно" />
              <ScoreRing score={78} size="md" label="Хорошо" />
              <ScoreRing score={92} size="lg" label="Отлично" />
            </div>
          </div>
        </Section>

        {/* 6. Status tags */}
        <Section title="Статус-теги" subtitle="Пять семантических вариантов">
          <div className="bg-white border border-border rounded-card shadow-card p-6">
            <div className="flex flex-wrap gap-3">
              <StatusTag variant="positive">✓ Сырьё рядом</StatusTag>
              <StatusTag variant="negative">✗ Дороги 43%</StatusTag>
              <StatusTag variant="warning">⚠ Конкуренция средняя</StatusTag>
              <StatusTag variant="info">ℹ Логистический узел</StatusTag>
              <StatusTag variant="neutral">Нет данных</StatusTag>
            </div>
          </div>
        </Section>

        {/* 7. Insight boxes */}
        <Section
          title="Блоки аналитики"
          subtitle="AI-выводы и предупреждения с цветной левой границей"
        >
          <div className="space-y-3">
            <InsightBox variant="info" title="📊 Ключевые выводы">
              ВРП вырос на 87% за 5 лет — основной вклад: услуги (+142%) и
              промышленность (+72%). Миграция остаётся сдерживающим фактором.
            </InsightBox>
            <InsightBox variant="danger" title="⚠ Миграционный риск">
              За 5 лет миграция выросла на 55% (6&#8239;936 человек). Необходимы
              срочные меры по созданию рабочих мест, особенно для молодёжи 18–29
              лет.
            </InsightBox>
            <InsightBox variant="success" title="✓ Позитивные изменения">
              Безработица снизилась с 10,4% до 3,9%. Бедность сократилась на 49%.
              Тренд устойчив на горизонте 3–5 лет.
            </InsightBox>
          </div>
        </Section>

        {/* 8. Step progress */}
        <Section
          title="Прогресс-шаги"
          subtitle="Используется в мастере бизнес-теста"
        >
          <div className="bg-white border border-border rounded-card shadow-card p-8">
            <StepProgress
              steps={[
                { label: "Профиль", status: "completed" },
                { label: "Финансы", status: "active" },
                { label: "Анализ", status: "upcoming" },
                { label: "Результат", status: "upcoming" },
              ]}
              currentStep={2}
              percentage={50}
            />
          </div>
        </Section>

        {/* 9. Scoring criteria */}
        <Section
          title="Критерий оценки"
          subtitle="Отдельный критерий со шкалой и объяснением"
        >
          <ScoringCriteria
            label="Региональное соответствие"
            score={75}
            description="Регион имеет хороший потенциал для вашего бизнеса. Наличие сырья и спрос выше среднего."
            improvements={[
              "Улучшить логистику",
              "Проверить конкуренцию",
            ]}
          />
        </Section>

        {/* 10. Recommendation card */}
        <Section
          title="Карточка рекомендации"
          subtitle="Предложение региона / типа бизнеса с мини-метриками"
        >
          <RecommendationCard
            rank={1}
            title="Когон, Бухоро"
            score={87}
            metrics={[
              { label: "Спрос", value: 82 },
              { label: "Конкуренция", value: 34 },
              { label: "Инфраструктура", value: 61 },
              { label: "Финансирование", value: 78 },
            ]}
            advantages={["✓ Сырьё рядом", "✓ Спрос высокий"]}
            risks={["⚠ Дороги 43%"]}
          />
        </Section>

        {/* 11. Header note */}
        <Section
          title="Шапка"
          subtitle="Шапка уже отображается вверху этой страницы — sticky, с логотипом, навигацией, переключателем языков и кнопкой входа"
        >
          <div className="bg-white border border-border rounded-card shadow-card p-5 font-sans text-[13px] font-medium text-gray-600 leading-[1.6]">
            Смотрите навигацию в верхней части страницы. Прокрутите вниз, чтобы
            увидеть появление тени при скролле.
          </div>
        </Section>

        {/* 12. Sidebar */}
        <Section
          title="Боковая панель"
          subtitle="Тёмная панель регионов со встроенным поиском"
        >
          <div className="bg-white border border-border rounded-card shadow-card overflow-hidden flex">
            <div className="shrink-0">
              <Sidebar regions={SAMPLE_REGIONS} defaultActiveId="buxoro" />
            </div>
            <div className="flex-1 p-8 flex items-center justify-center font-sans text-[13px] font-medium text-gray-600">
              Основная область — контент региона отображается здесь
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}
