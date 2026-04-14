// Rich per-region analytics data, derived from the main.html dashboard by @analytics_per_region.
// The template uses Marg'ilon (Ferghana) as the canonical shape. Per-region numbers scale
// from the base region data so the dashboard is populated for every oblast.

import { regions, national } from './regions'

const TEMPLATE_POPULATION = 661.0 // thousand — Marg'ilon benchmark
const TEMPLATE_GRP = 3616 // mlrd UZS

function parsePopulation(str) {
  const n = parseFloat(String(str).replace(',', '.'))
  return Number.isFinite(n) ? n * 1000 : TEMPLATE_POPULATION // mln → thousand
}
function parseExports(str) {
  const n = parseFloat(String(str).replace('$', '').replace(',', '.'))
  return Number.isFinite(n) ? n : 1.2
}
function parseGrowth(str) {
  const n = parseFloat(String(str).replace('%', '').replace(',', '.'))
  return Number.isFinite(n) ? n : 8.0
}
function fmt(n, d = 0) {
  if (!Number.isFinite(n)) return '—'
  return n.toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export function buildAnalytics(regionKey) {
  const r = regionKey && regions[regionKey] ? regions[regionKey] : null
  const pop = r ? parsePopulation(r.population) : 36800 // thousand
  const popScale = pop / TEMPLATE_POPULATION
  const grpGrowth = r ? parseGrowth(r.gdpGrowth) : parseGrowth(national.gdpGrowth)
  const expBil = r ? parseExports(r.exports) : parseExports(national.exports)
  const empl = (r ? r.employment : national.employment) || { employed: 85, selfEmployed: 60, education: 35 }
  const bars = (r ? r.bars : national.bars) || { industry: 80, agriculture: 65, services: 60 }
  const bank = (r ? r.bank : national.bank) || { credits: 78, newBusiness: 62, exporters: 52 }
  const mahallas = r ? r.mahallas : national.mahallas
  const districts = r ? r.districts : 14
  const area = r ? r.area : '—'

  const grpTotal = Math.round(TEMPLATE_GRP * popScale * (grpGrowth / 8.0))
  const industryBln = Math.round((grpTotal * (bars.industry / (bars.industry + bars.agriculture + bars.services))))
  const tradeBln = Math.round(grpTotal * 0.185)
  const servicesBln = Math.round(grpTotal * 0.297)
  const investBln = Math.round(883 * popScale * (grpGrowth / 8.0))
  const unemployment = Math.max(3.2, 6.5 - grpGrowth * 0.2).toFixed(1)
  const unemploymentStart = (parseFloat(unemployment) + 6.5).toFixed(1)

  const brief = {
    score: Math.min(9.4, 7.2 + grpGrowth * 0.12).toFixed(1),
    kpis: [
      { label: 'ВРП', value: fmt(grpTotal), unit: 'млрд сум', delta: `+${grpGrowth.toFixed(1)}%`, tone: 'green' },
      { label: 'Промышленность', value: fmt(industryBln), unit: 'млрд сум', delta: '+16.7%', tone: 'green' },
      { label: 'Инвестиции', value: fmt(investBln), unit: 'млрд сум', delta: `×${(2.0 + grpGrowth * 0.12).toFixed(1)}`, tone: 'green' },
      { label: 'Безработица', value: `${unemployment}%`, unit: '', delta: `−${(parseFloat(unemploymentStart) - parseFloat(unemployment)).toFixed(1)} п.п.`, tone: 'green' },
      { label: 'Население', value: fmt(Math.round(pop * 1000)), unit: 'чел.', delta: '+6.1%', tone: 'blue' },
      { label: 'Рейтинг устойчивости', value: Math.min(9.4, 7.2 + grpGrowth * 0.12).toFixed(1), unit: '/ 10', delta: 'сильный', tone: 'blue' },
    ],
  }

  const economic = {
    kpis: [
      { label: 'Охват бизнесом', value: `${Math.round(70 + bank.newBusiness * 0.2)}%`, sub: `${Math.round(mahallas * 0.65)} активных точек`, tone: 'green' },
      { label: 'Промышленность', value: `${fmt(industryBln)} млрд`, sub: 'сум, 2025', tone: 'blue' },
      { label: 'Розничная торговля', value: `${fmt(tradeBln)} млрд`, sub: 'сум, 2025', tone: 'blue' },
      { label: 'Услуги', value: `${fmt(servicesBln)} млрд`, sub: 'сум, 2025', tone: 'blue' },
    ],
    history: [2021, 2022, 2023, 2024, 2025].map((y, i) => {
      const factor = 0.55 + i * 0.12
      return {
        year: y,
        grp: Math.round(grpTotal * factor),
        industry: Math.round(industryBln * factor),
        invest: Math.round(investBln * factor * (i === 4 ? 2.6 : 1)),
      }
    }),
    sectors: [
      { name: 'Промышленность', percent: Math.min(55, 30 + bars.industry * 0.25).toFixed(1), color: '#003D7C' },
      { name: 'Услуги', percent: Math.min(40, 18 + bars.services * 0.2).toFixed(1), color: '#0054A6' },
      { name: 'Строительство', percent: '18.5', color: '#2563EB' },
      { name: 'Сельское хозяйство', percent: Math.min(20, 4 + bars.agriculture * 0.12).toFixed(1), color: '#059669' },
    ],
    trade: {
      importMln: Math.round(40 * popScale),
      exportMln: Math.round(11.4 * popScale * (grpGrowth / 8.0)),
      deficitMln: Math.round(-28.6 * popScale),
      exportGrowth: '+46.7%',
    },
    entities: {
      active: Math.round(866 * popScale),
      inactive: Math.round(336 * popScale),
      opened: Math.round(141 * popScale),
      closed: Math.round(338 * popScale),
      activeShare: 72,
      types: [
        { code: 'ИП', count: Math.round(817 * popScale), share: 60 },
        { code: 'ООО', count: Math.round(264 * popScale), share: 22 },
        { code: 'Фермер', count: Math.round(84 * popScale), share: 7 },
        { code: 'Прочее', count: Math.round(37 * popScale), share: 3 },
      ],
    },
    aiNote:
      'Малые предприятия массово закрываются (закрытых больше, чем открытых). NBU рекомендует расширить льготные кредиты до 200 млн сум на предпринимателей в промышленном секторе для стабилизации базы.',
  }

  const infra = {
    kpis: [
      { label: 'Электроэнергия', value: '100%', delta: 'покрытие', tone: 'green' },
      { label: 'Водоснабжение', value: '30.6%', delta: 'критично', tone: 'red' },
      { label: 'Газоснабжение', value: '89%', delta: 'стабильно', tone: 'green' },
      { label: 'Канализация', value: '44.8%', delta: 'ниже нормы', tone: 'amber' },
      { label: 'Транспорт', value: '80%', delta: 'в работе', tone: 'blue' },
    ],
    matrix: [
      { name: 'Электричество', status: 'ok', note: '100% — без перебоев' },
      { name: 'Питьевая вода', status: 'bad', note: '30.6% — модернизация' },
      { name: 'Газ', status: 'ok', note: '89% — работает' },
      { name: 'Канализация', status: 'warn', note: '44.8% — требуется' },
      { name: 'Дороги', status: 'warn', note: '49 км асфальта' },
      { name: 'Общественный транспорт', status: 'ok', note: '80% — обновлено' },
      { name: 'Цифровая сеть', status: 'warn', note: 'LTE 72%, 5G — план' },
    ],
    budgetMlrd: Math.round(46.3 * popScale * 10) / 10,
    roads: {
      totalKm: 160,
      asphaltKm: 49,
      gravelKm: 23,
      patchedKm: 42,
      earthKm: 46,
    },
    education: { schools: 11, schoolsPlanned: 3, kindergartens: 19, kindergartensPlanned: 30 },
    problems: [
      { code: 'M1', name: 'Реконструкция водопровода', cost: 12.8, priority: 'высокий' },
      { code: 'M2', name: 'Система канализации', cost: 8.4, priority: 'высокий' },
      { code: 'M3', name: 'Дорожная сеть', cost: 6.2, priority: 'средний' },
      { code: 'M4', name: 'Энергосистема', cost: 3.0, priority: 'средний' },
      { code: 'T1', name: 'Новые школы (3)', cost: 4.8, priority: 'высокий' },
      { code: 'T2', name: 'Детские сады (30)', cost: 2.2, priority: 'средний' },
      { code: 'T3', name: 'Цифровая сеть 5G', cost: 1.5, priority: 'низкий' },
      { code: 'T4', name: 'Зелёная энергия', cost: 1.5, priority: 'низкий' },
    ],
    aiNote:
      'Критический разрыв: электросеть на 100%, но вода на 30,6%. Рекомендуем ГЧП-проект «Водоканал-2026» на 12,8 млрд сум — окупаемость 7 лет, прямое влияние на здоровье и промышленность.',
  }

  const population = {
    kpis: [
      { label: 'Население', value: fmt(Math.round(pop * 1000)), delta: '+6.1%', sub: '<18 лет: 33.4%', tone: 'blue' },
      { label: 'Площадь', value: area, delta: '—', sub: `Плотность: ${Math.round((pop * 1000) / 20).toLocaleString('ru-RU')}/км²`, tone: 'blue' },
      { label: 'Эконом. активные', value: fmt(Math.round(29811 * popScale)), delta: `+${fmt(Math.round(5745 * popScale))}`, sub: 'с 2021 г.', tone: 'green' },
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
      formal: Math.round(row.formal * popScale),
      informal: Math.round(row.informal * popScale),
      abroad: Math.round(row.abroad * popScale),
      unemployed: Math.round(row.unemployed * popScale),
    })),
    unemploymentTrend: [
      { year: 2021, value: parseFloat(unemploymentStart) },
      { year: 2022, value: parseFloat(unemploymentStart) - 2.0 },
      { year: 2023, value: parseFloat(unemploymentStart) - 3.7 },
      { year: 2024, value: parseFloat(unemploymentStart) - 5.2 },
      { year: 2025, value: parseFloat(unemployment) },
    ],
    migration: {
      countAbroad: Math.round(6812 * popScale),
      growthPct: '+52%',
      shareOfWorkforce: '19.2%',
      totalEmployed: Math.round(29811 * popScale),
      warning: 'Безработица падает, но миграция растёт в 1.5×: локальные зарплаты не удерживают кадры.',
    },
    program2026: {
      title: 'Программа занятости 2026',
      goal: Math.round(2500 * popScale),
      breakdown: [
        { code: 'P1', label: 'Обучение ремеслам', count: Math.round(800 * popScale) },
        { code: 'P2', label: 'Субсидии на старт', count: Math.round(620 * popScale) },
        { code: 'P3', label: 'Трудоустройство в сфере', count: Math.round(580 * popScale) },
        { code: 'P4', label: 'Экспортные кластеры', count: Math.round(500 * popScale) },
      ],
    },
  }

  const mahalla = {
    kpis: [
      { label: 'Махалли', value: mahallas.toLocaleString('ru-RU'), sub: `${districts} районов`, tone: 'blue' },
      { label: 'Кредитный охват', value: `${bank.credits}%`, sub: 'МСБ в регионе', tone: 'green' },
      { label: 'Новые ИП', value: `${bank.newBusiness}%`, sub: 'квартальный рост', tone: 'green' },
      { label: 'Цифровизация', value: `${Math.round(bank.credits * 0.65)}%`, sub: 'онлайн-банкинг', tone: 'blue' },
    ],
    bankMetrics: [
      { label: 'Выданные кредиты МСБ', percent: bank.credits, color: 'bg-primary' },
      { label: 'Новые предприниматели', percent: bank.newBusiness, color: 'bg-primary-container' },
      { label: 'Экспортёры', percent: bank.exporters, color: 'bg-secondary' },
      { label: 'Трудоустроены', percent: empl.employed, color: 'bg-tertiary' },
      { label: 'Самозанятые', percent: empl.selfEmployed, color: 'bg-tertiary opacity-60' },
      { label: 'Проф. обучение', percent: empl.education, color: 'bg-primary opacity-60' },
    ],
    topMahallas: [
      { name: 'Олтиариқ', loans: Math.round(24 * popScale), score: 8.8 },
      { name: 'Беш-терак', loans: Math.round(19 * popScale), score: 8.4 },
      { name: 'Янги Марғилон', loans: Math.round(17 * popScale), score: 8.1 },
      { name: 'Турон', loans: Math.round(15 * popScale), score: 7.9 },
      { name: 'Фарғона йўли', loans: Math.round(14 * popScale), score: 7.6 },
    ],
    digitalAdoption: {
      payments: 72,
      cards: 58,
      merchants: 46,
      lending: 34,
    },
  }

  const opportunities = {
    swot: {
      strengths: [
        'Исторический центр текстиля',
        `Стабильный рост промышленности: +${Math.round(grpGrowth * 9)}%`,
        `Инвестиции в 2025 г.: +${Math.round(grpGrowth * 20)}%`,
        'Удобное логистическое положение',
        'Квалифицированная рабочая сила',
        `Устойчивый рост занятости: +${Math.round(grpGrowth * 3)}%`,
        'Экспорт в тренде роста: +46.7%',
      ],
      weaknesses: [
        'Низкое водоснабжение — 30.6%',
        'Проблемы канализации — 44.8%',
        'Дефицит энергии пиковых часов — 47%',
        'Устаревшее промышленное оборудование',
        'Ограниченные земельные ресурсы',
        'Доля неформальной занятости',
        'Низкие цифровые навыки',
        'Узкая номенклатура экспорта',
      ],
      opportunities: [
        'Рост туристического потенциала',
        'Создание smart-текстильного кластера',
        'Расширение логистического хаба',
        'Филиал IT-парка',
        'Диверсификация экспорта',
        'Проекты зелёной энергии',
      ],
      threats: [
        { label: 'Изменение климата и дефицит воды', level: 'высокий' },
        { label: 'Глобальная рыночная конкуренция', level: 'средний' },
        { label: 'Рост цен на сырьё', level: 'средний' },
        { label: 'Миграция квалифицированных кадров', level: 'высокий' },
        { label: 'Внешние экономические шоки', level: 'средний' },
      ],
    },
    aiRecommendation:
      'SWOT-анализ показывает критический разрыв между квалификацией кадров (Сила) и стабильностью энергии (Слабость). Приоритизируйте кредиты «Энергоэффективность» — это стабилизирует промышленную базу до расширения новых хабов.',
  }

  const summary = {
    score: brief.score,
    radar: [
      { axis: 'Экономика', value: Math.min(9.5, 6.5 + grpGrowth * 0.3).toFixed(1), provincial: 7.0 },
      { axis: 'Инфраструктура', value: 6.5, provincial: 7.2 },
      { axis: 'Занятость', value: Math.min(9.0, 6.0 + grpGrowth * 0.2).toFixed(1), provincial: 7.0 },
      { axis: 'Демография', value: 7.0, provincial: 7.0 },
      { axis: 'Инвестиции', value: Math.min(9.2, 6.2 + grpGrowth * 0.28).toFixed(1), provincial: 6.8 },
    ],
    comparison: [
      { metric: 'Промышленность (тыс. сум/душу)', region: Math.round(23847 * (bars.industry / 80)), provincial: 28914 },
      { metric: 'Услуги (тыс. сум/душу)', region: Math.round(16218 * (bars.services / 60)), provincial: 14120 },
      { metric: 'Торговля (тыс. сум/душу)', region: Math.round(10092 * (bars.services / 60)), provincial: 9380 },
      { metric: 'Инвестиции (тыс. сум/душу)', region: Math.round(13344 * (grpGrowth / 8.0)), provincial: 9910 },
      { metric: 'Экспорт ($/душу)', region: Math.round((expBil * 1000) * popScale / pop * 1000000), provincial: 28 },
    ],
    plan: [
      { horizon: '0–6 месяцев', title: 'Водоканал-2026', mlrd: 12.8, owner: 'Хокимият + NBU', kpi: '30.6% → 55%' },
      { horizon: '6–12 месяцев', title: 'Энергоэффективность МСБ', mlrd: 8.6, owner: 'NBU кредиты', kpi: 'Пик −12%' },
      { horizon: '12–18 месяцев', title: 'Smart-текстильный кластер', mlrd: 24.0, owner: 'IFC + NBU', kpi: 'Экспорт +35%' },
      { horizon: '18–24 месяцев', title: 'IT-парк филиал', mlrd: 6.4, owner: 'Минцифры', kpi: '1200 раб. мест' },
    ],
    conclusion: `Регион демонстрирует сильные экономические и инвестиционные показатели, опережая средний по области. Главный приоритет — ликвидация инфраструктурного разрыва (вода, энергия), что разблокирует промышленный рост 2026–2027 гг.`,
  }

  return { brief, economic, infra, population, mahalla, opportunities, summary }
}
