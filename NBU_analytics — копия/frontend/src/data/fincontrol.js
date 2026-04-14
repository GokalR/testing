// Demo data for the FinControl module — mirrors the colleague's HTML mockups.
// All amounts in UZS unless stated.

export const company = {
  name: 'ООО «Глобал Трейд Групп»',
  inn: '302 874 566',
  contact: 'Ахмедов Бекзод Тулкинович',
  phone: '+998 90 256 47 12',
}

export const accounts = [
  {
    key: 'nbu',
    bank: 'NBU Business Prime',
    number: '•••• •••• 4402',
    balance: '524 000 000',
    balanceRaw: 524_000_000,
    badges: [{ label: 'Расчётный', tone: 'blue' }, { label: '● Активен', tone: 'green' }],
    stats: { min: '412М', max: '611М', avg: '518М' },
    share: 62,
    trend: { value: '+8.2%', tone: 'up' },
    spark: [42, 48, 45, 50, 53, 49, 55, 58, 56, 60, 62, 58, 64, 67, 65, 70, 68, 71, 74, 72, 76, 78, 75, 80, 82, 79, 84, 86, 83, 88],
    color: '#0054A6',
    cardTone: 'blue',
  },
  {
    key: 'hbk',
    bank: 'Hamkorbank Reserve',
    number: '•••• •••• 1192',
    balance: '215 000 000',
    balanceRaw: 215_000_000,
    badges: [{ label: 'Резервный', tone: 'teal' }, { label: '● Активен', tone: 'green' }],
    stats: { min: '180М', max: '248М', avg: '210М' },
    share: 25,
    trend: { value: '+2.1%', tone: 'up' },
    spark: [180, 184, 187, 192, 195, 198, 200, 203, 205, 208, 210, 213, 215, 218, 220, 222, 220, 218, 217, 215, 213, 215, 218, 220, 222, 218, 215, 213, 215, 215],
    color: '#0891B2',
    cardTone: 'teal',
  },
  {
    key: 'cash',
    bank: 'Касса (наличные)',
    number: 'Внутренний учёт',
    balance: '103 500 000',
    balanceRaw: 103_500_000,
    badges: [{ label: 'Касса', tone: 'amber' }, { label: 'Учётный', tone: 'slate' }],
    stats: { min: '62М', max: '140М', avg: '98М' },
    share: 13,
    trend: { value: '−1.4%', tone: 'down' },
    spark: [120, 115, 110, 118, 122, 125, 130, 128, 124, 120, 116, 112, 108, 105, 102, 100, 98, 96, 94, 92, 95, 98, 100, 102, 105, 108, 106, 104, 103, 103],
    color: '#94A3B8',
    cardTone: 'amber',
  },
]

export const dashboardKpis = [
  { key: 'balance', label: 'Общий баланс', value: '842 500 000', unit: 'UZS', delta: '▲ 5.3%', deltaTone: 'green', sub: 'По 3 счетам', icon: 'account_balance', iconBg: '#EEF4FF', iconColor: '#0054A6' },
  { key: 'inflow', label: 'Входящий поток', value: '320 000 000', unit: 'UZS', valueTone: 'green', delta: '▲ 12.1%', deltaTone: 'green', sub: 'За текущий месяц', icon: 'south_west', iconBg: '#E6F7EE', iconColor: '#00A651' },
  { key: 'outflow', label: 'Исходящий поток', value: '198 000 000', unit: 'UZS', valueTone: 'red', delta: '▲ 3.7%', deltaTone: 'red', sub: 'За текущий месяц', icon: 'north_east', iconBg: '#FEE2E5', iconColor: '#E0384B' },
  { key: 'netcf', label: 'Чистый CF', value: '122 000 000', unit: 'UZS', valueTone: 'accent', delta: 'CF +', deltaTone: 'blue', sub: 'Входящий − Исходящий', icon: 'savings', iconBg: '#EEF4FF', iconColor: '#0054A6' },
  { key: 'runway', label: 'Runway', value: '4.2 мес', valueTone: 'amber', delta: '~4 мес', deltaTone: 'amber', sub: 'При текущем расходе', icon: 'flight_takeoff', iconBg: '#FEF3C7', iconColor: '#F59E0B' },
]

export const monthly = {
  labels: ['Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр'],
  income: [245, 310, 280, 320, 295, 260, 285, 300, 270, 315, 290, 320],
  expenses: [180, 195, 170, 210, 185, 175, 195, 200, 165, 185, 180, 198],
}

