"use client";

import { Dispatch, SetStateAction } from "react";
import { Briefcase, Building2, GraduationCap, Sparkles, User, Wrench, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { SectionLabel, SelectField, TextField } from "./form-fields";
import type { BusinessPath, FinanceData, ProfileData } from "./types";

/* ── Business directions (same in both langs — official Uzbek list) ── */
const BUSINESS_DIRECTIONS = [
  "Автомобил ижараси (Rent a Car)",
  "Тез овқатланиш пунктлари (Фаст-фуд)",
  "Автомобилларни ювиш хизмати",
  "Нон ва кондитер маҳсулотлари",
  "Полиграфия хизматлари",
  "Мебелчилик",
  "Тикувчилик",
  "Гўзаллик салони",
  "Ўқув маркази",
  "Автосервис",
  "Сартарошхона",
  "Савдо дўконлари",
  "Интернет заллари",
  "Умумий овқатланиш хизматлари",
  "Хусусий тиббий хизматлар",
  "Меҳмон уйлари — хостеллар",
  "Мева-сабзавотларни қайта ишлаш",
];

/* ── Translations ──────────────────────────────────── */
const T = {
  ru: {
    stepBadge: "ШАГ 2 ИЗ 5",
    titleNew: "Ваша бизнес-идея",
    titleExisting: "Финансовые вопросы",
    subNew: "Расскажите о вашей идее и ресурсах — мы оценим готовность к старту",
    subExisting: "Вопросы о текущем состоянии бизнеса и планах развития",
    sectionDirection: "БИЗНЕС-НАПРАВЛЕНИЕ",
    directionHint: "Выберите только одно направление.",
    // New path
    sectionIdea: "ВАША ИДЕЯ",
    ideaLabel: "Опишите вашу бизнес-идею кратко",
    ideaPlaceholder: "Например: пошив школьной формы в Маргилане",
    ideaHelper: "Зачем: для точного анализа ниши.",
    whyBusiness: "Почему именно этот бизнес?",
    whyHelper: "Зачем: мотивация влияет на успех.",
    targetCustomer: "Кто ваш целевой клиент?",
    targetHelper: "Зачем: для анализа рынка сбыта.",
    sectionResources: "РЕСУРСЫ",
    ownFunds: "Есть свои средства для старта?",
    ownFundsHelper: "Зачем: для расчёта потребности в кредите.",
    hasSpace: "Есть подходящее помещение?",
    hasSpaceHelper: "Зачем: помещение — крупная статья расходов.",
    hasEquipment: "Есть необходимое оборудование?",
    hasEquipmentHelper: "Зачем: влияет на стартовые затраты.",
    registered: "Бизнес зарегистрирован?",
    registeredHelper: "Зачем: влияет на доступные программы.",
    sectionPlanLoan: "БИЗНЕС-ПЛАН И КРЕДИТ",
    hasPlan: "Есть ли у вас бизнес-план?",
    hasPlanHelper: "Зачем: AI подготовит план, если его нет.",
    needsLoan: "Нужен ли вам кредит?",
    needsLoanHelper: "Зачем: для подбора банковских продуктов.",
    timeline: "Когда планируете запустить?",
    timelineHelper: "Зачем: для планирования подготовки.",
    // Existing path
    sectionCurrentState: "ТЕКУЩЕЕ СОСТОЯНИЕ",
    monthlyIncome: "Средний ежемесячный доход бизнеса?",
    incomeHelper: "Зачем: для оценки финансовой устойчивости.",
    monthlyExpenses: "Средние ежемесячные расходы?",
    expensesHelper: "Зачем: для расчёта прибыльности.",
    existingDebt: "Есть ли действующие кредиты или долги?",
    debtHelper: "Зачем: для оценки кредитной нагрузки.",
    ownFundsExisting: "Есть свои средства для развития?",
    sectionProblems: "ПРОБЛЕМЫ И ЦЕЛИ",
    bizGoal: "Что хотите сделать с бизнесом?",
    goalHelper: "Зачем: для определения приоритетов.",
    mainProblem: "Главная проблема бизнеса сейчас?",
    problemHelper: "Зачем: для подбора решений.",
    sectionFinancing: "ФИНАНСИРОВАНИЕ",
    loanAmount: "Ожидаемая сумма кредита?",
    loanAmountHelper: "Зачем: для подбора подходящей программы.",
    hasCollateral: "Есть имущество для залога?",
    collateralHelper: "Зачем: для определения доступных кредитных продуктов.",
    collateralType: "Тип залога?",
    collateralTypeHelper: "Зачем: влияет на условия кредита.",
    backBtn: "← Назад к профилю",
    nextBtn: "Запустить AI анализ",
    // Status banners
    banners: {
      "Предприниматель": { label: "Предприниматель", subtitle: "Вопросы для предпринимателей: развитие и расширение бизнеса." },
      "Безработный": { label: "Безработный", subtitle: "Вы в поиске возможностей. Подберём ресурсы для старта." },
      "Студент": { label: "Студент", subtitle: "Сочетание учёбы и бизнеса — расскажите о своих ресурсах." },
      "Наёмный работник": { label: "Наёмный работник", subtitle: "Думаете о своём деле параллельно с работой? Оценим возможности." },
      "Самозанятый": { label: "Самозанятый", subtitle: "Оценим путь к формализации и расширению самозанятости." },
    },
    // Options
    planOpts: ["Да, готовый", "Есть черновик", "Нет, нужна помощь"],
    loanOpts: ["Да, обязательно", "Возможно", "Нет, есть свои средства"],
    fundsOpts: ["Да", "Нет", "Частично"],
    collateralOpts: ["Да", "Нет"],
    collateralTypeOpts: ["Дом / квартира", "Земельный участок", "Автомобиль", "Оборудование", "Золото / ценности"],
    whyOpts: ["Есть опыт в этой сфере", "Вижу спрос на рынке", "Есть уникальная идея", "Семейный бизнес", "Другое"],
    targetOpts: ["Физические лица (B2C)", "Бизнес (B2B)", "Государство (B2G)", "Смешанный"],
    spaceOpts: ["Да, своё", "Да, арендую", "Нет, нужно найти"],
    equipOpts: ["Да, полностью", "Частично", "Нет"],
    regOpts: ["Да, ЯТТ (ИП)", "Да, ООО", "Да, фермерское хозяйство", "Нет, не зарегистрирован"],
    timeOpts: ["Уже готов начать", "В течение 1 месяца", "1–3 месяца", "3–6 месяцев", "Через 6+ месяцев"],
    incomeOpts: ["Нет дохода", "До 5 млн", "5–20 млн", "20–50 млн", "50–100 млн", "Более 100 млн"],
    expenseOpts: ["До 3 млн", "3–10 млн", "10–30 млн", "30–50 млн", "50–100 млн", "Более 100 млн"],
    debtOpts: ["Нет", "Да, выплачиваю вовремя", "Да, есть просрочки"],
    goalOpts: ["Расширить ассортимент", "Увеличить производство", "Открыть новую точку", "Снизить расходы", "Модернизировать оборудование", "Выйти на экспорт"],
    problemOpts: ["Не хватает оборотных средств", "Нет клиентов", "Высокая конкуренция", "Нет оборудования", "Нет знаний/опыта", "Нет помещения", "Высокие расходы"],
    amountOpts: ["До 50 млн", "50–200 млн", "200–500 млн", "500 млн – 1 млрд", "Более 1 млрд"],
  },
  uz: {
    stepBadge: "2-ҚАДАМ (5 ТАДАН)",
    titleNew: "Бизнес ғоянгиз",
    titleExisting: "Молиявий саволлар",
    subNew: "Ғоянгиз ва ресурсларингиз ҳақида айтинг — бошлашга тайёрлигингизни баҳолаймиз",
    subExisting: "Бизнеснинг жорий ҳолати ва ривожланиш режалари ҳақида саволлар",
    sectionDirection: "БИЗНЕС ЙЎНАЛИШИ",
    directionHint: "Фақат битта йўналишни танланг.",
    sectionIdea: "ҒОЯНГИЗ",
    ideaLabel: "Бизнес ғоянгизни қисқача тавсифланг",
    ideaPlaceholder: "Масалан: Марғилонда мактаб формаси тикиш",
    ideaHelper: "Нима учун: нишани аниқ таҳлил қилиш учун.",
    whyBusiness: "Нега айнан бу бизнес?",
    whyHelper: "Нима учун: мотивация муваффақиятга таъсир қилади.",
    targetCustomer: "Мақсадли мижозингиз ким?",
    targetHelper: "Нима учун: сотув бозорини таҳлил қилиш учун.",
    sectionResources: "РЕСУРСЛАР",
    ownFunds: "Бошлаш учун ўз маблағингиз борми?",
    ownFundsHelper: "Нима учун: кредитга бўлган эҳтиёжни ҳисоблаш учун.",
    hasSpace: "Мос бино борми?",
    hasSpaceHelper: "Нима учун: бино — йирик харажат моддаси.",
    hasEquipment: "Зарур ускуна борми?",
    hasEquipmentHelper: "Нима учун: бошланғич харажатларга таъсир қилади.",
    registered: "Бизнес рўйхатдан ўтганми?",
    registeredHelper: "Нима учун: мавжуд дастурларга таъсир қилади.",
    sectionPlanLoan: "БИЗНЕС-ПЛАН ВА КРЕДИТ",
    hasPlan: "Бизнес-планингиз борми?",
    hasPlanHelper: "Нима учун: AI план тайёрлайди, агар йўқ бўлса.",
    needsLoan: "Сизга кредит керакми?",
    needsLoanHelper: "Нима учун: банк маҳсулотларини танлаш учун.",
    timeline: "Қачон бошлашни режалаштиряпсиз?",
    timelineHelper: "Нима учун: тайёргарликни режалаштириш учун.",
    sectionCurrentState: "ЖОРИЙ ҲОЛАТ",
    monthlyIncome: "Бизнеснинг ўртача ойлик даромади?",
    incomeHelper: "Нима учун: молиявий барқарорликни баҳолаш учун.",
    monthlyExpenses: "Ўртача ойлик харажатлар?",
    expensesHelper: "Нима учун: фойдалиликни ҳисоблаш учун.",
    existingDebt: "Амалдаги кредитлар ёки қарзлар борми?",
    debtHelper: "Нима учун: кредит юкини баҳолаш учун.",
    ownFundsExisting: "Ривожланиш учун ўз маблағингиз борми?",
    sectionProblems: "МУАММОЛАР ВА МАҚСАДЛАР",
    bizGoal: "Бизнес билан нима қилмоқчисиз?",
    goalHelper: "Нима учун: устуворликларни аниқлаш учун.",
    mainProblem: "Бизнеснинг асосий муаммоси?",
    problemHelper: "Нима учун: ечимларни танлаш учун.",
    sectionFinancing: "МОЛИЯЛАШТИРИШ",
    loanAmount: "Кутилаётган кредит суммаси?",
    loanAmountHelper: "Нима учун: мос дастурни танлаш учун.",
    hasCollateral: "Гаров учун мулк борми?",
    collateralHelper: "Нима учун: мавжуд кредит маҳсулотларини аниқлаш учун.",
    collateralType: "Гаров тури?",
    collateralTypeHelper: "Нима учун: кредит шартларига таъсир қилади.",
    backBtn: "← Профилга қайтиш",
    nextBtn: "AI таҳлилни бошлаш",
    banners: {
      "Предприниматель": { label: "Тадбиркор", subtitle: "Тадбиркорлар учун саволлар: бизнесни ривожлантириш ва кенгайтириш." },
      "Безработный": { label: "Ишсиз", subtitle: "Имкониятлар излаяпсиз. Бошлаш учун ресурслар танлаймиз." },
      "Студент": { label: "Талаба", subtitle: "Ўқиш ва бизнесни бирлаштириш — ресурсларингиз ҳақида айтинг." },
      "Наёмный работник": { label: "Ёлланма ишчи", subtitle: "Иш билан бирга ўз ишингизни ўйлаяпсизми? Имкониятларни баҳолаймиз." },
      "Самозанятый": { label: "Ўз-ўзини банд қилган", subtitle: "Расмийлаштириш ва кенгайтириш йўлини баҳолаймиз." },
    },
    planOpts: ["Ҳа, тайёр", "Қоралама бор", "Йўқ, ёрдам керак"],
    loanOpts: ["Ҳа, албатта", "Балки", "Йўқ, ўз маблағим бор"],
    fundsOpts: ["Ҳа", "Йўқ", "Қисман"],
    collateralOpts: ["Ҳа", "Йўқ"],
    collateralTypeOpts: ["Уй / квартира", "Ер участка", "Автомобиль", "Ускуна", "Олтин / қимматбаҳо буюмлар"],
    whyOpts: ["Бу соҳада тажрибам бор", "Бозорда талаб кўряпман", "Ноёб ғоям бор", "Оилавий бизнес", "Бошқа"],
    targetOpts: ["Жисмоний шахслар (B2C)", "Бизнес (B2B)", "Давлат (B2G)", "Аралаш"],
    spaceOpts: ["Ҳа, ўзимники", "Ҳа, ижарада", "Йўқ, топиш керак"],
    equipOpts: ["Ҳа, тўлиқ", "Қисман", "Йўқ"],
    regOpts: ["Ҳа, ЯТТ", "Ҳа, МЧЖ", "Ҳа, фермер хўжалиги", "Йўқ, рўйхатдан ўтмаган"],
    timeOpts: ["Бошлашга тайёрман", "1 ой ичида", "1–3 ой", "3–6 ой", "6+ ойдан кейин"],
    incomeOpts: ["Даромад йўқ", "5 млн гача", "5–20 млн", "20–50 млн", "50–100 млн", "100 млн дан ортиқ"],
    expenseOpts: ["3 млн гача", "3–10 млн", "10–30 млн", "30–50 млн", "50–100 млн", "100 млн дан ортиқ"],
    debtOpts: ["Йўқ", "Ҳа, ўз вақтида тўлайман", "Ҳа, кечикишлар бор"],
    goalOpts: ["Ассортиментни кенгайтириш", "Ишлаб чиқаришни оширгиш", "Янги филиал очиш", "Харажатларни камайтириш", "Ускуналарни янгилаш", "Экспортга чиқиш"],
    problemOpts: ["Айланма маблағ етишмайди", "Мижоз йўқ", "Юқори рақобат", "Ускуна йўқ", "Билим/тажриба йўқ", "Бино йўқ", "Юқори харажатлар"],
    amountOpts: ["50 млн гача", "50–200 млн", "200–500 млн", "500 млн – 1 млрд", "1 млрд дан ортиқ"],
  },
};

const BANNER_ICONS: Record<string, LucideIcon> = {
  "Предприниматель": Building2,
  "Безработный": User,
  "Студент": GraduationCap,
  "Наёмный работник": Briefcase,
  "Самозанятый": Wrench,
};

/* ── Component ──────────────────────────────────────── */

interface Step2Props {
  profile: ProfileData;
  finance: FinanceData;
  setFinance: Dispatch<SetStateAction<FinanceData>>;
  path: BusinessPath;
  onBack: () => void;
  onNext: () => void;
}

export function Step2Finance({ profile, finance, setFinance, path, onBack, onNext }: Step2Props) {
  const { lang } = useLang();
  const t = T[lang];

  const update = <K extends keyof FinanceData>(key: K, value: FinanceData[K]) =>
    setFinance((f) => ({ ...f, [key]: value }));

  const handleCollateralChange = (v: string) =>
    setFinance((f) => ({ ...f, hasCollateral: v, collateralType: v === t.collateralOpts[0] ? f.collateralType : "" }));

  const bannerData = t.banners[profile.currentStatus as keyof typeof t.banners];
  const BannerIcon = BANNER_ICONS[profile.currentStatus];
  const showCollateralType = finance.hasCollateral === t.collateralOpts[0]; // "Да" or "Ҳа"
  const showLoanAmount = finance.needsLoan === t.loanOpts[0] || finance.needsLoan === t.loanOpts[1];

  const canProceed =
    !!finance.businessDirection &&
    (path === "new"
      ? !!finance.hasOwnFunds && !!finance.needsLoan
      : !!finance.monthlyIncome && !!finance.businessGoal);

  return (
    <div className="bg-white border border-border rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] py-10 px-12 animate-fade-in-up">
      <div>
        <span className="inline-flex items-center font-sans text-[12px] font-semibold text-gold-500 bg-gold-500/[0.08] rounded-[6px] py-1 px-3">
          {t.stepBadge}
        </span>
        <h1 className="font-sans text-[28px] font-bold text-carbon mt-4">
          {path === "new" ? t.titleNew : t.titleExisting}
        </h1>
        <p className="font-sans text-[15px] font-normal text-gray-600 leading-[1.5] mt-2">
          {path === "new" ? t.subNew : t.subExisting}
        </p>
      </div>

      {/* Adaptive banner */}
      {bannerData && BannerIcon && (
        <div className="flex items-center gap-3 rounded-[10px] border py-4 px-5 mt-6" style={{ borderColor: "rgba(215,181,109,0.2)", background: "rgba(215,181,109,0.06)" }}>
          <div className="w-9 h-9 rounded-full bg-gold-500/10 inline-flex items-center justify-center shrink-0">
            <BannerIcon size={20} strokeWidth={2} className="text-gold-500" />
          </div>
          <div>
            <div className="font-sans text-[16px] font-semibold text-gold-500 leading-tight">{bannerData.label}</div>
            <div className="font-sans text-[14px] font-normal text-gray-600 mt-[2px]">{bannerData.subtitle}</div>
          </div>
        </div>
      )}

      {/* Business Direction */}
      <div className="mt-10">
        <SectionLabel color="gold">{t.sectionDirection}</SectionLabel>
        <p className="font-sans text-[13px] font-medium text-gray-600 mt-3 mb-4">{t.directionHint}</p>
        <div className="flex flex-wrap gap-[10px]">
          {BUSINESS_DIRECTIONS.map((direction) => {
            const selected = finance.businessDirection === direction;
            return (
              <button key={direction} type="button" onClick={() => update("businessDirection", direction)}
                className={cn("font-sans text-[14px] font-medium py-[10px] px-[18px] rounded-[10px] border-[1.5px] transition-[background-color,border-color,color] duration-150",
                  selected ? "bg-navy-900 text-white border-navy-900" : "bg-gray-100 text-carbon border-border hover:border-navy-700 hover:bg-navy-900/[0.03]")}
                aria-pressed={selected}>{direction}</button>
            );
          })}
        </div>
      </div>

      {/* NEW PATH */}
      {path === "new" && (
        <>
          <div className="mt-10">
            <SectionLabel color="navy">{t.sectionIdea}</SectionLabel>
            <div className="mt-6 space-y-7">
              <TextField label={t.ideaLabel} placeholder={t.ideaPlaceholder} value={finance.ideaDescription ?? ""} onChange={(v) => update("ideaDescription", v)} helper={t.ideaHelper} />
              <div className="grid grid-cols-2 gap-x-6 gap-y-7">
                <SelectField label={t.whyBusiness} options={t.whyOpts} value={finance.whyThisBusiness ?? ""} onChange={(v) => update("whyThisBusiness", v)} helper={t.whyHelper} />
                <SelectField label={t.targetCustomer} options={t.targetOpts} value={finance.targetCustomer ?? ""} onChange={(v) => update("targetCustomer", v)} helper={t.targetHelper} />
              </div>
            </div>
          </div>
          <div className="mt-10">
            <SectionLabel color="gold">{t.sectionResources}</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-6">
              <SelectField label={t.ownFunds} options={t.fundsOpts} value={finance.hasOwnFunds} onChange={(v) => update("hasOwnFunds", v)} helper={t.ownFundsHelper} />
              <SelectField label={t.hasSpace} options={t.spaceOpts} value={finance.hasSpace ?? ""} onChange={(v) => update("hasSpace", v)} helper={t.hasSpaceHelper} />
              <SelectField label={t.hasEquipment} options={t.equipOpts} value={finance.hasEquipment ?? ""} onChange={(v) => update("hasEquipment", v)} helper={t.hasEquipmentHelper} />
              <SelectField label={t.registered} options={t.regOpts} value={finance.hasRegisteredBusiness} onChange={(v) => update("hasRegisteredBusiness", v)} helper={t.registeredHelper} />
            </div>
          </div>
          <div className="mt-10">
            <SectionLabel color="navy">{t.sectionPlanLoan}</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-6">
              <SelectField label={t.hasPlan} options={t.planOpts} value={finance.hasBusinessPlan} onChange={(v) => update("hasBusinessPlan", v)} helper={t.hasPlanHelper} />
              <SelectField label={t.needsLoan} options={t.loanOpts} value={finance.needsLoan} onChange={(v) => update("needsLoan", v)} helper={t.needsLoanHelper} />
              <SelectField label={t.timeline} options={t.timeOpts} value={finance.timeline ?? ""} onChange={(v) => update("timeline", v)} helper={t.timelineHelper} />
            </div>
          </div>
        </>
      )}

      {/* EXISTING PATH */}
      {path === "existing" && (
        <>
          <div className="mt-10">
            <SectionLabel color="navy">{t.sectionCurrentState}</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-6">
              <SelectField label={t.monthlyIncome} options={t.incomeOpts} value={finance.monthlyIncome} onChange={(v) => update("monthlyIncome", v)} helper={t.incomeHelper} />
              <SelectField label={t.monthlyExpenses} options={t.expenseOpts} value={finance.monthlyExpenses ?? ""} onChange={(v) => update("monthlyExpenses", v)} helper={t.expensesHelper} />
              <SelectField label={t.existingDebt} options={t.debtOpts} value={finance.existingDebt ?? ""} onChange={(v) => update("existingDebt", v)} helper={t.debtHelper} />
              <SelectField label={t.ownFundsExisting} options={t.fundsOpts} value={finance.hasOwnFunds} onChange={(v) => update("hasOwnFunds", v)} helper={t.ownFundsHelper} />
            </div>
          </div>
          <div className="mt-10">
            <SectionLabel color="gold">{t.sectionProblems}</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-6">
              <SelectField label={t.bizGoal} options={t.goalOpts} value={finance.businessGoal} onChange={(v) => update("businessGoal", v)} helper={t.goalHelper} />
              <SelectField label={t.mainProblem} options={t.problemOpts} value={finance.mainProblem} onChange={(v) => update("mainProblem", v)} helper={t.problemHelper} />
            </div>
          </div>
          <div className="mt-10">
            <SectionLabel color="navy">{t.sectionFinancing}</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-6">
              <SelectField label={t.needsLoan} options={t.loanOpts} value={finance.needsLoan} onChange={(v) => update("needsLoan", v)} helper={t.needsLoanHelper} />
              {showLoanAmount && (
                <SelectField label={t.loanAmount} options={t.amountOpts} value={finance.loanAmount ?? ""} onChange={(v) => update("loanAmount", v)} helper={t.loanAmountHelper} />
              )}
              <SelectField label={t.hasCollateral} options={t.collateralOpts} value={finance.hasCollateral} onChange={handleCollateralChange} helper={t.collateralHelper} />
              {showCollateralType && (
                <SelectField label={t.collateralType} options={t.collateralTypeOpts} value={finance.collateralType ?? ""} onChange={(v) => update("collateralType", v)} helper={t.collateralTypeHelper} />
              )}
              <SelectField label={t.hasPlan} options={t.planOpts} value={finance.hasBusinessPlan} onChange={(v) => update("hasBusinessPlan", v)} helper={t.hasPlanHelper} />
            </div>
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between">
        <button type="button" onClick={onBack} className="font-sans text-[14px] font-medium text-navy-700 hover:bg-navy-900/[0.04] rounded-[8px] py-2 px-3 transition-colors duration-150">
          {t.backBtn}
        </button>
        <button type="button" onClick={onNext} disabled={!canProceed}
          className={cn("inline-flex items-center font-sans text-[15px] font-semibold text-navy-900 bg-gold-500 rounded-[10px] py-[14px] px-10 transition-[background-color,opacity] duration-200",
            canProceed ? "hover:bg-[#C9A85F]" : "opacity-50 cursor-not-allowed")}>
          <Sparkles size={18} strokeWidth={2.25} className="mr-2" />
          {t.nextBtn}
        </button>
      </div>
    </div>
  );
}
