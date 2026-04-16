// Per-district analytics for Fergana oblast (19 entries).
// Values are scaled from population + the district profile so every drill-down
// screen is populated realistically. The shape matches buildAnalytics() from
// regionAnalytics.js so the existing DistrictAnalyticsView tabs can render it.

import { districtByKey } from './districts'

// Heuristic profile per district: sector mix, infra maturity, growth tilt.
// industry/agri/services/trade sum to 100. growth is % grp/yr. infra is 0–1.
// These are illustrative; replace with real stat.uz data when wired.
const PROFILE = {
  fargona_city:  { industry: 42, agri:  8, services: 32, trade: 18, growth: 9.8, infra: 0.92, tourism: 0.8, textile: 0.6, enclave: false },
  margilon_city: { industry: 56, agri:  4, services: 22, trade: 18, growth: 9.1, infra: 0.86, tourism: 0.9, textile: 1.0, enclave: false },
  qoqon_city:    { industry: 40, agri:  6, services: 30, trade: 24, growth: 8.9, infra: 0.88, tourism: 0.8, textile: 0.5, enclave: false },
  quvasoy_city:  { industry: 64, agri:  6, services: 18, trade: 12, growth: 8.2, infra: 0.78, tourism: 0.3, textile: 0.2, enclave: false },
  oltiariq:      { industry: 28, agri: 48, services: 14, trade: 10, growth: 7.8, infra: 0.58, tourism: 0.2, textile: 0.3, enclave: false },
  beshariq:      { industry: 24, agri: 52, services: 14, trade: 10, growth: 7.2, infra: 0.55, tourism: 0.1, textile: 0.2, enclave: false },
  bogdod:        { industry: 22, agri: 56, services: 12, trade: 10, growth: 6.9, infra: 0.52, tourism: 0.1, textile: 0.2, enclave: false },
  buvayda:       { industry: 22, agri: 58, services: 12, trade:  8, growth: 6.8, infra: 0.50, tourism: 0.1, textile: 0.2, enclave: false },
  dangara:       { industry: 26, agri: 50, services: 14, trade: 10, growth: 7.1, infra: 0.55, tourism: 0.2, textile: 0.4, enclave: false },
  farhona:       { industry: 34, agri: 40, services: 16, trade: 10, growth: 8.0, infra: 0.68, tourism: 0.3, textile: 0.4, enclave: false },
  furqat:        { industry: 20, agri: 60, services: 12, trade:  8, growth: 6.5, infra: 0.48, tourism: 0.1, textile: 0.2, enclave: false },
  qoshtepa:      { industry: 32, agri: 44, services: 14, trade: 10, growth: 7.5, infra: 0.60, tourism: 0.2, textile: 0.3, enclave: false },
  quva:          { industry: 30, agri: 46, services: 14, trade: 10, growth: 7.6, infra: 0.62, tourism: 0.4, textile: 0.4, enclave: false },
  rishton:       { industry: 34, agri: 42, services: 14, trade: 10, growth: 7.4, infra: 0.60, tourism: 0.9, textile: 0.3, enclave: false }, // ceramics
  sox:           { industry: 16, agri: 64, services: 12, trade:  8, growth: 5.8, infra: 0.38, tourism: 0.1, textile: 0.1, enclave: true },  // Tajik enclave
  toshloq:       { industry: 28, agri: 48, services: 14, trade: 10, growth: 7.3, infra: 0.58, tourism: 0.2, textile: 0.3, enclave: false },
  uchkoprik:     { industry: 26, agri: 50, services: 14, trade: 10, growth: 7.0, infra: 0.55, tourism: 0.1, textile: 0.2, enclave: false },
  ozbekiston:    { industry: 30, agri: 46, services: 14, trade: 10, growth: 7.5, infra: 0.60, tourism: 0.2, textile: 0.3, enclave: false },
  yozyovon:      { industry: 24, agri: 54, services: 12, trade: 10, growth: 6.9, infra: 0.52, tourism: 0.1, textile: 0.2, enclave: false },
}

// Benchmark district = Marg'ilon (base for template scales).
const BENCH_POP = 245.2
const BENCH_GRP = 3616 // mlrd UZS

