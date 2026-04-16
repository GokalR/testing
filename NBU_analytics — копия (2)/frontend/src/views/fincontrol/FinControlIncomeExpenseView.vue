<script setup>
import { ref } from 'vue'
import FcHeader from '@/components/fincontrol/FcHeader.vue'
import FcChart from '@/components/fincontrol/FcChart.vue'
import FcSparkline from '@/components/fincontrol/FcSparkline.vue'
import AppIcon from '@/components/AppIcon.vue'
import { transactions, expenseStructure, expenseCategories, incomeCategories } from '@/data/fincontrol'

const compareMode = ref('both')
const txTab = ref('all')

const compareData = {
  labels: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
  datasets: [
    { label: 'Апрель доходы', data: [76, 84, 88, 72], backgroundColor: '#0054A6', stack: 'apr', borderRadius: 5, barThickness: 18 },
    { label: 'Апрель расходы', data: [-46, -52, -54, -46], backgroundColor: '#003D7C', stack: 'apr', borderRadius: 5, barThickness: 18 },
    { label: 'Март доходы', data: [68, 78, 80, 70], backgroundColor: '#CBD5E8', stack: 'mar', borderRadius: 5, barThickness: 18 },
    { label: 'Март расходы', data: [-50, -56, -58, -40], backgroundColor: '#94A3B8', stack: 'mar', borderRadius: 5, barThickness: 18 },
  ],
}
const compareOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#6B7A99', font: { size: 11 } } },
    y: { grid: { color: '#F0F4FA' }, ticks: { color: '#6B7A99', font: { size: 11 }, callback: (v) => `${v}М` } },
  },
}

const donutData = {
  labels: expenseStructure.map((e) => e.label),
  datasets: [{
    data: expenseStructure.map((e) => e.value),
    backgroundColor: expenseStructure.map((e) => e.color),
    borderWidth: 0,
  }],
}
const donutOptions = { cutout: '68%', plugins: { legend: { display: false } } }
</script>

