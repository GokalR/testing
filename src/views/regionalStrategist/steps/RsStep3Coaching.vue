<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRsLang } from '@/composables/useRsLang'
import RsIcon from '@/components/regionalStrategist/RsIcon.vue'

const emit = defineEmits(['back', 'next'])
const { lang } = useRsLang()

const T = {
  ru: {
    stepBadge: 'ШАГ 3 ИЗ 5',
    title: 'AI Рекомендации',
    sub: 'На основе ваших ответов мы подготовили ключевые наблюдения и советы',
    typing: 'AI анализирует данные...',
    back: 'Назад',
    next: 'Запустить полный анализ',
  },
  uz: {
    stepBadge: '3-ҚАДАМ (5 ТАДАН)',
    title: 'AI Тавсиялар',
    sub: 'Жавобларингизга асосланиб асосий кузатувлар ва маслаҳатларни тайёрладик',
    typing: 'AI маълумотларни таҳлил қилмоқда...',
    back: 'Орқага',
    next: 'Тўлиқ таҳлилни бошлаш',
  },
}

const ITEMS = {
  ru: [
    { type: 'strength', title: 'Кредитная нагрузка', text: 'Нет действующих кредитов — ваша кредитная нагрузка нулевая. Это значительно повышает шансы на одобрение кредита.' },
    { type: 'strength', title: 'Стабильность бизнеса', text: 'Юридическое лицо (ООО) с опытом 3–5 лет — банк оценит стабильность и историю вашего бизнеса.' },
    { type: 'market', title: 'Конкуренция и спрос', text: 'В Маргилане 31 действующий учебный центр. Спрос растёт: город планирует обучить 1,604 безработных и подготовить 650 IT-специалистов в 2026 году.' },
    { type: 'market', title: 'Целевая аудитория', text: '54% населения Маргилана — молодёжь до 30 лет (141,500 чел.). Это значительная потенциальная аудитория для образовательных курсов.' },
    { type: 'warning', title: 'Платёжеспособность', text: 'Средняя зарплата в Маргилане — 3,974 тыс. сум/мес. Учитывайте ценовую доступность при формировании стоимости курсов.' },
    { type: 'warning', title: 'Сезонность', text: 'Образовательные курсы подвержены сезонности — летом поток снижается. Рассмотрите онлайн-формат для стабилизации дохода круглый год.' },
    { type: 'recommendation', title: 'Фокус на IT-направления', text: 'AI, data science, кибербезопасность — эти направления совпадают со стратегией развития города и программой IT-Park (инвестиции 5.0 млрд сум).' },
    { type: 'recommendation', title: 'Подходящий кредитный продукт', text: '«Бизнес прогресс» — 15% годовых, до 2 млрд сум, срок до 84 мес., льготный период до 24 мес. Оптимально для расширения вашего бизнеса.' },
  ],
  uz: [
    { type: 'strength', title: 'Кредит юки', text: 'Амалдаги кредитлар йўқ — кредит юкингиз нолга тенг. Бу кредит тасдиқланиш имкониятини сезиларли оширади.' },
    { type: 'strength', title: 'Бизнес барқарорлиги', text: 'Юридик шахс (МЧЖ) 3–5 йиллик тажриба билан — банк бизнесингизнинг барқарорлиги ва тарихини баҳолайди.' },
    { type: 'market', title: 'Рақобат ва талаб', text: 'Марғилонда 31 та фаолиятдаги ўқув маркази бор. Талаб ўсмоқда: шаҳар 2026 йилда 1,604 ишсизни ўқитиш ва 650 IT-мутахассис тайёрлашни режалаштирмоқда.' },
    { type: 'market', title: 'Мақсадли аудитория', text: 'Марғилон аҳолисининг 54% — 30 ёшгача бўлган ёшлар (141,500 киши). Бу ўқув курслари учун катта потенциал аудитория.' },
    { type: 'warning', title: 'Тўлов қобилияти', text: 'Марғилонда ўртача маош — 3,974 минг сўм/ой. Курс нархини белгилашда нарх мавжудлигини ҳисобга олинг.' },
    { type: 'warning', title: 'Мавсумийлик', text: 'Таълим курслари мавсумийликка бўйсунади — ёзда оқим камаяди. Йил давомида даромадни барқарорлаштириш учун онлайн форматни кўриб чиқинг.' },
    { type: 'recommendation', title: 'IT йўналишларига урғу беринг', text: 'AI, data science, кибер хавфсизлик — бу йўналишлар шаҳарни ривожлантириш стратегияси ва IT-Park дастури (5.0 млрд сўм инвестиция) билан мос келади.' },
    { type: 'recommendation', title: 'Мос кредит маҳсулоти', text: '«Бизнес прогресс» — йиллик 15%, 2 млрд сўмгача, муддати 84 ойгача, имтиёзли давр 24 ойгача. Бизнесингизни кенгайтириш учун оптимал.' },
  ],
}

