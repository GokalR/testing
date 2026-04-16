# NBU AI Business Advisor — Complete Question Bank

> Compiled from analysis of: SCORE readiness assessment, SBA business plan
> checklist, OnDeck/bank loan applications, feasibility study frameworks,
> Uzbekistan-specific business registration requirements, and NBU credit
> product eligibility criteria.
>
> Questions are organized by STEP and SECTION. Each question has:
> - Field type (how it appears in UI)
> - Why the AI needs it (what analysis it feeds)
> - Conditional logic (when it appears)

---

## STEP 1: КТО ВЫ (Who Are You)

### 1.1 — Личные данные (Personal)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 1.1.1 | Ваше полное имя | text | Personalization of report |
| 1.1.2 | Возраст | select: 18-24 / 25-30 / 31-40 / 41-50 / 51+ | Youth loan eligibility (≤30 for «Тадбиркорликка илк кадам»), risk profile |
| 1.1.3 | Пол | select: Мужской / Женский | Women's entrepreneurship programs eligibility |
| 1.1.4 | Высшее образование? | select: Да / Нет / Среднее специальное | Adjusts explanation depth; graduate startup loan eligibility |
| 1.1.5 | Специальность / направление образования | text (optional) | If related to business → credibility factor |
| 1.1.6 | Семейное положение | select: Холост / Женат(замужем) / Разведён(а) | Household income context, risk |
| 1.1.7 | Количество иждивенцев | select: 0 / 1-2 / 3-5 / 6+ | Personal expense burden → affects how much can invest |

### 1.2 — Локация (Location)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 1.2.1 | Область (вилоят) | select: 14 regions | Regional data pack lookup |
| 1.2.2 | Район (худуд) | select: filtered by viloyat | District-level market analysis |
| 1.2.3 | Махалля (необязательно) | text | Hyper-local context if available |
| 1.2.4 | Вы живёте в городе или в сельской местности? | select: Город / Пригород / Село | Rural entrepreneurship programs, different cost structures |

### 1.3 — Опыт и навыки (Experience & Skills)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 1.3.1 | Ваш текущий статус | select: Безработный / Наёмный работник / Самозанятый / Предприниматель / Студент / Пенсионер | Determines PATH A (new) vs PATH B (existing); loan eligibility |
| 1.3.2 | Опыт работы в бизнесе | select: Нет / Менее 1 года / 1-3 года / 3-5 лет / 5-10 лет / Более 10 лет | Risk assessment, recommendation depth |
| 1.3.3 | Работали ли вы в сфере, в которой хотите открыть бизнес? | select: Да, работал(а) / Нет, но изучал(а) / Нет, начинаю с нуля | Critical for feasibility; "domain experience" is #1 predictor of success |
| 1.3.4 | Проходили ли вы обучение по предпринимательству? | select: Да / Нет | Affects recommendation to take courses |
| 1.3.5 | Есть ли у вас наставник или партнёр с опытом? | select: Да / Нет | Support network assessment |

---

## STEP 2: ВАШ БИЗНЕС (Your Business)

> **Branching:** Based on 1.3.1:
> - If "Предприниматель" → Section 2B (Existing Business)
> - All others → Section 2A (New Business)

### 2A — Новый бизнес (New Business — PATH A)

#### 2A.1 — Бизнес-идея (Business Idea)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 2A.1.1 | Какое направление бизнеса вас интересует? | select: Текстиль / Пищевое производство / Сельское хозяйство / Торговля / Общепит / Строительство / IT и услуги / Транспорт / Туризм / Другое | Primary data pack selector |
| 2A.1.2 | Конкретная ниша (что именно?) | text + suggestions based on direction | "Textile" is too broad — "пошив школьной формы" vs "производство шёлка" = different economics |
| 2A.1.3 | Опишите вашу идею в 2-3 предложениях | textarea | AI uses this for personalized analysis |
| 2A.1.4 | Почему именно этот бизнес? | select: Есть опыт / Вижу спрос в районе / Семейная традиция / Есть контакты-поставщики / Просто интересно | Motivation assessment → affects risk profile |
| 2A.1.5 | Есть ли у вас уже потенциальные клиенты или заказы? | select: Да, есть заказы / Да, есть договорённости / Нет, но знаю кому продавать / Нет, пока не думал(а) | Huge difference in viability |

#### 2A.2 — Целевой рынок (Target Market)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 2A.2.1 | Кто ваш основной покупатель? | select: Физические лица (B2C) / Предприятия и организации (B2B) / Государство (B2G) / Экспорт | Completely changes market analysis |
| 2A.2.2 | Где планируете продавать? | multi-select: Свой район / Весь город / Вся область / По стране / Экспорт в СНГ / Экспорт в дальнее зарубежье | Geographic scope of market |
| 2A.2.3 | Знаете ли вы своих конкурентов? | select: Да, знаю основных / Знаю нескольких / Не знаю | Competition awareness |
| 2A.2.4 | Сколько конкурентов в вашем районе? | select: Нет / 1-3 / 4-10 / Более 10 / Не знаю | Local competition density |
| 2A.2.5 | Чем ваш бизнес будет отличаться от конкурентов? | textarea (optional) | Unique value proposition |

