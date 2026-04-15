<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRsLang } from '@/composables/useRsLang'
import { useRegionalStrategistStore } from '@/stores/regionalStrategist'
import RsStatusTag from '@/components/regionalStrategist/RsStatusTag.vue'
import RsInsightBox from '@/components/regionalStrategist/RsInsightBox.vue'
import RsIcon from '@/components/regionalStrategist/RsIcon.vue'
import RsMargilanHeatmap from '@/components/regionalStrategist/RsMargilanHeatmap.vue'
import RsInputSummary from '@/components/regionalStrategist/RsInputSummary.vue'
import RsScoreBreakdown from '@/components/regionalStrategist/RsScoreBreakdown.vue'
import RsClaudeAnalysis from '@/components/regionalStrategist/RsClaudeAnalysis.vue'
import { STEP5_T } from './rs-step5-i18n'
import { CITIES } from '@/data/regionalStrategist/cities'
import { matchCreditProducts, collateralLabel } from '@/data/regionalStrategist/credit-products'
import { computeScore } from '@/data/regionalStrategist/scoring'
import { rsApi } from '@/services/rsApi'
import { generateLocalAnalysisAsync } from '@/services/rsLocalAnalysis'
import { onMounted } from 'vue'

const emit = defineEmits(['restart'])
const { lang } = useRsLang()
const t = computed(() => STEP5_T[lang.value])

const store = useRegionalStrategistStore()
const { profile, finance, submissionId, uploads, analysis, analysisStatus } = storeToRefs(store)

// Detect pilot city from the user's profile answers. Only Fergana + Margilan
// have real data; everything else shows a "data not yet available" state.
const resolvedCityId = computed(() => {
  const h = [profile.value.hudud, profile.value.viloyat, profile.value.mahalla].join(' ').toLowerCase()
  if (/marg|марғ|марг/.test(h)) return 'margilan'
  if (/farg|фарғ|ферг|фарг/.test(h)) return 'fergana'
  return null
})
const isPilotCity = computed(() => resolvedCityId.value !== null)
const selectedCity = computed(() => (resolvedCityId.value ? CITIES[resolvedCityId.value] : CITIES.fergana))
const isMargilan = computed(() => resolvedCityId.value === 'margilan')

// Label the user's own region (what they picked), regardless of pilot status.
const userPickedLabel = computed(() => {
  const h = (profile.value.hudud || '').trim()
  const v = (profile.value.viloyat || '').trim()
  return h || v || (isPilotCity.value ? selectedCity.value.name[lang.value] : '')
})
const isCityDataReal = computed(() => {
  if (!isPilotCity.value) return false
  if (isMargilan.value) return true
  const h = (profile.value.hudud || '').toLowerCase()
  return !h
})

// Pick the most recent upload with computed ratios/absolutes (from backend parse).
const extractedFinancials = computed(() => {
  const ups = [...(uploads.value || [])].sort((a, b) => {
    const ta = new Date(a.created_at || 0).getTime()
    const tb = new Date(b.created_at || 0).getTime()
    return tb - ta
  })
  for (const u of ups) {
    const c = u?.parsed?.computed
    if (c && (c.ratios || c.absolutes)) {
      return { ratios: c.ratios || {}, absolutes: c.absolutes || {} }
    }
  }
  return null
})

const formatPct = (v) => (v == null || isNaN(v) ? '—' : `${(v * 100).toFixed(1)}%`)
const formatRatio = (v) => (v == null || isNaN(v) ? '—' : Number(v).toFixed(2))
const formatUzs = (v) => {
  if (v == null || isNaN(v)) return '—'
  const n = Number(v)
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)} ${lang.value === 'uz' ? 'млрд' : 'млрд'}`
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} ${lang.value === 'uz' ? 'млн' : 'млн'}`
  return n.toLocaleString('ru-RU')
}

const financialMetrics = computed(() => {
  const f = extractedFinancials.value
  if (!f) return []
  const r = f.ratios || {}
  const a = f.absolutes || {}
  const L = lang.value
  return [
    { key: 'revenue',      label: L === 'uz' ? 'Тушум'            : 'Выручка',             value: formatUzs(a.revenue),      kind: 'abs' },
    { key: 'netProfit',    label: L === 'uz' ? 'Соф фойда'         : 'Чистая прибыль',      value: formatUzs(a.netProfit),    kind: 'abs' },
    { key: 'grossMargin',  label: L === 'uz' ? 'Ялпи маржа'        : 'Валовая маржа',       value: formatPct(r.grossMargin),  kind: 'pct' },
    { key: 'netMargin',    label: L === 'uz' ? 'Соф маржа'         : 'Чистая маржа',        value: formatPct(r.netMargin),    kind: 'pct' },
    { key: 'roa',          label: 'ROA',                                                    value: formatPct(r.roa),          kind: 'pct' },
    { key: 'roe',          label: 'ROE',                                                    value: formatPct(r.roe),          kind: 'pct' },
    { key: 'currentRatio', label: L === 'uz' ? 'Жорий ликвидлик'   : 'Текущ. ликвидность',  value: formatRatio(r.currentRatio), kind: 'ratio' },
    { key: 'debtToEquity', label: L === 'uz' ? 'Қарз/капитал'      : 'Долг/капитал',        value: formatRatio(r.debtToEquity), kind: 'ratio' },
  ].filter((m) => m.value !== '—')
})

