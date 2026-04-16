"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import { ArrowRight, ArrowLeft, User, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import {
  SectionLabel,
  SelectField,
  TextField,
} from "./form-fields";
import { REGIONS, VILOYAT_OPTIONS } from "./regions-data";
import type { BusinessPath, ProfileData } from "./types";

/* ── Translations ──────────────────────────────────── */

const T = {
  ru: {
    stepBadge: "ШАГ 1 ИЗ 5",
    titleNew: "Расскажите о себе",
    titleExisting: "О вас и вашем бизнесе",
    subNew: "Мы узнаем о вас, чтобы подобрать правильные вопросы и дать точный анализ",
    subExisting: "Расскажите о себе и бизнесе — это поможет нам оценить ситуацию точнее",
    sectionPersonal: "ЛИЧНЫЕ ДАННЫЕ",
    name: "Ваше полное имя",
    namePlaceholder: "Жавохир Каримов",
    age: "Возраст",
    ageHelper: "Зачем: для подбора молодёжных программ кредитования.",
    gender: "Пол",
    genderHelper: "Зачем: для программ поддержки женского предпринимательства.",
    education: "Высшее образование?",
    educationHelper: "Зачем: для кредита «Тадбиркорликка илк кадам» (выпускники).",
    specialty: "Специальность (необязательно)",
    specialtyPlaceholder: "Например: технолог текстиля",
    specialtyHelper: "Зачем: если связана с бизнесом — фактор доверия.",
    marital: "Семейное положение",
    dependents: "Количество иждивенцев",
    dependentsHelper: "Зачем: для расчёта личных расходов.",
    sectionBusiness: "О ВАШЕМ БИЗНЕСЕ",
    entityQuestion: "Вы физ. лицо или юр. лицо?",
    entityPhysTitle: "Физическое лицо",
    entityPhysDesc: "ИП, самозанятый, без регистрации",
    entityLegalTitle: "Юридическое лицо",
    entityLegalDesc: "ООО, АО, фермерское хозяйство",
    entityHelper: "Зачем: влияет на доступные кредитные продукты и условия.",
    regForm: "Форма регистрации",
    regFormHelper: "Зачем: определяет налоговый режим и возможности.",
    bizSize: "Размер бизнеса",
    bizSizeHelper: "Зачем: для подбора программ поддержки.",
    bizAge: "Возраст бизнеса",
    bizAgeHelper: "Зачем: для оценки стабильности.",
    empCount: "Количество сотрудников",
    empCountHelper: "Зачем: для определения масштаба бизнеса.",
    sectionLocation: "ЛОКАЦИЯ",
    viloyat: "Область (вилоят)",
    viloyatHelper: "Зачем: для региональной аналитики.",
    hudud: "Район (худуд)",
    hududHelper: "Зачем: для точного анализа рынка.",
    hududPlaceholderReady: "Выберите",
    hududPlaceholderWait: "Сначала выберите область",
    mahalla: "Махалля (необязательно)",
    mahallaPlaceholder: "Введите название махалли",
    urbanRural: "Вы живёте в городе или в селе?",
    urbanRuralHelper: "Зачем: для программ сельского предпринимательства.",
    sectionExperience: "ОПЫТ И НАВЫКИ",
    currentStatus: "Ваш текущий статус",
    currentStatusHelper: "Зачем: для подбора подходящих программ.",
    expLevel: "Опыт работы в бизнесе",
    expLevelHelper: "Зачем: для оценки рисков.",
    domainExp: "Работали ли вы в сфере, в которой хотите открыть бизнес?",
    domainExpHelper: "Зачем: опыт в отрасли — главный фактор успеха.",
    training: "Проходили обучение по предпринимательству?",
    mentor: "Есть наставник или партнёр с опытом?",
    mentorHelper: "Зачем: наличие поддержки снижает риски.",
    back: "Назад",
    next: "Следующий шаг",
    // Options
    ageOpts: ["18-24", "25-30", "31-40", "41-50", "51+"],
    genderOpts: ["Мужской", "Женский"],
    educationOpts: ["Да", "Нет", "Среднее специальное"],
    maritalOpts: ["Холост/Не замужем", "Женат/Замужем", "Разведён(а)"],
    dependentsOpts: ["0", "1-2", "3-5", "6+"],
    urbanOpts: ["Город", "Пригород", "Село"],
    statusOpts: ["Безработный", "Наёмный работник", "Самозанятый", "Студент", "Пенсионер"],
    expOpts: ["Нет опыта", "Менее 1 года", "1-3 года", "3-5 лет", "5-10 лет", "Более 10 лет"],
    domainExpOpts: ["Да, работал(а) в этой сфере", "Нет, но изучал(а)", "Нет, начинаю с нуля"],
    yesNo: ["Да", "Нет"],
    regFormOpts: ["ЯТТ (ИП)", "ООО", "Фермерское хозяйство", "Семейное предприятие", "Другое"],
    bizSizeOpts: ["Микро (до 5 сотрудников)", "Малый (5–25 сотрудников)", "Средний (25–100 сотрудников)", "Крупный (100+ сотрудников)"],
    bizAgeOpts: ["Менее 6 месяцев", "6–12 месяцев", "1–3 года", "3–5 лет", "5–10 лет", "Более 10 лет"],
    empCountOpts: ["Только я", "2–5", "6–15", "16–50", "51–100", "Более 100"],
  },
  uz: {
    stepBadge: "1-ҚАДАМ (5 ТАДАН)",
    titleNew: "Ўзингиз ҳақингизда",
    titleExisting: "Сиз ва бизнесингиз ҳақида",
    subNew: "Тўғри саволларни танлаш ва аниқ таҳлил бериш учун сиз ҳақингизда биламиз",
    subExisting: "Ўзингиз ва бизнесингиз ҳақида айтинг — бу бизга вазиятни аниқроқ баҳолашга ёрдам беради",
    sectionPersonal: "ШАХСИЙ МАЪЛУМОТЛАР",
    name: "Тўлиқ исмингиз",
    namePlaceholder: "Жавоҳир Каримов",
    age: "Ёш",
    ageHelper: "Нима учун: ёшларга мўлжалланган кредитлаш дастурларини танлаш учун.",
    gender: "Жинс",
    genderHelper: "Нима учун: аёллар тадбиркорлигини қўллаб-қувватлаш дастурлари учун.",
    education: "Олий таълим?",
    educationHelper: "Нима учун: «Тадбиркорликка илк қадам» кредити учун (битирувчилар).",
    specialty: "Мутахассислик (ихтиёрий)",
    specialtyPlaceholder: "Масалан: тўқимачилик технологи",
    specialtyHelper: "Нима учун: бизнес билан боғлиқ бўлса — ишонч омили.",
    marital: "Оилавий ҳолат",
    dependents: "Қарамоғидагилар сони",
    dependentsHelper: "Нима учун: шахсий харажатларни ҳисоблаш учун.",
    sectionBusiness: "БИЗНЕСИНГИЗ ҲАҚИДА",
    entityQuestion: "Сиз жисмоний шахсми ёки юридик шахсми?",
    entityPhysTitle: "Жисмоний шахс",
    entityPhysDesc: "ЯТТ, ўз-ўзини банд қилган, рўйхатдан ўтмаган",
    entityLegalTitle: "Юридик шахс",
    entityLegalDesc: "МЧЖ, АЖ, фермер хўжалиги",
    entityHelper: "Нима учун: мавжуд кредит маҳсулотлари ва шартларга таъсир қилади.",
    regForm: "Рўйхатдан ўтиш шакли",
    regFormHelper: "Нима учун: солиқ тартиби ва имкониятларни белгилайди.",
    bizSize: "Бизнес ҳажми",
    bizSizeHelper: "Нима учун: қўллаб-қувватлаш дастурларини танлаш учун.",
    bizAge: "Бизнес ёши",
    bizAgeHelper: "Нима учун: барқарорликни баҳолаш учун.",
    empCount: "Ходимлар сони",
    empCountHelper: "Нима учун: бизнес миқёсини аниқлаш учун.",
    sectionLocation: "ЖОЙЛАШУВ",
    viloyat: "Вилоят",
    viloyatHelper: "Нима учун: минтақавий таҳлил учун.",
    hudud: "Туман (ҳудуд)",
    hududHelper: "Нима учун: аниқ бозор таҳлили учун.",
    hududPlaceholderReady: "Танланг",
    hududPlaceholderWait: "Аввал вилоятни танланг",
    mahalla: "Маҳалла (ихтиёрий)",
    mahallaPlaceholder: "Маҳалла номини киритинг",
    urbanRural: "Шаҳарда ёки қишлоқда яшайсизми?",
    urbanRuralHelper: "Нима учун: қишлоқ тадбиркорлиги дастурлари учун.",
    sectionExperience: "ТАЖРИБА ВА КЎНИКМАЛАР",
    currentStatus: "Жорий ҳолатингиз",
    currentStatusHelper: "Нима учун: мос дастурларни танлаш учун.",
    expLevel: "Бизнесда иш тажрибаси",
    expLevelHelper: "Нима учун: хатарларни баҳолаш учун.",
    domainExp: "Бизнес очмоқчи бўлган соҳада ишлаганмисиз?",
    domainExpHelper: "Нима учун: тармоқдаги тажриба — муваффақиятнинг асосий омили.",
    training: "Тадбиркорлик бўйича ўқиганмисиз?",
    mentor: "Тажрибали устоз ёки шерикингиз борми?",
    mentorHelper: "Нима учун: қўллаб-қувватлаш хатарларни камайтиради.",
    back: "Орқага",
    next: "Кейинги қадам",
    // Options
    ageOpts: ["18-24", "25-30", "31-40", "41-50", "51+"],
    genderOpts: ["Эркак", "Аёл"],
    educationOpts: ["Ҳа", "Йўқ", "Ўрта махсус"],
    maritalOpts: ["Турмуш қурмаган", "Турмуш қурган", "Ажрашган"],
    dependentsOpts: ["0", "1-2", "3-5", "6+"],
    urbanOpts: ["Шаҳар", "Шаҳар атрофи", "Қишлоқ"],
    statusOpts: ["Ишсиз", "Ёлланма ишчи", "Ўз-ўзини банд қилган", "Талаба", "Нафақахўр"],
    expOpts: ["Тажриба йўқ", "1 йилдан кам", "1-3 йил", "3-5 йил", "5-10 йил", "10 йилдан ортиқ"],
    domainExpOpts: ["Ҳа, бу соҳада ишлаганман", "Йўқ, лекин ўрганганман", "Йўқ, нолдан бошлайман"],
    yesNo: ["Ҳа", "Йўқ"],
    regFormOpts: ["ЯТТ", "МЧЖ", "Фермер хўжалиги", "Оилавий корхона", "Бошқа"],
    bizSizeOpts: ["Микро (5 тагача ходим)", "Кичик (5–25 ходим)", "Ўрта (25–100 ходим)", "Йирик (100+ ходим)"],
    bizAgeOpts: ["6 ойдан кам", "6–12 ой", "1–3 йил", "3–5 йил", "5–10 йил", "10 йилдан ортиқ"],
    empCountOpts: ["Фақат мен", "2–5", "6–15", "16–50", "51–100", "100 дан ортиқ"],
  },
};

