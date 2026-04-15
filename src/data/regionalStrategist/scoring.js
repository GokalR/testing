// Прозрачная скоринговая модель для Regional Strategist.
// Чистая функция — вход (profile, finance, city), выход:
//   {
//     total: 0..100,
//     verdict: 'good' | 'fair' | 'weak',
//     factors: [{ key, label{ru,uz}, value 0..100, weight 0..1,
//                 contribution: value*weight, inputs: [{label, value, impact}], hint }]
//   }
//
// Цель: пользователь может открыть любой фактор и увидеть, какие его ответы
// повлияли и как. Никакой магии.

import { CITIES } from './cities'

// ── helpers ────────────────────────────────────────────────────────────────
const n = (v) => {
  const x = Number(String(v ?? '').replace(/[^\d.-]/g, ''))
  return Number.isFinite(x) ? x : 0
}
const has = (v) => {
  if (v === undefined || v === null) return false
  const s = String(v).trim().toLowerCase()
  return s && !['', 'нет', 'йўқ', 'no', '0', 'false', '—'].includes(s)
}
const isYes = (v) => /^(да|ҳа|yes|true|1)$/i.test(String(v ?? '').trim())

// Возвращает «мягкий» процент прироста от 0 до max при value в [0, cap].
const ramp = (value, cap, max) => Math.min(max, (Math.max(0, value) / cap) * max)

// ── фактор: опыт предпринимателя ───────────────────────────────────────────
function factorExperience(profile) {
  const inputs = []
  let v = 30 // базовая планка

  const exp = String(profile.experienceLevel || '').toLowerCase()
  if (/10\+|более 10/.test(exp)) { v += 35; inputs.push({ label: 'experienceLevel', value: profile.experienceLevel, impact: +35 }) }
  else if (/5–10|5-10|5 до 10/.test(exp)) { v += 25; inputs.push({ label: 'experienceLevel', value: profile.experienceLevel, impact: +25 }) }
  else if (/3–5|3-5|3 до 5/.test(exp)) { v += 18; inputs.push({ label: 'experienceLevel', value: profile.experienceLevel, impact: +18 }) }
  else if (/1–3|1-3|1 до 3/.test(exp)) { v += 10; inputs.push({ label: 'experienceLevel', value: profile.experienceLevel, impact: +10 }) }
  else if (has(exp)) { v += 3; inputs.push({ label: 'experienceLevel', value: profile.experienceLevel, impact: +3 }) }
  else { inputs.push({ label: 'experienceLevel', value: '—', impact: 0 }) }

  if (isYes(profile.domainExperience)) { v += 15; inputs.push({ label: 'domainExperience', value: profile.domainExperience, impact: +15 }) }
  else if (has(profile.domainExperience)) inputs.push({ label: 'domainExperience', value: profile.domainExperience, impact: 0 })

  if (isYes(profile.hasHigherEducation)) { v += 8; inputs.push({ label: 'hasHigherEducation', value: profile.hasHigherEducation, impact: +8 }) }
  if (has(profile.educationField)) { v += 4; inputs.push({ label: 'educationField', value: profile.educationField, impact: +4 }) }
  if (isYes(profile.hasTraining)) { v += 5; inputs.push({ label: 'hasTraining', value: profile.hasTraining, impact: +5 }) }
  if (isYes(profile.hasMentor)) { v += 5; inputs.push({ label: 'hasMentor', value: profile.hasMentor, impact: +5 }) }

  return {
    key: 'experience',
    label: { ru: 'Опыт предпринимателя', uz: 'Тадбиркор тажрибаси' },
    value: Math.max(0, Math.min(100, Math.round(v))),
    inputs,
    hint: {
      ru: 'Учитываем стаж, опыт в отрасли, образование, обучение и наличие ментора.',
      uz: 'Тажриба, соҳадаги иш, таълим, ўқитиш ва ментор мавжудлигини ҳисобга оламиз.',
    },
  }
}