#### 2A.3 — Ресурсы (Resources)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 2A.3.1 | Сколько собственных средств вы готовы вложить? | number input (soum) + presets: <5M / 5-20M / 20-50M / 50-100M / 100-500M / >500M | Core of financial projection |
| 2A.3.2 | Нужны ли вам заёмные средства? | select: Да / Нет / Не уверен(а) | Loan matching trigger |
| 2A.3.3 | Если да — сколько примерно нужно? | number input (soum) + presets: <10M / 10-50M / 50-200M / 200M-1B / >1B | Matches to specific NBU products by amount |
| 2A.3.4 | Есть ли у вас помещение для бизнеса? | select: Своё / Арендую / Планирую арендовать / Нет, нужна помощь | Rent cost in/out of financial model |
| 2A.3.5 | Если аренда — сколько платите или готовы платить в месяц? | number input (soum) | Monthly cost input |
| 2A.3.6 | Есть ли у вас оборудование? | select: Да, всё есть / Частично / Нет, нужно покупать | Equipment cost in financial model |
| 2A.3.7 | Есть ли у вас залоговое имущество? | select: Недвижимость / Автотранспорт / Оборудование / Нет | Loan eligibility by collateral type |
| 2A.3.8 | Оценочная стоимость залога (если есть) | number input (soum) | Determines max loan amount |
| 2A.3.9 | Сколько сотрудников планируете нанять? | select: Только я / 1-2 / 3-5 / 6-15 / 16-50 / Более 50 | Payroll cost, scale |
| 2A.3.10 | Когда планируете начать? | select: Уже начинаю / В течение 1-3 месяцев / Через 3-6 месяцев / Через 6-12 месяцев / Больше года | Urgency, timeline for action plan |

#### 2A.4 — Юридический статус (Legal Status)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 2A.4.1 | Зарегистрирован ли ваш бизнес? | select: Да, ООО / Да, ИП / Да, самозанятый / Нет, ещё не регистрировал(а) | Registration guidance, tax regime |
| 2A.4.2 | Знаете ли вы, какая форма регистрации вам подходит? | select: Да / Нет, нужна помощь | If no → AI explains ИП vs ООО vs самозанятый |
| 2A.4.3 | Есть ли у вас ИНН (налоговый номер)? | select: Да / Нет | Registration step tracking |

---

### 2B — Действующий бизнес (Existing Business — PATH B)

#### 2B.1 — О бизнесе (About Your Business)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 2B.1.1 | Чем занимается ваш бизнес? | select (same categories as 2A.1.1) + text for specifics | Data pack + specific context |
| 2B.1.2 | Опишите ваш бизнес в 2-3 предложениях | textarea | AI context |
| 2B.1.3 | Сколько лет вашему бизнесу? | select: Менее 6 месяцев / 6мес-1год / 1-2 года / 2-5 лет / 5-10 лет / Более 10 лет | Track record, loan eligibility (min 6 months for many banks) |
| 2B.1.4 | Форма регистрации | select: ИП / ООО / Самозанятый / ДП / Другое | Tax, legal context |
| 2B.1.5 | Количество сотрудников | select: Только я / 2-5 / 6-15 / 16-50 / 51-100 / Более 100 | Scale |
| 2B.1.6 | Кто ваши основные клиенты? | select: Физлица (B2C) / Предприятия (B2B) / Госзаказ (B2G) / Экспорт / Смешанный | Market type |

#### 2B.2 — Финансы (Financials)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 2B.2.1 | Средняя ежемесячная выручка | number input (soum) + presets: <5M / 5-20M / 20-50M / 50-100M / 100-500M / >500M | Revenue baseline |
| 2B.2.2 | Средние ежемесячные расходы | number input (soum) + same presets | Expense baseline → profit margin |
| 2B.2.3 | Из чего складываются основные расходы? | multi-select: Сырьё / Аренда / Зарплата / Транспорт / Налоги / Коммунальные / Кредиты / Реклама | Cost structure analysis |
| 2B.2.4 | Есть ли у вас текущие кредиты или долги? | select: Нет / Да, до 20M / Да, 20-100M / Да, более 100M | Debt-to-income, loan eligibility |
| 2B.2.5 | Есть ли просроченные платежи? | select: Нет / Да | Credit history → loan disqualifier |
| 2B.2.6 | Ведёте ли вы бухгалтерский учёт? | select: Да, профессиональный бухгалтер / Да, сам(а) / Нет | Financial literacy, credibility |
| 2B.2.7 | Есть ли расчётный счёт в банке? | select: Да, в NBU / Да, в другом банке / Нет | Cross-sell opportunity, banking relationship |
| 2B.2.8 | Сезонность бизнеса | select: Стабильный круглый год / Есть сезонные колебания / Сильно сезонный | Cash flow planning |

