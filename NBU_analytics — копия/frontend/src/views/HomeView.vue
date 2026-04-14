<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import KpiCard from '@/components/KpiCard.vue'
import StatCard from '@/components/StatCard.vue'
import UzbekistanMap from '@/components/UzbekistanMap.vue'
import AppIcon from '@/components/AppIcon.vue'
import RegionDropdown from '@/components/RegionDropdown.vue'
import { regions, regionKeys, national } from '@/data/regions'
import { regionColors } from '@/data/regionColors'

const { t } = useI18n()
const router = useRouter()

const selected = ref(null) // null = whole country

const current = computed(() => (selected.value ? regions[selected.value] : national))

const kpis = computed(() => [
  {
    key: 'population',
    icon: 'groups',
    value: current.value.population,
    delta: '+1.2%',
    tone: 'positive',
  },
  {
    key: 'gdpGrowth',
    icon: 'trending_up',
    value: current.value.gdpGrowth,
    delta: current.value.gdpDelta,
    tone: 'positive',
  },
  {
    key: 'exports',
    icon: 'payments',
    value: current.value.exports,
    delta: 'Target',
    tone: 'positive',
  },
  {
    key: 'mahallas',
    icon: 'location_city',
    value: current.value.mahallas.toLocaleString(),
    delta: 'Total',
    tone: 'neutral',
  },
])

const economicBars = computed(() => [
  {
    label: t('home.cards.industry'),
    value: scaleVal(current.value.bars.industry, '$', ' mln'),
    percent: current.value.bars.industry,
    color: 'bg-primary',
  },
  {
    label: t('home.cards.agriculture'),
    value: scaleVal(current.value.bars.agriculture, '$', ' mln'),
    percent: current.value.bars.agriculture,
    color: 'bg-primary-container',
  },
  {
    label: t('home.cards.services'),
    value: scaleVal(current.value.bars.services, '$', ' mln'),
    percent: current.value.bars.services,
    color: 'bg-primary opacity-60',
  },
])

const populationBars = computed(() => [
  {
    label: t('home.cards.employed'),
    value: pctOfPop(current.value.employment.employed, 0.55),
    percent: current.value.employment.employed,
    color: 'bg-tertiary',
  },
  {
    label: t('home.cards.selfEmployed'),
    value: pctOfPop(current.value.employment.selfEmployed, 0.22),
    percent: current.value.employment.selfEmployed,
    color: 'bg-tertiary-container',
  },
  {
    label: t('home.cards.education'),
    value: pctOfPop(current.value.employment.education, 0.04),
    percent: current.value.employment.education,
    color: 'bg-tertiary opacity-60',
  },
])

const bankBars = computed(() => [
  {
    label: t('home.cards.credits'),
    value: scaleVal(current.value.bank.credits, '', ' trln'),
    percent: current.value.bank.credits,
    color: 'bg-primary-container',
  },
  {
    label: t('home.cards.newBusiness'),
    value: `${(current.value.bank.newBusiness * 80).toLocaleString()} ta`,
    percent: current.value.bank.newBusiness,
    color: 'bg-primary',
  },
  {
    label: t('home.cards.exporters'),
    value: `${current.value.bank.exporters * 12} ta`,
    percent: current.value.bank.exporters,
    color: 'bg-secondary',
  },
])

function scaleVal(percent, prefix = '', suffix = '') {
  return `${prefix}${(percent * 5).toFixed(0)}${suffix}`
}

function pctOfPop(percent, factor) {
  const popMln =
    parseFloat(String(current.value.population).replace(/[^\d.]/g, '')) || 1
  const v = popMln * factor * (percent / 100) * 4
  return v >= 1 ? `${v.toFixed(1)} mln` : `${(v * 1000).toFixed(0)}k`
}

function reset() {
  selected.value = null
}
function gotoAnalytics() {
  router.push({ name: 'districts', query: { region: selected.value || '' } })
}

// Sorted region list (by population) for sidebar
const sortedRegions = computed(() =>
  regionKeys
    .map((k) => ({ key: k, ...regions[k] }))
    .sort((a, b) => b.populationRaw - a.populationRaw),
)
</script>