function fmt(n, d = 0) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export function buildDistrictAnalytics(districtKey) {
  const d = districtByKey[districtKey]
  if (!d) return null
  const p = PROFILE[districtKey] || PROFILE.oltiariq
  const popK = d.population // thousand
  const popAbs = Math.round(popK * 1000)
  const scale = popK / BENCH_POP

  const grpTotal = Math.round(BENCH_GRP * scale * (p.growth / 8.0))
  const industryBln = Math.round(grpTotal * (p.industry / 100))
  const agriBln = Math.round(grpTotal * (p.agri / 100))
  const servicesBln = Math.round(grpTotal * (p.services / 100))
  const tradeBln = Math.round(grpTotal * (p.trade / 100))
  const investBln = Math.round(883 * scale * (p.growth / 8.0))
  const unemployment = Math.max(3.0, 7.0 - p.growth * 0.25).toFixed(1)
  const unemploymentStart = (parseFloat(unemployment) + 6.5).toFixed(1)

  const mahallas = Math.max(18, Math.round(popK * 0.35))
  const score = Math.min(9.4, 5.5 + p.growth * 0.25 + p.infra * 2.0).toFixed(1)

  // Composite-score breakdown exposed to UI so users understand what feeds it.
  const scoreBreakdown = [
    { axis: 'Рост ВРП', value: Math.min(10, p.growth).toFixed(1), weight: 30 },
    { axis: 'Инфраструктура', value: (p.infra * 10).toFixed(1), weight: 30 },
    { axis: 'Занятость', value: Math.min(10, 5 + p.growth * 0.35).toFixed(1), weight: 20 },
    { axis: 'Инвестиции', value: Math.min(10, 5.5 + p.growth * 0.4).toFixed(1), weight: 20 },
  ]

  const brief = {
    score,
    scoreBreakdown,
    kpis: [
      { label: 'ВРП', value: fmt(grpTotal), unit: 'млрд сум', delta: `+${p.growth.toFixed(1)}%`, tone: 'green' },
      { label: 'Промышленность', value: fmt(industryBln), unit: 'млрд сум', delta: `${p.industry}% ВРП`, tone: 'green' },
      { label: 'Инвестиции', value: fmt(investBln), unit: 'млрд сум', delta: `×${(1.6 + p.growth * 0.15).toFixed(1)}`, tone: 'green' },
      { label: 'Безработица', value: `${unemployment}%`, unit: '', delta: `−${(parseFloat(unemploymentStart) - parseFloat(unemployment)).toFixed(1)} п.п.`, tone: 'green' },
      { label: 'Население', value: fmt(popAbs), unit: 'чел.', delta: d.kind === 'city' ? 'городское' : 'сельское', tone: 'blue' },
    ],
  }

  const economic = {
    kpis: [
      { label: 'Охват бизнесом', value: `${Math.round(55 + p.growth * 4 + p.infra * 20)}%`, sub: `${Math.round(mahallas * 0.62)} активных точек`, tone: 'green' },
      { label: 'Промышленность', value: `${fmt(industryBln)} млрд`, sub: 'сум, 2025', tone: 'blue' },
      { label: 'Сельское х-во', value: `${fmt(agriBln)} млрд`, sub: 'сум, 2025', tone: 'blue' },
      { label: 'Услуги', value: `${fmt(servicesBln)} млрд`, sub: 'сум, 2025', tone: 'blue' },
    ],
    history: [2021, 2022, 2023, 2024, 2025].map((y, i) => {
      const factor = 0.55 + i * 0.12
      return {
        year: y,
        grp: Math.round(grpTotal * factor),
        industry: Math.round(industryBln * factor),
        invest: Math.round(investBln * factor * (i === 4 ? 2.4 : 1)),
      }
    }),
    sectors: [
      { name: 'Промышленность', percent: p.industry.toFixed(1), color: '#003D7C' },
      { name: 'Сельское х-во',  percent: p.agri.toFixed(1),     color: '#059669' },
      { name: 'Услуги',          percent: p.services.toFixed(1), color: '#0054A6' },
      { name: 'Торговля',        percent: p.trade.toFixed(1),    color: '#2563EB' },
    ],
    trade: {
      importMln: Math.round(40 * scale),
      exportMln: Math.round(11.4 * scale * (p.growth / 8.0) * (1 + p.textile * 0.4)),
      deficitMln: Math.round(-28.6 * scale),
      exportGrowth: `+${Math.round(30 + p.growth * 5)}%`,
    },
    entities: {
      active: Math.round(866 * scale),
      inactive: Math.round(336 * scale),
      opened: Math.round(141 * scale),
      closed: Math.round(338 * scale * (1 - p.infra * 0.3)),
      activeShare: Math.round(60 + p.infra * 20),
      types: [
        { code: 'ИП',     count: Math.round(817 * scale), share: 60 },
        { code: 'ООО',    count: Math.round(264 * scale), share: 22 },
        { code: 'Фермер', count: Math.round(84 * scale * (1 + p.agri / 60)), share: 11 },
        { code: 'Прочее', count: Math.round(37 * scale), share: 7 },
      ],
    },
    aiNote: p.industry >= 40
      ? `${d.kind === 'city' ? 'Город' : 'Район'} опирается на промышленный сектор (${p.industry}% ВРП). NBU рекомендует льготные кредиты «Модернизация ОПФ» до 300 млн сум и экспортное финансирование через фонд NBU-Export для масштабирования текстильных/керамических цепочек.`
      : `Экономика ${d.kind === 'city' ? 'города' : 'района'} преимущественно аграрная (${p.agri}% ВРП). NBU рекомендует расширить агро-кредитование под залог урожая и целевую программу «Кооператив-МСБ» для переработки на местах — добавленная стоимость +35%.`,
  }

  const water = Math.round(p.infra * 70 + 10)
  const sewage = Math.round(p.infra * 60 + 5)
  const roads = Math.round(p.infra * 60 + 20)
  const gas = Math.min(100, Math.round(p.infra * 80 + 20))

  const infra = {
    kpis: [
      { label: 'Электроэнергия', value: '100%', delta: 'покрытие', tone: 'green' },
      { label: 'Водоснабжение', value: `${water}%`, delta: water >= 60 ? 'стабильно' : water >= 40 ? 'ниже нормы' : 'критично', tone: water >= 60 ? 'green' : water >= 40 ? 'amber' : 'red' },
      { label: 'Газоснабжение', value: `${gas}%`, delta: 'сеть', tone: 'green' },
      { label: 'Канализация', value: `${sewage}%`, delta: sewage >= 55 ? 'норма' : 'ниже нормы', tone: sewage >= 55 ? 'green' : 'amber' },
      { label: 'Транспорт', value: `${roads}%`, delta: 'в работе', tone: 'blue' },
    ],
    matrix: [
      { name: 'Электричество',        status: 'ok',   note: '100% — без перебоев' },
      { name: 'Питьевая вода',        status: water >= 60 ? 'ok' : water >= 40 ? 'warn' : 'bad', note: `${water}% — ${water >= 60 ? 'в норме' : 'модернизация'}` },
      { name: 'Газ',                  status: gas >= 80 ? 'ok' : 'warn', note: `${gas}% — ${gas >= 80 ? 'работает' : 'расширение'}` },
      { name: 'Канализация',          status: sewage >= 55 ? 'ok' : 'warn', note: `${sewage}% — требуется` },
      { name: 'Дороги',               status: roads >= 60 ? 'ok' : 'warn', note: `${Math.round(popK * 0.6)} км сети` },
      { name: 'Общественный транспорт', status: p.infra >= 0.7 ? 'ok' : 'warn', note: `${Math.round(p.infra * 100)}% — обновлено` },
      { name: 'Цифровая сеть',        status: 'warn', note: `LTE ${Math.round(60 + p.infra * 30)}%, 5G — план` },
    ],
    budgetMlrd: Math.round(46.3 * scale * 10) / 10,
    roads: {
      totalKm: Math.round(popK * 0.6),
      asphaltKm: Math.round(popK * 0.6 * (0.2 + p.infra * 0.4)),
      gravelKm: Math.round(popK * 0.6 * 0.15),
      patchedKm: Math.round(popK * 0.6 * 0.25),
      earthKm: Math.round(popK * 0.6 * 0.3 * (1 - p.infra * 0.5)),
    },
    education: {
      schools: Math.max(4, Math.round(popK * 0.06)),
      schoolsPlanned: Math.max(1, Math.round(popK * 0.015)),
      kindergartens: Math.max(6, Math.round(popK * 0.09)),
      kindergartensPlanned: Math.max(3, Math.round(popK * 0.04)),
    },
    problems: [
      { code: 'M1', name: 'Реконструкция водопровода', cost: Math.round(12.8 * scale * 10) / 10, priority: water < 55 ? 'высокий' : 'средний' },
      { code: 'M2', name: 'Система канализации',     cost: Math.round(8.4 * scale * 10) / 10,  priority: sewage < 50 ? 'высокий' : 'средний' },
      { code: 'M3', name: 'Дорожная сеть',            cost: Math.round(6.2 * scale * 10) / 10,  priority: 'средний' },
      { code: 'M4', name: 'Энергосистема',            cost: Math.round(3.0 * scale * 10) / 10,  priority: 'средний' },
      { code: 'T1', name: 'Новые школы',              cost: Math.round(4.8 * scale * 10) / 10,  priority: 'высокий' },
      { code: 'T2', name: 'Детские сады',             cost: Math.round(2.2 * scale * 10) / 10,  priority: 'средний' },
      { code: 'T3', name: 'Цифровая сеть 5G',         cost: Math.round(1.5 * scale * 10) / 10,  priority: 'низкий' },
      { code: 'T4', name: 'Зелёная энергия',          cost: Math.round(1.5 * scale * 10) / 10,  priority: 'низкий' },
    ],
    aiNote: water < 50
      ? `Критически низкое водоснабжение (${water}%). Приоритет NBU — ГЧП-проект «Водоканал-2026» на ${Math.round(12.8 * scale * 10) / 10} млрд сум, окупаемость 7 лет.`
      : `Инфраструктура ${d.kind === 'city' ? 'города' : 'района'} сбалансирована (${Math.round(p.infra * 100)}%). Рекомендуется инвестировать в цифровую сеть 5G и зелёную энергетику для подготовки к промышленному росту 2026–2027 гг.`,
  }

  const empEmployed = Math.round(75 + p.infra * 20)
  const population = {
    kpis: [
      { label: 'Население', value: fmt(popAbs), delta: d.kind === 'city' ? '+1.4% в год' : '+1.0% в год', sub: '<18 лет: ~34%', tone: 'blue' },
      { label: 'Площадь', value: `${d.area} км²`, delta: '—', sub: `Плотность: ${Math.round(popAbs / d.area).toLocaleString('ru-RU')}/км²`, tone: 'blue' },
      { label: 'Эконом. активные', value: fmt(Math.round(29811 * scale)), delta: `+${fmt(Math.round(5745 * scale))}`, sub: 'с 2021 г.', tone: 'green' },
      { label: 'Безработица', value: `${unemployment}%`, delta: `${unemploymentStart}% → ${unemployment}%`, sub: '2021 → 2025', tone: 'green' },
    ],
    laborTrend: [
      { year: 2021, formal: 16137, informal: 3455, abroad: 4474, unemployed: 2784 },
      { year: 2022, formal: 16618, informal: 3010, abroad: 4875, unemployed: 2246 },
      { year: 2023, formal: 17618, informal: 2995, abroad: 5213, unemployed: 1854 },
      { year: 2024, formal: 19455, informal: 2765, abroad: 5566, unemployed: 1520 },
      { year: 2025, formal: 20415, informal: 2210, abroad: 6936, unemployed: 1197 },
    ].map((row) => ({
      year: row.year,
      formal: Math.round(row.formal * scale),
      informal: Math.round(row.informal * scale),
      abroad: Math.round(row.abroad * scale * (1 + (1 - p.infra) * 0.5)),
      unemployed: Math.round(row.unemployed * scale),
    })),
    unemploymentTrend: [
      { year: 2021, value: parseFloat(unemploymentStart) },
      { year: 2022, value: parseFloat(unemploymentStart) - 2.0 },
      { year: 2023, value: parseFloat(unemploymentStart) - 3.7 },
      { year: 2024, value: parseFloat(unemploymentStart) - 5.2 },
      { year: 2025, value: parseFloat(unemployment) },
    ],
    migration: {
      countAbroad: Math.round(6812 * scale * (1 + (1 - p.infra) * 0.6)),
      growthPct: `+${Math.round(40 + (1 - p.infra) * 30)}%`,
      shareOfWorkforce: `${(19.2 * (1 + (1 - p.infra) * 0.3)).toFixed(1)}%`,
      totalEmployed: Math.round(29811 * scale),
      warning: p.enclave
        ? 'Анклавное положение сдерживает миграцию, но ограничивает кадровый рынок. Нужна логистика кадров внутри долины.'
        : 'Безработица падает, но миграция растёт в 1.5×: локальные зарплаты не удерживают кадры.',
    },
    program2026: {
      title: 'Программа занятости 2026',
      goal: Math.round(2500 * scale),
      breakdown: [
        { code: 'P1', label: 'Обучение ремеслам', count: Math.round(800 * scale) },
        { code: 'P2', label: 'Субсидии на старт', count: Math.round(620 * scale) },
        { code: 'P3', label: 'Трудоустройство в сфере', count: Math.round(580 * scale) },
        { code: 'P4', label: 'Экспортные кластеры', count: Math.round(500 * scale * (1 + p.textile * 0.5)) },
      ],
    },
  }

  const bankCredits = Math.round(55 + p.infra * 30)
  const bankNewBusiness = Math.round(40 + p.growth * 3)
  const bankExporters = Math.round(20 + p.textile * 40 + p.tourism * 15)

  const mahalla = {
    kpis: [
      { label: 'Махалли', value: mahallas.toLocaleString('ru-RU'), sub: d.kind === 'city' ? 'городские' : 'сельские', tone: 'blue' },
      { label: 'Кредитный охват', value: `${bankCredits}%`, sub: 'МСБ района', tone: 'green' },
      { label: 'Новые ИП', value: `${bankNewBusiness}%`, sub: 'квартальный рост', tone: 'green' },
      { label: 'Цифровизация', value: `${Math.round(bankCredits * 0.65)}%`, sub: 'онлайн-банкинг', tone: 'blue' },
    ],
    bankMetrics: [
      { label: 'Выданные кредиты МСБ', percent: bankCredits, color: 'bg-primary' },
      { label: 'Новые предприниматели', percent: bankNewBusiness, color: 'bg-primary-container' },
      { label: 'Экспортёры', percent: bankExporters, color: 'bg-secondary' },
      { label: 'Трудоустроены', percent: empEmployed, color: 'bg-tertiary' },
      { label: 'Самозанятые', percent: Math.round(40 + p.agri * 0.5), color: 'bg-tertiary opacity-60' },
      { label: 'Проф. обучение', percent: Math.round(25 + p.infra * 20), color: 'bg-primary opacity-60' },
    ],
    topMahallas: buildTopMahallas(d, p, scale),
    digitalAdoption: {
      payments: Math.round(60 + p.infra * 30),
      cards: Math.round(45 + p.infra * 30),
      merchants: Math.round(35 + p.infra * 25),
      lending: Math.round(25 + p.infra * 20),
    },
  }

  const opportunities = {
    swot: {
      strengths: buildStrengths(d, p),
      weaknesses: buildWeaknesses(d, p, water, sewage),
      opportunities: buildOpportunities(d, p),
      threats: buildThreats(d, p),
    },
    aiRecommendation: p.textile >= 0.8
      ? `${d.kind === 'city' ? 'Город' : 'Район'} — исторический центр текстиля. Стратегический ход: smart-текстильный кластер + филиал IT-парка. NBU готов закрыть ~${Math.round(24 * scale)} млрд сум экспортного кредита под 8% годовых.`
      : p.tourism >= 0.8
        ? `Туристический потенциал недоиспользован. Запустите программу «Турхаб-2026»: гостевые дома + ремесленные площадки, гарантия NBU до 1,5 млрд сум на одного участника.`
        : p.enclave
          ? 'Анклавное положение — стратегический вызов. Приоритет: логистический коридор + мобильные МФЦ банковских услуг для малых хозяйств.'
          : `Экономика сбалансирована, но растёт медленнее соседей. Концентрируйтесь на агропереработке: кредиты NBU «Сырьё → Продукт» дают +35% добавленной стоимости к ${d.kind === 'city' ? 'городской' : 'районной'} базе.`,
  }

  const summary = {
    score,
    radar: [
      { axis: 'Экономика',       value: Math.min(9.5, 5.5 + p.growth * 0.3).toFixed(1), provincial: 7.0 },
      { axis: 'Инфраструктура', value: (4 + p.infra * 5.5).toFixed(1), provincial: 6.5 },
      { axis: 'Занятость',       value: Math.min(9.0, 5.5 + p.growth * 0.25).toFixed(1), provincial: 7.0 },
      { axis: 'Демография',      value: (d.kind === 'city' ? 7.8 : 6.8).toFixed(1), provincial: 7.0 },
      { axis: 'Инвестиции',      value: Math.min(9.2, 5.5 + p.growth * 0.3).toFixed(1), provincial: 6.8 },
    ],
    comparison: [
      { metric: 'Промышленность (тыс. сум/душу)', region: Math.round((industryBln * 1e9) / popAbs / 1000), provincial: 28914 },
      { metric: 'Услуги (тыс. сум/душу)',          region: Math.round((servicesBln * 1e9) / popAbs / 1000), provincial: 14120 },
      { metric: 'Торговля (тыс. сум/душу)',        region: Math.round((tradeBln * 1e9) / popAbs / 1000), provincial: 9380 },
      { metric: 'Инвестиции (тыс. сум/душу)',      region: Math.round((investBln * 1e9) / popAbs / 1000), provincial: 9910 },
      { metric: 'Экспорт ($/душу)',                region: Math.round((11.4 * scale * (p.growth / 8.0) * 1e6) / popAbs), provincial: 28 },
    ],
    plan: buildPlan(d, p, scale, water),
    conclusion: `${d.kind === 'city' ? 'Город' : 'Район'} «${fmt(popAbs)}» занимает ${(scale * 100).toFixed(0)}% от бенчмарка области. Итоговый рейтинг устойчивости ${score}/10 — ${score >= 8.5 ? 'лидер' : score >= 7.5 ? 'выше среднего' : score >= 6.5 ? 'в группе роста' : 'догоняющий'} среди 19 точек Ферганы.`,
  }

  // ---- Enrichments inspired by NBU Data Office reference dashboard ----
  const industryYears = [0.58, 0.63, 0.68, 0.84, 1.0].map((f) => Math.round(industryBln * f))
  const exportBaseline = Math.round(11.4 * scale * (p.growth / 8.0) * (1 + p.textile * 0.4))
  const exportYears = [0.33, 0.42, 0.58, 0.47, 1.0].map((f) => Math.round(exportBaseline * f * 39))
  const importBaseline = Math.round(40 * scale * 18)
  const importYears = [1.04, 1.06, 1.07, 1.10, 1.0].map((f) => Math.round(importBaseline * f))
  const deficitYears = importYears.map((im, i) => im - exportYears[i])
  const constructionYears = [121.9, 88.9, 110.2, 102.7, 118.8]
  const migrationBase = Math.round(253 * scale * (1 + (1 - p.infra) * 0.6))
  const migrationYears = [1.0, 2.49, 7.0, 24.6, 4.67].map((f) => Math.round(migrationBase * f))
  const enterprisesYears = [1.0, 0.85, 0.71, 0.63, 0.57].map((f) => Math.round(4928 * scale * f))
  const unemploymentYears = [
    parseFloat(unemploymentStart),
    parseFloat(unemploymentStart) - 2.0,
    parseFloat(unemploymentStart) - 3.7,
    parseFloat(unemploymentStart) - 5.2,
    parseFloat(unemployment),
  ].map((v) => parseFloat(v.toFixed(1)))
  const investmentYears = [0.61, 0.71, 1.23, 0.55, 1.0].map((f) => Math.round(investBln * f))

  economic.fiveYear = [
    { label: 'Промышленность, млрд сум', values: industryYears, trend: '+71%', trendTone: 'green' },
    { label: 'Экспорт, млрд сум',        values: exportYears,   trend: '+202%', trendTone: 'green' },
    { label: 'Импорт, млрд сум',         values: importYears,   trend: '−4.1%', trendTone: 'green' },
    { label: 'Торговый дефицит',         values: deficitYears,  trend: '−53%', trendTone: 'green' },
    { label: 'Строительство, рост %',    values: constructionYears, trend: '−2.5%', trendTone: 'red' },
    { label: 'Миграция (выезд/год)',     values: migrationYears, trend: '×25 ↑', trendTone: 'red' },
    { label: 'Предприятия, шт.',         values: enterprisesYears, trend: '−43%', trendTone: 'red' },
    { label: 'Безработица, %',           values: unemploymentYears, trend: `−${(parseFloat(unemploymentStart) - parseFloat(unemployment)).toFixed(1)} п.п.`, trendTone: 'green' },
    { label: 'Инвестиции, млрд сум',     values: investmentYears, trend: '+83%', trendTone: 'green' },
  ]

  economic.investmentSources = [
    { label: 'Иностранные',          percent: 44.3, color: '#003D7C' },
    { label: 'Средства предприятий', percent: 19.1, color: '#059669' },
    { label: 'Госбюджет',            percent: 16.0, color: '#D97706' },
    { label: 'Средства населения',   percent: 13.9, color: '#7C3AED' },
    { label: 'Фонд реставрации',     percent:  6.7, color: '#6B7280' },
  ]

  const pc = (bln) => Math.round((bln * 1e9) / popAbs / 1000)
  const perCapitaIndustry = pc(industryBln)
  const perCapitaInvest = pc(investBln)
  const perCapitaServices = pc(servicesBln)
  const perCapitaTrade = pc(tradeBln)
  const perCapitaConstr = pc(Math.round(grpTotal * 0.12))

  economic.perCapita = {
    industry: perCapitaIndustry,
    services: perCapitaServices,
    trade: perCapitaTrade,
    invest: perCapitaInvest,
    construction: perCapitaConstr,
  }

  const benchIsCity = districtKey === 'fargona_city'
  economic.benchmark = {
    versus: benchIsCity ? 'Средний по области' : 'Фергана (обл. центр)',
    rows: [
      { label: 'Промышленность', district: perCapitaIndustry, benchmark: benchIsCity ? 14820 : 38187 },
      { label: 'Инвестиции',     district: perCapitaInvest,   benchmark: benchIsCity ? 7120  : 21491 },
      { label: 'Услуги',         district: perCapitaServices, benchmark: benchIsCity ? 11400 : 36753 },
      { label: 'Торговля',       district: perCapitaTrade,    benchmark: benchIsCity ? 9380  : 19785 },
      { label: 'Строительство',  district: perCapitaConstr,   benchmark: benchIsCity ? 5100  :  9878 },
    ],
  }

  economic.macroKpis = [
    { label: 'Население',    value: fmt(popAbs), sub: `${Math.round(popAbs / d.area).toLocaleString('ru-RU')}/км²`, delta: d.kind === 'city' ? '+1.4%/год' : '+1.0%/год', tone: 'green' },
    { label: 'Площадь',      value: `${d.area} км²`, sub: 'административная', delta: '—', tone: 'blue' },
    { label: 'Промышл.',     value: fmt(industryBln), sub: 'млрд сум', delta: '+71% 5Y', tone: 'green' },
    { label: 'Экспорт',      value: fmt(exportYears[4]), sub: 'млрд сум', delta: '+202% 5Y', tone: 'green' },
    { label: 'Инвестиции',   value: fmt(investBln), sub: 'млрд сум', delta: '+83% YoY', tone: 'green' },
    { label: 'Ср. зарплата', value: fmt(Math.round(2100 + p.growth * 200 + p.infra * 900)), sub: 'тыс. сум/мес', delta: '+86% 5Y', tone: 'green' },
    { label: 'Туризм',       value: `${Math.round(80 + p.tourism * 300)}K`, sub: 'посетителей/год', delta: `${Math.max(4, Math.round(8 + p.tourism * 40))} объектов`, tone: 'blue' },
    { label: 'ВРП/душу',     value: fmt(Math.round((grpTotal * 1e9) / popAbs / 1000)), sub: 'тыс. сум/чел.', delta: p.industry >= 40 ? 'выше обл.' : 'ниже обл.', tone: p.industry >= 40 ? 'green' : 'amber' },
  ]

  opportunities.criticalIssues = [
    {
      code: 'I1',
      severity: migrationYears[4] > migrationYears[0] * 3 ? 'high' : 'medium',
      title: 'Миграционный кризис',
      detail: `${fmt(migrationYears[3])} выездов в пик 2024; накоплено ~${fmt(Math.round(migrationBase * 32))} за рубежом — ${(((migrationBase * 32) / (popAbs * 0.52)) * 100).toFixed(0)}% экономически активных.`,
      kpi: { from: fmt(migrationYears[3]), to: fmt(Math.round(migrationBase * 2)), unit: 'выезд/год' },
    },
    {
      code: 'I2',
      severity: p.industry < 30 ? 'high' : 'medium',
      title: p.industry < 30 ? 'Слабая промышленная база' : 'Зависимость от одного сектора',
      detail: p.industry < 30
        ? `Всего ${p.industry}% ВРП в промышленности; 97% МСБ, нет якорных производств масштаба «Ферганаазот».`
        : `Концентрация ${p.industry}% ВРП в одном секторе повышает уязвимость к внешним шокам.`,
      kpi: { from: `${p.industry}%`, to: `${Math.min(50, p.industry + 8)}%`, unit: 'доля ВРП' },
    },
    {
      code: 'I3',
      severity: water < 50 ? 'high' : 'medium',
      title: 'Инфраструктурные разрывы',
      detail: `Вода ${water}%, канализация ${sewage}%, дороги ${roads}% — износ сетей тормозит инвестиции.`,
      kpi: { from: `${water}%`, to: '≥70%', unit: 'водоснабжение' },
    },
    {
      code: 'I4',
      severity: 'medium',
      title: '«Спящий» бизнес и тень',
      detail: `${fmt(Math.round(336 * scale))} неактивных предприятий (28%); ~${Math.round(25 + (1 - p.infra) * 15)}% занятости — неформальная.`,
      kpi: { from: `${Math.round(25 + (1 - p.infra) * 15)}%`, to: '12%', unit: 'тень' },
    },
    {
      code: 'I5',
      severity: p.growth < 7.5 ? 'medium' : 'low',
      title: 'Разрыв доходов с центром',
      detail: `ВРП/душу ${fmt(Math.round((grpTotal * 1e9) / popAbs / 1000))} тыс. сум — ${p.industry >= 40 ? 'близко к' : 'в 2–4× ниже'} Ферганы-центра (~38 тыс. сум).`,
      kpi: { from: `×${(38187 / Math.max(1, perCapitaIndustry)).toFixed(1)}`, to: '×1.5', unit: 'разрыв' },
    },
    {
      code: 'I6',
      severity: p.enclave ? 'high' : 'low',
      title: p.enclave ? 'Анклавная логистика' : 'Цифровое отставание',
      detail: p.enclave
        ? 'Единственный въезд через Риштан — уязвимость поставок, медленный оборот капитала.'
        : `LTE ${Math.round(60 + p.infra * 30)}%, 5G — в плане. Цифровой разрыв тормозит экспорт и финтех.`,
      kpi: p.enclave
        ? { from: '1', to: '2', unit: 'коридора' }
        : { from: `${Math.round(60 + p.infra * 30)}%`, to: '95%', unit: 'покрытие' },
    },
  ]

  const strategyPick = (title, base, kpi, owner) => ({
    title, budget: Math.round(base * scale * 10) / 10, kpi, owner,
  })
  summary.strategicPriorities = [
    {
      horizon: '2026',
      label: 'Быстрые победы',
      color: '#DC2626',
      items: [
        strategyPick(water < 55 ? 'Водоканал-2026' : 'Модернизация сетей', water < 55 ? 12.8 : 6.2, `${water}% → 70%`, 'Хокимият + NBU'),
        strategyPick('Субсидии МСБ', 8.0, `+${Math.round(1200 * scale)} раб. мест`, 'NBU кредиты'),
        strategyPick('Энергоэффективность', 5.6, 'Пик −12%', 'УзЭнерго + NBU'),
      ],
    },
    {
      horizon: '2027–2028',
      label: 'Отраслевой прорыв',
      color: '#D97706',
      items: [
        p.textile >= 0.5 || d.kind === 'city'
          ? strategyPick('Smart-текстильный кластер', 24.0, 'Экспорт +35%', 'IFC + NBU')
          : strategyPick('Агропереработка-хаб', 18.0, '+35% доб. ст-ти', 'Минсельхоз + NBU'),
        p.tourism >= 0.7
          ? strategyPick('Турхаб и гостевые дома', 12.5, `${Math.round(60 + p.tourism * 300)}K визитёров`, 'Минтуризм')
          : strategyPick('Кооператив-МСБ', 5.2, `+${Math.round(600 * scale)} раб. мест`, 'NBU + Хокимият'),
        d.kind === 'city'
          ? strategyPick('Филиал IT-парка', 6.4, `${Math.round(1200 * scale)} IT-мест`, 'Минцифры')
          : strategyPick('Логистика + склады', 9.0, 'Оборот +40%', 'Минтранс'),
      ],
    },
    {
      horizon: '2029–2031',
      label: 'Масштабирование',
      color: '#059669',
      items: [
        strategyPick('Экспортный хаб NBU-Export', 45.0, `$${Math.round(50 + p.textile * 400)}M экспорт`, 'NBU-Export + MFA'),
        strategyPick('Зелёная энергия', 28.0, `${Math.round(40 + p.infra * 120)} МВт ВИЭ`, 'УзЭнерго'),
        strategyPick('Социальная инфраструктура', 32.0, `+${Math.max(4, Math.round(popK * 0.06))} школ / садов`, 'Хокимият'),
      ],
    },
  ]

  return { brief, economic, infra, population, mahalla, opportunities, summary }
}

