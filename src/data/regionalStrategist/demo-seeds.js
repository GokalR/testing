/**
 * Demo seeds — pre-filled Step 1 + Step 2 answers for showcase runs.
 *
 * The ERKIN PARVOZ seed mirrors the real SME in NBU_analytics/SME-companies/:
 *   Организация:  ERKIN PARVOZ NURI OLTIN MCHJ
 *   ИФУТ:         85100 (дошкольное образование)
 *   Адрес:        Фарғона ш., Мирзо Улуғбек MFY
 *   Forma 1 (Баланс) 2024:
 *     Jami aktivlar         7,876,771 ming som
 *     O'z kapitali          2,746,628 ming som
 *     Joriy aktivlar/majburiyatlar ≈ 1.19
 *   Forma 2 (Moliyaviy natija) 2024:
 *     Sof tushum            3,444,401 ming som
 *     Sof foyda               425,274 ming som
 *     Yalpi foyda rentabel. ≈ 33 %
 *
 * Option strings MUST match exactly the values declared in
 * rs-step1-i18n.js / rs-step2-i18n.js (ru variants) — otherwise the
 * RsSelectField shows an empty value.
 */

export const DEMO_SEEDS = {
  erkinParvoz: {
    label: 'ERKIN PARVOZ NURI OLTIN (Фергана, детсад)',
    profile: {
      name: 'ERKIN PARVOZ NURI OLTIN MCHJ',
      ageRange: '31-40',
      gender: 'Женский',
      hasHigherEducation: 'Да',
      educationField: 'Дошкольная педагогика',
      maritalStatus: 'Женат/Замужем',
      dependents: '1-2',
      currentStatus: 'Предприниматель',
      experienceLevel: '3-5 лет',
      domainExperience: 'Да, работал(а) в этой сфере',
      hasTraining: 'Да',
      hasMentor: 'Нет',
      viloyat: 'Ферганская область',
      hudud: 'Фарғона шаҳар',
      mahalla: 'Мирзо Улуғбек MFY',
      urbanRural: 'Город',
      entityType: 'Юридическое лицо',
      registrationForm: 'ООО',
      businessSize: 'Средний (25–100 сотрудников)',
      businessAge: '3–5 лет',
      employeeCount: '16–50',
    },
    finance: {
      businessDirection: 'Частный детский сад',
      ideaDescription:
        'Частный детский сад полного дня (ИФУТ 85100), Мирзо Улуғбек MFY, г. Фергана. 4 существующие группы (3–6 лет), расширение ещё на 2 группы для детей 2–3 лет — спрос в маҳалле превышает текущую мощность.',
      whyThisBusiness: 'Есть опыт в этой сфере',
      targetCustomer: 'Физические лица (B2C)',
      hasOwnFunds: 'Да',
      hasSpace: 'Да, своё',
      hasEquipment: 'Да, полностью',
      hasRegisteredBusiness: 'Да, ООО',
      hasBusinessPlan: 'Есть черновик',
      needsLoan: 'Да, обязательно',
      timeline: 'В течение 1 месяца',
      monthlyIncome: 'Более 100 млн',
      monthlyExpenses: 'Более 100 млн',
      existingDebt: 'Нет',
      businessGoal: 'Увеличить производство',
      mainProblem: 'Не хватает оборотных средств',
      loanAmount: '500 млн – 1 млрд',
      hasCollateral: 'Да',
      collateralType: 'Дом / квартира',
    },
  },
}