// ── фактор: финансовая устойчивость ────────────────────────────────────────
function factorFinance(finance) {
  const inputs = []
  let v = 30

  const income = n(finance.monthlyIncome)
  const expenses = n(finance.monthlyExpenses)
  const debt = n(finance.existingDebt)
  const loan = n(finance.loanAmount)
  const ownFunds = n(finance.hasOwnFunds)

  if (income > 0 && expenses >= 0) {
    const margin = income - expenses
    if (margin > 0) {
      const pct = margin / income
      const bonus = Math.round(ramp(pct, 0.5, 25))
      v += bonus
      inputs.push({ label: 'monthlyIncome − monthlyExpenses', value: `${margin.toLocaleString('ru-RU')} сум/мес (маржа ${Math.round(pct * 100)}%)`, impact: +bonus })
    } else {
      v -= 15
      inputs.push({ label: 'monthlyIncome − monthlyExpenses', value: `${margin.toLocaleString('ru-RU')} сум/мес (убыток)`, impact: -15 })
    }
  } else {
    inputs.push({ label: 'monthlyIncome / monthlyExpenses', value: '—', impact: 0 })
  }

  if (ownFunds > 0 && loan > 0) {
    const share = ownFunds / (ownFunds + loan)
    const bonus = Math.round(ramp(share, 0.5, 20))
    v += bonus
    inputs.push({ label: 'hasOwnFunds ÷ (own + loan)', value: `${Math.round(share * 100)}% собственных средств`, impact: +bonus })
  } else if (ownFunds > 0) {
    v += 10
    inputs.push({ label: 'hasOwnFunds', value: ownFunds.toLocaleString('ru-RU'), impact: +10 })
  } else {
    inputs.push({ label: 'hasOwnFunds', value: '—', impact: 0 })
  }

  if (isYes(finance.hasCollateral)) {
    v += 10
    inputs.push({ label: 'hasCollateral', value: finance.collateralType || 'да', impact: +10 })
  } else {
    inputs.push({ label: 'hasCollateral', value: 'нет', impact: 0 })
  }

  if (debt > 0 && income > 0) {
    const ratio = debt / (income * 12)
    if (ratio > 0.4) {
      v -= 15
      inputs.push({ label: 'existingDebt ÷ годовой доход', value: `${Math.round(ratio * 100)}% — высокая нагрузка`, impact: -15 })
    } else if (ratio > 0.2) {
      v -= 5
      inputs.push({ label: 'existingDebt ÷ годовой доход', value: `${Math.round(ratio * 100)}%`, impact: -5 })
    }
  }

  return {
    key: 'finance',
    label: { ru: 'Финансовая устойчивость', uz: 'Молиявий барқарорлик' },
    value: Math.max(0, Math.min(100, Math.round(v))),
    inputs,
    hint: {
      ru: 'Маржа дохода, доля собственных средств, наличие залога и текущая долговая нагрузка.',
      uz: 'Даромад маржаси, ўз маблағлари улуши, гаров мавжудлиги ва ҳозирги қарз юки.',
    },
  }
}

