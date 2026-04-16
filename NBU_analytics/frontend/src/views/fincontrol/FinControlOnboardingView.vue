<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import '@/assets/fincontrol.css'

const router = useRouter()
const step = ref(1)
const showSuccess = ref(false)

const accounts = ref([
  { key: 'a1', name: 'Расчётный счёт', number: '•••• •••• 7841 2300', balance: '142 850 000 UZS', badge: { label: 'Текущий', tone: 'blue' }, selected: true },
  { key: 'a2', name: 'Накопительный счёт', number: '•••• •••• 4412 0088', balance: '58 200 000 UZS', badge: { label: 'Накопительный', tone: 'green' }, selected: true },
  { key: 'a3', name: 'Бизнес-карта', number: '•••• •••• 9963 5517', balance: '12 475 500 UZS', badge: { label: 'Бизнес', tone: 'amber' }, selected: true },
])

const employees = ref('6–15')
const turnover = ref('50–200М UZS')

function next() {
  if (step.value < 3) step.value++
}
function back() {
  if (step.value > 1) step.value--
}
function connect() {
  showSuccess.value = true
  setTimeout(() => {
    router.push('/tools/fincontrol/dashboard')
  }, 1800)
}

const selectedCount = computed(() => accounts.value.filter((a) => a.selected).length)
</script>

