<script setup>
import { RouterLink, useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'

const router = useRouter()

const items = [
  { to: '/tools/fincontrol/dashboard', icon: 'dashboard', label: 'Обзор' },
  { to: '/tools/fincontrol/accounts', icon: 'account_balance_wallet', label: 'Счета и остатки' },
  { to: '/tools/fincontrol/cashflow', icon: 'trending_up', label: 'Движение денег' },
  { to: '/tools/fincontrol/income-expense', icon: 'bar_chart', label: 'Доходы и расходы' },
  { to: '/tools/fincontrol/pnl', icon: 'description', label: 'P&L отчёт' },
  { to: '/tools/fincontrol/counterparties', icon: 'group', label: 'Контрагенты' },
  { to: '/tools/fincontrol/planning', icon: 'event_note', label: 'Планирование' },
  { to: '/tools/fincontrol/import', icon: 'download', label: 'Импорт выписок' },
]
</script>

<template>
  <aside class="fc-sidebar">
    <button type="button" class="fc-sb-back" @click="router.push('/tools')">
      <AppIcon name="chevron_left" />
      <span>Главная</span>
    </button>

    <div class="fc-sb-brand">
      <div class="fc-sb-brand-icon">
        <AppIcon name="auto_awesome" filled />
      </div>
      <div>
        <div class="name">FinControl</div>
        <div class="sub">Бизнес-помощник</div>
      </div>
    </div>

    <nav class="fc-sb-nav">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="fc-sb-item"
        active-class="active"
      >
        <AppIcon class="nav-icon" :name="item.icon" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <div class="fc-sb-divider"></div>

      <RouterLink
        to="/tools/fincontrol/ai"
        class="fc-sb-item ai"
        active-class="active"
      >
        <AppIcon class="nav-icon" name="auto_awesome" filled />
        <span>AI-помощник</span>
      </RouterLink>
    </nav>

    <div class="fc-sb-footer">
      <button type="button" class="fc-sb-item">
        <AppIcon class="nav-icon" name="help" />
        <span>Поддержка</span>
      </button>
      <button type="button" class="fc-sb-item">
        <AppIcon class="nav-icon" name="settings" />
        <span>Настройки</span>
      </button>
    </div>
  </aside>
</template>
