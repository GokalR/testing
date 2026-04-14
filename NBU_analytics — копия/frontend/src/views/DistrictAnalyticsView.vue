<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import StatCard from '@/components/StatCard.vue'
import { regions, national } from '@/data/regions'

const { t } = useI18n()
const route = useRoute()

const regionKey = computed(() => {
  const k = route.query.region
  return k && regions[k] ? k : null
})
const regionData = computed(() => (regionKey.value ? regions[regionKey.value] : national))
const title = computed(() =>
  regionKey.value ? t(`regions.${regionKey.value}`) : t('home.map.nationalTitle'),
)
const breadcrumb = computed(() =>
  regionKey.value
    ? `${t(`regions.${regionKey.value}`)} / ${t('nav.districts')}`
    : t('nav.districts'),
)

const tabs = [
  { id: 'economic', labelKey: 'district.tabs.economic' },
  { id: 'infra', labelKey: 'district.tabs.infra' },
  { id: 'population', labelKey: 'district.tabs.population' },
  { id: 'mahalla', labelKey: 'district.tabs.mahalla' },
  { id: 'opportunities', labelKey: 'district.tabs.opportunities' },
  { id: 'summary', labelKey: 'district.tabs.summary' },
]
const activeTab = ref('economic')

const economicBars = computed(() => {
  const bars = regionData.value.bars || { industry: 60, agriculture: 50, services: 40 }
  const scale = (p) => `$${(p * 5).toFixed(0)} mln`
  return [
    { label: t('district.metrics.industry'), value: scale(bars.industry), percent: bars.industry, color: 'bg-primary' },
    { label: t('district.metrics.agri'), value: scale(bars.agriculture), percent: bars.agriculture, color: 'bg-primary-container' },
    { label: t('district.metrics.trade'), value: scale(bars.services), percent: bars.services, color: 'bg-secondary' },
  ]
})

const grpGrowth = computed(() => regionData.value.gdpGrowth || '108.4%')
</script>

<template>
  <section class="p-6 lg:p-8 space-y-10">
    <PageHeader
      :eyebrow="breadcrumb"
      :title="title"
      :subtitle="t('district.subtitle')"
    >
      <nav
        class="flex gap-6 lg:gap-8 border-b border-outline-variant/30 pb-4 mt-4 overflow-x-auto no-scrollbar"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="text-sm font-semibold whitespace-nowrap transition-colors pb-1 border-b-2"
          :class="
            activeTab === tab.id
              ? 'text-primary border-primary'
              : 'text-on-surface-variant border-transparent hover:text-primary'
          "
          @click="activeTab = tab.id"
        >
          {{ t(tab.labelKey) }}
        </button>
      </nav>
    </PageHeader>

    <section class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold flex items-center gap-4">
          <span class="text-outline-variant opacity-30 text-5xl font-black">#1</span>
          {{ t(`district.tabs.${activeTab}`) }}
        </h2>
        <span
          class="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter"
        >
          DATA: STAT.UZ
        </span>
      </div>

      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary">
          <p class="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1">
            {{ t('district.metrics.grpGrowth') }}
          </p>
          <p class="text-6xl font-extrabold text-primary mb-4">
            {{ grpGrowth }}
          </p>
        </div>
        <div class="col-span-12 lg:col-span-8">
          <StatCard icon="finance" :title="t('home.cards.economic')" :bars="economicBars" />
        </div>
      </div>
    </section>
  </section>
</template>
