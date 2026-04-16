"use client";

import { useState } from "react";
import { Header } from "@/components/ui/header";
import { StepProgress } from "@/components/ui/step-progress";
import { Step0PathSelect } from "./_components/step0-path-select";
import { Step1Profile } from "./_components/step1-profile";
import { Step2Finance } from "./_components/step2-finance";
import { Step3Coaching } from "./_components/step3-coaching";
import { Step3Analyzing } from "./_components/step3-analyzing";
import { Step4Results } from "./_components/step4-results";
import { useLang } from "@/lib/i18n";
import type { BusinessPath, FinanceData, ProfileData } from "./_components/types";
import type { StepItem } from "@/lib/types";

/** 0 = path selector, 1-5 = wizard steps */
type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = {
  ru: ["Личный профиль", "Финансовые вопросы", "AI Рекомендации", "AI Анализ", "Результат"],
  uz: ["Шахсий маълумотлар", "Молиявий саволлар", "AI Тавсиялар", "AI Таҳлил", "Натижа"],
};
const STEP_PERCENTAGES = [20, 40, 60, 80, 100];

const INITIAL_PROFILE: ProfileData = {
  name: "",
  ageRange: "",
  gender: "",
  hasHigherEducation: "",
  educationField: "",
  maritalStatus: "",
  dependents: "",
  currentStatus: "",
  experienceLevel: "",
  domainExperience: "",
  hasTraining: "",
  hasMentor: "",
  hudud: "",
  mahalla: "",
  viloyat: "",
  urbanRural: "",
};

const INITIAL_FINANCE: FinanceData = {
  businessDirection: "",
  hasBusinessPlan: "",
  needsLoan: "",
  hasOwnFunds: "",
  hasCollateral: "",
  collateralType: "",
  ideaDescription: "",
  whyThisBusiness: "",
  targetCustomer: "",
  hasSpace: "",
  hasEquipment: "",
  timeline: "",
  hasRegisteredBusiness: "",
  businessGoal: "",
  mainProblem: "",
  monthlyIncome: "",
  monthlyExpenses: "",
  existingDebt: "",
  loanAmount: "",
};

export default function BusinessTestPage() {
  const [step, setStep] = useState<WizardStep>(0);
  const [path, setPath] = useState<BusinessPath | null>(null);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [finance, setFinance] = useState<FinanceData>(INITIAL_FINANCE);
  const { lang } = useLang();

  const labels = STEP_LABELS[lang];
  const steps: StepItem[] = labels.map((label, i) => {
    const num = i + 1;
    if (step === 5) return { label, status: "completed" };
    const status: StepItem["status"] =
      num < step ? "completed" : num === step ? "active" : "upcoming";
    return { label, status };
  });

  const goTo = (next: WizardStep) => {
    setStep(next);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePathSelect = (selectedPath: BusinessPath) => {
    setPath(selectedPath);
    if (selectedPath === "existing") {
      setProfile((p) => ({ ...p, currentStatus: "Предприниматель" }));
    }
    goTo(1);
  };

  const resetWizard = () => {
    setPath(null);
    setProfile(INITIAL_PROFILE);
    setFinance(INITIAL_FINANCE);
    goTo(0);
  };

  const containerWidth =
    step === 0
      ? "max-w-[820px]"
      : step === 5
        ? "max-w-[1100px]"
        : step === 4
          ? "max-w-[640px]"
          : step === 3
            ? "max-w-[820px]"
            : "max-w-[780px]";

  return (
    <div className="min-h-screen bg-surface">
      <Header activeNav="businessTest" />

      {step > 0 && (
        <main className="max-w-[1100px] mx-auto px-10 pt-10">
          <StepProgress
            steps={steps}
            currentStep={step}
            percentage={STEP_PERCENTAGES[step - 1]}
          />
        </main>
      )}

      <div
        className={`${containerWidth} mx-auto px-6 ${step === 0 ? "mt-16" : "mt-8"} mb-16`}
        key={step}
      >
        {step === 0 && <Step0PathSelect onSelect={handlePathSelect} />}

        {step === 1 && (
          <Step1Profile
            profile={profile}
            setProfile={setProfile}
            path={path!}
            onBack={() => goTo(0)}
            onNext={() => goTo(2)}
          />
        )}

        {step === 2 && (
          <Step2Finance
            profile={profile}
            finance={finance}
            setFinance={setFinance}
            path={path!}
            onBack={() => goTo(1)}
            onNext={() => goTo(3)}
          />
        )}

        {step === 3 && (
          <Step3Coaching
            onBack={() => goTo(2)}
            onNext={() => goTo(4)}
          />
        )}

        {step === 4 && (
          <Step3Analyzing
            onBack={() => goTo(3)}
            onComplete={() => goTo(5)}
          />
        )}

        {step === 5 && <Step4Results onRestart={resetWizard} />}
      </div>
    </div>
  );
}
