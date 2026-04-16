export type BusinessPath = "new" | "existing";

export interface ProfileData {
  name: string;
  ageRange: string;
  gender: string;
  hasHigherEducation: string;
  educationField: string;
  maritalStatus: string;
  dependents: string;
  currentStatus: string;
  experienceLevel: string;
  domainExperience: string;
  hasTraining: string;
  hasMentor: string;
  hudud: string;
  mahalla: string;
  viloyat: string;
  urbanRural: string;
  businessAge?: string;
  employeeCount?: string;
  entityType?: string;
  registrationForm?: string;
  businessSize?: string;
}

/** PATH A — New business */
export interface NewBusinessData {
  direction: string;
  niche: string;
  ideaDescription: string;
  whyThisBusiness: string;
  hasClients: string;
  targetCustomer: string;
  salesGeography: string[];
  knowsCompetitors: string;
  competitorCount: string;
  uniqueValue: string;
  ownCapital: string;
  needsLoan: string;
  loanAmount: string;
  hasSpace: string;
  rentBudget: string;
  hasEquipment: string;
  hasCollateral: string;
  collateralType: string;
  collateralValue: string;
  plannedEmployees: string;
  timeline: string;
  isRegistered: string;
  knowsRegistration: string;
  hasINN: string;
}

/** PATH B — Existing business */
export interface ExistingBusinessData {
  direction: string;
  businessDescription: string;
  businessAge: string;
  registrationForm: string;
  employeeCount: string;
  clientType: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  mainExpenses: string[];
  existingDebt: string;
  hasOverduePayments: string;
  hasAccountant: string;
  bankAccount: string;
  seasonality: string;
  mainProblem: string;
  goals: string[];
  needsLoan: string;
  loanPurpose: string[];
  loanAmount: string;
  hasCollateral: string;
  collateralType: string;
  collateralValue: string;
}

/** Shared — additional factors (Step 3) */
export interface AdditionalFactors {
  hasBusinessPlan: string;
  hasMarketResearch: string;
  knowsBreakeven: string;
  hasSuppliers: string;
  hasManagementExp: string;
  knowsLegalForms: string;
  knowsTaxes: string;
  knowsCostCalc: string;
  knowsCashFlow: string;
  expectedIncome6m: string;
  readyForNoProfit: string;
  hasPersonalRunway: string;
  planB: string;
  familySupport: string;
}

/** Step 2 — covers both new and existing business paths */
export interface FinanceData {
  // Shared
  businessDirection: string;
  hasBusinessPlan: string;
  needsLoan: string;
  hasOwnFunds: string;
  hasCollateral: string;
  collateralType?: string;

  // New business path
  ideaDescription?: string;
  whyThisBusiness?: string;
  targetCustomer?: string;
  hasSpace?: string;
  hasEquipment?: string;
  timeline?: string;
  hasRegisteredBusiness: string;

  // Existing business path
  businessGoal: string;
  mainProblem: string;
  monthlyIncome: string;
  monthlyExpenses?: string;
  existingDebt?: string;
  loanAmount?: string;
}