<template>
  <FcHeader
    title="Доходы и расходы"
    :pills="[{key:'week',label:'Неделя'},{key:'month',label:'Месяц'},{key:'quarter',label:'Квартал'},{key:'year',label:'Год'}]"
    active-pill="month"
    :export-button="true"
  />

  <div class="fc-content">
    <div class="fc-page-title">
      <div class="eyebrow">FinControl / Финансы</div>
      <h1>Доходы и расходы</h1>
      <p class="subtitle"><span class="fc-green-line"></span>Апрель 2026 · Анализ финансовых потоков</p>
    </div>

    <!-- KPI strip -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px">
      <div class="fc-kpi" style="border-top:3px solid #00A651">
        <div class="fc-kpi-label">Доходы</div>
        <div class="fc-kpi-value green">320 000 000 <span style="font-size:12px;opacity:.55">UZS</span></div>
        <div class="flex items-center gap-2" style="margin-top:4px"><span class="fc-badge green">▲ 8.2%</span><span class="fc-kpi-sub">vs пред. мес.: 295.7М</span></div>
        <FcSparkline :data="[28,30,32,30,33,35,32,36,38,40,38,40]" color="#00A651" :height="34" />
      </div>
      <div class="fc-kpi" style="border-top:3px solid #E0384B">
        <div class="fc-kpi-label">Расходы</div>
        <div class="fc-kpi-value red">198 000 000 <span style="font-size:12px;opacity:.55">UZS</span></div>
        <div class="flex items-center gap-2" style="margin-top:4px"><span class="fc-badge red">▼ 3.1%</span><span class="fc-kpi-sub">vs пред. мес.: 204.4М</span></div>
        <FcSparkline :data="[22,21,23,24,22,21,20,21,19,20,19,19.8]" color="#E0384B" :height="34" />
      </div>
      <div class="fc-kpi" style="border-top:3px solid #003D7C">
        <div class="fc-kpi-label">Чистый результат</div>
        <div class="fc-kpi-value navy">122 000 000 <span style="font-size:12px;opacity:.55">UZS</span></div>
        <div class="flex items-center gap-2" style="margin-top:4px"><span class="fc-badge blue">▲ 15.0%</span><span class="fc-kpi-sub">vs пред. мес.: 106.1М</span></div>
        <FcSparkline :data="[6,9,9,6,11,14,12,15,19,20,19,20.2]" color="#003D7C" :height="34" />
      </div>
      <div class="fc-kpi" style="border-top:3px solid #94A3B8">
        <div class="fc-kpi-label">Средний расход / день</div>
        <div class="fc-kpi-value" style="color:#475569">6 387 000 <span style="font-size:12px;opacity:.55">UZS</span></div>
        <div class="flex items-center gap-2" style="margin-top:4px"><span class="fc-badge slate">→ стабильно</span><span class="fc-kpi-sub">Апрель · 31 день</span></div>
        <FcSparkline :data="[6.4,6.3,6.5,6.4,6.4,6.3,6.4,6.5,6.4,6.4,6.3,6.4]" color="#94A3B8" :height="34" />
      </div>
    </div>

    <!-- Main grid -->
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-bottom:18px">
      <div class="fc-card">
        <div class="fc-card-header">
          <div>
            <div class="fc-card-title">Этот месяц vs Прошлый месяц</div>
            <div class="fc-card-sub">Апрель vs Март 2026 · по неделям</div>
          </div>
          <div style="display:flex;background:#F0F4FA;border-radius:8px;padding:2px">
            <button class="fc-period-pill" :class="{active:compareMode==='both'}" @click="compareMode='both'" style="font-size:11px;padding:4px 10px;border-radius:6px">Оба</button>
            <button class="fc-period-pill" :class="{active:compareMode==='income'}" @click="compareMode='income'" style="font-size:11px;padding:4px 10px;border-radius:6px">Доходы</button>
            <button class="fc-period-pill" :class="{active:compareMode==='expense'}" @click="compareMode='expense'" style="font-size:11px;padding:4px 10px;border-radius:6px">Расходы</button>
          </div>
        </div>
        <div style="display:flex;gap:14px;margin-bottom:8px;font-size:12px;color:#6B7A99">
          <span><span style="display:inline-block;width:10px;height:10px;background:#003D7C;border-radius:2px;margin-right:6px"></span>Апрель</span>
          <span><span style="display:inline-block;width:10px;height:10px;background:#CBD5E8;border-radius:2px;margin-right:6px"></span>Март</span>
        </div>
        <FcChart type="bar" :data="compareData" :options="compareOptions" :height="280" />
      </div>

      <div class="fc-card">
        <div class="fc-card-header">
          <div>
            <div class="fc-card-title">Структура расходов</div>
            <div class="fc-card-sub">Апрель 2026 · 198 000 000 UZS</div>
          </div>
        </div>
        <div style="position:relative;height:200px;display:flex;align-items:center;justify-content:center">
          <FcChart type="doughnut" :data="donutData" :options="donutOptions" :height="200" />
          <div style="position:absolute;text-align:center;pointer-events:none">
            <div class="fc-num" style="font-size:18px;color:#003D7C">Закупки</div>
            <div style="font-size:12px;color:#6B7A99">34% · 67.3М</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:5px;margin-top:14px">
          <div v-for="e in expenseStructure" :key="e.label" class="flex items-center gap-2" style="font-size:12px">
            <span :style="{ width:'10px', height:'10px', borderRadius:'2px', background:e.color }"></span>
            <span style="flex:1;color:#1A2B4A">{{ e.label }}</span>
            <span class="fc-num" style="color:#003D7C">{{ e.value }}%</span>
            <span class="fc-num" style="color:#6B7A99;font-weight:600">{{ e.amount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Expense categories -->
    <div class="flex items-center justify-between" style="margin-bottom:12px">
      <h3 class="fc-card-title" style="font-size:16px">Категории расходов</h3>
      <button class="fc-link">Управление →</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:24px">
      <div v-for="c in expenseCategories" :key="c.name" class="fc-card" style="padding:16px;position:relative">
        <div class="flex items-center justify-between" style="margin-bottom:8px">
          <div style="font-size:24px">{{ c.emoji }}</div>
          <span class="fc-badge" :class="c.trendTone">{{ c.trend }}</span>
        </div>
        <div style="font-weight:700;color:#1A2B4A;font-size:14px;margin-bottom:4px">{{ c.name }}</div>
        <div class="fc-num" style="color:#003D7C;font-size:18px">{{ c.amount }} <span style="font-size:11px;opacity:.55">UZS</span></div>
        <div style="font-size:11px;color:#6B7A99;margin:6px 0">{{ c.share }}% от расходов</div>
        <div class="fc-bar"><div class="fc-bar-fill" :class="c.overspend ? 'red' : 'blue'" :style="{ width: c.bar + '%' }"></div></div>
        <div v-if="c.overspend" class="fc-banner red" style="margin-top:8px;padding:6px 10px;font-size:11.5px">
          <AppIcon name="warning" /> Перерасход
        </div>
      </div>
    </div>

    <!-- Income categories -->
    <div class="flex items-center justify-between" style="margin-bottom:12px">
      <h3 class="fc-card-title" style="font-size:16px">Категории доходов</h3>
      <button class="fc-link">Подробнее →</button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:24px">
      <div v-for="c in incomeCategories" :key="c.name" class="fc-card" style="padding:16px">
        <div style="font-size:24px;margin-bottom:8px">{{ c.emoji }}</div>
        <div style="font-weight:700;color:#1A2B4A;font-size:14px;margin-bottom:4px">{{ c.name }}</div>
        <div class="fc-num green" style="font-size:18px">{{ c.amount }} <span style="font-size:11px;opacity:.55;color:#6B7A99">UZS</span></div>
        <div style="font-size:11px;color:#6B7A99;margin:6px 0">{{ c.share }}% от доходов</div>
        <div class="fc-bar"><div class="fc-bar-fill green" :style="{ width: c.bar + '%' }"></div></div>
      </div>
    </div>

    <!-- Transactions -->
    <div class="fc-card" style="padding:0;overflow:hidden">
      <div class="fc-card-header" style="padding:18px 18px 14px">
        <div>
          <div class="fc-card-title">Транзакции</div>
          <div class="fc-card-sub">Апрель 2026</div>
        </div>
        <div class="flex items-center gap-2">
          <div style="display:flex;background:#F0F4FA;border-radius:8px;padding:2px">
            <button v-for="t in [{k:'all',l:'Все'},{k:'income',l:'Доходы'},{k:'expense',l:'Расходы'}]" :key="t.k"
              class="fc-period-pill" :class="{active:txTab===t.k}" @click="txTab=t.k" style="font-size:11px;padding:4px 10px;border-radius:6px">{{ t.l }}</button>
          </div>
          <select class="fc-select" style="width:auto;height:34px;font-size:12px;padding:0 10px"><option>Все категории</option><option>Закупки</option><option>Зарплата</option><option>Налоги</option><option>Аренда</option><option>Маркетинг</option><option>Прочее</option></select>
          <input class="fc-input" placeholder="Поиск…" style="height:34px;width:180px;font-size:12px" />
          <span style="font-size:12px;color:#6B7A99">Показано 7 из 86</span>
        </div>
      </div>
      <table class="fc-table">
        <thead>
          <tr><th>Дата</th><th>Контрагент</th><th>Категория</th><th>Назначение</th><th style="text-align:right">Доход</th><th style="text-align:right">Расход</th><th>Счёт</th></tr>
        </thead>
        <tbody>
          <tr v-for="(tx, i) in transactions.slice(0,7)" :key="i" class="clickable">
            <td><div style="font-size:12.5px">{{ tx.date }}</div><div style="font-size:11px;color:#6B7A99">{{ tx.time }}</div></td>
            <td><div class="flex items-center gap-2"><span class="fc-av" :class="tx.avTone" style="width:26px;height:26px;font-size:10px">{{ tx.av }}</span><span style="font-weight:600;font-size:13px">{{ tx.name }}</span></div></td>
            <td><span class="fc-badge" :class="tx.categoryTone">{{ tx.category }}</span></td>
            <td style="font-size:12px;color:#6B7A99">{{ tx.purpose }}</td>
            <td style="text-align:right"><span v-if="tx.income" class="fc-num green">{{ tx.income }}</span><span v-else style="color:#CBD5E8">—</span></td>
            <td style="text-align:right"><span v-if="tx.expense" class="fc-num red">{{ tx.expense }}</span><span v-else style="color:#CBD5E8">—</span></td>
            <td style="font-size:12px;color:#6B7A99">{{ tx.account }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
