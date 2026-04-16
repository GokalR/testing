<script setup>
import { ref, nextTick, computed } from 'vue'
import FcChart from '@/components/fincontrol/FcChart.vue'
import AppIcon from '@/components/AppIcon.vue'

const lang = ref('ru')
const inputText = ref('')
const messages = ref([])
const typing = ref(false)
const scrollRef = ref(null)

const quickQuestions = [
  { icon: 'trending_up', text: 'Какие расходы выросли больше всего?' },
  { icon: 'schedule', text: 'Когда возможен кассовый разрыв?' },
  { icon: 'group', text: 'Топ контрагент по поступлениям?' },
  { icon: 'insights', text: 'Сравни этот месяц с прошлым' },
  { icon: 'percent', text: 'Сколько уходит на налоги и зарплату?' },
  { icon: 'show_chart', text: 'Как изменился чистый CF за 3 месяца?' },
]

const cannedAnswers = [
  { match: /расход|выросл/i, kind: 'expenseGrowth' },
  { match: /сравн|поток|денеж|cf/i, kind: 'cfCompare' },
  { match: /разрыв|кассов|ликвид/i, kind: 'cashGap' },
  { match: /налог|зарплат/i, kind: 'taxShare' },
  { match: /контрагент|плательщик|поступ/i, kind: 'topPayer' },
]
let fallbackIdx = 0
const fallbackKinds = ['balance', 'topPayer', 'taxShare', 'cfTrend']

const seed = () => [
  { role: 'user', time: '10:14', text: 'Какие расходы выросли больше всего за май 2025?' },
  { role: 'ai', time: '10:14', kind: 'expenseGrowth' },
  { role: 'user', time: '10:16', text: 'Сравни денежные потоки этого месяца с прошлым — доходы, расходы и чистый CF' },
  { role: 'ai', time: '10:16', kind: 'cfCompare' },
  { role: 'user', time: '10:19', text: 'Когда может возникнуть кассовый разрыв?' },
  { role: 'ai', time: '10:19', kind: 'cashGap' },
]

messages.value = seed()

const hasMessages = computed(() => messages.value.length > 0)

const compareData = {
  labels: ['Доходы', 'Расходы', 'Чистый CF'],
  datasets: [
    { label: 'Апрель 2025', data: [295, 173, 142], backgroundColor: 'rgba(0,61,124,.18)', borderColor: '#003D7C', borderWidth: 1.5, borderRadius: 4 },
    { label: 'Май 2025', data: [320, 198, 122], backgroundColor: ['rgba(0,166,81,.55)', 'rgba(224,56,75,.55)', 'rgba(0,84,166,.55)'], borderColor: ['#00A651', '#E0384B', '#0054A6'], borderWidth: 1.5, borderRadius: 4 },
  ],
}
const compareOptions = {
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#6B7A99', font: { size: 10 } } },
    y: { grid: { color: '#F0F4FA' }, ticks: { color: '#6B7A99', font: { size: 10 }, callback: (v) => `${v}М` } },
  },
}

function nowTime() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
function scroll() {
  nextTick(() => {
    if (scrollRef.value) scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  })
}
function pickKind(text) {
  for (const c of cannedAnswers) if (c.match.test(text)) return c.kind
  const k = fallbackKinds[fallbackIdx % fallbackKinds.length]
  fallbackIdx += 1
  return k
}
function send(text) {
  const t = (text ?? inputText.value).trim()
  if (!t) return
  messages.value.push({ role: 'user', time: nowTime(), text: t })
  inputText.value = ''
  typing.value = true
  scroll()
  setTimeout(() => {
    typing.value = false
    messages.value.push({ role: 'ai', time: nowTime(), kind: pickKind(t) })
    scroll()
  }, 1500)
}
function newDialog() {
  messages.value = []
  typing.value = false
}
function onKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}
</script>