export const expenseStructure = [
  { label: 'Закупки', value: 34, amount: '67.3М', color: '#0054A6' },
  { label: 'Зарплата', value: 28, amount: '55.4М', color: '#00A651' },
  { label: 'Налоги', value: 14, amount: '27.7М', color: '#F59E0B' },
  { label: 'Аренда', value: 12, amount: '23.8М', color: '#E0384B' },
  { label: 'Маркетинг', value: 8, amount: '15.8М', color: '#8B5CF6' },
  { label: 'Прочее', value: 4, amount: '7.9М', color: '#94A3B8' },
]

export const topCounterpartiesSuppliers = [
  { initials: 'СТ', tone: 'av-blue', name: 'Silk Trade LLC', sub: '14 транзакций · Апр', amount: '−52 400 000' },
  { initials: 'АП', tone: 'av-green', name: 'АгроПрайм', sub: '9 транзакций · Апр', amount: '−38 700 000' },
  { initials: 'УТ', tone: 'av-amber', name: 'УзПакТранс', sub: '6 транзакций · Апр', amount: '−21 200 000' },
  { initials: 'НЛ', tone: 'av-purple', name: 'NovaTech Logistics', sub: '5 транзакций · Апр', amount: '−18 900 000' },
  { initials: 'МС', tone: 'av-red', name: 'МегаСнаб', sub: '4 транзакции · Апр', amount: '−14 600 000' },
]

export const aiSignals = [
  { tone: 'red', icon: 'warning', title: 'Резкий рост расходов', text: 'Расходы на логистику выросли на +47% vs прошлый месяц. Основной вклад: УзПакТранс (+8.4М).', time: 'Сегодня, 09:14' },
  { tone: 'amber', icon: 'schedule', title: 'Runway снижается', text: 'Прогнозируемый runway: 4.2 мес. При текущей динамике остатки опустятся ниже критической точки к августу.', time: 'Сегодня, 08:30' },
  { tone: 'green', icon: 'thumb_up', title: 'Позитивный Cash Flow', text: 'Чистый CF +122М UZS второй месяц подряд. Бизнес генерирует устойчивый профицит.', time: 'Вчера, 18:05' },
]

export const transactions = [
  { date: '14 апр', time: '15:22', av: 'АП', avTone: 'av-green', name: 'АгроПрайм', purpose: 'Оплата по дог. №145-А', category: 'Доходы', categoryTone: 'green', income: '+85 000 000', account: 'NBU •4402' },
  { date: '13 апр', time: '11:08', av: 'СТ', avTone: 'av-blue', name: 'Silk Trade LLC', purpose: 'Закуп товара партия №38', category: 'Закупки', categoryTone: 'blue', expense: '−52 400 000', account: 'NBU •4402' },
  { date: '12 апр', time: '09:45', av: 'НБУ', avTone: 'av-slate', name: 'ГНК Узбекистан', purpose: 'НДС за март 2026', category: 'Налоги', categoryTone: 'amber', expense: '−27 720 000', account: 'HBK •1192' },
  { date: '11 апр', time: '14:30', av: 'УТ', avTone: 'av-amber', name: 'УзПакТранс', purpose: 'Логистика апр 2026', category: 'Логистика', categoryTone: 'amber', expense: '−21 200 000', account: 'NBU •4402' },
  { date: '10 апр', time: '16:55', av: 'СА', avTone: 'av-blue', name: 'ООО «Сармат»', purpose: 'Оплата инв. №2026-084', category: 'Доходы', categoryTone: 'green', income: '+63 500 000', account: 'NBU •4402' },
  { date: '09 апр', time: '10:00', av: 'ЗП', avTone: 'av-purple', name: 'Выплата зарплат', purpose: 'З/П сотрудникам апр', category: 'Зарплата', categoryTone: 'purple', expense: '−55 440 000', account: 'NBU •4402' },
  { date: '08 апр', time: '13:20', av: 'МС', avTone: 'av-green', name: 'МегаСнаб', purpose: 'Гос. контракт №2026-08', category: 'Гос. контракты', categoryTone: 'green', income: '+38 400 000', account: 'HBK •1192' },
  { date: '08 апр', time: '12:18', av: 'НЛ', avTone: 'av-purple', name: 'NovaTech Logistics', purpose: 'Аванс нал. расчёт', category: 'Логистика', categoryTone: 'amber', expense: '−18 900 000', account: 'Касса' },
]