// On arrival at results: run real backend analysis if configured,
// else fall back to the local deterministic generator.
onMounted(async () => {
  if (analysis.value || analysisStatus.value === 'analyzing') return

  if (rsApi.isConfigured()) {
    store.setAnalysisStatus('analyzing')

    // Ensure submission exists (Step 2 uploads may have already created one).
    if (!submissionId.value) {
      const created = await rsApi.createSubmission({
        profile: profile.value,
        finance: finance.value,
        city_id: resolvedCityId.value,
        lang: lang.value,
      })
      if (!created.ok) {
        store.setAnalysisStatus('error', created.error || 'Submission creation failed')
        return
      }
      store.setSubmission(created.data.id)
    }

    const res = await rsApi.runAnalysis(submissionId.value, { lang: lang.value })
    if (res.ok) {
      store.setAnalysis(res.data)
    } else {
      store.setAnalysisStatus('error', res.error || 'Analysis failed')
    }
    return
  }

  // Demo mode — local generator.
  store.setAnalysisStatus('analyzing')
  const result = await generateLocalAnalysisAsync({
    profile: profile.value,
    finance: finance.value,
    cityId: resolvedCityId.value,
    uploads: uploads.value,
    lang: lang.value,
  })
  store.setAnalysis(result)
})

// Map finance inputs to matcher arguments.
const matcherInputs = computed(() => {
  const amt = Number(String(finance.value.loanAmount || '').replace(/[^\d]/g, '')) || 0
  const collMap = {
    'Недвижимость': 'realEstate',
    'Автотранспорт': 'vehicle',
    'Страховой полис': 'insurance',
    'Недвижимость + автотранспорт': 'realEstate',
  }
  const coll = collMap[finance.value.collateralType] || (finance.value.hasCollateral === 'Да' ? 'realEstate' : null)
  const purposeMap = {
    'Оборотные средства': 'working',
    'Основные средства': 'fixed',
    'Покупка автотранспорта': 'vehicle',
    'Покупка недвижимости': 'realEstate',
  }
  const purpose = purposeMap[finance.value.businessGoal] || 'any'
  const entity = /ИП|ЯТТ/i.test(profile.value.entityType || '') ? 'IP' : 'LLC'
  const firstTime = profile.value.businessAge === '' || /нет|йўқ|менее/i.test(profile.value.businessAge || '')
  return { loanAmount: amt, collateral: coll, purpose, entityType: entity, firstTime, lang: lang.value }
})

const matchedProducts = computed(() => matchCreditProducts(matcherInputs.value).slice(0, 4))
const primaryMatch = computed(() => matchedProducts.value[0])
const altMatches = computed(() => matchedProducts.value.slice(1))

const formatProductCollateral = (p) =>
  p.collateral.map((c) => collateralLabel(c, lang.value)).join(' · ')

/* ── Live score from user data ────────────────────── */
const scoreResult = computed(() => computeScore(profile.value, finance.value, selectedCity.value.id))
const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const scoreOffset = computed(() => CIRCUMFERENCE - (scoreResult.value.total / 100) * CIRCUMFERENCE)
const scoreColor = computed(() =>
  scoreResult.value.total >= 70 ? '#16a34a' : scoreResult.value.total >= 50 ? '#d97706' : '#dc2626',
)
const verdictLabel = computed(() => {
  const map = {
    good: { ru: 'Хороший потенциал', uz: 'Яхши потенциал', cls: 'text-emerald-600 bg-emerald-50' },
    fair: { ru: 'Средний потенциал', uz: 'Ўрта потенциал', cls: 'text-amber-600 bg-amber-50' },
    weak: { ru: 'Требует доработки', uz: 'Такомиллаштириш керак', cls: 'text-red-600 bg-red-50' },
  }
  return map[scoreResult.value.verdict]
})