<template>
  <!-- Compact chat header (replaces FcHeader) -->
  <header class="fc-header" style="gap:14px">
    <div class="flex items-center gap-3" style="flex:1">
      <div style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#F59E0B,#F97316);display:flex;align-items:center;justify-content:center;color:white">
        <AppIcon name="auto_awesome" filled />
      </div>
      <div>
        <div style="font-family:'Manrope';font-weight:800;font-size:16px;color:#1A2B4A">AI-помощник FinControl</div>
        <div style="font-size:11px;color:#6B7A99">Анализ реальных транзакций · Май 2025</div>
      </div>
    </div>

    <div style="display:flex;background:#F0F4FA;border-radius:8px;padding:2px">
      <button class="fc-period-pill" :class="{active:lang==='ru'}" @click="lang='ru'" style="font-size:11px;padding:4px 10px;border-radius:6px">RU</button>
      <button class="fc-period-pill" :class="{active:lang==='uz'}" @click="lang='uz'" style="font-size:11px;padding:4px 10px;border-radius:6px">UZ</button>
    </div>
    <button class="fc-primary-btn" @click="newDialog"><AppIcon name="add" /> Новый диалог</button>
    <button class="fc-icon-btn"><AppIcon name="help" /></button>
    <div class="fc-avatar">АБ</div>
  </header>

  <div class="fc-content" style="padding:0;display:grid;grid-template-columns:264px 1fr;gap:0;height:calc(100vh - 60px);overflow:hidden">
    <!-- LEFT: Quick questions -->
    <aside style="background:white;border-right:1px solid #DDE3EE;padding:18px;overflow-y:auto">
      <div class="flex items-center gap-2" style="margin-bottom:3px">
        <AppIcon name="auto_awesome" filled style="color:#F59E0B" />
        <div style="font-family:'Manrope';font-weight:800;font-size:14px;color:#1A2B4A">Быстрые вопросы</div>
      </div>
      <div style="font-size:11px;color:#6B7A99;margin-bottom:14px">Нажмите для мгновенного ответа</div>

      <div style="display:flex;flex-direction:column;gap:6px">
        <button v-for="q in quickQuestions" :key="q.text"
          class="flex items-center gap-2" style="text-align:left;padding:9px 10px;border-radius:9px;background:#F8FAFC;border:1px solid transparent;cursor:pointer;transition:all .15s"
          @mouseover="(e) => { e.currentTarget.style.background = 'rgba(245,158,11,.08)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,.2)' }"
          @mouseleave="(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = 'transparent' }"
          @click="send(q.text)">
          <div style="width:28px;height:28px;border-radius:7px;background:rgba(245,158,11,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <AppIcon :name="q.icon" style="color:#F59E0B;font-size:15px" />
          </div>
          <span style="flex:1;font-size:12px;color:#1A2B4A;line-height:1.3">{{ q.text }}</span>
          <AppIcon name="chevron_right" style="color:#CBD5E8;font-size:16px" />
        </button>
      </div>

      <div style="border-top:1px solid #DDE3EE;margin:16px 0 12px"></div>
      <div style="font-size:10.5px;color:#6B7A99;text-transform:uppercase;letter-spacing:.5px;font-weight:700;margin-bottom:8px">Контекст анализа</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
        <div class="flex justify-between"><span style="color:#6B7A99">Период</span><span style="color:#1A2B4A;font-weight:600">Май 2025</span></div>
        <div class="flex justify-between"><span style="color:#6B7A99">Счета</span><span style="color:#1A2B4A;font-weight:600">все 3</span></div>
        <div class="flex justify-between"><span style="color:#6B7A99">Валюта</span><span style="color:#1A2B4A;font-weight:600">UZS</span></div>
        <div class="flex justify-between"><span style="color:#6B7A99">Данные</span><button class="fc-link" style="font-size:12px">Изменить период</button></div>
      </div>

      <div style="border-top:1px solid #DDE3EE;margin:16px 0 12px"></div>
      <div style="font-size:11.5px;color:#6B7A99;line-height:1.5"><b style="color:#1A2B4A">FinControl AI</b> анализирует ваши реальные транзакции и даёт персонализированные рекомендации.</div>

      <div style="font-size:10.5px;color:#94A3B8;font-style:italic;margin-top:18px;line-height:1.4">* AI-ответы носят информационный характер и не являются финансовой консультацией.</div>
    </aside>

    <!-- CENTER: Chat -->
    <div style="display:flex;flex-direction:column;background:#F7F9FB;overflow:hidden">
      <!-- Chat sub-header -->
      <div class="flex items-center gap-3" style="padding:12px 20px;background:white;border-bottom:1px solid #DDE3EE">
        <div style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#F59E0B,#F97316);display:flex;align-items:center;justify-content:center;color:white">
          <AppIcon name="auto_awesome" filled />
        </div>
        <div style="flex:1">
          <div style="font-family:'Manrope';font-weight:800;font-size:14px;color:#1A2B4A">FinControl AI</div>
          <div style="font-size:11px;color:#6B7A99">Анализирует данные за Май 2025</div>
        </div>
        <span class="fc-badge blue">{{ lang.toUpperCase() }}</span>
        <div class="flex items-center gap-1">
          <span style="width:8px;height:8px;border-radius:50%;background:#00A651;animation:ai-pulse 1.8s infinite"></span>
          <span style="font-size:11px;color:#6B7A99">Онлайн</span>
        </div>
      </div>

      <!-- Messages -->
      <div ref="scrollRef" style="flex:1;overflow-y:auto;padding:20px">
        <!-- Empty state -->
        <div v-if="!hasMessages" style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
          <div style="width:72px;height:72px;border-radius:18px;background:rgba(245,158,11,.12);display:flex;align-items:center;justify-content:center;margin-bottom:16px;box-shadow:0 0 30px rgba(245,158,11,.25)">
            <AppIcon name="auto_awesome" filled style="color:#F59E0B;font-size:38px" />
          </div>
          <h2 style="font-family:'Manrope';font-weight:800;font-size:20px;color:#1A2B4A;margin-bottom:8px">Привет! Я ваш финансовый AI-помощник</h2>
          <p style="font-size:13.5px;color:#6B7A99;max-width:440px;margin-bottom:18px">Задайте любой вопрос о финансах вашего бизнеса — расходах, доходах, кассовых разрывах и трендах. Анализирую реальные данные за Май 2025.</p>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:560px">
            <button v-for="q in quickQuestions.slice(0,3)" :key="q.text"
              style="padding:12px;background:white;border:1px solid #DDE3EE;border-radius:11px;font-size:12px;color:#1A2B4A;cursor:pointer;text-align:left"
              @click="send(q.text)">
              <AppIcon :name="q.icon" style="color:#F59E0B;font-size:16px;margin-bottom:6px" />
              <div>{{ q.text }}</div>
            </button>
          </div>
        </div>

        <!-- Messages list -->
        <div v-else style="display:flex;flex-direction:column;gap:16px">
          <template v-for="(m, idx) in messages" :key="idx">
            <!-- USER -->
            <div v-if="m.role === 'user'" class="flex gap-2" style="justify-content:flex-end">
              <div style="max-width:70%">
                <div style="background:linear-gradient(135deg,#003D7C,#0054A6);color:white;padding:10px 14px;border-radius:14px 14px 4px 14px;font-size:13.5px;line-height:1.5">{{ m.text }}</div>
                <div style="font-size:10.5px;color:#94A3B8;margin-top:4px;text-align:right">{{ m.time }}</div>
              </div>
              <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#003D7C,#0054A6);color:white;font-family:'Manrope';font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0">АБ</div>
            </div>

            <!-- AI -->
            <div v-else class="flex gap-2" style="align-items:flex-start">
              <div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#F59E0B,#F97316);display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0">
                <AppIcon name="auto_awesome" filled style="font-size:18px" />
              </div>
              <div :style="`max-width:75%;background:white;border:1px solid #DDE3EE;padding:14px;border-radius:14px 14px 14px 4px;${m.kind === 'cashGap' ? 'border-left:3px solid #F59E0B;' : ''}`">
                <!-- Expense growth -->
                <template v-if="m.kind === 'expenseGrowth'">
                  <div style="font-size:13.5px;line-height:1.5;color:#1A2B4A;margin-bottom:10px">За <b>май 2025</b> наибольший рост расходов зафиксирован в трёх категориях:</div>
                  <div style="border:1px solid #DDE3EE;border-radius:9px;overflow:hidden;margin-bottom:10px">
                    <table class="fc-table" style="margin:0">
                      <thead><tr><th>Категория</th><th style="text-align:right">Сумма</th><th style="text-align:right">Δ к апрелю</th></tr></thead>
                      <tbody>
                        <tr><td><span class="flex items-center gap-2"><span style="width:8px;height:8px;border-radius:50%;background:#A855F7"></span>Маркетинг</span></td><td style="text-align:right" class="fc-num">13 200 000 UZS</td><td style="text-align:right"><span class="fc-badge red">▲ +18%</span></td></tr>
                        <tr><td><span class="flex items-center gap-2"><span style="width:8px;height:8px;border-radius:50%;background:#0054A6"></span>Закупки</span></td><td style="text-align:right" class="fc-num">61 600 000 UZS</td><td style="text-align:right"><span class="fc-badge red">▲ +12%</span></td></tr>
                        <tr><td><span class="flex items-center gap-2"><span style="width:8px;height:8px;border-radius:50%;background:#F59E0B"></span>Налоги</span></td><td style="text-align:right" class="fc-num">27 600 000 UZS</td><td style="text-align:right"><span class="fc-badge amber">▲ +5%</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div style="font-size:12.5px;color:#6B7A99;line-height:1.5;margin-bottom:8px">📈 Маркетинг вырос на 18% — возможно, связано с запуском новой рекламной кампании. Закупки также растут опережающими темпами.</div>
                  <button class="fc-link" style="font-size:13px">→ Открыть Доходы и расходы</button>
                </template>

                <!-- CF compare -->
                <template v-else-if="m.kind === 'cfCompare'">
                  <div style="font-size:13.5px;line-height:1.5;color:#1A2B4A;margin-bottom:10px">Сравнение <b>Апрель → Май 2025</b> по ключевым потокам:</div>
                  <div style="border:1px solid #DDE3EE;border-radius:9px;padding:10px;margin-bottom:10px">
                    <FcChart type="bar" :data="compareData" :options="compareOptions" :height="140" />
                  </div>
                  <div style="font-size:12.5px;color:#6B7A99;line-height:1.5;margin-bottom:8px">🟢 Доходы +8.5% · 🔴 Расходы +14.5% · 🔵 Чистый CF −14%. Опережающий рост расходов съедает прирост выручки.</div>
                  <button class="fc-link" style="font-size:13px">→ Открыть движение денег</button>
                </template>

                <!-- Cash gap -->
                <template v-else-if="m.kind === 'cashGap'">
                  <div style="font-size:13.5px;line-height:1.5;color:#1A2B4A;margin-bottom:10px">Проанализировав обязательства до конца мая и текущий баланс:</div>
                  <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:10px">
                    <div v-for="o in [
                      { dot:'#F59E0B', name:'НДС (квартальный)', date:'Срок: 25 мая 2025', amt:'−18 400 000 UZS' },
                      { dot:'#00A651', name:'Зарплата', date:'Срок: 31 мая 2025', amt:'−50 000 000 UZS' },
                      { dot:'#E0384B', name:'Аренда офиса', date:'Срок: 1 июня 2025', amt:'−8 500 000 UZS' },
                    ]" :key="o.name" class="flex items-center gap-2" style="background:#F8FAFC;padding:9px 11px;border-radius:8px">
                      <span :style="{ width:'8px', height:'8px', borderRadius:'50%', background:o.dot }"></span>
                      <div style="flex:1">
                        <div style="font-weight:700;font-size:12.5px;color:#1A2B4A">{{ o.name }}</div>
                        <div style="font-size:11px;color:#6B7A99">{{ o.date }}</div>
                      </div>
                      <span class="fc-num red" style="font-weight:700">{{ o.amt }}</span>
                    </div>
                  </div>
                  <div style="font-size:12.5px;color:#1A2B4A;margin-bottom:8px">Суммарные обязательства: <b>76 900 000 UZS</b>. Текущий баланс: <b>842 500 000 UZS</b>. Покрытие достаточное.</div>
                  <div style="display:inline-flex;align-items:center;gap:6px;background:rgba(0,166,81,.1);color:#00A651;padding:6px 12px;border-radius:20px;font-weight:700;font-size:12px;margin-bottom:8px">
                    <AppIcon name="check_circle" filled style="font-size:14px" /> Ликвидность в норме — до конца мая кассовый разрыв не прогнозируется
                  </div>
                  <div><button class="fc-link" style="font-size:13px">→ Открыть Планирование</button></div>
                </template>

                <template v-else-if="m.kind === 'balance'">
                  <div style="font-size:13.5px;line-height:1.5;color:#1A2B4A">Текущий баланс по всем счетам: <b>842 500 000 UZS</b>. Остаток на NBU Institutional — 524 М, Hamkorbank — 215 М, касса — 103 М.</div>
                </template>
                <template v-else-if="m.kind === 'topPayer'">
                  <div style="font-size:13.5px;line-height:1.5;color:#1A2B4A">Топ-плательщик за май — <b>ООО «Стройком»</b>, поступления 120 000 000 UZS (≈37% от входящих). Следующий — ИП Рашидов А., 35 600 000 UZS.</div>
                </template>
                <template v-else-if="m.kind === 'taxShare'">
                  <div style="font-size:13.5px;line-height:1.5;color:#1A2B4A">На налоги и зарплату уходит <b>39%</b> расходов мая: налоги 27.6 М (14%) + зарплата 50.5 М (25.5%). В апреле доля была 41%.</div>
                </template>
                <template v-else-if="m.kind === 'cfTrend'">
                  <div style="font-size:13.5px;line-height:1.5;color:#1A2B4A">Чистый CF за 3 месяца: Мар 138 М → Апр 142 М → Май <b>122 М</b>. Небольшой откат из-за роста расходов на маркетинг и закупки.</div>
                </template>

                <div style="font-size:10.5px;color:#94A3B8;font-style:italic;border-top:1px solid #F0F4FA;margin-top:10px;padding-top:6px">* AI-ответ носит информационный характер и не является финансовой консультацией.</div>
                <div style="font-size:10.5px;color:#94A3B8;margin-top:4px">{{ m.time }}</div>
              </div>
            </div>
          </template>

          <!-- Typing indicator -->
          <div v-if="typing" class="flex gap-2" style="align-items:flex-start">
            <div style="width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#F59E0B,#F97316);display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0">
              <AppIcon name="auto_awesome" filled style="font-size:18px" />
            </div>
            <div style="background:white;border:1px solid #DDE3EE;padding:12px 14px;border-radius:14px 14px 14px 4px;display:flex;gap:4px">
              <span v-for="i in 3" :key="i" :style="{ width:'7px', height:'7px', borderRadius:'50%', background:'#F59E0B', animation:'ai-dot 1.4s infinite', animationDelay: `${i * 0.15}s` }"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div style="padding:14px 20px;background:white;border-top:1px solid #DDE3EE">
        <div style="display:flex;gap:8px;align-items:flex-end;background:#F8FAFC;border:1px solid #DDE3EE;border-radius:12px;padding:8px 10px">
          <textarea v-model="inputText" @keydown="onKey" rows="1"
            placeholder="Задайте вопрос о финансах вашего бизнеса…"
            style="flex:1;resize:none;border:0;background:transparent;outline:none;font-family:inherit;font-size:13.5px;color:#1A2B4A;padding:6px 4px;min-height:22px;max-height:120px"></textarea>
          <button class="fc-primary-btn" :disabled="!inputText.trim()" style="padding:8px 10px" @click="send()">
            <AppIcon name="send" />
          </button>
        </div>
        <div class="flex items-center gap-2" style="font-size:11px;color:#6B7A99;margin-top:8px">
          <AppIcon name="schedule" style="font-size:12px" />
          Анализирую транзакции за Май 2025 • <b style="color:#1A2B4A">842 500 000 UZS</b> на счетах
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes ai-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,166,81,.6); }
  50% { box-shadow: 0 0 0 6px rgba(0,166,81,0); }
}
@keyframes ai-dot {
  0%, 80%, 100% { opacity: .3; transform: scale(.8); }
  40% { opacity: 1; transform: scale(1.2); }
}
</style>