export const recurring = {
  outgoing: [
    { name: 'Аренда склада', sub: 'ООО «Мега Логист»', category: 'Аренда', categoryTone: 'purple', period: 'Ежемесячно', date: '01 мая', amount: '−24 000 000', status: 'Достаточно средств', statusTone: 'green' },
    { name: 'Зарплата сотрудников', sub: '31 сотрудник', category: 'Зарплата', categoryTone: 'red', period: 'Ежемесячно', date: '25 апр', amount: '−55 440 000', status: 'Недостаточно средств', statusTone: 'red', danger: true },
    { name: 'НДС — налоговая', sub: 'ГНК Узбекистан', category: 'Налоги', categoryTone: 'amber', period: 'Ежеквартально', date: '15 июл', amount: '−27 720 000', status: 'Достаточно средств', statusTone: 'green' },
    { name: 'Интернет и телефон', sub: 'UzTelecom', category: 'Операционные', categoryTone: 'blue', period: 'Ежемесячно', date: '05 мая', amount: '−2 400 000', status: 'Достаточно средств', statusTone: 'green' },
    { name: 'Страхование имущества', sub: 'Узагросигурта', category: 'Страхование', categoryTone: 'green', period: 'Раз в квартал', date: '30 июн', amount: '−8 700 000', status: 'Ожидается', statusTone: 'amber' },
  ],
  incoming: [
    { name: 'ООО «Сармат»', sub: 'Абонплата', category: 'Доходы', categoryTone: 'green', period: 'Ежемесячно', date: '03 мая', amount: '+45 000 000', status: 'Подтверждено', statusTone: 'green' },
    { name: 'Hamkorbank — купон', sub: 'Депозит 9963517', category: 'Финансовые', categoryTone: 'blue', period: 'Ежемесячно', date: '10 мая', amount: '+3 870 000', status: 'Подтверждено', statusTone: 'green' },
    { name: 'АгроПрайм — рассрочка', sub: 'Платёж 3 из 6', category: 'Доходы', categoryTone: 'green', period: 'Ежемесячно', date: '15 мая', amount: '+28 000 000', status: 'Ожидается', statusTone: 'amber' },
  ],
}

export const counterparties = [
  { initials: 'ИР', tone: 'av-green', name: 'ИП Рашидов А.', inn: '307 282 145', type: 'Плательщик', typeTone: 'green', tx: 9, amount: '+35 600 000', amountTone: 'green', last: '14 апр 2026', status: 'Регулярный', statusTone: 'blue' },
  { initials: 'СТ', tone: 'av-blue', name: 'Silk Trade LLC', inn: '302 418 762', type: 'Получатель', typeTone: 'blue', tx: 7, amount: '−18 900 000', amountTone: 'red', last: '13 апр 2026', status: 'Регулярный', statusTone: 'blue' },
  { initials: 'АГ', tone: 'av-amber', name: 'ООО АрендаГрупп', inn: '201 843 920', type: 'Получатель', typeTone: 'amber', tx: 1, amount: '−12 800 000', amountTone: 'red', last: '01 апр 2026', status: 'Регулярный', statusTone: 'blue' },
  { initials: 'СА', tone: 'av-blue', name: 'ООО «Сармат»', inn: '308 194 012', type: 'Плательщик', typeTone: 'green', tx: 3, amount: '+28 400 000', amountTone: 'green', last: '10 апр 2026', status: 'Регулярный', statusTone: 'blue' },
  { initials: 'НЛ', tone: 'av-purple', name: 'NovaTech Logistics', inn: '402 183 774', type: 'Получатель', typeTone: 'blue', tx: 5, amount: '−8 900 000', amountTone: 'red', last: '08 апр 2026', status: 'Регулярный', statusTone: 'blue' },
  { initials: 'МС', tone: 'av-green', name: 'МегаСнаб', inn: '310 284 198', type: 'Плательщик', typeTone: 'green', tx: 4, amount: '+14 200 000', amountTone: 'green', last: '07 апр 2026', status: 'Разовый', statusTone: 'slate' },
  { initials: 'АД', tone: 'av-amber', name: 'Ad Pro Agency', inn: '405 192 831', type: 'Получатель', typeTone: 'amber', tx: 2, amount: '−7 200 000', amountTone: 'red', last: '05 апр 2026', status: 'Разовый', statusTone: 'slate' },
  { initials: 'ГНК', tone: 'av-slate', name: 'ГНК Узбекистан', inn: '100 000 001', type: 'Гос. орган', typeTone: 'purple', tx: 3, amount: '−6 100 000', amountTone: 'red', last: '03 апр 2026', status: 'Регулярный', statusTone: 'blue' },
]

export const expenseCategories = [
  { emoji: '🛒', name: 'Закупки', amount: '67 320 000', share: 34, bar: 82, trend: '↑ +4.1%', trendTone: 'red' },
  { emoji: '👥', name: 'Зарплата', amount: '55 440 000', share: 28, bar: 68, trend: '→ 0.0%', trendTone: 'slate' },
  { emoji: '🏛', name: 'Налоги', amount: '27 720 000', share: 14, bar: 35, trend: '↓ −2.3%', trendTone: 'green' },
  { emoji: '🏢', name: 'Аренда', amount: '23 760 000', share: 12, bar: 29, trend: '→ 0.0%', trendTone: 'slate' },
  { emoji: '📣', name: 'Маркетинг', amount: '15 840 000', share: 8, bar: 20, trend: '↑ +22%', trendTone: 'red', overspend: true },
  { emoji: '📦', name: 'Прочее', amount: '7 920 000', share: 4, bar: 10, trend: '↓ −8.4%', trendTone: 'green' },
]