/* ── Component ──────────────────────────────────────── */

interface Step1Props {
  profile: ProfileData;
  setProfile: Dispatch<SetStateAction<ProfileData>>;
  path: BusinessPath;
  onBack: () => void;
  onNext: () => void;
}

export function Step1Profile({ profile, setProfile, path, onBack, onNext }: Step1Props) {
  const { lang } = useLang();
  const t = T[lang];

  const update = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const hududOptions = useMemo(
    () => (profile.viloyat ? REGIONS[profile.viloyat] ?? [] : []),
    [profile.viloyat],
  );

  const handleViloyatChange = (v: string) =>
    setProfile((p) => ({ ...p, viloyat: v, hudud: "", mahalla: "" }));

  const entityCards = [
    { id: "Физическое лицо" as const, icon: User, title: t.entityPhysTitle, desc: t.entityPhysDesc },
    { id: "Юридическое лицо" as const, icon: Building2, title: t.entityLegalTitle, desc: t.entityLegalDesc },
  ];

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

      {/* ── Section 1: Personal ──────────────────── */}
      <div className="mt-10">
        <SectionLabel color="gold">{t.sectionPersonal}</SectionLabel>
        <div className="mt-6 space-y-7">
          <TextField label={t.name} placeholder={t.namePlaceholder} value={profile.name} onChange={(v) => update("name", v)} />
          <div className="grid grid-cols-2 gap-x-6 gap-y-7">
            <SelectField label={t.age} options={t.ageOpts} value={profile.ageRange} onChange={(v) => update("ageRange", v)} helper={t.ageHelper} />
            <SelectField label={t.gender} options={t.genderOpts} value={profile.gender} onChange={(v) => update("gender", v)} helper={t.genderHelper} />
            <SelectField label={t.education} options={t.educationOpts} value={profile.hasHigherEducation} onChange={(v) => update("hasHigherEducation", v)} helper={t.educationHelper} />
            <TextField label={t.specialty} placeholder={t.specialtyPlaceholder} value={profile.educationField} onChange={(v) => update("educationField", v)} helper={t.specialtyHelper} />
            {path === "new" && (
              <>
                <SelectField label={t.marital} options={t.maritalOpts} value={profile.maritalStatus} onChange={(v) => update("maritalStatus", v)} />
                <SelectField label={t.dependents} options={t.dependentsOpts} value={profile.dependents} onChange={(v) => update("dependents", v)} helper={t.dependentsHelper} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 2 (existing only): Business Info ── */}
      {path === "existing" && (
        <div className="mt-10">
          <SectionLabel color="navy">{t.sectionBusiness}</SectionLabel>
          <p className="font-sans text-[14px] font-semibold text-carbon mt-6 mb-3">{t.entityQuestion}</p>
          <div className="grid grid-cols-2 gap-4">
            {entityCards.map((card) => {
              const isSelected = profile.entityType === card.id;
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => update("entityType", card.id)}
                  className={cn(
                    "relative text-left rounded-[12px] border-[2px] p-5 transition-all duration-200",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40",
                    isSelected
                      ? "border-navy-900 bg-navy-900/[0.03] shadow-[0_2px_12px_rgba(25,63,114,0.1)]"
                      : "border-border bg-white hover:border-steel-500/50 hover:shadow-[0_1px_6px_rgba(0,0,0,0.04)]",
                  )}
                >
                  <div className={cn("absolute top-4 right-4 w-5 h-5 rounded-full border-[2px] transition-all duration-200 flex items-center justify-center", isSelected ? "border-navy-900 bg-navy-900" : "border-border bg-white")}>
                    {isSelected && (
                      <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div className={cn("w-10 h-10 rounded-[10px] flex items-center justify-center mb-3", isSelected ? "bg-navy-900/10" : "bg-gray-100")}>
                    <Icon size={20} strokeWidth={1.75} className={isSelected ? "text-navy-900" : "text-steel-500"} />
                  </div>
                  <div className="font-sans text-[16px] font-bold text-carbon">{card.title}</div>
                  <div className="font-sans text-[13px] font-normal text-gray-600 mt-1">{card.desc}</div>
                </button>
              );
            })}
          </div>
          <p className="font-sans text-[12px] font-normal italic text-steel-500 mt-2">{t.entityHelper}</p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-7">
            <SelectField label={t.regForm} options={t.regFormOpts} value={profile.registrationForm ?? ""} onChange={(v) => update("registrationForm", v)} helper={t.regFormHelper} />
            <SelectField label={t.bizSize} options={t.bizSizeOpts} value={profile.businessSize ?? ""} onChange={(v) => update("businessSize", v)} helper={t.bizSizeHelper} />
            <SelectField label={t.bizAge} options={t.bizAgeOpts} value={profile.businessAge ?? ""} onChange={(v) => update("businessAge", v)} helper={t.bizAgeHelper} />
            <SelectField label={t.empCount} options={t.empCountOpts} value={profile.employeeCount ?? ""} onChange={(v) => update("employeeCount", v)} helper={t.empCountHelper} />
          </div>
        </div>
      )}

      {/* ── Section: Location ──────────────────── */}
      <div className="mt-10">
        <SectionLabel color="gold">{t.sectionLocation}</SectionLabel>
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 mt-6">
          <SelectField label={t.viloyat} options={VILOYAT_OPTIONS} value={profile.viloyat} onChange={handleViloyatChange} helper={t.viloyatHelper} />
          <SelectField label={t.hudud} options={hududOptions} value={profile.hudud} onChange={(v) => update("hudud", v)} placeholder={profile.viloyat ? t.hududPlaceholderReady : t.hududPlaceholderWait} disabled={!profile.viloyat} helper={t.hududHelper} />
          <TextField label={t.mahalla} placeholder={t.mahallaPlaceholder} value={profile.mahalla} onChange={(v) => update("mahalla", v)} />
          <SelectField label={t.urbanRural} options={t.urbanOpts} value={profile.urbanRural} onChange={(v) => update("urbanRural", v)} helper={t.urbanRuralHelper} />
        </div>
      </div>

      {/* ── Section (new only): Experience ─────── */}
      {path === "new" && (
        <div className="mt-10">
          <SectionLabel color="gold">{t.sectionExperience}</SectionLabel>
          <div className="mt-6 space-y-7">
            <div className="grid grid-cols-2 gap-x-6 gap-y-7">
              <SelectField label={t.currentStatus} options={t.statusOpts} value={profile.currentStatus} onChange={(v) => update("currentStatus", v)} helper={t.currentStatusHelper} />
              <SelectField label={t.expLevel} options={t.expOpts} value={profile.experienceLevel} onChange={(v) => update("experienceLevel", v)} helper={t.expLevelHelper} />
            </div>
            <SelectField label={t.domainExp} options={t.domainExpOpts} value={profile.domainExperience} onChange={(v) => update("domainExperience", v)} helper={t.domainExpHelper} />
            <div className="grid grid-cols-2 gap-x-6 gap-y-7">
              <SelectField label={t.training} options={t.yesNo} value={profile.hasTraining} onChange={(v) => update("hasTraining", v)} />
              <SelectField label={t.mentor} options={t.yesNo} value={profile.hasMentor} onChange={(v) => update("hasMentor", v)} helper={t.mentorHelper} />
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ────────────────────────────── */}
      <div className="mt-10 flex items-center justify-between">
        <button type="button" onClick={onBack} className="inline-flex items-center font-sans text-[14px] font-medium text-steel-500 hover:text-navy-900 transition-colors duration-200">
          <ArrowLeft size={16} strokeWidth={2} className="mr-1" />
          {t.back}
        </button>
        <button type="button" onClick={onNext} className="inline-flex items-center font-sans text-[15px] font-semibold text-white bg-navy-900 hover:bg-navy-700 rounded-[10px] py-[14px] px-10 transition-colors duration-200">
          {t.next}
          <ArrowRight size={18} strokeWidth={2.25} className="ml-2" />
        </button>
      </div>
    </div>
  );
}
