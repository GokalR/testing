# NBU AI Business Advisor — Data Requirements

> This document specifies EVERY piece of data needed to produce real,
> fact-based business analysis. Nothing the AI outputs should be invented.
>
> Status legend:
> - **HAVE** — we already have this in the codebase
> - **PARTIAL** — some data exists but incomplete
> - **NEED** — must be collected before pilot
> - **NBU** — can only come from the bank internally

---

## 1. USER INPUT (collected from the form)

We collect this from the user. No external data needed.

### 1A. Personal Profile

| Field | Type | Why the AI needs it |
|-------|------|---------------------|
| Имя | text | Personalization |
| Возраст | select: 18-24 / 25-34 / 35-49 / 50+ | Youth loan eligibility, risk profile |
| Образование | yes/no | Adjusts explanation complexity |
| Текущий статус | select: безработный / предприниматель / студент / наёмный / самозанятый | Determines Path A (new) vs Path B (existing) |
| Опыт в бизнесе | select: нет / <1г / 1-3г / 3-5л / 5+л | Risk assessment, loan eligibility |
| Область (вилоят) | select from 14 regions | Regional data lookup |
| Район (худуд) | select, filtered by viloyat | District-level analysis |

### 1B. Business Details (branching logic)

**Path A — NEW business (status ≠ предприниматель):**

| Field | Type | Why |
|-------|------|-----|
| Направление бизнеса | select from supported niches | Determines which data pack to load |
| Конкретная ниша | select/text, filtered by direction | "Textile" → silk weaving? garments? knitwear? |
| Целевой клиент | select: местный рынок / опт / экспорт / B2B / онлайн | Changes market analysis completely |
| Стартовый капитал (сумма) | number input in soum | Core of financial projection |
| Сколько нужно дополнительно? | number input in soum | Loan matching |
| Есть помещение? | select: своё / аренда / нет | Cost structure |
| Есть ли уже контракты/заказы? | yes/no + text | Viability indicator |
| Когда хотите начать? | select: уже начал / 1-3мес / 3-6мес / 6-12мес | Urgency of recommendations |

**Path B — EXISTING business (status = предприниматель):**

| Field | Type | Why |
|-------|------|-----|
| Чем именно занимаетесь? | text + select | Specific business description |
| Сколько лет бизнесу? | select | Track record for loans |
| Ежемесячная выручка | number input in soum | Financial health |
| Ежемесячные расходы | number input in soum | Profit margin calculation |
| Количество сотрудников | select | Scale |
| Главная проблема СЕЙЧАС | select: нет клиентов / нет сырья / нет кадров / нет оборудования / высокая аренда / конкуренция / нужен кредит / хочу расширяться | Targeted recommendations |
| Текущие кредиты/долги | number input | Debt load for loan matching |
| Что хотите? | select: расширить / новый продукт / новый рынок / снизить расходы / экспорт | Goal of analysis |

---

## 2. MARKET & INDUSTRY DATA (per niche, per region)

This is the core. Without this, the AI invents numbers.

### 2A. Sector Overview (per business niche)

| Data point | Granularity | Source | Status |
|-----------|-------------|--------|--------|
| Total enterprises in region by sector | Region-level | stat.uz | **PARTIAL** — have for textile (855 in Fergana) |
| Total enterprises in country by sector | National | stat.uz | **PARTIAL** — 5,547 textile national |
| Year-over-year production growth % | National + regional | stat.uz | **PARTIAL** — cotton yarn +26%, fabrics +21% |
| Total production volume (tons or soum) | Regional | stat.uz | **PARTIAL** — 273,000 tons / 12.9T soum for Fergana |
| Export volume by sector | National + regional | stat.uz / customs | **NEED** |
| Export destinations | National | customs / trade ministry | **NEED** |
| Import of raw materials | National | customs | **NEED** |
| Market size estimate (soum) | Regional | stat.uz + industry reports | **NEED** |
| 3-year growth trend | National + regional | stat.uz multi-year | **NEED** |

### 2B. District-Level Data (per district within region)

| Data point | Granularity | Source | Status |
|-----------|-------------|--------|--------|
| Population | Per district | stat.uz / citypopulation.de | **HAVE** ✓ (2025 estimates) |
| Number of businesses in this niche | Per district | stat.uz (not published per district) | **NEED** — stat.uz only gives regional totals |
| Key enterprises + employee count | Per district | news, business directories, gov.uz | **PARTIAL** — have 5 key enterprises |
| Unemployment rate | Per district | stat.uz labour reports | **NEED** |
| Average wage | Per district or regional | stat.uz | **NEED** |
| Industrial zones / SEZ presence | Per district | gov.uz, SEZ websites | **PARTIAL** — know about SEZ Fergana |
| Infrastructure quality (roads, rail, utilities) | Per district | qualitative assessment | **NEED** |
| Proximity to raw material sources | Per district | geographic / industry knowledge | **NEED** |
| Available rental space + average rent | Per district | real estate / local data | **NEED** |