export const incomeCategories = [
  { emoji: '💼', name: 'Продажи', amount: '256 000 000', share: 80, bar: 80 },
  { emoji: '🏛', name: 'Гос. контракты', amount: '38 400 000', share: 12, bar: 12 },
  { emoji: '📈', name: 'Проценты', amount: '16 000 000', share: 5, bar: 5 },
  { emoji: '📦', name: 'Прочие', amount: '9 600 000', share: 3, bar: 3 },
]

export const pnlRows = [
  { type: 'group', label: 'ДОХОДЫ' },
  { label: 'Выручка', may: '320 000 000', apr: '295 700 000', delta: '+8.2%', deltaTone: 'green', total: true },
  { label: 'Продажи товаров', may: '256 000 000', apr: '238 800 000', delta: '+7.2%', deltaTone: 'green' },
  { label: 'Гос. контракты', may: '38 400 000', apr: '35 200 000', delta: '+9.1%', deltaTone: 'green' },
  { label: 'Проценты и прочее', estimated: true, may: '16 000 000', apr: '14 700 000', delta: '+8.8%', deltaTone: 'green' },
  { label: 'Прочие доходы', estimated: true, may: '9 600 000', apr: '7 000 000', delta: '+37.1%', deltaTone: 'green' },
  { type: 'group', label: 'СЕБЕСТОИМОСТЬ' },
  { label: 'Материалы и сырьё', may: '−145 000 000', apr: '−139 000 000', delta: '+4.3%', deltaTone: 'red' },
  { label: 'Прямые трудозатраты', estimated: true, may: '−38 000 000', apr: '−36 400 000', delta: '+4.4%', deltaTone: 'red' },
  { label: 'Производственные накладные', estimated: true, may: '−12 000 000', apr: '−11 800 000', delta: '+1.7%', deltaTone: 'red' },
  { label: 'Транспорт и логистика', may: '−3 000 000', apr: '−2 400 000', delta: '+25.0%', deltaTone: 'red' },
  { type: 'result', tone: 'green', label: 'Валовая прибыль', meta: '38% маржа', may: '122 000 000', apr: '106 100 000', delta: '+15.0%', deltaTone: 'green' },
  { type: 'group', label: 'ОПЕРАЦИОННЫЕ РАСХОДЫ' },
  { label: 'Фонд оплаты труда (косв.)', may: '−19 000 000', apr: '−18 400 000', delta: '+3.3%', deltaTone: 'red' },
  { label: 'Аренда офиса и склада', may: '−3 800 000', apr: '−3 800 000', delta: '0.0%', deltaTone: 'slate' },
  { label: 'Маркетинг и реклама', icon: '📣', warning: 'перерасход', may: '−15 840 000', apr: '−12 960 000', delta: '+22.2%', deltaTone: 'red' },
  { label: 'Амортизация', estimated: true, may: '−4 000 000', apr: '−3 800 000', delta: '+5.3%', deltaTone: 'red' },
  { label: 'Прочие операц. расходы', estimated: true, may: '−2 360 000', apr: '−2 100 000', delta: '+12.4%', deltaTone: 'red' },
  { type: 'result', tone: 'blue', label: 'Операц. прибыль (EBIT)', meta: '24% маржа', may: '77 000 000', apr: '65 040 000', delta: '+18.4%', deltaTone: 'green' },
  { type: 'group', label: 'НИЖЕ ОПЕРАЦ. ЧЕРТЫ' },
  { label: 'Процентные расходы', estimated: true, may: '−3 500 000', apr: '−3 200 000', delta: '+9.4%', deltaTone: 'red' },
  { label: 'Прочие финансовые расходы', estimated: true, may: '−1 500 000', apr: '−1 200 000', delta: '+25.0%', deltaTone: 'red' },
  { label: 'Курсовая разница', estimated: true, may: '−1 400 000', apr: '+800 000', delta: '—', deltaTone: 'slate' },
  { type: 'group', label: 'НАЛОГИ' },
  { label: 'Налог на прибыль (15%)', estimated: true, may: '−6 100 000', apr: '−5 600 000', delta: '+8.9%', deltaTone: 'red' },
  { type: 'result', tone: 'amber', label: 'Чистая прибыль', meta: '~20.3% маржа · ест.', estimated: true, may: '65 000 000', apr: '55 840 000', delta: '+16.4%', deltaTone: 'green' },
]