// ── фактор: рыночный потенциал ─────────────────────────────────────────────
function factorMarket(finance, city) {
  const inputs = []
  let v = 50

  const direction = String(finance.businessDirection || '').toLowerCase()
  if (!city) {
    inputs.push({ label: 'city', value: '—', impact: 0 })
    return {
      key: 'market',
      label: { ru: 'Рыночный потенциал', uz: 'Бозор потенциали' },
      value: 50, inputs,
      hint: { ru: 'Город не определён — невозможно оценить соответствие отрасли.', uz: 'Шаҳар аниқланмаган.' },
    }
  }

  const sectors = city.recommendedSectors || []
  const match = sectors.some((s) => direction.includes(s) || s.includes(direction.slice(0, 4)))
  const textile = /текстил|ткан|атлас|шёлк|тўқим/.test(direction)
  const food = /пищев|еда|ресторан|кафе|food|озиқ/.test(direction)
  const services = /услуг|сервис|салон|туризм|education|образование|таълим/.test(direction)

  if (match) { v += 20; inputs.push({ label: 'businessDirection ↔ city.recommendedSectors', value: `совпадает (${finance.businessDirection})`, impact: +20 }) }
  else if (direction) { v -= 5; inputs.push({ label: 'businessDirection', value: finance.businessDirection, impact: -5 }) }
  else { inputs.push({ label: 'businessDirection', value: '—', impact: 0 }) }

  // Margilan-specific boosts: export-oriented textiles and tourism are the growth drivers
  if (city.id === 'margilan') {
    if (textile) { v += 12; inputs.push({ label: 'direction=textile × Margilan export +202%', value: 'атлас/трикотаж — экспортный рост', impact: +12 }) }
    if (services) { v += 8; inputs.push({ label: 'direction=services × Margilan tourism 380K/год', value: 'туризм и услуги — растущий сектор (+107%)', impact: +8 }) }
  }
  // Fergana: industrial hubs (textiles, chemicals, food)
  if (city.id === 'fergana') {
    if (textile || food) { v += 8; inputs.push({ label: 'direction × Fergana industrial base 45.9 трлн', value: 'текстиль/пищёвка — крупнейшие кластеры', impact: +8 }) }
  }

  return {
    key: 'market',
    label: { ru: 'Рыночный потенциал', uz: 'Бозор потенциали' },
    value: Math.max(0, Math.min(100, Math.round(v))),
    inputs,
    hint: {
      ru: 'Соответствие вашего направления рекомендованным отраслям города и отраслевым трендам.',
      uz: 'Йўналишингизнинг шаҳар тавсия этилган соҳалари ва соҳа трендларига мослиги.',
    },
  }
}

// ── фактор: локация ────────────────────────────────────────────────────────
function factorLocation(profile, city) {
  const inputs = []
  let v = 40

  if (city) {
    v += 25
    inputs.push({ label: 'viloyat/hudud', value: `${profile.viloyat || ''} ${profile.hudud || ''}`.trim() || city.name.ru, impact: +25 })
  } else {
    inputs.push({ label: 'viloyat/hudud', value: '—', impact: 0 })
  }

  if (profile.urbanRural === 'Город' || /шаҳар|urban/i.test(profile.urbanRural || '')) {
    v += 15
    inputs.push({ label: 'urbanRural', value: profile.urbanRural, impact: +15 })
  } else if (has(profile.urbanRural)) {
    v += 5
    inputs.push({ label: 'urbanRural', value: profile.urbanRural, impact: +5 })
  }

  if (has(profile.mahalla)) {
    v += 8
    inputs.push({ label: 'mahalla', value: profile.mahalla, impact: +8 })
  }

  return {
    key: 'location',
    label: { ru: 'Локация', uz: 'Жойлашув' },
    value: Math.max(0, Math.min(100, Math.round(v))),
    inputs,
    hint: {
      ru: 'Пилотные города (Фергана, Маргилан) дают полный анализ. Городские локации — выше плотность рынка.',
      uz: 'Пилот шаҳарларда (Фарғона, Марғилон) тўлиқ таҳлил. Шаҳар жойлашувларида — бозор зичлиги юқори.',
    },
  }
}

// ── фактор: конкуренция ────────────────────────────────────────────────────
function factorCompetition(finance, city) {
  const inputs = []
  let v = 65 // нейтрально-оптимистичная база

  if (!city) return {
    key: 'competition',
    label: { ru: 'Конкуренция', uz: 'Рақобат' },
    value: 60, inputs,
    hint: { ru: 'Нужен город для анализа насыщенности.', uz: 'Таҳлил учун шаҳар керак.' },
  }

  const direction = String(finance.businessDirection || '').toLowerCase()
  const isRetail = /розниц|магазин|торгов|чакана/.test(direction)
  const isFood = /пищев|еда|ресторан|кафе|food|озиқ/.test(direction)
  const isTextile = /текстил|ткан|атлас|тўқим/.test(direction)

  if (city.id === 'margilan') {
    if (isRetail) { v -= 25; inputs.push({ label: 'retail × Margilan: 38.2% экономики + 43% ИП в приостановке', value: 'перенасыщено', impact: -25 }) }
    if (isFood) { v -= 8; inputs.push({ label: 'food × Margilan: 562 активных предприятий', value: 'плотный рынок', impact: -8 }) }
    if (isTextile) { v += 5; inputs.push({ label: 'textile × Margilan: экспортный рост', value: 'ниша есть', impact: +5 }) }
  }
  if (city.id === 'fergana') {
    if (isRetail) { v -= 10; inputs.push({ label: 'retail × Fergana area province', value: 'плотный рынок', impact: -10 }) }
  }

  if (!inputs.length) inputs.push({ label: 'businessDirection × city', value: finance.businessDirection || '—', impact: 0 })

  return {
    key: 'competition',
    label: { ru: 'Конкуренция', uz: 'Рақобат' },
    value: Math.max(0, Math.min(100, Math.round(v))),
    inputs,
    hint: {
      ru: 'Оценка насыщенности вашей отрасли в выбранном городе на основе данных дашбордов.',
      uz: 'Танланган шаҳарда соҳангиз тўйинганлиги — дашборд маълумотлари асосида.',
    },
  }
}

