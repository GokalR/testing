<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import AppIcon from '@/components/AppIcon.vue'
import { tools } from '@/data/districts'

const { t } = useI18n()
</script>

<template>
  <section class="p-6 lg:p-8 space-y-10">
    <PageHeader :title="t('tools.title')" :subtitle="t('tools.subtitle')" />

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <component
        :is="tool.to ? RouterLink : 'article'"
        v-for="tool in tools"
        :key="tool.key"
        :to="tool.to"
        class="group bg-surface-container-lowest rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col gap-4 no-underline"
        :class="{ 'ring-2 ring-primary/30': tool.featured }"
      >
        <div class="flex items-start justify-between">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center text-white"
            :class="tool.accent"
          >
            <AppIcon :name="tool.icon" filled />
          </div>
          <span
            v-if="tool.featured"
            class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/10 text-primary"
          >{{ t('tools.new') }}</span>
        </div>
        <div class="space-y-2 flex-1">
          <h3 class="text-lg font-bold text-on-surface">{{ t(`tools.items.${tool.key}.title`) }}</h3>
          <p class="text-sm text-on-surface-variant leading-relaxed">
            {{ t(`tools.items.${tool.key}.desc`) }}
          </p>
        </div>
        <span
          class="self-start text-sm font-bold text-primary flex items-center gap-2 group-hover:gap-3 transition-all"
        >
          {{ t('tools.open') }}
          <AppIcon name="arrow_forward" />
        </span>
      </component>
    </div>
  </section>
</template>
