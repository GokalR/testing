"use client";

import { StatusTag } from "@/components/ui/status-tag";
import { InsightBox } from "@/components/ui/insight-box";
import { MargilanHeatmap } from "@/components/ui/margilan-heatmap";
import type { StatusVariant } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

/* ── helpers ──────────────────────────────────────────── */

function SectionNum({ n, gold }: { n: number; gold?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[15px] font-bold text-white shrink-0 ${gold ? "bg-gold-500" : "bg-navy-900"}`}
    >
      {n}
    </span>
  );
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="relative w-[140px] h-[140px]">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[36px] font-bold text-carbon leading-none">{score}</span>
        <span className="font-sans text-[12px] font-medium text-steel-500">{label}</span>
      </div>
    </div>
  );
}

function FactorBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = value >= 75 ? "bg-emerald-500" : value >= 60 ? "bg-gold-500" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-sans text-[13px] font-medium text-carbon">{label}</span>
        <span className="font-mono text-[13px] font-semibold text-steel-500">{value}</span>
      </div>
      <div className="h-[6px] bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SWOTCard({
  title, color, items,
}: {
  title: string;
  color: "emerald" | "red" | "blue" | "amber";
  items: string[];
}) {
  const styles = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", title: "text-emerald-700", dot: "bg-emerald-500" },
    red:     { bg: "bg-red-50",     border: "border-red-200",     title: "text-red-700",     dot: "bg-red-400" },
    blue:    { bg: "bg-blue-50",    border: "border-blue-200",    title: "text-blue-700",    dot: "bg-blue-500" },
    amber:   { bg: "bg-amber-50",   border: "border-amber-200",   title: "text-amber-700",   dot: "bg-amber-500" },
  }[color];

  return (
    <div className={cn("rounded-[10px] border p-5", styles.bg, styles.border)}>
      <h4 className={cn("font-sans text-[13px] font-bold uppercase tracking-[0.5px] mb-3", styles.title)}>
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className={cn("w-[5px] h-[5px] rounded-full mt-[7px] shrink-0", styles.dot)} />
            <span className="font-sans text-[13px] text-carbon leading-[1.5]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── translations ────────────────────────────────────── */

const T = {
  ru: {
    /* ScoreCircle label */
    outOf100: "из 100",

    /* Score factors */
    SCORE_FACTORS: [
      { label: "Опыт предпринимателя", value: 80 },
      { label: "Финансовая устойчивость", value: 70 },
      { label: "Рыночный потенциал", value: 78 },
      { label: "Локация", value: 82 },
      { label: "Конкуренция", value: 62 },
      { label: "Бизнес-модель", value: 72 },
    ],

    /* SWOT */
    SWOT: {
      strengths: [
        "ООО с 3–5 летней историей — банк оценит стабильность",
        "Нулевая кредитная нагрузка — нет действующих долгов",
        "Положительная маржа (доход > расходы)",
        "Профильное образование и опыт в отрасли",
      ],
      weaknesses: [
        "Ограниченный собственный капитал для расширения",
        "Зависимость от одного филиала",
        "Нет онлайн-платформы для дистанционного обучения",
        "Сезонные колебания потока студентов",
      ],
      opportunities: [
        "Гос. программа: подготовить 650 IT-специалистов в Маргилане",
        "10,904 мигранта хотят вернуться — нужна переподготовка",
        "IT-Park: инвестиции 5.0 млрд сум в молодёжный бульвар",
        "Кредит «Бизнес прогресс» — 15% годовых, до 2 млрд",
        "1,604 безработных + 974 женщины — целевая аудитория гос. программ",
      ],
      threats: [
        "31 действующий учебный центр — высокая конкуренция",
        "Средняя зарплата 3,974 тыс. сум — ценовое давление",
        "Отток квалифицированных преподавателей за рубеж",
        "Сезонный спад летом (июнь–август)",
      ],
    },

    /* Mahalla ranking */
    MAHALLA_RANKING: [
      { name: "Бахрин", score: 92, reason: "Центр возвращающихся мигрантов, высокий спрос на переподготовку", stat: "1,218 новых рабочих мест" },
      { name: "З.М. Бобур", score: 88, reason: "Молодёжный район, планируется 1,008 рабочих мест", stat: "1,008 рабочих мест" },
      { name: "Кашкар", score: 85, reason: "Самая высокая бизнес-активность — 19.6% населения = ИП", stat: "1,401 предприниматель" },
      { name: "Юксалиш", score: 82, reason: "Промзона «Навруз» — работодатели нуждаются в обученных кадрах", stat: "150 рабочих мест" },
      { name: "Нурафшон", score: 78, reason: "Развивающийся район с инвестиционными проектами", stat: "SHOYI SILK проект" },
      { name: "Горианвал", score: 75, reason: "Фонтанная площадь, 15 коммерческих объектов — трафик", stat: "15 объектов" },
      { name: "Тояагум", score: 72, reason: "Набережная 0.9 км — туристический и молодёжный кластер", stat: "11.3 млрд инвестиций" },
      { name: "Пичокчи", score: 68, reason: "Gold Silk, ADB проект — потенциал для курсов рядом с производством", stat: "ADB проект" },
    ],

    /* Business plan costs */
    STARTUP_COSTS: [
      ["Аренда и ремонт помещения", "80 млн"],
      ["Компьютеры и оборудование (20 шт.)", "120 млн"],
      ["Мебель и оснащение классов", "30 млн"],
      ["Маркетинг и реклама", "20 млн"],
      ["Оборотные средства (3 мес.)", "50 млн"],
    ] as [string, string][],

    MONTHLY_COSTS: [
      ["Аренда помещения", "8 млн"],
      ["Зарплата (6 преподавателей)", "24 млн"],
      ["Коммунальные услуги", "3 млн"],
      ["Маркетинг", "4 млн"],
      ["Прочие расходы", "3 млн"],
    ] as [string, string][],

    REVENUE_FORECAST: [
      { period: "Месяц 1–3", students: 40, revenue: "80 млн", profit: "-12 млн", profitPositive: false },
      { period: "Месяц 4–6", students: 60, revenue: "120 млн", profit: "+28 млн", profitPositive: true },
      { period: "Месяц 7–9", students: 80, revenue: "160 млн", profit: "+68 млн", profitPositive: true },
      { period: "Месяц 10–12", students: 100, revenue: "200 млн", profit: "+108 млн", profitPositive: true },
    ] as { period: string; students: number; revenue: string; profit: string; profitPositive: boolean }[],

    /* Credit products */
    PRIMARY_PRODUCT: {
      name: "Бизнес прогресс",
      program: "Келажак тадбиркори",
      badge: "РЕКОМЕНДУЕМЫЙ",
      rows: [
        ["СТАВКА", "15% годовых"],
        ["СУММА", "До 2 000 млн сум"],
        ["СРОК", "До 84 месяцев (7 лет)"],
        ["ЛЬГОТНЫЙ ПЕРИОД", "До 24 месяцев"],
        ["ЗАЛОГ", "Ликвидное обеспечение — 125% от суммы кредита"],
        ["НАЗНАЧЕНИЕ", "Расширение деятельности действующего бизнеса"],
        ["ПОЧЕМУ ПОДХОДИТ", "Низкая ставка, длительный срок, большой льготный период — идеально для расширения образовательного центра"],
      ] as [string, string][],
    },

    ADDITIONAL_PRODUCTS: [
      {
        name: "Развивайся",
        subtitle: "Основные средства",
        rate: "23%",
        amount: "До 3.5 млрд",
        term: "До 4 лет",
        purpose: "Закупка оборудования, компьютеров, мебели",
      },
      {
        name: "Доступный (Имконият)",
        subtitle: "Первый кредит",
        rate: "23%",
        amount: "До 150 млн (первый) / 500 млн (повторный)",
        term: "До 3 лет",
        purpose: "Оборотные средства или основные средства",
      },
      {
        name: "Расширяйся",
        subtitle: "Оборотные средства",
        rate: "23–25%",
        amount: "До 3.5 млрд",
        term: "До 3 лет",
        purpose: "Пополнение оборотных средств",
      },
    ],

    /* Action plan */
    ACTION_STEPS: [
      { week: "Неделя 1–2", title: "Доработка бизнес-плана", desc: "Есть черновик — доработать финансовые прогнозы и маркетинговый план", status: "warning" as StatusVariant },
      { week: "Неделя 3–4", title: "Подача заявки на кредит", desc: "Подать на «Бизнес прогресс» в отделение NBU Маргилан", status: "negative" as StatusVariant },
      { week: "Месяц 2", title: "Поиск помещения", desc: "Аренда 150–200 м² в мах. Бахрин или З.М. Бобур", status: "neutral" as StatusVariant },
      { week: "Месяц 2–3", title: "Ремонт и оборудование", desc: "Закупка 20 компьютеров, мебели, ремонт классов", status: "neutral" as StatusVariant },
      { week: "Месяц 3", title: "Набор преподавателей", desc: "6 преподавателей: IT, английский, предпринимательство", status: "neutral" as StatusVariant },
      { week: "Месяц 3–4", title: "Маркетинговая кампания", desc: "Соцсети, партнёрство с IT-Park, объявления в махаллях", status: "neutral" as StatusVariant },
      { week: "Месяц 4", title: "Запуск второго филиала", desc: "Открытие и набор первого потока — 40 студентов", status: "positive" as StatusVariant },
      { week: "Месяц 6", title: "Выход на окупаемость", desc: "60+ студентов, выручка 120 млн/мес, чистая прибыль", status: "positive" as StatusVariant },
    ],

    /* UI strings */
    restartBtn: "← Начать заново",
    section1Title: "AI Оценка готовности бизнеса",
    section1Sub: "Комплексный анализ по 6 факторам",
    goodPotential: "Хороший потенциал",
    aiConclusion: "Вывод AI",
    aiConclusionText: "Ваш бизнес имеет хороший потенциал для расширения. Сильные стороны — стабильная история (3–5 лет) и нулевая кредитная нагрузка. Основной риск — высокая конкуренция (31 учебный центр). Рекомендуем дифференцироваться через IT-направления, которые совпадают со стратегией развития Маргилана.",
    section2Title: "SWOT-анализ",
    section2Sub: "Образовательные курсы — Маргилан, Фергана",
    swotStrengths: "Сильные стороны",
    swotWeaknesses: "Слабые стороны",
    swotOpportunities: "Возможности",
    swotThreats: "Угрозы",
    section3Title: "Рейтинг махаллей — лучшие локации",
    section3Sub: "Маргилан · 50 махаллей · Образовательные курсы",
    locationInsightTitle: "AI рекомендация по локации",
    locationInsightText: (
      <>
        Лучшие локации для второго филиала — махалля <b>Бахрин</b> (1,218 новых рабочих мест, центр возвращающихся мигрантов) и <b>З.М. Бобур</b> (молодёжный район, 1,008 рабочих мест). Оба района имеют высокий спрос на переподготовку кадров и совпадают с государственными программами занятости.
      </>
    ),
    section4Title: "Бизнес-план: расширение образовательного центра",
    section4Sub: "Открытие второго филиала · IT-направления · Маргилан",
    projectDescLabel: "ОПИСАНИЕ ПРОЕКТА",
    projectDescText: "Расширение действующего образовательного центра с открытием второго филиала в махалле Бахрин. Фокус на IT-направления (AI/ML, data science, кибербезопасность, UX/UI), английский язык и основы предпринимательства. Целевая аудитория — молодёжь (141,500 чел.), возвращающиеся мигранты (10,904 чел.) и безработные (1,798 чел.).",
    coursesLabel: "НАПРАВЛЕНИЯ КУРСОВ",
    courses: ["Python / JavaScript", "AI и Machine Learning", "Data Science", "Кибербезопасность", "UX/UI дизайн", "Английский язык", "Основы предпринимательства", "Digital Marketing"],
    startupCostsLabel: "СТАРТОВЫЕ ЗАТРАТЫ",
    monthlyCostsLabel: "ЕЖЕМЕСЯЧНЫЕ РАСХОДЫ",
    total: "Итого",
    startupTotal: "300 млн сум",
    monthlyTotal: "42 млн/мес",
    revenueForecastLabel: "ПРОГНОЗ ВЫРУЧКИ (стоимость курса: ~2 млн сум/мес на студента)",
    periodCol: "Период",
    studentsCol: "Студенты",
    revenueCol: "Выручка/мес",
    profitCol: "Чистая прибыль",
    breakeven: "Точка безубыточности: месяц 3–4 (при 50+ студентах)",
    section5Title: "Кредитные продукты NBU",
    section5Sub: "Подобраны на основе вашего профиля и бизнес-плана",
    altProductsLabel: "АЛЬТЕРНАТИВНЫЕ ПРОДУКТЫ",
    rateLabel: "Ставка:",
    amountLabel: "Сумма:",
    termLabel: "Срок:",
    section6Title: "План действий",
    section6Sub: "Пошаговый план на 6 месяцев",
    ctaTitle: "Готовы начать?",
    ctaSubtitle: "Подайте заявку на кредит «Бизнес прогресс» или скачайте полный бизнес-план",
    applyBtn: "Подать заявку в банк",
    downloadBtn: "Скачать бизнес-план (PDF)",
    downloadAlert: "Бизнес-план будет доступен в следующей версии",
    restartCta: "Или начните тест заново",
  },

  uz: {
    /* ScoreCircle label */
    outOf100: "100 дан",

    /* Score factors */
    SCORE_FACTORS: [
      { label: "Тадбиркор тажрибаси", value: 80 },
      { label: "Молиявий барқарорлик", value: 70 },
      { label: "Бозор потенциали", value: 78 },
      { label: "Жойлашув", value: 82 },
      { label: "Рақобат", value: 62 },
      { label: "Бизнес-модель", value: 72 },
    ],

    /* SWOT */
    SWOT: {
      strengths: [
        "МЧЖ 3–5 йиллик тарихга эга — банк барқарорликни баҳолайди",
        "Нол кредит юки — амалдаги қарзлар йўқ",
        "Ижобий марж (даромад > харажат)",
        "Соҳавий таълим ва тармоқдаги тажриба",
      ],
      weaknesses: [
        "Кенгайтириш учун чекланган ўз капитали",
        "Битта филиалга боғлиқлик",
        "Масофавий ўқитиш учун онлайн платформа йўқ",
        "Талабалар оқимида мавсумий тебранишлар",
      ],
      opportunities: [
        "Давлат дастури: Марғилонда 650 нафар IT мутахассис тайёрлаш",
        "10 904 мигрант қайтишни истайди — қайта тайёрлаш керак",
        "IT-Park: ёшлар булварига 5.0 млрд сўм инвестиция",
        "«Бизнес прогресс» кредити — йилига 15%, 2 млрдгача",
        "1 604 ишсиз + 974 аёл — давлат дастурларининг мақсадли аудиторияси",
      ],
      threats: [
        "31 та фаолият юритаётган ўқув маркази — юқори рақобат",
        "Ўртача иш ҳақи 3 974 минг сўм — нарх босими",
        "Малакали ўқитувчиларнинг чет элга кетиши",
        "Ёзда мавсумий пасайиш (июнь–август)",
      ],
    },

    /* Mahalla ranking */
    MAHALLA_RANKING: [
      { name: "Баҳрин", score: 92, reason: "Қайтаётган мигрантлар маркази, қайта тайёрлашга юқори талаб", stat: "1 218 янги иш ўрни" },
      { name: "З.М. Бобур", score: 88, reason: "Ёшлар туманида 1 008 та иш ўрни режалаштирилган", stat: "1 008 иш ўрни" },
      { name: "Қашқар", score: 85, reason: "Энг юқори бизнес фаоллиги — аҳолининг 19.6% = ЯТТ", stat: "1 401 тадбиркор" },
      { name: "Юксалиш", score: 82, reason: "«Наврўз» саноат зонаси — иш берувчилар тайёр кадрларга муҳтож", stat: "150 иш ўрни" },
      { name: "Нурафшон", score: 78, reason: "Инвестиция лойиҳалари билан ривожланаётган туман", stat: "SHOYI SILK лойиҳаси" },
      { name: "Горианвал", score: 75, reason: "Фонтан майдони, 15 та тижорат объекти — трафик", stat: "15 та объект" },
      { name: "Тояагум", score: 72, reason: "0.9 км соҳилбанд — туристик ва ёшлар кластери", stat: "11.3 млрд инвестиция" },
      { name: "Пичоқчи", score: 68, reason: "Gold Silk, ADB лойиҳаси — ишлаб чиқариш яқинида курслар потенциали", stat: "ADB лойиҳаси" },
    ],

    /* Business plan costs */
    STARTUP_COSTS: [
      ["Ижара ва бинони таъмирлаш", "80 млн"],
      ["Компьютерлар ва жиҳозлар (20 дона)", "120 млн"],
      ["Мебель ва синфхоналарни жиҳозлаш", "30 млн"],
      ["Маркетинг ва реклама", "20 млн"],
      ["Айланма маблағлар (3 ой)", "50 млн"],
    ] as [string, string][],

    MONTHLY_COSTS: [
      ["Бинони ижарага олиш", "8 млн"],
      ["Иш ҳақи (6 ўқитувчи)", "24 млн"],
      ["Коммунал хизматлар", "3 млн"],
      ["Маркетинг", "4 млн"],
      ["Бошқа харажатлар", "3 млн"],
    ] as [string, string][],

    REVENUE_FORECAST: [
      { period: "1–3 ой", students: 40, revenue: "80 млн", profit: "-12 млн", profitPositive: false },
      { period: "4–6 ой", students: 60, revenue: "120 млн", profit: "+28 млн", profitPositive: true },
      { period: "7–9 ой", students: 80, revenue: "160 млн", profit: "+68 млн", profitPositive: true },
      { period: "10–12 ой", students: 100, revenue: "200 млн", profit: "+108 млн", profitPositive: true },
    ] as { period: string; students: number; revenue: string; profit: string; profitPositive: boolean }[],

    /* Credit products */
    PRIMARY_PRODUCT: {
      name: "Бизнес прогресс",
      program: "Келажак тадбиркори",
      badge: "ТАВСИЯ ЭТИЛГАН",
      rows: [
        ["СТАВКА", "йилига 15%"],
        ["СУММА", "2 000 млн сўмгача"],
        ["МУДДАТ", "84 ойгача (7 йил)"],
        ["ИМТИЁЗЛИ ДАВР", "24 ойгача"],
        ["ГАРОВ", "Ликвид таъминот — кредит суммасининг 125%"],
        ["МАҚСАД", "Амалдаги бизнес фаолиятини кенгайтириш"],
        ["НЕГА МОС КЕЛАДИ", "Паст ставка, узоқ муддат, катта имтиёзли давр — таълим марказини кенгайтириш учун идеал"],
      ] as [string, string][],
    },

    ADDITIONAL_PRODUCTS: [
      {
        name: "Ривожлан",
        subtitle: "Асосий воситалар",
        rate: "23%",
        amount: "3.5 млрдгача",
        term: "4 йилгача",
        purpose: "Жиҳоз, компьютер, мебель сотиб олиш",
      },
      {
        name: "Имконият (Доступный)",
        subtitle: "Биринчи кредит",
        rate: "23%",
        amount: "150 млнгача (биринчи) / 500 млн (такрорий)",
        term: "3 йилгача",
        purpose: "Айланма ёки асосий воситалар",
      },
      {
        name: "Кенгай",
        subtitle: "Айланма маблағлар",
        rate: "23–25%",
        amount: "3.5 млрдгача",
        term: "3 йилгача",
        purpose: "Айланма маблағларни тўлдириш",
      },
    ],

    /* Action plan */
    ACTION_STEPS: [
      { week: "1–2 ҳафта", title: "Бизнес-планни якунлаш", desc: "Қоралама бор — молиявий прогнозлар ва маркетинг режасини такомиллаштириш", status: "warning" as StatusVariant },
      { week: "3–4 ҳафта", title: "Кредитга ариза бериш", desc: "NBU Марғилон бўлимига «Бизнес прогресс» учун ариза топшириш", status: "negative" as StatusVariant },
      { week: "2 ой", title: "Бино излаш", desc: "Баҳрин ёки З.М. Бобур маҳаллаларида 150–200 м² ижара", status: "neutral" as StatusVariant },
      { week: "2–3 ой", title: "Таъмир ва жиҳозлаш", desc: "20 та компьютер, мебель сотиб олиш, синфхоналарни таъмирлаш", status: "neutral" as StatusVariant },
      { week: "3 ой", title: "Ўқитувчиларни ёллаш", desc: "6 нафар ўқитувчи: IT, инглиз тили, тадбиркорлик", status: "neutral" as StatusVariant },
      { week: "3–4 ой", title: "Маркетинг кампанияси", desc: "Ижтимоий тармоқлар, IT-Park билан ҳамкорлик, маҳаллалардаги эълонлар", status: "neutral" as StatusVariant },
      { week: "4 ой", title: "Иккинчи филиални очиш", desc: "Очилиш ва биринчи оқимни йиғиш — 40 талаба", status: "positive" as StatusVariant },
      { week: "6 ой", title: "Зарарсизлик нуқтасига чиқиш", desc: "60+ талаба, даромад 120 млн/ой, соф фойда", status: "positive" as StatusVariant },
    ],

    /* UI strings */
    restartBtn: "← Қайтадан бошлаш",
    section1Title: "AI Бизнес тайёрлигини баҳолаш",
    section1Sub: "6 омил бўйича комплекс таҳлил",
    goodPotential: "Яхши потенциал",
    aiConclusion: "AI хулосаси",
    aiConclusionText: "Бизнесингиз кенгайтириш учун яхши потенциалга эга. Кучли томонлари — барқарор тарих (3–5 йил) ва нол кредит юки. Асосий хавф — юқори рақобат (31 та ўқув маркази). IT-йўналишлар орқали дифференциация қилишни тавсия этамиз, бу Марғилон ривожланиш стратегиясига мос келади.",
    section2Title: "SWOT-таҳлил",
    section2Sub: "Таълим курслари — Марғилон, Фарғона",
    swotStrengths: "Кучли томонлар",
    swotWeaknesses: "Заиф томонлар",
    swotOpportunities: "Имкониятлар",
    swotThreats: "Таҳдидлар",
    section3Title: "Маҳаллалар рейтинги — энг яхши жойлашувлар",
    section3Sub: "Марғилон · 50 та маҳалла · Таълим курслари",
    locationInsightTitle: "AI жойлашув тавсияси",
    locationInsightText: (
      <>
        Иккинчи филиал учун энг яхши жойлашувлар — <b>Баҳрин</b> маҳалласи (1 218 та янги иш ўрни, қайтаётган мигрантлар маркази) ва <b>З.М. Бобур</b> (ёшлар тумани, 1 008 та иш ўрни). Ҳар иккала туманда кадрларни қайта тайёрлашга юқори талаб мавжуд ва давлат бандлик дастурларига мос келади.
      </>
    ),
    section4Title: "Бизнес-план: таълим марказини кенгайтириш",
    section4Sub: "Иккинчи филиални очиш · IT-йўналишлар · Марғилон",
    projectDescLabel: "ЛОЙИҲА ТАВСИФИ",
    projectDescText: "Баҳрин маҳалласида иккинчи филиал очиш орқали амалдаги таълим марказини кенгайтириш. IT-йўналишларига (AI/ML, data science, кибер хавфсизлик, UX/UI), инглиз тили ва тадбиркорлик асосларига эътибор. Мақсадли аудитория — ёшлар (141 500 киши), қайтаётган мигрантлар (10 904 киши) ва ишсизлар (1 798 киши).",
    coursesLabel: "КУРС ЙЎНАЛИШЛАРИ",
    courses: ["Python / JavaScript", "AI ва Machine Learning", "Data Science", "Кибер хавфсизлик", "UX/UI дизайн", "Инглиз тили", "Тадбиркорлик асослари", "Digital Marketing"],
    startupCostsLabel: "БОШЛАНҒИЧ ХАРАЖАТЛАР",
    monthlyCostsLabel: "ОЙЛИК ХАРАЖАТЛАР",
    total: "Жами",
    startupTotal: "300 млн сўм",
    monthlyTotal: "42 млн/ой",
    revenueForecastLabel: "ДАРОМАД ПРОГНОЗИ (курс нархи: ~2 млн сўм/ой талабага)",
    periodCol: "Давр",
    studentsCol: "Талабалар",
    revenueCol: "Даромад/ой",
    profitCol: "Соф фойда",
    breakeven: "Зарарсизлик нуқтаси: 3–4 ой (50+ талаба бўлганда)",
    section5Title: "NBU кредит маҳсулотлари",
    section5Sub: "Профилингиз ва бизнес-режангиз асосида танланган",
    altProductsLabel: "МУҚОБИЛ МАҲСУЛОТЛАР",
    rateLabel: "Ставка:",
    amountLabel: "Сумма:",
    termLabel: "Муддат:",
    section6Title: "Ҳаракат режаси",
    section6Sub: "6 ойга босқичма-босқич режа",
    ctaTitle: "Бошлашга тайёрмисиз?",
    ctaSubtitle: "«Бизнес прогресс» кредитига ариза беринг ёки тўлиқ бизнес-планни юклаб олинг",
    applyBtn: "Банкка ариза бериш",
    downloadBtn: "Бизнес-планни юклаб олиш (PDF)",
    downloadAlert: "Бизнес-план кейинги версияда мавжуд бўлади",
    restartCta: "Ёки тестни қайтадан бошланг",
  },
};

/* ── main component ─────────────────────────────────── */

interface Step4Props {
  onRestart: () => void;
}

export function Step4Results({ onRestart }: Step4Props) {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Restart link */}
      <button
        type="button"
        onClick={onRestart}
        className="font-sans text-[14px] font-medium text-navy-700 hover:bg-navy-900/[0.04] rounded-[8px] py-2 px-3 transition-colors duration-150"
      >
        {t.restartBtn}
      </button>

      {/* ═══ SECTION 1 — AI Scoring ═══ */}
      <section className="bg-white border border-border rounded-[12px] overflow-hidden shadow-card">
        <div className="px-8 py-6" style={{ background: "rgba(215,181,109,0.04)", borderBottom: "1px solid rgba(215,181,109,0.12)" }}>
          <div className="flex items-center gap-4">
            <SectionNum n={1} />
            <div>
              <h2 className="font-sans text-[20px] font-bold text-carbon">{t.section1Title}</h2>
              <p className="font-sans text-[14px] font-normal text-gray-600 mt-1">{t.section1Sub}</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8">
          <div className="flex gap-10">
            <div className="flex flex-col items-center gap-3">
              <ScoreCircle score={74} label={t.outOf100} />
              <span className="font-sans text-[14px] font-semibold text-emerald-600 bg-emerald-50 rounded-[6px] py-1 px-3">
                {t.goodPotential}
              </span>
            </div>
            <div className="flex-1 space-y-3">
              {t.SCORE_FACTORS.map((f) => (
                <FactorBar key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
          </div>
          <div className="mt-6">
            <InsightBox variant="info" title={t.aiConclusion}>
              {t.aiConclusionText}
            </InsightBox>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2 — SWOT ═══ */}
      <section className="bg-white border border-border rounded-[12px] overflow-hidden shadow-card">
        <div className="px-8 py-6" style={{ background: "rgba(41,87,162,0.04)", borderBottom: "1px solid rgba(41,87,162,0.1)" }}>
          <div className="flex items-center gap-4">
            <SectionNum n={2} />
            <div>
              <h2 className="font-sans text-[20px] font-bold text-carbon">{t.section2Title}</h2>
              <p className="font-sans text-[14px] font-normal text-gray-600 mt-1">{t.section2Sub}</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8">
          <div className="grid grid-cols-2 gap-4">
            <SWOTCard title={t.swotStrengths} color="emerald" items={t.SWOT.strengths} />
            <SWOTCard title={t.swotWeaknesses} color="red" items={t.SWOT.weaknesses} />
            <SWOTCard title={t.swotOpportunities} color="blue" items={t.SWOT.opportunities} />
            <SWOTCard title={t.swotThreats} color="amber" items={t.SWOT.threats} />
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3 — Mahalla Heatmap ═══ */}
      <section className="bg-white border border-border rounded-[12px] overflow-hidden shadow-card">
        <div className="px-8 py-6" style={{ background: "rgba(215,181,109,0.04)", borderBottom: "1px solid rgba(215,181,109,0.12)" }}>
          <div className="flex items-center gap-4">
            <SectionNum n={3} gold />
            <div>
              <h2 className="font-sans text-[20px] font-bold text-carbon">{t.section3Title}</h2>
              <p className="font-sans text-[14px] font-normal text-gray-600 mt-1">{t.section3Sub}</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8 space-y-6">
          <MargilanHeatmap />

          <InsightBox variant="info" title={t.locationInsightTitle}>
            {t.locationInsightText}
          </InsightBox>
        </div>
      </section>

      {/* ═══ SECTION 4 — Business Plan ═══ */}
      <section className="bg-white border border-border rounded-[12px] overflow-hidden shadow-card">
        <div className="px-8 py-6" style={{ background: "rgba(41,87,162,0.04)", borderBottom: "1px solid rgba(41,87,162,0.1)" }}>
          <div className="flex items-center gap-4">
            <SectionNum n={4} />
            <div>
              <h2 className="font-sans text-[20px] font-bold text-carbon">{t.section4Title}</h2>
              <p className="font-sans text-[14px] font-normal text-gray-600 mt-1">{t.section4Sub}</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8 space-y-8">
          {/* Description */}
          <div className="rounded-[8px] py-4 px-5" style={{ borderLeft: "3px solid #D7B56D", background: "rgba(215,181,109,0.06)" }}>
            <div className="font-sans text-[13px] font-bold mb-1 text-gold-500">{t.projectDescLabel}</div>
            <div className="font-sans text-[14px] font-medium text-carbon leading-[1.6]">
              {t.projectDescText}
            </div>
          </div>

          {/* Courses */}
          <div>
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{t.coursesLabel}</div>
            <div className="flex flex-wrap gap-2">
              {t.courses.map((c) => (
                <span key={c} className="font-sans text-[13px] font-medium text-navy-900 bg-navy-900/[0.06] rounded-[8px] py-[6px] px-3">{c}</span>
              ))}
            </div>
          </div>

          {/* Costs side by side */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{t.startupCostsLabel}</div>
              <div className="border border-border rounded-[10px] overflow-hidden">
                <div className="divide-y divide-border">
                  {t.STARTUP_COSTS.map(([item, cost]) => (
                    <div key={item} className="flex justify-between py-3 px-4">
                      <span className="font-sans text-[13px] text-carbon">{item}</span>
                      <span className="font-mono text-[13px] font-semibold text-carbon">{cost}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3 px-4 bg-navy-900/[0.03]">
                    <span className="font-sans text-[13px] font-bold text-carbon">{t.total}</span>
                    <span className="font-mono text-[14px] font-bold text-navy-900">{t.startupTotal}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{t.monthlyCostsLabel}</div>
              <div className="border border-border rounded-[10px] overflow-hidden">
                <div className="divide-y divide-border">
                  {t.MONTHLY_COSTS.map(([item, cost]) => (
                    <div key={item} className="flex justify-between py-3 px-4">
                      <span className="font-sans text-[13px] text-carbon">{item}</span>
                      <span className="font-mono text-[13px] font-semibold text-carbon">{cost}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-3 px-4 bg-navy-900/[0.03]">
                    <span className="font-sans text-[13px] font-bold text-carbon">{t.total}</span>
                    <span className="font-mono text-[14px] font-bold text-navy-900">{t.monthlyTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue forecast */}
          <div>
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{t.revenueForecastLabel}</div>
            <div className="border border-border rounded-[10px] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-900/[0.03]">
                    <th className="text-left font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{t.periodCol}</th>
                    <th className="text-center font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{t.studentsCol}</th>
                    <th className="text-right font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{t.revenueCol}</th>
                    <th className="text-right font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{t.profitCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {t.REVENUE_FORECAST.map((r) => (
                    <tr key={r.period}>
                      <td className="font-sans text-[13px] font-medium text-carbon py-3 px-4">{r.period}</td>
                      <td className="font-mono text-[13px] font-semibold text-carbon py-3 px-4 text-center">{r.students}</td>
                      <td className="font-mono text-[13px] font-semibold text-carbon py-3 px-4 text-right">{r.revenue}</td>
                      <td className={cn("font-mono text-[13px] font-bold py-3 px-4 text-right", r.profitPositive ? "text-emerald-600" : "text-red-500")}>
                        {r.profit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-sans text-[12px] text-steel-500 mt-2 italic">
              {t.breakeven}
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5 — Credit Products ═══ */}
      <section className="bg-white border border-border rounded-[12px] overflow-hidden shadow-card">
        <div className="px-8 py-6" style={{ background: "rgba(215,181,109,0.06)", borderBottom: "1px solid rgba(215,181,109,0.15)" }}>
          <div className="flex items-center gap-4">
            <SectionNum n={5} gold />
            <div>
              <h2 className="font-sans text-[20px] font-bold text-carbon">{t.section5Title}</h2>
              <p className="font-sans text-[14px] font-normal text-gray-600 mt-1">{t.section5Sub}</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8 space-y-6">
          {/* Primary product */}
          <div className="border border-border rounded-[10px] overflow-hidden" style={{ borderTop: "3px solid #D7B56D" }}>
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <div className="font-sans text-[11px] font-semibold text-gold-500 uppercase tracking-[0.5px] mb-1">
                  {t.PRIMARY_PRODUCT.program}
                </div>
                <h3 className="font-sans text-[20px] font-bold text-carbon">
                  {t.PRIMARY_PRODUCT.name}
                </h3>
              </div>
              <span className="font-sans text-[12px] font-bold text-emerald-600 bg-emerald-50 rounded-[6px] py-[6px] px-[14px] uppercase tracking-[0.5px]">
                {t.PRIMARY_PRODUCT.badge}
              </span>
            </div>
            <div className="px-6 pb-6">
              <div className="divide-y divide-border">
                {t.PRIMARY_PRODUCT.rows.map(([label, value]) => (
                  <div key={label} className="flex gap-6 py-3">
                    <div className="w-44 shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 pt-[2px]">
                      {label}
                    </div>
                    <div className="font-sans text-[14px] font-medium text-carbon">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional products */}
          <div>
            <div className="font-sans text-[12px] font-semibold uppercase tracking-[1px] text-steel-500 mb-4">
              {t.altProductsLabel}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {t.ADDITIONAL_PRODUCTS.map((p) => (
                <div key={p.name} className="border border-border rounded-[10px] py-[14px] px-[18px]">
                  <div className="font-sans text-[15px] font-semibold text-carbon">{p.name}</div>
                  <div className="font-sans text-[12px] font-normal text-gray-600 mt-[2px]">{p.subtitle}</div>
                  <div className="mt-3 space-y-1">
                    <div className="font-sans text-[12px] text-steel-500">
                      <span className="font-semibold">{t.rateLabel}</span> {p.rate}
                    </div>
                    <div className="font-sans text-[12px] text-steel-500">
                      <span className="font-semibold">{t.amountLabel}</span> {p.amount}
                    </div>
                    <div className="font-sans text-[12px] text-steel-500">
                      <span className="font-semibold">{t.termLabel}</span> {p.term}
                    </div>
                  </div>
                  <p className="font-sans text-[12px] font-normal text-gray-600 mt-2 leading-[1.4]">{p.purpose}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6 — Action Plan ═══ */}
      <section className="bg-white border border-border rounded-[12px] overflow-hidden shadow-card">
        <div className="px-8 py-6" style={{ background: "rgba(41,87,162,0.04)", borderBottom: "1px solid rgba(41,87,162,0.1)" }}>
          <div className="flex items-center gap-4">
            <SectionNum n={6} />
            <div>
              <h2 className="font-sans text-[20px] font-bold text-carbon">{t.section6Title}</h2>
              <p className="font-sans text-[14px] font-normal text-gray-600 mt-1">{t.section6Sub}</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-8">
          <div className="space-y-3">
            {t.ACTION_STEPS.map((s, i) => (
              <div key={s.title} className="flex items-start gap-4 border border-border rounded-[10px] p-4">
                <div className="flex flex-col items-center shrink-0">
                  <span className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-mono text-[13px] font-bold text-white",
                    i < 2 ? "bg-gold-500" : i >= 6 ? "bg-emerald-500" : "bg-navy-900",
                  )}>
                    {i + 1}
                  </span>
                  {i < t.ACTION_STEPS.length - 1 && (
                    <div className="w-[2px] h-4 bg-border mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="font-sans text-[15px] font-semibold text-carbon">{s.title}</span>
                    <StatusTag variant={s.status}>{s.week}</StatusTag>
                  </div>
                  <p className="font-sans text-[13px] text-gray-600 mt-1 leading-[1.5]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7 — CTA ═══ */}
      <section
        className="rounded-[16px] py-14 px-10 text-center"
        style={{ background: "linear-gradient(135deg, #0F2847, #193F72)" }}
      >
        <h2 className="font-sans text-[24px] font-bold text-white">
          {t.ctaTitle}
        </h2>
        <p className="font-sans text-[15px] font-normal text-white/65 mt-2">
          {t.ctaSubtitle}
        </p>
        <div className="flex items-center justify-center gap-4 mt-7">
          <a
            href="https://nbu.uz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-sans text-[15px] font-bold text-navy-900 bg-gold-500 hover:bg-[#C9A85F] rounded-[10px] py-[14px] px-8 transition-colors duration-200"
          >
            {t.applyBtn}
          </a>
          <button
            type="button"
            onClick={() => alert(t.downloadAlert)}
            className="inline-flex items-center justify-center font-sans text-[15px] font-semibold text-white border-[1.5px] border-white/30 hover:bg-white/10 rounded-[10px] py-[13px] px-8 transition-colors duration-200"
          >
            {t.downloadBtn}
          </button>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="font-sans text-[14px] font-medium text-white/45 hover:text-white/70 mt-5 transition-colors duration-150"
        >
          {t.restartCta}
        </button>
      </section>
    </div>
  );
}