// ── фактор: бизнес-модель ──────────────────────────────────────────────────
function factorBusinessModel(finance) {
  const inputs = []
  let v = 35

  if (isYes(finance.hasBusinessPlan)) { v += 20; inputs.push({ label: 'hasBusinessPlan', value: 'да', impact: +20 }) }
  else { inputs.push({ label: 'hasBusinessPlan', value: 'нет', impact: 0 }) }

  const ideaLen = String(finance.ideaDescription || '').trim().length
  if (ideaLen > 200) { v += 15; inputs.push({ label: 'ideaDescription (длина)', value: `${ideaLen} симв.`, impact: +15 }) }
  else if (ideaLen > 80) { v += 8; inputs.push({ label: 'ideaDescription (длина)', value: `${ideaLen} симв.`, impact: +8 }) }
  else if (ideaLen > 0) { v += 3; inputs.push({ label: 'ideaDescription (длина)', value: `${ideaLen} симв.`, impact: +3 }) }
  else inputs.push({ label: 'ideaDescription', value: '—', impact: 0 })

  if (has(finance.targetCustomer)) { v += 10; inputs.push({ label: 'targetCustomer', value: finance.targetCustomer, impact: +10 }) }
  if (has(finance.whyThisBusiness)) { v += 7; inputs.push({ label: 'whyThisBusiness', value: 'заполнено', impact: +7 }) }
  if (has(finance.timeline)) { v += 5; inputs.push({ label: 'timeline', value: finance.timeline, impact: +5 }) }
  if (isYes(finance.hasSpace)) { v += 4; inputs.push({ label: 'hasSpace', value: 'да', impact: +4 }) }
  if (isYes(finance.hasEquipment)) { v += 4; inputs.push({ label: 'hasEquipment', value: 'да', impact: +4 }) }

  return {
    key: 'model',
    label: { ru: 'Бизнес-модель', uz: 'Бизнес-модель' },
    value: Math.max(0, Math.min(100, Math.round(v))),
    inputs,
    hint: {
      ru: 'Проработанность идеи: план, описание, целевой клиент, сроки, ресурсы.',
      uz: 'Ғоянинг пишиклиги: режа, тавсиф, мақсадли мижоз, муддатлар, ресурслар.',
    },
  }
}

// ── Веса (должны в сумме давать 1.0) ───────────────────────────────────────
const WEIGHTS = {
  experience: 0.18,
  finance: 0.22,
  market: 0.18,
  location: 0.14,
  competition: 0.14,
  model: 0.14,
}

export function computeScore(profile = {}, finance = {}, cityId = null) {
  const city = cityId ? CITIES[cityId] ?? null : null

  const factors = [
    factorExperience(profile),
    factorFinance(finance),
    factorMarket(finance, city),
    factorLocation(profile, city),
    factorCompetition(finance, city),
    factorBusinessModel(finance),
  ].map((f) => ({
    ...f,
    weight: WEIGHTS[f.key],
    contribution: Math.round(f.value * WEIGHTS[f.key] * 10) / 10,
  }))

  const total = Math.round(factors.reduce((acc, f) => acc + f.value * f.weight, 0))
  const verdict = total >= 70 ? 'good' : total >= 50 ? 'fair' : 'weak'

  return { total, verdict, factors }
}