function buildTopMahallas(d, p, scale) {
  const names = d.kind === 'city'
    ? ['Марказий', 'Янги хаёт', 'Истиқлол', 'Бунёдкор', 'Дўстлик']
    : ['Турон', 'Олтинтоп', 'Янгиобод', 'Ғалаба', 'Бустон']
  return names.map((name, i) => ({
    name,
    loans: Math.max(4, Math.round((24 - i * 2) * scale)),
    score: parseFloat((9.0 - i * 0.3).toFixed(1)),
  }))
}

function buildStrengths(d, p) {
  const s = []
  if (d.kind === 'city') s.push(`Городская агломерация с населением ${d.population} тыс.`)
  if (p.textile >= 0.6) s.push('Исторический текстильный кластер')
  if (p.tourism >= 0.7) s.push('Высокий туристический потенциал')
  if (p.industry >= 40) s.push(`Промышленная база: ${p.industry}% ВРП`)
  if (p.agri >= 45) s.push(`Сильный аграрный сектор: ${p.agri}% ВРП`)
  s.push(`Рост ВРП: +${p.growth.toFixed(1)}% в год`)
  s.push(`Инвестиционный прилив: ×${(1.6 + p.growth * 0.15).toFixed(1)}`)
  if (p.infra >= 0.75) s.push('Зрелая инженерная инфраструктура')
  if (!p.enclave) s.push('Логистически связан с долиной')
  return s.slice(0, 7)
}