<template>
  <div class="fc-app">
    <div class="fc-onb-page">
      <div class="fc-onb-topnav">
        <div class="flex items-center gap-3">
          <div class="fc-sb-brand-icon" style="width:32px;height:32px;background:linear-gradient(135deg,#003D7C,#0054A6);box-shadow:0 3px 10px rgba(0,61,124,.3)">
            <AppIcon name="account_balance" filled />
          </div>
          <div>
            <div style="font-family:'Manrope';font-weight:800;font-size:14px;color:#003D7C">NBU Institutional</div>
            <div style="font-size:11px;color:#6B7A99">Национальный банк Узбекистана</div>
          </div>
        </div>
        <span class="fc-badge blue" style="font-size:12px;padding:5px 12px">FinControl</span>
      </div>

      <div class="fc-onb-container">
        <div class="fc-page-title" style="text-align:center">
          <div class="eyebrow" style="justify-content:center">Настройка</div>
          <h1>Подключение FinControl</h1>
          <p class="subtitle" style="justify-content:center">Бизнес-помощник — финансовая аналитика для вашей компании</p>
        </div>

        <div class="fc-stepper">
          <div class="fc-step" :class="{ active: step === 1, done: step > 1 }">
            <div class="fc-step-circle">{{ step > 1 ? '✓' : '1' }}</div>
            <div class="fc-step-label">Компания</div>
          </div>
          <div class="fc-step-conn"></div>
          <div class="fc-step" :class="{ active: step === 2, done: step > 2 }">
            <div class="fc-step-circle">{{ step > 2 ? '✓' : '2' }}</div>
            <div class="fc-step-label">О бизнесе</div>
          </div>
          <div class="fc-step-conn"></div>
          <div class="fc-step" :class="{ active: step === 3 }">
            <div class="fc-step-circle">3</div>
            <div class="fc-step-label">Счета</div>
          </div>
        </div>

        <!-- Step 1 -->
        <div v-if="step === 1" class="fc-card" style="padding:24px">
          <h2 class="fc-card-title" style="font-size:18px;margin-bottom:6px">Расскажите о вашей компании</h2>
          <p class="fc-card-sub" style="margin-bottom:16px">Для активации FinControl укажите данные о вашем бизнесе</p>

          <div class="fc-banner blue" style="margin-bottom:18px">
            <AppIcon name="info" />
            <span>Данные частично заполнены из вашего банковского профиля</span>
          </div>

          <div class="fc-form-field">
            <label>Название компании</label>
            <input class="fc-input" value="ООО «Глобал Трейд Групп»" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="fc-form-field">
              <label>Орг.-правовая форма</label>
              <select class="fc-select">
                <option>ООО</option>
                <option>ИП</option>
                <option>АО</option>
                <option>ГУП</option>
              </select>
            </div>
            <div class="fc-form-field">
              <label>ИНН</label>
              <div style="position:relative">
                <input class="fc-input" value="302 874 566" readonly style="padding-right:108px" />
                <span class="fc-badge green" style="position:absolute;right:8px;top:50%;transform:translateY(-50%)">✓ Подтверждён</span>
              </div>
            </div>
          </div>
          <div class="fc-form-field">
            <label>Отрасль деятельности</label>
            <select class="fc-select">
              <option>— Выберите отрасль —</option>
              <option selected>Оптовая и розничная торговля</option>
              <option>Производство</option>
              <option>Строительство</option>
              <option>Услуги и консалтинг</option>
              <option>Информационные технологии</option>
              <option>Сельское хозяйство</option>
              <option>Транспорт и логистика</option>
              <option>Фармацевтика и здравоохранение</option>
              <option>Другое</option>
            </select>
          </div>

          <button class="fc-cta-primary full" style="margin-top:14px" @click="next">
            Далее <AppIcon name="arrow_forward" />
          </button>
        </div>

        <!-- Step 2 -->
        <div v-if="step === 2" class="fc-card" style="padding:24px">
          <h2 class="fc-card-title" style="font-size:18px;margin-bottom:6px">Параметры вашего бизнеса</h2>
          <p class="fc-card-sub" style="margin-bottom:16px">Эти данные помогут точнее настроить аналитику</p>

          <div class="fc-form-field">
            <label>Количество сотрудников</label>
            <div class="fc-pillgroup">
              <button v-for="opt in ['1–5','6–15','16–50','50+']" :key="opt"
                type="button" class="fc-pillgroup-pill"
                :class="{ active: employees === opt }"
                @click="employees = opt">{{ opt }}</button>
            </div>
          </div>

          <div class="fc-form-field">
            <label>Годовой оборот</label>
            <div class="fc-pillgroup">
              <button v-for="opt in ['до 50М UZS','50–200М UZS','200М–1Б UZS','1Б+ UZS']" :key="opt"
                type="button" class="fc-pillgroup-pill"
                :class="{ active: turnover === opt }"
                @click="turnover = opt">{{ opt }}</button>
            </div>
          </div>

          <div style="height:1px;background:#DDE3EE;margin:18px 0"></div>

          <div style="font-size:13px;font-weight:700;color:#1A2B4A;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Контактное лицо</div>
          <div class="fc-form-field">
            <label>ФИО</label>
            <input class="fc-input" value="Ахмедов Бекзод Тулкинович" />
          </div>
          <div class="fc-form-field">
            <label>Номер телефона</label>
            <div style="position:relative">
              <AppIcon name="call" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#6B7A99" />
              <input class="fc-input" value="+998 90 256 47 12" style="padding-left:38px" />
            </div>
          </div>

          <div class="flex justify-between gap-3" style="margin-top:18px">
            <button class="fc-cta-ghost" @click="back"><AppIcon name="arrow_back" /> Назад</button>
            <button class="fc-cta-primary" @click="next">Далее <AppIcon name="arrow_forward" /></button>
          </div>
        </div>

        <!-- Step 3 -->
        <div v-if="step === 3" class="fc-card" style="padding:24px">
          <h2 class="fc-card-title" style="font-size:18px;margin-bottom:6px">Выберите счета для FinControl</h2>
          <p class="fc-card-sub" style="margin-bottom:16px">
            Выберите банковские счета, данные которых будут анализироваться в FinControl. Вы сможете изменить выбор позже в настройках.
          </p>

          <div style="display:flex;flex-direction:column;gap:10px">
            <label v-for="acc in accounts" :key="acc.key"
              style="display:flex;align-items:center;gap:14px;padding:14px;border:1.5px solid #DDE3EE;border-radius:10px;cursor:pointer"
              :style="acc.selected ? 'border-color:#0054A6;background:#EEF4FF' : ''">
              <input type="checkbox" v-model="acc.selected" style="width:20px;height:20px;accent-color:#0054A6" />
              <div style="flex:1">
                <div style="font-weight:700;color:#1A2B4A;font-size:14px">{{ acc.name }}</div>
                <div style="font-size:12px;color:#6B7A99;font-family:'Manrope';font-variant-numeric:tabular-nums">{{ acc.number }}</div>
              </div>
              <div style="text-align:right">
                <div class="fc-num" style="font-size:14px;color:#003D7C">{{ acc.balance }}</div>
                <span class="fc-badge" :class="acc.badge.tone" style="margin-top:4px">{{ acc.badge.label }}</span>
              </div>
            </label>
          </div>

          <button class="fc-link" style="margin-top:14px;font-size:13px">+ Добавить счёт из другого банка</button>

          <div style="height:1px;background:#DDE3EE;margin:18px 0"></div>

          <div class="flex justify-between gap-3 items-center" style="margin-bottom:14px">
            <button class="fc-cta-ghost" @click="back"><AppIcon name="arrow_back" /> Назад</button>
            <span class="fc-card-sub">Подключено счетов: {{ selectedCount }} из {{ accounts.length }}</span>
          </div>

          <button class="fc-cta-primary full" style="height:52px" @click="connect">
            <AppIcon name="check_circle" filled /> Подключить и запустить
          </button>
          <p class="fc-card-sub" style="text-align:center;margin-top:10px">
            <AppIcon name="info" style="vertical-align:middle;font-size:14px" />
            После подключения вы попадёте в FinControl dashboard
          </p>
        </div>
      </div>

      <!-- Success modal -->
      <div v-if="showSuccess" style="position:fixed;inset:0;background:rgba(15,23,42,.5);backdrop-filter:blur(4px);z-index:200;display:flex;align-items:center;justify-content:center">
        <div style="background:white;border-radius:16px;padding:32px;max-width:420px;width:92%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2)">
          <div style="width:64px;height:64px;border-radius:50%;background:#E6F7EE;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
            <AppIcon name="check_circle" filled style="color:#00A651;font-size:36px" />
          </div>
          <h2 style="font-family:'Manrope';font-weight:800;font-size:20px;color:#003D7C;margin-bottom:8px">FinControl подключён!</h2>
          <p style="font-size:13.5px;color:#6B7A99;margin-bottom:18px">Ваши счета успешно синхронизированы. Переходим в FinControl Dashboard…</p>
          <div style="display:flex;justify-content:center;gap:6px">
            <span v-for="i in 3" :key="i" style="width:8px;height:8px;border-radius:50%;background:#0054A6;animation:pulse 1.4s infinite" :style="{ animationDelay: `${i * 0.2}s` }"></span>
          </div>
          <p class="fc-card-sub" style="margin-top:14px">Подключено счетов: {{ selectedCount }} из {{ accounts.length }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
</style>
