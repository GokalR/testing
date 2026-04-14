<script setup>
import { ref } from 'vue'
import FcHeader from '@/components/fincontrol/FcHeader.vue'
import FcChart from '@/components/fincontrol/FcChart.vue'
import AppIcon from '@/components/AppIcon.vue'
import { counterparties } from '@/data/fincontrol'

const filter = ref('all')
const showRiskBanner = ref(true)
const showAddModal = ref(false)
const detail = ref(null)

const detailChartData = {
  labels: ['Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр'],
  datasets: [{
    data: [4.8, 5.2, 6.1, 7.0, 8.4, 10.0],
    backgroundColor: 'rgba(0,166,81,.6)',
    borderColor: '#00A651',
    borderWidth: 1,
    borderRadius: 5,
  }],
}
const detailChartOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#6B7A99', font: { size: 10 } } },
    y: { grid: { color: '#F0F4FA' }, ticks: { color: '#6B7A99', font: { size: 10 }, callback: (v) => `${v}М` } },
  },
}

function open(cp) { detail.value = cp }
function close() { detail.value = null }
</script>

<template>
  <FcHeader
    title="Контрагенты"
    search="Поиск по названию, ИНН…"
    :primary-action="{ label:'Добавить контрагента', icon:'add' }"
    @primary="showAddModal = true"
  />

  <div class="fc-content">
    <div class="fc-page-title">
      <div class="eyebrow">FinControl / База клиентов</div>
      <h1>Контрагенты</h1>
      <p class="subtitle"><span class="fc-green-line"></span>Управление контрагентами и анализ оборота</p>
    </div>

    <!-- KPI strip -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px">
      <div class="fc-kpi" style="border-top:3px solid #003D7C">
        <div class="fc-kpi-label">Всего контрагентов</div>
        <div class="fc-kpi-value navy">47</div>
        <div class="fc-kpi-sub">+3 новых за апрель · 12 регулярных</div>
      </div>
      <div class="fc-kpi" style="border-top:3px solid #00A651">
        <div class="fc-kpi-label">Топ плательщик</div>
        <div style="font-weight:700;font-size:15px;color:#1A2B4A">ИП Рашидов А.</div>
        <div class="fc-kpi-value green" style="font-size:18px;margin-top:2px">35 600 000 <span style="font-size:11px;opacity:.55">UZS</span></div>
        <div class="fc-kpi-sub" style="color:#00A651">↑ 67% от всех поступлений</div>
      </div>
      <div class="fc-kpi" style="border-top:3px solid #F59E0B">
        <div class="fc-kpi-label">Топ получатель</div>
        <div style="font-weight:700;font-size:15px;color:#1A2B4A">ООО АрендаГрупп</div>
        <div class="fc-kpi-value amber" style="font-size:18px;margin-top:2px">12 800 000 <span style="font-size:11px;opacity:.55">UZS</span></div>
        <div class="fc-kpi-sub">Доля расходов: 18.4%</div>
      </div>
    </div>

    <!-- Risk banner -->
    <div v-if="showRiskBanner" class="fc-banner red" style="margin-bottom:18px;align-items:center">
      <AppIcon name="warning" />
      <span style="flex:1"><b>Высокая концентрация:</b> ИП Рашидов А. обеспечивает <b>67% поступлений</b>. Потеря этого клиента критически повлияет на выручку. Рекомендуем диверсификацию клиентской базы.</span>
      <button class="fc-icon-btn" style="background:transparent" @click="showRiskBanner = false"><AppIcon name="close" /></button>
    </div>

    <!-- Counterparties table -->
    <div class="fc-card" style="padding:0;overflow:hidden">
      <div class="fc-card-header" style="padding:18px 18px 14px">
        <div>
          <div class="fc-card-title">Все контрагенты</div>
          <div class="fc-card-sub">Май 2026 · Нажмите на строку для деталей</div>
        </div>
        <div class="flex items-center gap-2">
          <div style="display:flex;background:#F0F4FA;border-radius:8px;padding:2px">
            <button v-for="t in [{k:'all',l:'Все'},{k:'payers',l:'Плательщики'},{k:'recipients',l:'Получатели'},{k:'regular',l:'Регулярные'}]" :key="t.k"
              class="fc-period-pill" :class="{active:filter===t.k}" @click="filter=t.k" style="font-size:11px;padding:4px 10px;border-radius:6px">{{ t.l }}</button>
          </div>
          <select class="fc-select" style="width:auto;height:34px;font-size:12px;padding:0 10px"><option>По сумме ↓</option><option>По имени</option><option>По транзакциям</option><option>По дате</option></select>
          <span style="font-size:12px;color:#6B7A99">47 контрагентов</span>
        </div>
      </div>
      <table class="fc-table">
        <thead>
          <tr><th>Контрагент</th><th>Тип</th><th style="text-align:center">Транзакций</th><th style="text-align:right">Общая сумма</th><th>Последняя операция</th><th>Статус</th></tr>
        </thead>
        <tbody>
          <tr v-for="cp in counterparties" :key="cp.inn" class="clickable" @click="open(cp)">
            <td>
              <div class="flex items-center gap-3">
                <span class="fc-av" :class="cp.tone">{{ cp.initials }}</span>
                <div>
                  <div style="font-weight:700;font-size:13px;color:#1A2B4A">{{ cp.name }}</div>
                  <div style="font-size:11px;color:#6B7A99;font-family:'Manrope';font-variant-numeric:tabular-nums">ИНН: {{ cp.inn }}</div>
                </div>
              </div>
            </td>
            <td><span class="fc-badge" :class="cp.typeTone">{{ cp.type }}</span></td>
            <td style="text-align:center;font-weight:700">{{ cp.tx }}</td>
            <td style="text-align:right" class="fc-num" :class="cp.amountTone">{{ cp.amount }}</td>
            <td style="font-size:12px;color:#6B7A99">{{ cp.last }}</td>
            <td><span class="fc-badge" :class="cp.statusTone">{{ cp.status }}</span></td>
          </tr>
        </tbody>
      </table>
      <div style="display:flex;justify-content:space-between;padding:14px 18px;border-top:1px solid #DDE3EE">
        <button class="fc-cta-ghost" style="padding:6px 12px;font-size:12px"><AppIcon name="expand_more" /> Загрузить ещё</button>
        <div class="flex items-center gap-1">
          <button class="fc-period-pill active" style="padding:4px 10px">1</button>
          <button class="fc-period-pill" style="padding:4px 10px">2</button>
          <button class="fc-period-pill" style="padding:4px 10px">3</button>
        </div>
      </div>
    </div>

    <!-- Slide panel -->
    <div class="fc-panel-overlay" :class="{ open: detail }" @click="close"></div>
    <aside class="fc-panel" :class="{ open: detail }">
      <template v-if="detail">
        <header class="fc-panel-head">
          <div class="flex items-center gap-3">
            <span class="fc-av" :class="detail.tone" style="width:48px;height:48px;font-size:16px;border-radius:12px">{{ detail.initials }}</span>
            <div>
              <div style="font-family:'Manrope';font-weight:800;font-size:18px;color:#003D7C">{{ detail.name }}</div>
              <div style="font-size:12px;color:#6B7A99">ИНН: {{ detail.inn }} · <span class="fc-badge" :class="detail.statusTone" style="margin-left:4px">● {{ detail.status }}</span></div>
            </div>
          </div>
          <button class="fc-icon-btn" @click="close"><AppIcon name="close" /></button>
        </header>
        <div class="fc-panel-body">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px">
            <div style="background:#F8FAFC;padding:12px;border-radius:9px;text-align:center">
              <div style="font-size:11px;color:#6B7A99;text-transform:uppercase;letter-spacing:.5px">Транзакций</div>
              <div class="fc-num" style="color:#003D7C;font-size:18px">{{ detail.tx }}</div>
            </div>
            <div style="background:#F8FAFC;padding:12px;border-radius:9px;text-align:center">
              <div style="font-size:11px;color:#6B7A99;text-transform:uppercase;letter-spacing:.5px">Оборот</div>
              <div class="fc-num" :class="detail.amountTone" style="font-size:18px">{{ detail.amount }}</div>
            </div>
            <div style="background:#F8FAFC;padding:12px;border-radius:9px;text-align:center">
              <div style="font-size:11px;color:#6B7A99;text-transform:uppercase;letter-spacing:.5px">Последняя</div>
              <div class="fc-num" style="color:#003D7C;font-size:14px">{{ detail.last }}</div>
            </div>
          </div>

          <div class="fc-card-title" style="font-size:13px;margin-bottom:8px">Поступления за 6 месяцев</div>
          <FcChart type="bar" :data="detailChartData" :options="detailChartOptions" :height="180" />

          <div class="fc-card-title" style="font-size:13px;margin:18px 0 8px">История транзакций</div>
          <table class="fc-table" style="border-radius:8px;border:1px solid #DDE3EE">
            <tbody>
              <tr v-for="(tx, i) in [
                { date: '14 апр', desc: 'Оплата по дог. №145-А', acc: 'NBU •4402', cat: 'Продажи', amt: '+14 200 000' },
                { date: '02 апр', desc: 'Аванс апрель 2026', acc: 'NBU •4402', cat: 'Продажи', amt: '+10 000 000' },
                { date: '18 мар', desc: 'Финальный расчёт мар', acc: 'HBK •1192', cat: 'Продажи', amt: '+7 400 000' },
                { date: '04 мар', desc: 'Аванс март 2026', acc: 'NBU •4402', cat: 'Продажи', amt: '+4 000 000' },
              ]" :key="i">
                <td style="font-size:11.5px;color:#6B7A99">{{ tx.date }}</td>
                <td style="font-size:12px"><div>{{ tx.desc }}</div><div style="color:#6B7A99;font-size:10.5px">{{ tx.acc }} · {{ tx.cat }}</div></td>
                <td style="text-align:right" class="fc-num green">{{ tx.amt }}</td>
              </tr>
            </tbody>
          </table>

          <div class="fc-banner amber" style="margin-top:18px">
            <AppIcon name="auto_awesome" filled />
            <div><b>AI-анализ:</b> ИП Рашидов А. обеспечивает <b>67% всех поступлений</b> — критическая зависимость. Рекомендуется развитие новых каналов продаж.</div>
          </div>
        </div>
        <footer class="fc-panel-foot">
          <button class="fc-cta-ghost">Редактировать</button>
          <button class="fc-cta-primary">Все транзакции →</button>
        </footer>
      </template>
    </aside>

    <!-- Add modal -->
    <div v-if="showAddModal" style="position:fixed;inset:0;background:rgba(15,23,42,.5);z-index:200;display:flex;align-items:center;justify-content:center" @click.self="showAddModal = false">
      <div style="background:white;border-radius:14px;padding:22px;max-width:480px;width:92%">
        <div class="flex items-center justify-between" style="margin-bottom:16px">
          <h3 class="fc-card-title" style="font-size:17px">Добавить контрагента</h3>
          <button class="fc-icon-btn" @click="showAddModal = false"><AppIcon name="close" /></button>
        </div>
        <div class="fc-form-field"><label>Название / ФИО *</label><input class="fc-input" placeholder="ООО «Компания» или ИП Фамилия И.О." /></div>
        <div class="grid grid-cols-2 gap-3">
          <div class="fc-form-field"><label>ИНН</label><input class="fc-input" placeholder="например: 302 841 956" maxlength="15" /></div>
          <div class="fc-form-field"><label>Тип контрагента</label>
            <select class="fc-select"><option>Плательщик</option><option>Получатель</option><option>Плательщик / Получатель</option><option>Гос. орган</option></select>
          </div>
        </div>
        <div class="fc-form-field"><label>Организационная форма</label>
          <select class="fc-select"><option>ООО</option><option>АО</option><option selected>ИП</option><option>Физическое лицо</option><option>Гос. орган</option></select>
        </div>
        <div class="fc-form-field"><label>Комментарий</label><textarea class="fc-textarea" placeholder="Доп. информация…"></textarea></div>
        <div class="flex gap-3 justify-end" style="margin-top:16px">
          <button class="fc-cta-ghost" @click="showAddModal = false">Отмена</button>
          <button class="fc-cta-primary" @click="showAddModal = false">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>