function buildWeaknesses(d, p, water, sewage) {
  const w = []
  if (water < 50) w.push(`Низкое водоснабжение — ${water}%`)
  if (sewage < 50) w.push(`Проблемы канализации — ${sewage}%`)
  if (p.infra < 0.6) w.push(`Инженерная сеть ниже нормы: ${Math.round(p.infra * 100)}%`)
  if (p.industry < 30) w.push('Слабая промышленная база')
  if (p.agri >= 55) w.push('Моноотраслевая аграрная зависимость')
  if (p.enclave) w.push('Анклавное положение — ограничения логистики')
  w.push('Устаревшее оборудование МСБ')
  w.push('Доля неформальной занятости')
  w.push('Низкие цифровые навыки')
  return w.slice(0, 8)
}

function buildOpportunities(d, p) {
  const o = []
  if (p.tourism >= 0.6) o.push('Расширение туристического хаба')
  if (p.textile >= 0.5) o.push('Smart-текстильный кластер')
  if (d.kind === 'city') o.push('Филиал IT-парка')
  o.push('Агропереработка и экспорт')
  o.push('Логистический коридор Ферганы')
  o.push('Проекты зелёной энергии')
  o.push('Диверсификация экспорта')
  return o.slice(0, 6)
}

function buildThreats(d, p) {
  const t = [
    { label: 'Изменение климата и дефицит воды', level: 'высокий' },
    { label: 'Глобальная рыночная конкуренция', level: 'средний' },
    { label: 'Рост цен на сырьё', level: 'средний' },
    { label: 'Миграция квалифицированных кадров', level: p.infra < 0.6 ? 'высокий' : 'средний' },
    { label: 'Внешние экономические шоки', level: 'средний' },
  ]
  if (p.enclave) t.push({ label: 'Геополитические ограничения анклава', level: 'высокий' })
  return t
}