#### 2B.3 — Текущие проблемы и цели (Problems & Goals)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 2B.3.1 | Что является вашей главной проблемой СЕЙЧАС? | select: Мало клиентов / Высокая конкуренция / Нехватка сырья / Нехватка кадров / Дорогая аренда / Устаревшее оборудование / Нехватка оборотных средств / Проблемы с логистикой / Нет доступа к кредиту / Налоговая нагрузка / Другое | Primary pain point → targeted recommendations |
| 2B.3.2 | Что вы хотите сделать? | multi-select: Увеличить продажи / Снизить расходы / Расширить производство / Открыть новую точку / Запустить новый продукт / Выйти на экспорт / Получить кредит / Нанять сотрудников / Автоматизировать процессы / Обучить персонал | Goal of analysis → shapes entire output |
| 2B.3.3 | Нужны ли вам заёмные средства? | select: Да, срочно / Да, в ближайшие месяцы / Возможно / Нет | Loan urgency |
| 2B.3.4 | Если да — на что именно? | multi-select: Пополнение оборотных средств / Покупка оборудования / Расширение помещения / Маркетинг и реклама / Зарплаты / Погашение долгов / Экспортный контракт | Loan purpose → product matching |
| 2B.3.5 | Сколько примерно нужно? | number input (soum) + presets | Amount → product matching |
| 2B.3.6 | Есть ли залоговое имущество? | select: Недвижимость / Авто / Оборудование / Нет | Collateral → loan type |
| 2B.3.7 | Оценочная стоимость залога | number input (soum) | Max loan amount calculation |

---

## STEP 3: ДОПОЛНИТЕЛЬНЫЕ ФАКТОРЫ (Additional Factors)

> These questions appear for BOTH paths. They add depth to the analysis.

### 3.1 — Бизнес-план и готовность (Business Plan & Readiness)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 3.1.1 | Есть ли у вас бизнес-план? | select: Да, подробный / Да, базовый / Нет, но знаю что нужно / Нет | If no → AI generates basic plan structure |
| 3.1.2 | Проводили ли вы анализ рынка? | select: Да / Частично / Нет | If no → AI provides market analysis |
| 3.1.3 | Знаете ли вы свою точку безубыточности? | select: Да / Нет / Не знаю что это | If no → AI calculates and explains |
| 3.1.4 | Есть ли у вас поставщики? | select: Да, постоянные / Да, несколько вариантов / Нет, ищу / Не знаю где искать | Supply chain readiness |
| 3.1.5 | Есть ли у вас опыт управления людьми? | select: Да / Нет | Management capability |

### 3.2 — Финансовая грамотность (Financial Literacy)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 3.2.1 | Знаете ли вы разницу между ИП, ООО и самозанятым? | select: Да / Примерно / Нет | Adjusts legal explanation depth |
| 3.2.2 | Знаете ли вы, какие налоги платит ваш тип бизнеса? | select: Да / Примерно / Нет | Adjusts tax explanation depth |
| 3.2.3 | Умеете ли вы считать себестоимость товара/услуги? | select: Да / Примерно / Нет | If no → AI explains with examples |
| 3.2.4 | Знакомы ли вы с понятием «денежный поток» (cash flow)? | select: Да / Примерно / Нет | Adjusts financial projection explanation depth |

### 3.3 — Риски и ожидания (Risks & Expectations)

| # | Question (RU) | Field type | Why AI needs it |
|---|--------------|------------|-----------------|
| 3.3.1 | Какой ежемесячный доход вы ожидаете через 6 месяцев? | number input (soum) | Reality check — AI compares with market data |
| 3.3.2 | Готовы ли вы к тому, что первые 3-6 месяцев бизнес может не приносить прибыль? | select: Да / Не уверен(а) / Нет | Expectation management |
| 3.3.3 | Есть ли у вас запас средств на жизнь на 3-6 месяцев без дохода? | select: Да / Частично / Нет | Personal financial runway |
| 3.3.4 | Что вы будете делать, если бизнес не пойдёт? | select: Есть план Б / Вернусь к работе по найму / Буду пробовать дальше / Не думал(а) об этом | Risk tolerance |
| 3.3.5 | Поддерживает ли вас семья в этом решении? | select: Да / Частично / Нет | Social support factor |

---

## STEP 4: AI АНАЛИЗ (Processing)