<template>
  <section class="p-6 lg:p-8 space-y-8">
    <!-- Map (top, full width) -->
    <div class="space-y-4">
      <header class="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-on-surface">
            {{ selected ? t(`regions.${selected}`) : t('home.map.title') }}
          </h2>
          <p class="text-sm text-on-surface-variant mt-1">{{ t('home.map.subtitle') }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="selected"
            type="button"
            class="text-xs font-bold text-primary inline-flex items-center gap-1 hover:underline"
            @click="reset"
          >
            <AppIcon name="restart_alt" />
            {{ t('home.map.reset') }}
          </button>
          <button
            v-if="selected"
            type="button"
            class="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
            @click="gotoAnalytics"
          >
            <AppIcon name="analytics" />
            {{ t('regionInfo.viewAnalytics') }}
          </button>
          <div class="lg:hidden">
            <RegionDropdown v-model="selected" :regions="sortedRegions" />
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
        <UzbekistanMap v-model="selected" />

        <aside
          class="hidden lg:flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm"
        >
          <header class="px-4 py-3 bg-surface-container-low flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {{ t('home.districts.title') }}
            </span>
            <span class="text-[10px] text-on-surface-variant">
              {{ t('home.districts.subtitle') }}
            </span>
          </header>
          <ul class="flex-1 overflow-y-auto py-1 max-h-[560px]">
            <li v-for="r in sortedRegions" :key="r.key">
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container transition-colors text-left"
                :class="selected === r.key ? 'bg-primary-fixed' : ''"
                @click="selected = selected === r.key ? null : r.key"
              >
                <span
                  class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  :style="{ backgroundColor: regionColors[r.key]?.selected }"
                ></span>
                <span class="text-sm font-semibold flex-1 truncate">
                  {{ t(`regionsShort.${r.key}`) }}
                </span>
                <span class="text-xs font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded">
                  {{ r.population }}
                </span>
              </button>
            </li>
          </ul>
        </aside>
      </div>
    </div>

    <!-- Data section: KPIs + detailed stat cards for selected region or whole country -->
    <div class="space-y-6">
      <header class="flex items-center gap-2">
        <AppIcon name="location_on" filled class="text-primary" />
        <h3 class="text-lg font-bold tracking-tight text-on-surface">
          {{ selected ? t(`regions.${selected}`) : t('home.map.nationalTitle') }}
        </h3>
        <span class="text-xs text-on-surface-variant">
          · {{ t('regionInfo.districts') }}: {{ current.districts }}
          · {{ t('regionInfo.area') }}: {{ current.area }}
        </span>
      </header>

      <!-- KPI grid (dynamic) -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          v-for="kpi in kpis"
          :key="kpi.key"
          :icon="kpi.icon"
          :value="kpi.value"
          :label="t(`home.kpi.${kpi.key}`)"
          :delta="kpi.delta"
          :tone="kpi.tone"
        />
      </div>

      <!-- Stat cards (dynamic) -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        <StatCard icon="finance" :title="t('home.cards.economic')" :bars="economicBars" />
        <StatCard icon="person_search" :title="t('home.cards.population')" :bars="populationBars" />
        <StatCard icon="storefront" :title="t('home.cards.bank')" :bars="bankBars" />
      </div>

      <!-- Detailed analytics CTA (only when a region is selected) -->
      <transition name="slide-fade">
        <div
          v-if="selected"
          class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-primary text-on-primary rounded-xl px-6 py-5 shadow-lg"
        >
          <div class="flex items-center gap-3">
            <AppIcon name="analytics" filled />
            <div>
              <p class="text-xs uppercase tracking-widest opacity-80 font-bold">
                {{ t(`regions.${selected}`) }}
              </p>
              <p class="text-lg font-bold">{{ t('common.details') }}</p>
            </div>
          </div>
          <button
            type="button"
            class="bg-on-primary text-primary px-5 py-2.5 rounded-lg text-sm font-bold inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform self-start md:self-auto"
            @click="gotoAnalytics"
          >
            {{ t('nav.districts') }}
            <AppIcon name="arrow_forward" />
          </button>
        </div>
      </transition>
    </div>

    <!-- Floating action button -->
    <button
      type="button"
      class="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 flex items-center gap-2 group"
    >
      <AppIcon name="add_chart" filled />
      <span
        class="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-sm whitespace-nowrap"
      >
        {{ t('common.createReport') }}
      </span>
    </button>
  </section>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