/* ── SWOT colour map (inlined, was SWOTCard) ──────── */
const SWOT_STYLES = {
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', title: 'text-emerald-700', dot: 'bg-emerald-500' },
  red:     { bg: 'bg-red-50',     border: 'border-red-200',     title: 'text-red-700',     dot: 'bg-red-400' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    title: 'text-blue-700',    dot: 'bg-blue-500' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-200',   title: 'text-amber-700',   dot: 'bg-amber-500' },
}

const swotQuadrants = computed(() => [
  { title: t.value.swotStrengths,     color: 'emerald', items: t.value.SWOT.strengths },
  { title: t.value.swotWeaknesses,    color: 'red',     items: t.value.SWOT.weaknesses },
  { title: t.value.swotOpportunities, color: 'blue',    items: t.value.SWOT.opportunities },
  { title: t.value.swotThreats,       color: 'amber',   items: t.value.SWOT.threats },
])

/* ── Action step circle colour ────────────────────── */
const stepCircleClass = (i, total) => {
  if (i < 2) return 'bg-gold-500'
  if (i >= 6) return 'bg-emerald-500'
  return 'bg-navy-900'
}

const onDownload = () => {
  // eslint-disable-next-line no-alert
  alert(t.value.downloadAlert)
}
</script>

<template>
  <div class="animate-rs-fade-in-up space-y-8">
    <!-- Restart link -->
    <button
      type="button"
      @click="emit('restart')"
      class="font-sans text-[14px] font-medium text-navy-700 hover:bg-navy-900/[0.04] rounded-[8px] py-2 px-3 transition-colors duration-150"
    >
      {{ t.restartBtn }}
    </button>

    <!-- ═══ 0 — YOUR INPUTS (transparency) ═══ -->
    <section class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div class="px-8 py-6"
           style="background: rgba(215,181,109,0.04); border-bottom: 1px solid rgba(215,181,109,0.12);">
        <div class="flex items-center gap-4">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gold-500 shrink-0">
            <RsIcon name="file-check" :size="16" class="text-white" />
          </span>
          <div>
            <h2 class="font-sans text-[20px] font-bold text-carbon">
              {{ lang === 'uz' ? 'Сиз киритган маълумотлар' : 'Ваши данные' }}
            </h2>
            <p class="font-sans text-[13px] text-gray-600 mt-1">
              {{ lang === 'uz' ? 'Тавсия ва балл шу маълумотлар асосида ҳисобланган' : 'Рекомендация и балл рассчитаны по этим ответам' }}
            </p>
          </div>
        </div>
      </div>
      <div class="px-8 py-7 space-y-6">
        <RsInputSummary :profile="profile" :finance="finance" :lang="lang" />

        <!-- Financial metrics extracted from Excel (backend parse) -->
        <div v-if="financialMetrics.length" class="border-t border-rs-border pt-6">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div>
              <div class="font-sans text-[13px] font-bold text-carbon">
                {{ lang === 'uz' ? 'Молиявий кўрсаткичлар (Excel)' : 'Финансовые показатели (из Excel)' }}
              </div>
              <div class="font-sans text-[12px] text-steel-500 mt-[2px]">
                {{ lang === 'uz' ? '1С / Документы.uz шакллари бўйича ҳисобланди' : 'Посчитано из стандартных форм 1С / Документы.uz' }}
              </div>
            </div>
            <span class="text-[10px] font-bold uppercase tracking-[0.5px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-[6px] py-1 px-2">
              {{ lang === 'uz' ? 'Excel’дан' : 'Из Excel' }}
            </span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="m in financialMetrics" :key="m.key"
                 class="border border-rs-border rounded-[8px] py-3 px-4 bg-navy-900/[0.02]">
              <div class="text-[10px] font-semibold uppercase tracking-[0.5px] text-steel-500">{{ m.label }}</div>
              <div class="font-mono text-[16px] font-bold text-carbon mt-1">{{ m.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ AI ANALYSIS (demo: local generator runs on mount; backend-powered if VITE_API_URL is set) ═══ -->
    <RsClaudeAnalysis v-if="analysis" :analysis="analysis" :lang="lang" />

    <div v-else-if="analysisStatus === 'analyzing'"
         class="bg-white border border-rs-border rounded-[12px] py-6 px-8 text-center text-[13px] text-steel-500 italic">
      {{ lang === 'uz' ? 'AI таҳлил қиляпти…' : 'AI анализирует…' }}
    </div>
    <div v-else-if="analysisStatus === 'error'"
         class="bg-red-50 border border-red-200 rounded-[12px] py-5 px-6 text-[13px] text-red-700">
      {{ lang === 'uz' ? 'Таҳлил хатоси:' : 'Ошибка анализа:' }} {{ store.analysisError }}
    </div>

    <!-- ═══ CITY CONTEXT — only for pilot cities (Fergana, Margilan) ═══ -->
    <section v-if="isPilotCity" class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div class="px-8 py-6 flex items-start justify-between gap-4"
           style="background: rgba(25,63,114,0.03); border-bottom: 1px solid rgba(25,63,114,0.08);">
        <div class="flex items-start gap-4">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-navy-900 shrink-0">
            <RsIcon name="landmark" :size="16" class="text-white" />
          </span>
          <div class="min-w-0">
            <h2 class="font-sans text-[20px] font-bold text-carbon">{{ t.cityContextTitle }}: {{ userPickedLabel }}</h2>
            <p class="font-sans text-[13px] text-gray-600 mt-1">{{ t.cityContextHint }}</p>
          </div>
        </div>
        <span v-if="!isCityDataReal"
              class="shrink-0 inline-flex text-[11px] font-bold uppercase tracking-[0.5px] text-amber-700 bg-amber-50 border border-amber-200 rounded-[6px] py-1 px-2 self-start"
              :title="lang === 'uz' ? 'Шаҳар бўйича батафсил маълумотлар тайёрланмоқда — қуйида вилоят бўйича' : 'Детальные данные по городу в разработке — ниже показаны областные'">
          {{ lang === 'uz' ? 'Данные по области' : 'Данные по области' }}
        </span>
      </div>
      <div class="px-8 py-7 grid grid-cols-2 md:grid-cols-4 gap-5">
        <div>
          <div class="text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">{{ lang === 'uz' ? 'Аҳоли' : 'Население' }}</div>
          <div class="font-mono text-[20px] font-bold text-carbon mt-1">
            {{ selectedCity.populationK.toLocaleString('ru-RU') }}
            <span class="text-[13px] font-medium text-steel-500">{{ lang === 'uz' ? 'минг' : 'тыс.' }}</span>
          </div>
        </div>
        <div>
          <div class="text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">{{ lang === 'uz' ? 'Саноат' : 'Промышленность' }}</div>
          <div class="font-mono text-[20px] font-bold text-carbon mt-1">
            {{ Math.round(selectedCity.industryBlnUzs).toLocaleString('ru-RU') }}
            <span class="text-[13px] font-medium text-steel-500">{{ lang === 'uz' ? 'млрд сўм' : 'млрд сум' }}</span>
          </div>
        </div>
        <div>
          <div class="text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">
            {{ selectedCity.id === 'margilan' ? (lang === 'uz' ? 'Экспорт' : 'Экспорт') : (lang === 'uz' ? 'Инвестиция' : 'Инвестиции') }}
          </div>
          <div class="font-mono text-[20px] font-bold text-carbon mt-1">
            {{ (selectedCity.exportsBlnUzs ?? selectedCity.investmentsBlnUzs).toLocaleString('ru-RU') }}
            <span class="text-[13px] font-medium text-steel-500">{{ lang === 'uz' ? 'млрд' : 'млрд' }}</span>
          </div>
        </div>
        <div>
          <div class="text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500">{{ lang === 'uz' ? 'Маҳаллалар' : 'Махаллей' }}</div>
          <div class="font-mono text-[20px] font-bold text-carbon mt-1">
            {{ selectedCity.mahallas.toLocaleString('ru-RU') }}
          </div>
        </div>
      </div>
      <div class="px-8 pb-7">
        <div class="text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 mb-2">
          {{ lang === 'uz' ? 'Тавсия этилган соҳалар' : 'Рекомендуемые отрасли' }}
        </div>
        <div class="flex flex-wrap gap-2">
          <span v-for="sec in selectedCity.topSectors || selectedCity.industries" :key="sec.key"
                class="inline-flex items-center gap-2 text-[13px] font-medium text-navy-900 bg-navy-900/[0.05] rounded-[8px] py-[6px] px-3">
            {{ lang === 'uz' ? sec.nameUz : sec.nameRu }}
            <span class="font-mono text-[12px] text-steel-500">{{ sec.blnUzs }} {{ lang === 'uz' ? 'млрд' : 'млрд' }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- Non-pilot region: show honest 'no data yet' banner instead of city KPIs -->
    <section v-else class="bg-amber-50 border border-amber-200 rounded-[12px] overflow-hidden">
      <div class="px-8 py-6 flex items-start gap-4">
        <span class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 shrink-0">
          <RsIcon name="alert-triangle" :size="16" class="text-white" />
        </span>
        <div class="min-w-0">
          <h2 class="font-sans text-[18px] font-bold text-amber-900">
            {{ lang === 'uz'
              ? 'Бу ҳудуд бўйича батафсил маълумотлар ҳозирча мавжуд эмас'
              : 'Детальные данные по этому региону пока недоступны' }}
          </h2>
          <p class="font-sans text-[13px] text-amber-800 mt-1 leading-[1.5]">
            {{ lang === 'uz'
              ? 'Пилот шаҳарлар: Фарғона ва Марғилон. AI таҳлили сизнинг профил ва молиявий маълумотларингиз асосида умумий тавсия беради.'
              : 'Пилотные города: Фергана и Маргилан. AI-анализ даст общую рекомендацию по вашему профилю и финансам без опоры на региональные показатели.' }}
          </p>
          <p v-if="userPickedLabel" class="font-sans text-[12px] text-amber-700 mt-2">
            {{ lang === 'uz' ? 'Сиз танлаган ҳудуд:' : 'Ваш выбор:' }}
            <span class="font-semibold">{{ userPickedLabel }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- ═══ SECTION 1 — AI Scoring ═══ -->
    <section class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div
        class="px-8 py-6"
        style="background: rgba(215,181,109,0.04); border-bottom: 1px solid rgba(215,181,109,0.12);"
      >
        <div class="flex items-center gap-4">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[15px] font-bold text-white shrink-0 bg-navy-900">1</span>
          <div>
            <h2 class="font-sans text-[20px] font-bold text-carbon">{{ t.section1Title }}</h2>
            <p class="font-sans text-[14px] font-normal text-gray-600 mt-1">{{ t.section1Sub }}</p>
          </div>
        </div>
      </div>
      <div class="px-8 py-8">
        <div class="flex flex-col md:flex-row gap-8 md:gap-10">
          <!-- ScoreCircle (live) -->
          <div class="flex flex-col items-center gap-3 shrink-0">
            <div class="relative w-[140px] h-[140px]">
              <svg viewBox="0 0 120 120" class="w-full h-full -rotate-90">
                <circle cx="60" cy="60" :r="RADIUS" fill="none" stroke="#f3f4f6" stroke-width="10" />
                <circle
                  cx="60" cy="60" :r="RADIUS" fill="none"
                  :stroke="scoreColor" stroke-width="10" stroke-linecap="round"
                  :stroke-dasharray="CIRCUMFERENCE" :stroke-dashoffset="scoreOffset"
                  class="transition-all duration-1000"
                />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="font-mono text-[36px] font-bold text-carbon leading-none">{{ scoreResult.total }}</span>
                <span class="font-sans text-[12px] font-medium text-steel-500">{{ t.outOf100 }}</span>
              </div>
            </div>
            <span :class="['font-sans text-[14px] font-semibold rounded-[6px] py-1 px-3', verdictLabel.cls]">
              {{ verdictLabel[lang] }}
            </span>
            <p class="text-[11px] text-steel-500 text-center max-w-[160px] leading-[1.4]">
              {{ lang === 'uz' ? 'Ҳар бир омилни очиб, қандай ҳисобланганини кўринг' : 'Раскройте любой фактор, чтобы увидеть как он посчитан' }}
            </p>
          </div>

          <!-- Live breakdown -->
          <div class="flex-1 min-w-0">
            <RsScoreBreakdown :factors="scoreResult.factors" :lang="lang" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ SECTION 2 — Credit Products (headline answer) ═══ -->
    <section class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div
        class="px-8 py-6"
        style="background: rgba(215,181,109,0.06); border-bottom: 1px solid rgba(215,181,109,0.15);"
      >
        <div class="flex items-center gap-4">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[15px] font-bold text-white shrink-0 bg-gold-500">2</span>
          <div>
            <h2 class="font-sans text-[20px] font-bold text-carbon">{{ t.section5Title }}</h2>
            <p class="font-sans text-[14px] font-normal text-gray-600 mt-1">{{ t.section5Sub }}</p>
          </div>
        </div>
      </div>
      <div class="px-8 py-8 space-y-6">
        <!-- Primary product — live match -->
        <div v-if="primaryMatch"
          class="border border-rs-border rounded-[10px] overflow-hidden"
          style="border-top: 3px solid #D7B56D;"
        >
          <div class="px-6 py-5 flex items-center justify-between">
            <div>
              <div class="font-sans text-[11px] font-semibold text-gold-500 uppercase tracking-[0.5px] mb-1">
                {{ primaryMatch.product.tier === 'easy' ? (lang === 'uz' ? 'Енгил маҳсулот' : 'Облегчённый продукт') : (lang === 'uz' ? 'Стандарт маҳсулот' : 'Стандартный продукт') }}
              </div>
              <h3 class="font-sans text-[20px] font-bold text-carbon">
                {{ primaryMatch.product.name[lang] }}
              </h3>
            </div>
            <span class="font-sans text-[12px] font-bold text-emerald-600 bg-emerald-50 rounded-[6px] py-[6px] px-[14px] uppercase tracking-[0.5px]">
              {{ t.recommendedBadge }}
            </span>
          </div>
          <div class="px-6 pb-6">
            <div class="divide-y divide-rs-border">
              <div class="flex gap-6 py-3">
                <div class="w-44 shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 pt-[2px]">{{ t.rateLabel.replace(':','') }}</div>
                <div class="font-sans text-[14px] font-medium text-carbon">{{ primaryMatch.product.rateLabel[lang] }}</div>
              </div>
              <div class="flex gap-6 py-3">
                <div class="w-44 shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 pt-[2px]">{{ t.amountLabel.replace(':','') }}</div>
                <div class="font-sans text-[14px] font-medium text-carbon">{{ primaryMatch.product.amountLabel[lang] }}</div>
              </div>
              <div class="flex gap-6 py-3">
                <div class="w-44 shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 pt-[2px]">{{ t.termLabel.replace(':','') }}</div>
                <div class="font-sans text-[14px] font-medium text-carbon">{{ primaryMatch.product.termLabel[lang] }}</div>
              </div>
              <div class="flex gap-6 py-3">
                <div class="w-44 shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 pt-[2px]">{{ t.collateralLabel.replace(':','') }}</div>
                <div class="font-sans text-[14px] font-medium text-carbon">{{ formatProductCollateral(primaryMatch.product) }}</div>
              </div>
              <div class="flex gap-6 py-3">
                <div class="w-44 shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 pt-[2px]">{{ t.purposeLabel.replace(':','') }}</div>
                <div class="font-sans text-[14px] font-medium text-carbon">{{ primaryMatch.product.purposeLabel[lang] }}</div>
              </div>
              <div v-if="primaryMatch.reasons.length" class="flex gap-6 py-3">
                <div class="w-44 shrink-0 font-sans text-[11px] font-semibold uppercase tracking-[0.5px] text-steel-500 pt-[2px]">{{ t.matchReasons }}</div>
                <ul class="space-y-1">
                  <li v-for="r in primaryMatch.reasons" :key="r" class="flex items-start gap-2">
                    <span class="w-[5px] h-[5px] rounded-full bg-emerald-500 mt-[7px] shrink-0" />
                    <span class="font-sans text-[13px] text-carbon leading-[1.5]">{{ r }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional products -->
        <div v-if="altMatches.length">
          <div class="font-sans text-[12px] font-semibold uppercase tracking-[1px] text-steel-500 mb-4">
            {{ t.altProductsLabel }}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              v-for="m in altMatches" :key="m.product.id"
              class="border border-rs-border rounded-[10px] py-[14px] px-[18px]"
            >
              <div class="font-sans text-[15px] font-semibold text-carbon">{{ m.product.name[lang] }}</div>
              <div class="font-sans text-[12px] font-normal text-gray-600 mt-[2px]">
                {{ m.product.tier === 'easy' ? (lang === 'uz' ? 'Енгил' : 'Облегчённый') : (lang === 'uz' ? 'Стандарт' : 'Стандартный') }}
              </div>
              <div class="mt-3 space-y-1">
                <div class="font-sans text-[12px] text-steel-500">
                  <span class="font-semibold">{{ t.rateLabel }}</span> {{ m.product.rateLabel[lang] }}
                </div>
                <div class="font-sans text-[12px] text-steel-500">
                  <span class="font-semibold">{{ t.amountLabel }}</span> {{ m.product.amountLabel[lang] }}
                </div>
                <div class="font-sans text-[12px] text-steel-500">
                  <span class="font-semibold">{{ t.termLabel }}</span> {{ m.product.termLabel[lang] }}
                </div>
              </div>
              <p class="font-sans text-[12px] font-normal text-gray-600 mt-2 leading-[1.4]">{{ m.product.purposeLabel[lang] }}</p>
            </div>
          </div>
        </div>

        <p class="font-sans text-[12px] text-steel-500 italic">{{ t.catalogNote }}</p>
      </div>
    </section>

    <!-- ═══ SECTION 3 — SWOT ═══ -->
    <section class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div
        class="px-8 py-6"
        style="background: rgba(41,87,162,0.04); border-bottom: 1px solid rgba(41,87,162,0.1);"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[15px] font-bold text-white shrink-0 bg-navy-900">3</span>
            <div>
              <h2 class="font-sans text-[20px] font-bold text-carbon">{{ t.section2Title }}</h2>
              <p class="font-sans text-[14px] font-normal text-gray-600 mt-1">{{ t.section2Sub }}</p>
            </div>
          </div>
          <span class="shrink-0 inline-flex text-[11px] font-bold uppercase tracking-[0.5px] text-gold-500 bg-gold-500/10 rounded-[6px] py-1 px-2"
                :title="t.demoBadgeHint">
            {{ t.demoBadge }}
          </span>
        </div>
      </div>
      <div class="px-8 py-8">
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="q in swotQuadrants" :key="q.title"
            :class="['rounded-[10px] border p-5', SWOT_STYLES[q.color].bg, SWOT_STYLES[q.color].border]"
          >
            <h4 :class="['font-sans text-[13px] font-bold uppercase tracking-[0.5px] mb-3', SWOT_STYLES[q.color].title]">
              {{ q.title }}
            </h4>
            <ul class="space-y-2">
              <li v-for="item in q.items" :key="item" class="flex items-start gap-2">
                <span :class="['w-[5px] h-[5px] rounded-full mt-[7px] shrink-0', SWOT_STYLES[q.color].dot]" />
                <span class="font-sans text-[13px] text-carbon leading-[1.5]">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ SECTION 4 — Mahalla Heatmap (Margilan pilot only) ═══ -->
    <section v-if="isMargilan" class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div
        class="px-8 py-6"
        style="background: rgba(215,181,109,0.04); border-bottom: 1px solid rgba(215,181,109,0.12);"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[15px] font-bold text-white shrink-0 bg-gold-500">4</span>
            <div>
              <h2 class="font-sans text-[20px] font-bold text-carbon">{{ t.section3Title }}</h2>
              <p class="font-sans text-[14px] font-normal text-gray-600 mt-1">{{ t.section3Sub }}</p>
            </div>
          </div>
          <span class="shrink-0 inline-flex text-[11px] font-bold uppercase tracking-[0.5px] text-gold-500 bg-gold-500/10 rounded-[6px] py-1 px-2">
            {{ t.demoBadge }}
          </span>
        </div>
      </div>
      <div class="px-8 py-8 space-y-6">
        <RsMargilanHeatmap :ranking="t.MAHALLA_RANKING" />

        <RsInsightBox variant="info" :title="t.locationInsightTitle">
          {{ t.locationInsightText }}
        </RsInsightBox>
      </div>
    </section>

    <!-- ═══ SECTION 5 — Business Plan ═══ -->
    <section class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div
        class="px-8 py-6"
        style="background: rgba(41,87,162,0.04); border-bottom: 1px solid rgba(41,87,162,0.1);"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[15px] font-bold text-white shrink-0 bg-navy-900">5</span>
            <div>
              <h2 class="font-sans text-[20px] font-bold text-carbon">{{ t.section4Title }}</h2>
              <p class="font-sans text-[14px] font-normal text-gray-600 mt-1">{{ t.section4Sub }}</p>
            </div>
          </div>
          <span class="shrink-0 inline-flex text-[11px] font-bold uppercase tracking-[0.5px] text-gold-500 bg-gold-500/10 rounded-[6px] py-1 px-2"
                :title="t.demoBadgeHint">
            {{ t.demoBadge }}
          </span>
        </div>
      </div>
      <div class="px-8 py-8 space-y-8">
        <!-- Description -->
        <div
          class="rounded-[8px] py-4 px-5"
          style="border-left: 3px solid #D7B56D; background: rgba(215,181,109,0.06);"
        >
          <div class="font-sans text-[13px] font-bold mb-1 text-gold-500">{{ t.projectDescLabel }}</div>
          <div class="font-sans text-[14px] font-medium text-carbon leading-[1.6]">
            {{ t.projectDescText }}
          </div>
        </div>

        <!-- Courses -->
        <div>
          <div class="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{{ t.coursesLabel }}</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="c in t.courses" :key="c"
              class="font-sans text-[13px] font-medium text-navy-900 bg-navy-900/[0.06] rounded-[8px] py-[6px] px-3"
            >{{ c }}</span>
          </div>
        </div>

        <!-- Costs side by side -->
        <div class="grid grid-cols-2 gap-6">
          <div>
            <div class="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{{ t.startupCostsLabel }}</div>
            <div class="border border-rs-border rounded-[10px] overflow-hidden">
              <div class="divide-y divide-rs-border">
                <div v-for="row in t.STARTUP_COSTS" :key="row[0]" class="flex justify-between py-3 px-4">
                  <span class="font-sans text-[13px] text-carbon">{{ row[0] }}</span>
                  <span class="font-mono text-[13px] font-semibold text-carbon">{{ row[1] }}</span>
                </div>
                <div class="flex justify-between py-3 px-4 bg-navy-900/[0.03]">
                  <span class="font-sans text-[13px] font-bold text-carbon">{{ t.total }}</span>
                  <span class="font-mono text-[14px] font-bold text-navy-900">{{ t.startupTotal }}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{{ t.monthlyCostsLabel }}</div>
            <div class="border border-rs-border rounded-[10px] overflow-hidden">
              <div class="divide-y divide-rs-border">
                <div v-for="row in t.MONTHLY_COSTS" :key="row[0]" class="flex justify-between py-3 px-4">
                  <span class="font-sans text-[13px] text-carbon">{{ row[0] }}</span>
                  <span class="font-mono text-[13px] font-semibold text-carbon">{{ row[1] }}</span>
                </div>
                <div class="flex justify-between py-3 px-4 bg-navy-900/[0.03]">
                  <span class="font-sans text-[13px] font-bold text-carbon">{{ t.total }}</span>
                  <span class="font-mono text-[14px] font-bold text-navy-900">{{ t.monthlyTotal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue forecast -->
        <div>
          <div class="font-sans text-[11px] font-semibold uppercase tracking-[1px] text-steel-500 mb-3">{{ t.revenueForecastLabel }}</div>
          <div class="border border-rs-border rounded-[10px] overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="bg-navy-900/[0.03]">
                  <th class="text-left font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{{ t.periodCol }}</th>
                  <th class="text-center font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{{ t.studentsCol }}</th>
                  <th class="text-right font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{{ t.revenueCol }}</th>
                  <th class="text-right font-sans text-[12px] font-semibold text-steel-500 uppercase tracking-[0.5px] py-3 px-4">{{ t.profitCol }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-rs-border">
                <tr v-for="r in t.REVENUE_FORECAST" :key="r.period">
                  <td class="font-sans text-[13px] font-medium text-carbon py-3 px-4">{{ r.period }}</td>
                  <td class="font-mono text-[13px] font-semibold text-carbon py-3 px-4 text-center">{{ r.students }}</td>
                  <td class="font-mono text-[13px] font-semibold text-carbon py-3 px-4 text-right">{{ r.revenue }}</td>
                  <td
                    :class="[
                      'font-mono text-[13px] font-bold py-3 px-4 text-right',
                      r.profitPositive ? 'text-emerald-600' : 'text-red-500',
                    ]"
                  >
                    {{ r.profit }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="font-sans text-[12px] text-steel-500 mt-2 italic">{{ t.breakeven }}</p>
        </div>
      </div>
    </section>

    <!-- ═══ SECTION 6 — Action Plan ═══ -->
    <section class="bg-white border border-rs-border rounded-[12px] overflow-hidden shadow-rs-card">
      <div
        class="px-8 py-6"
        style="background: rgba(41,87,162,0.04); border-bottom: 1px solid rgba(41,87,162,0.1);"
      >
        <div class="flex items-center gap-4">
          <span class="inline-flex items-center justify-center w-9 h-9 rounded-full font-mono text-[15px] font-bold text-white shrink-0 bg-navy-900">6</span>
          <div>
            <h2 class="font-sans text-[20px] font-bold text-carbon">{{ t.section6Title }}</h2>
            <p class="font-sans text-[14px] font-normal text-gray-600 mt-1">{{ t.section6Sub }}</p>
          </div>
        </div>
      </div>
      <div class="px-8 py-8">
        <div class="space-y-3">
          <div
            v-for="(s, i) in t.ACTION_STEPS" :key="s.title"
            class="flex items-start gap-4 border border-rs-border rounded-[10px] p-4"
          >
            <div class="flex flex-col items-center shrink-0">
              <span
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center font-mono text-[13px] font-bold text-white',
                  stepCircleClass(i, t.ACTION_STEPS.length),
                ]"
              >
                {{ i + 1 }}
              </span>
              <div v-if="i < t.ACTION_STEPS.length - 1" class="w-[2px] h-4 bg-rs-border mt-1" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <span class="font-sans text-[15px] font-semibold text-carbon">{{ s.title }}</span>
                <RsStatusTag :variant="s.status">{{ s.week }}</RsStatusTag>
              </div>
              <p class="font-sans text-[13px] text-gray-600 mt-1 leading-[1.5]">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ SECTION 7 — CTA ═══ -->
    <section
      class="rounded-[16px] py-14 px-10 text-center"
      style="background: linear-gradient(135deg, #0F2847, #193F72);"
    >
      <h2 class="font-sans text-[24px] font-bold text-white">{{ t.ctaTitle }}</h2>
      <p class="font-sans text-[15px] font-normal text-white/65 mt-2">{{ t.ctaSubtitle }}</p>
      <div class="flex items-center justify-center gap-4 mt-7">
        <a
          href="https://nbu.uz"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center font-sans text-[15px] font-bold text-navy-900 bg-gold-500 hover:bg-[#C9A85F] rounded-btn py-[14px] px-8 transition-colors duration-200"
        >
          {{ t.applyBtn }}
        </a>
        <button
          type="button"
          @click="onDownload"
          class="inline-flex items-center justify-center font-sans text-[15px] font-semibold text-white border-[1.5px] border-white/30 hover:bg-white/10 rounded-btn py-[13px] px-8 transition-colors duration-200"
        >
          {{ t.downloadBtn }}
        </button>
      </div>
      <button
        type="button"
        @click="emit('restart')"
        class="font-sans text-[14px] font-medium text-white/45 hover:text-white/70 mt-5 transition-colors duration-150"
      >
        {{ t.restartCta }}
      </button>
    </section>
  </div>
</template>