### 2C. Sub-Niche Specifics (for textile pilot)

These are the numbers that make or break a business plan:

| Data point | Unit | Source | Status |
|-----------|------|--------|--------|
| Cotton price (raw) | soum/kg | commodity exchanges, dehqon bazaar | **NEED** |
| Silk cocoon price | soum/kg | industry, sericulture farms | **NEED** |
| Yarn price (various types) | soum/kg | wholesale market | **NEED** |
| Fabric wholesale price | soum/m² | wholesale market | **NEED** |
| Finished garment wholesale price | soum/unit by type | wholesale market | **NEED** |
| Electricity tariff (industrial) | soum/kWh | energy ministry | **NEED** — publicly available |
| Water tariff (industrial) | soum/m³ | utility provider | **NEED** — publicly available |
| Minimum wage | soum/month | government decree | **NEED** — publicly available |
| Average textile worker wage | soum/month by skill level | stat.uz / industry | **NEED** |
| Sewing machine cost (basic) | soum/unit | equipment dealers | **NEED** |
| Industrial sewing machine cost | soum/unit | equipment dealers | **NEED** |
| Loom cost | soum/unit | equipment dealers | **NEED** |
| Average rent for production space | soum/m²/month by district | local real estate | **NEED** |
| Registration cost (business entity) | soum | tax authority | **NEED** — publicly available |
| Monthly tax burden estimate | % of revenue | tax code | **NEED** — publicly available |

---

## 3. BANK PRODUCT DATA (from NBU)

This MUST come from inside the bank. Cannot be researched externally.

### 3A. Loan Products

For EACH loan product NBU offers:

| Data point | Example |
|-----------|---------|
| Product name (Russian) | "Кредит Молодой предприниматель" |
| Product code / ID | Internal |
| Loan type | startup / expansion / equipment / working capital |
| Minimum amount (soum) | 5,000,000 |
| Maximum amount (soum) | 500,000,000 |
| Interest rate (% annual) | 14% |
| Term (months, min-max) | 12–60 months |
| Grace period (months) | 0–6 months |
| Collateral required? | yes / no / partial |
| Collateral types accepted | property / equipment / guarantee / none |
| Eligibility: age range | 18-30 for youth programs |
| Eligibility: experience required? | min years of business |
| Eligibility: registered business required? | yes/no |
| Eligibility: business types | which sectors qualify |
| Eligibility: regions | all or specific regions |
| Required documents | list |
| Processing time (business days) | 5-15 |
| Special conditions | women-owned, rural areas, etc. |
| Application URL or office | where to apply |

### 3B. Non-Loan Products

| Product type | Data needed |
|-------------|-------------|
| Deposit accounts for business | rates, minimum balance |
| Business cards | fees, limits |
| Salary projects | terms |
| Trade finance / letters of credit | for exporters |
| Guarantees | for government contracts |
| Insurance partnerships | if any |
| Government subsidy programs channeled through NBU | eligibility, amounts |

### 3C. Matching Rules

For the AI to match a user to the RIGHT product:

| Rule | Logic |
|------|-------|
| Age < 30 + new business → | "Молодой предприниматель" |
| Existing business + needs equipment → | Equipment leasing / asset finance |
| Needs < 10M soum + no collateral → | Microloan |
| Export-oriented + has contracts → | Trade finance |
| Agricultural/textile in rural area → | Government-subsidized loan |
| Woman-owned business → | Special program (if exists) |

These rules need to be defined by NBU product managers.

---

## 4. REGULATORY & LEGAL DATA (per business type)

| Data point | Source | Status |
|-----------|--------|--------|
| Required business registration form | soliq.uz (tax authority) | **NEED** |
| Registration steps (ordered list) | soliq.uz, my.gov.uz | **NEED** |
| Registration cost | soliq.uz | **NEED** |
| Required licenses for this business type | license.gov.uz | **NEED** |
| License cost | license.gov.uz | **NEED** |
| License processing time | license.gov.uz | **NEED** |
| Tax regime options (simplified, general, etc.) | tax code | **NEED** |
| Tax rates by regime | tax code | **NEED** |
| Social fund contributions | government decree | **NEED** |
| Environmental permits (if applicable) | ecology ministry | **NEED** for textile (water use, dyes) |
| Fire safety requirements | MES | **NEED** for production spaces |
| Sanitary requirements (if applicable) | SES | **NEED** for food businesses |

---

## 5. WHAT THE AI PRODUCES WITH THIS DATA

Each section of the results page and what data feeds it:

### Section A: "Оценка рынка" (Market Assessment)
**Feeds from:** 2A (sector overview) + 2B (district data) + user's niche
**Output:** "In your district (Oltiariq), there are approximately X textile enterprises. The Fergana region has 855 total, growing Y% year-over-year. Competition level: Z."

### Section B: "Финансовый прогноз" (Financial Projection)
**Feeds from:** 2C (costs/prices) + user's capital + user's scale
**Output:** Startup cost breakdown, monthly cost estimate, revenue estimate, break-even timeline. ALL based on real cost data.

### Section C: "Конкуренция" (Competition Analysis)
**Feeds from:** 2B (key enterprises) + 2A (enterprise counts)
**Output:** Who are the major players, where is the gap, what niche is underserved.

### Section D: "Риски" (Risk Analysis)
**Feeds from:** 2C (price volatility) + 2B (infrastructure) + sector knowledge
**Output:** Raw material price risk, currency risk, competition risk, infrastructure risk.

### Section E: "План действий" (Action Plan)
**Feeds from:** 4 (regulatory) + user's timeline + user's capital
**Output:** Step 1: Register at soliq.uz (cost: X soum, time: Y days). Step 2: Get license. Step 3: Find space. Etc.

### Section F: "Подходящие продукты NBU" (Bank Product Match)
**Feeds from:** 3A-3C (bank products + matching rules) + user profile
**Output:** "You qualify for Product X (up to Y soum at Z%). Here's why. Here's how to apply."

### Section G: "Карта возможностей" (Heatmap)
**Feeds from:** 2B (district data) + user's niche
**Output:** The interactive map scored for their specific business type and region.

---

## 6. PILOT SCOPE — MINIMUM VIABLE DATA

For a working pilot with **textile in Fergana region**:

### Must have (blocks the pilot):
- [ ] NBU loan products — full list with criteria (Section 3A) — **from NBU team**
- [ ] Textile startup costs — equipment, rent, materials (Section 2C) — **research task**
- [ ] Business registration steps + costs (Section 4) — **research task**
- [ ] Average textile worker wages in Fergana (Section 2C) — **research task**
- [ ] Utility tariffs — electricity, water (Section 2C) — **publicly available**

### Should have (makes it credible):
- [ ] Raw material prices — cotton, silk, yarn (Section 2C)
- [ ] Average rent for production space by district
- [ ] Tax regime comparison for small textile business
- [ ] Export data — where Fergana textiles go

### Already have:
- [x] Population per district (citypopulation.de, 2025)
- [x] Total textile enterprises — 855 (stat.uz)
- [x] Key enterprises — 5 verified (Yodgorlik, Margilan Silk, Global Textile, Innovative Apparel, Handicraft Center)
- [x] Sub-sector breakdown (silk, knitwear, cotton, carpets)
- [x] Year-over-year growth (cotton yarn +26%, fabrics +21%)
- [x] Major FDI — Innovative Apparel $15M / H&M (Qo'shtepa)
- [x] Heatmap with district scores and SVG map

---

## 7. DATA COLLECTION ASSIGNMENTS

| Task | Who | Estimated time |
|------|-----|---------------|
| NBU loan products + eligibility rules | NBU product team / team lead | 1-2 days |
| Textile startup cost research | Research (me + web) | 1 day |
| Registration steps + costs | Research from soliq.uz, my.gov.uz | 0.5 day |
| Utility tariffs | Research from public sources | 0.5 day |
| Tax regime summary | Research from tax code | 0.5 day |
| Average wages in Fergana textile | stat.uz labour reports or NBU internal | 1 day |
| Raw material prices | Industry contacts or bazaar data | 1-2 days |
| Rental costs by district | Local real estate contacts | 1-2 days |

**Total estimated: 1 week of parallel data collection.**

---

## 8. HOW DATA IS STORED IN THE APP

```
lib/
  data/
    textile/
      fergana/
        market.ts        ← sector stats, enterprise counts, growth
        districts.ts     ← per-district scores, population, businesses (HAVE)
        enterprises.ts   ← key companies (HAVE)
        costs.ts         ← startup costs, materials, equipment, rent, wages
        regulations.ts   ← licenses, registration, taxes
    [next-niche]/
      [next-region]/
        ...

  bank-products/
    products.ts          ← all NBU products with criteria
    matching-rules.ts    ← eligibility logic

  regions/
    fergana-paths.ts     ← SVG map (HAVE)
    regions-data.ts      ← viloyat→district mapping (HAVE)
```

The AI prompt is assembled from:
1. User's form answers (dynamic)
2. The matching data pack for their niche + region (pre-loaded)
3. Matching bank products (pre-loaded)

The AI REASONS over real data. It never invents numbers.