> No questions. AI processes all data and generates the report.
> The loading screen shows real progress indicators:
> 1. Анализ профиля...
> 2. Оценка рынка в вашем районе...
> 3. Расчёт финансовой модели...
> 4. Анализ конкуренции...
> 5. Подбор продуктов NBU...
> 6. Формирование рекомендаций...

---

## STEP 5: РЕЗУЛЬТАТЫ (Results)

> No questions. Dynamic results page generated from AI analysis.

---

## SUMMARY: Question Count

| Section | Path A (New) | Path B (Existing) |
|---------|-------------|-------------------|
| Step 1: Кто вы | 16 | 16 |
| Step 2A: Новый бизнес | 18 | — |
| Step 2B: Действующий бизнес | — | 17 |
| Step 3: Доп. факторы | 10 | 10 |
| **TOTAL** | **44** | **43** |

---

## UX NOTES

### How to NOT make 44 questions feel like a tax form:

1. **Group into sub-steps** — show 4-6 questions per screen, not all at once
2. **Progressive disclosure** — questions 2A.3.5 only shows if 2A.3.4 = "Арендую"
3. **Smart defaults** — if age is 18-24, pre-check "Менее 1 года" for experience
4. **Helper text** — every question has a "Зачем мы спрашиваем?" tooltip
5. **Skip optional** — mark non-critical questions as "необязательно"
6. **Progress bar** — "Шаг 2 из 4 · вопрос 5 из 12"
7. **Save draft** — allow resuming later (localStorage minimum, DB ideal)
8. **Instant feedback** — after financial questions, show a mini-preview: "На основе ваших данных, ваш бизнес может выйти на прибыль через ~X месяцев"

### Conditional logic map:

```
1.3.1 = "Предприниматель"
  → Show Section 2B (existing business)
  → Hide Section 2A

1.3.1 ≠ "Предприниматель"
  → Show Section 2A (new business)
  → Hide Section 2B

2A.3.2 = "Да" or 2B.3.3 = "Да"
  → Show loan amount question
  → Show collateral questions

2A.3.4 = "Арендую"
  → Show monthly rent question

2A.4.1 = "Нет"
  → Show "do you know which form?" question

2B.2.4 ≠ "Нет"
  → Show "any overdue payments?" question

2B.3.3 = "Да, срочно" or "Да, в ближайшие месяцы"
  → Show loan purpose multi-select
  → Show amount question
  → Show collateral questions
```

---

## NBU LOAN PRODUCTS (from nbu.uz, verified April 2026)

> These are REAL products from NBU's website. Need team lead to confirm
> full criteria, as the website shows limited details.

| Product | Rate | Term | Max Amount | Key Eligibility |
|---------|------|------|-----------|-----------------|
| Микрозайм | — | до 60 мес | 100M сум | Via Milliy app |
| Тадбиркорликка илк кадам (Startup) | — | до 18 мес (6 мес grace) | 20M сум | Graduates, young entrepreneurs |
| National Green | — | 60 мес (3 мес grace) | 70M сум | Renewable energy equipment |
| Овердрафт | — | до 24 мес (2 мес grace) | 100M сум | Salary card employees |
| Ипотека | от 16.5% | до 20 лет | 5B сум | Property purchase |
| Автокредит | — | до 60 мес (6 мес grace) | 1B сум | Vehicle purchase |
| Образовательный | от 14% | до 162 мес | — | Students |

### MISSING from NBU website (need from team lead):
- [ ] Full interest rates for each product
- [ ] Business-specific loan products (not just consumer)
- [ ] Corporate lending products and criteria
- [ ] SME-specific programs
- [ ] Government-subsidized credit lines channeled through NBU
- [ ] Required documents per product
- [ ] Minimum revenue/business age requirements
- [ ] Collateral valuation rules
- [ ] Online application availability

---

## WHAT EACH QUESTION FEEDS IN THE RESULTS

| Results Section | Key Input Questions |
|----------------|-------------------|
| Оценка рынка (Market Assessment) | 2A.1.1, 2A.1.2, 2A.2.1-2.2.4, 1.2.1-1.2.2 |
| Финансовый прогноз (Financial Projection) | 2A.3.1-3.9 or 2B.2.1-2.2.8 + cost data |
| Анализ конкуренции (Competition) | 2A.2.3-2.2.5, 2B.1.6, market data |
| Риски (Risks) | 3.3.1-3.3.5, 2B.2.4-2.2.5, market data |
| План действий (Action Plan) | 2A.4.1-4.3, 2A.3.10, 3.1.1-3.1.5 |
| Продукты NBU (Bank Match) | age, amount, collateral, business type, registration |
| Карта возможностей (Heatmap) | 1.2.1, 1.2.2, 2A.1.1 or 2B.1.1 |
| Уровень готовности (Readiness Score) | 3.1.1-3.2.4, 1.3.2-1.3.5 |