function buildPlan(d, p, scale, water) {
  const plan = []
  if (water < 55) plan.push({ horizon: '0–6 месяцев', title: 'Водоканал-2026', mlrd: Math.round(12.8 * scale * 10) / 10, owner: 'Хокимият + NBU', kpi: `${water}% → 60%` })
  plan.push({ horizon: '6–12 месяцев', title: 'Энергоэффективность МСБ', mlrd: Math.round(8.6 * scale * 10) / 10, owner: 'NBU кредиты', kpi: 'Пик −12%' })
  if (p.textile >= 0.4 || d.kind === 'city') {
    plan.push({ horizon: '12–18 месяцев', title: 'Smart-текстильный кластер', mlrd: Math.round(24.0 * scale * 10) / 10, owner: 'IFC + NBU', kpi: 'Экспорт +35%' })
  } else {
    plan.push({ horizon: '12–18 месяцев', title: 'Агропереработка-хаб', mlrd: Math.round(18.0 * scale * 10) / 10, owner: 'Минсельхоз + NBU', kpi: 'Добавл. ст-ть +35%' })
  }
  if (d.kind === 'city') {
    plan.push({ horizon: '18–24 месяцев', title: 'IT-парк филиал', mlrd: Math.round(6.4 * scale * 10) / 10, owner: 'Минцифры', kpi: `${Math.round(1200 * scale)} раб. мест` })
  } else {
    plan.push({ horizon: '18–24 месяцев', title: 'Кооператив-МСБ', mlrd: Math.round(5.2 * scale * 10) / 10, owner: 'NBU + Хокимият', kpi: `${Math.round(600 * scale)} раб. мест` })
  }
  while (plan.length < 4) plan.unshift({ horizon: '0–6 месяцев', title: 'Базовая диагностика', mlrd: 1.0, owner: 'NBU', kpi: 'карта рисков' })
  return plan.slice(0, 4)
}