const TYPE_CONFIG = {
  ru: {
    strength: { label: 'СИЛЬНАЯ СТОРОНА', borderClass: 'border-l-emerald-500', bgClass: 'bg-emerald-50', iconClass: 'text-emerald-600', labelClass: 'text-emerald-600' },
    market: { label: 'РЫНОК', borderClass: 'border-l-blue-500', bgClass: 'bg-blue-50', iconClass: 'text-blue-600', labelClass: 'text-blue-600' },
    warning: { label: 'ОБРАТИТЕ ВНИМАНИЕ', borderClass: 'border-l-amber-500', bgClass: 'bg-amber-50', iconClass: 'text-amber-600', labelClass: 'text-amber-600' },
    recommendation: { label: 'РЕКОМЕНДАЦИЯ', borderClass: 'border-l-navy-900', bgClass: 'bg-navy-900/[0.04]', iconClass: 'text-navy-900', labelClass: 'text-navy-900' },
  },
  uz: {
    strength: { label: 'КУЧЛИ ТОМОН', borderClass: 'border-l-emerald-500', bgClass: 'bg-emerald-50', iconClass: 'text-emerald-600', labelClass: 'text-emerald-600' },
    market: { label: 'БОЗОР', borderClass: 'border-l-blue-500', bgClass: 'bg-blue-50', iconClass: 'text-blue-600', labelClass: 'text-blue-600' },
    warning: { label: 'ЭЪТИБОР БЕРИНГ', borderClass: 'border-l-amber-500', bgClass: 'bg-amber-50', iconClass: 'text-amber-600', labelClass: 'text-amber-600' },
    recommendation: { label: 'ТАВСИЯ', borderClass: 'border-l-navy-900', bgClass: 'bg-navy-900/[0.04]', iconClass: 'text-navy-900', labelClass: 'text-navy-900' },
  },
}

const TYPE_ICONS = {
  strength: 'check-circle',
  market: 'bar-chart-3',
  warning: 'alert-triangle',
  recommendation: 'lightbulb',
}

const t = computed(() => T[lang.value])
const items = computed(() => ITEMS[lang.value])
const typeConfig = computed(() => TYPE_CONFIG[lang.value])

const visibleCount = ref(0)
let timer = null

const scheduleNext = () => {
  if (visibleCount.value >= items.value.length) return
  const delay = visibleCount.value === 0 ? 400 : 350
  timer = setTimeout(() => {
    visibleCount.value += 1
    scheduleNext()
  }, delay)
}

onMounted(scheduleNext)
onBeforeUnmount(() => timer && clearTimeout(timer))

const allVisible = computed(() => visibleCount.value >= items.value.length)
</script>

<template>
  <div class="bg-white border border-rs-border rounded-[12px] shadow-rs-card py-8 md:py-10 px-6 md:px-12 animate-rs-fade-in-up">
    <div>
      <span class="inline-flex items-center text-[12px] font-semibold text-gold-500 bg-gold-500/[0.08] rounded-[6px] py-1 px-3">{{ t.stepBadge }}</span>
      <h1 class="text-[24px] md:text-[28px] font-bold text-carbon mt-4">{{ t.title }}</h1>
      <p class="text-[14px] md:text-[15px] text-[#898989] leading-[1.5] mt-2">{{ t.sub }}</p>
    </div>

    <div class="mt-8 space-y-4">
      <div
        v-for="(item, i) in items" :key="item.title"
        :class="[
          'border-l-[3px] rounded-[10px] p-5 transition-all duration-500',
          typeConfig[item.type].borderClass,
          typeConfig[item.type].bgClass,
          i < visibleCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
        ]"
      >
        <div class="flex items-start gap-4">
          <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-white/70">
            <RsIcon :name="TYPE_ICONS[item.type]" :size="18" :stroke-width="2" :class="typeConfig[item.type].iconClass" />
          </div>
          <div class="min-w-0">
            <span :class="['text-[10px] font-bold uppercase tracking-[0.8px]', typeConfig[item.type].labelClass]">
              {{ typeConfig[item.type].label }}
            </span>
            <h3 class="text-[15px] font-semibold text-carbon mt-1">{{ item.title }}</h3>
            <p class="text-[14px] text-[#898989] leading-[1.6] mt-1">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!allVisible" class="flex items-center gap-2 mt-4 ml-1">
      <div class="flex gap-1">
        <span class="w-[6px] h-[6px] rounded-full bg-gold-500 animate-bounce" style="animation-delay: 0ms" />
        <span class="w-[6px] h-[6px] rounded-full bg-gold-500 animate-bounce" style="animation-delay: 150ms" />
        <span class="w-[6px] h-[6px] rounded-full bg-gold-500 animate-bounce" style="animation-delay: 300ms" />
      </div>
      <span class="text-[13px] text-steel-500">{{ t.typing }}</span>
    </div>

    <div
      :class="[
        'mt-10 flex items-center justify-between transition-opacity duration-500',
        allVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      ]"
    >
      <button type="button" @click="emit('back')"
              class="inline-flex items-center text-[14px] font-medium text-steel-500 hover:text-navy-900 transition-colors duration-200">
        <RsIcon name="arrow-left" :size="16" :stroke-width="2" class="mr-1" />
        {{ t.back }}
      </button>
      <button type="button" @click="emit('next')"
              class="inline-flex items-center text-[15px] font-semibold text-white bg-navy-900 hover:bg-navy-700 rounded-btn py-[14px] px-6 md:px-10 transition-colors duration-200">
        {{ t.next }}
        <RsIcon name="arrow-right" :size="18" :stroke-width="2.25" class="ml-2" />
      </button>
    </div>
  </div>
</template>