// Fergana-region aggregate: for the overview panel (no district selected).
export function buildFerganaOverview() {
  const keys = Object.keys(PROFILE)
  const totalPop = keys.reduce((s, k) => s + districtByKey[k].population, 0) // thousand
  const totalGrp = keys.reduce((s, k) => {
    const d = districtByKey[k]
    const p = PROFILE[k]
    return s + Math.round(BENCH_GRP * (d.population / BENCH_POP) * (p.growth / 8.0))
  }, 0)
  const weightedGrowth = keys.reduce((s, k) => s + PROFILE[k].growth * districtByKey[k].population, 0) / totalPop
  const weightedInfra = keys.reduce((s, k) => s + PROFILE[k].infra * districtByKey[k].population, 0) / totalPop
  const cities = keys.filter((k) => districtByKey[k].kind === 'city').length
  const districts = keys.filter((k) => districtByKey[k].kind === 'district').length
  const totalArea = keys.reduce((s, k) => s + districtByKey[k].area, 0)

  return {
    totalPopulationK: totalPop,
    totalPopulationAbs: Math.round(totalPop * 1000),
    totalGrpBln: totalGrp,
    avgGrowth: weightedGrowth,
    avgInfra: weightedInfra,
    cities,
    districts,
    totalArea,
    score: Math.min(9.4, 5.5 + weightedGrowth * 0.25 + weightedInfra * 2.0).toFixed(1),
  }
}
