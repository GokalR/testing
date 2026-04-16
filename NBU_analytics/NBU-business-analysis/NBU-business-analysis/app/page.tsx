"use client";

import Link from "next/link";
import Image from "next/image";
import { Shield, User, Landmark, Brain, FileCheck, ArrowRight } from "lucide-react";
import { Header } from "@/components/ui/header";
import { useLang } from "@/lib/i18n";

const T = {
  ru: {
    badge: "NATIONAL BANK OF UZBEKISTAN",
    heroTitle: "AI Бизнес-советник",
    heroLine2: "для предпринимателей",
    heroSub:
      "За 4 шага вы получите AI-анализ вашего бизнеса, рейтинг маҳаллей, SWOT-анализ и подходящий кредитный продукт NBU",
    cta: "Начать анализ",
    trust: "Банковское шифрование",

    stat1n: "6",
    stat1l: "критериев AI-анализа",
    stat2n: "4",
    stat2l: "кредитных продукта NBU",
    stat3n: "50",
    stat3l: "маҳаллей в рейтинге",
    stat4n: "5",
    stat4l: "минут на заполнение",

    howBadge: "КАК ЭТО РАБОТАЕТ",
    howHeading: "От анкеты — к бизнес-плану",
    howSub:
      "Заполните анкету, а AI подготовит персональный анализ и рекомендации",
    stepLabel: "ШАГ",
    steps: [
      {
        title: "Личный профиль",
        desc: "Регион, возраст и тип юридического лица",
      },
      {
        title: "Финансы и опыт",
        desc: "Бизнес-направление, кредитная история, ресурсы",
      },
      {
        title: "AI анализ",
        desc: "Оценка по 6 критериям + SWOT + рейтинг маҳаллей",
      },
      {
        title: "Бизнес-план",
        desc: "Готовый план, прогноз и заявка на кредит",
      },
    ],

    ctaTitle: "Готовы начать?",
    ctaSub:
      "Получите персональный AI-анализ бизнес-возможностей за 5 минут",
    ctaTrust: "Данные шифруются на серверах банка",

    footer: "© 2026 NBU — Национальный банк Узбекистана",
    privacy: "Конфиденциальность",
    footerDesc: "AI Бизнес-советник",

    cardScore: "AI Оценка",
    cardSwot: "SWOT-анализ",
    cardCredit: "Кредит NBU",
    cardMonths: "мес",
  },
  uz: {
    badge: "ЎЗБЕКИСТОН МИЛЛИЙ БАНКИ",
    heroTitle: "AI Бизнес-маслаҳатчи",
    heroLine2: "тадбиркорлар учун",
    heroSub:
      "4 қадамда бизнесингизнинг AI-таҳлили, маҳалла рейтинги, SWOT-таҳлил ва мос NBU кредит маҳсулотини оласиз",
    cta: "Таҳлилни бошлаш",
    trust: "Банк шифрлаши",

    stat1n: "6",
    stat1l: "AI таҳлил мезонлари",
    stat2n: "4",
    stat2l: "NBU кредит маҳсулотлари",
    stat3n: "50",
    stat3l: "маҳалла рейтингда",
    stat4n: "5",
    stat4l: "дақиқа тўлдириш учун",

    howBadge: "БУ ҚАНДАЙ ИШЛАЙДИ",
    howHeading: "Анкетадан — бизнес-режага",
    howSub:
      "Анкетани тўлдиринг, AI шахсий таҳлил ва тавсияларни тайёрлайди",
    stepLabel: "ҚАДАМ",
    steps: [
      {
        title: "Шахсий маълумотлар",
        desc: "Минтақа, ёш ва юридик шахс тури",
      },
      {
        title: "Молия ва тажриба",
        desc: "Бизнес-йўналиш, кредит тарихи, ресурслар",
      },
      {
        title: "AI таҳлил",
        desc: "6 мезон бўйича баҳо + SWOT + маҳалла рейтинги",
      },
      {
        title: "Бизнес-режа",
        desc: "Тайёр режа, прогноз ва кредитга ариза",
      },
    ],

    ctaTitle: "Бошлашга тайёрмисиз?",
    ctaSub:
      "5 дақиқада бизнес имкониятларининг шахсий AI-таҳлилини олинг",
    ctaTrust: "Маълумотлар банк серверларида шифрланади",

    footer: "© 2026 NBU — Ўзбекистон Миллий банки",
    privacy: "Махфийлик",
    footerDesc: "AI Бизнес-маслаҳатчи",

    cardScore: "AI Баҳо",
    cardSwot: "SWOT-таҳлил",
    cardCredit: "NBU Кредит",
    cardMonths: "ой",
  },
};

const STEP_ICONS = [User, Landmark, Brain, FileCheck];

export default function Home() {
  const { lang } = useLang();
  const t = T[lang];

  const stats = [
    { n: t.stat1n, l: t.stat1l },
    { n: t.stat2n, l: t.stat2l },
    { n: t.stat3n, l: t.stat3l },
    { n: t.stat4n, l: t.stat4l },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header activeNav="home" />

      {/* ─── HERO ─── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #091B35 0%, #12305C 40%, #193F72 70%, #1E4F82 100%)",
        }}
      >
        {/* grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.5) 60px,rgba(255,255,255,.5) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.5) 60px,rgba(255,255,255,.5) 61px)",
          }}
        />
        {/* gold glow */}
        <div
          className="absolute -top-[200px] -right-[200px] w-[800px] h-[800px] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(215,181,109,0.07) 0%, transparent 55%)",
          }}
        />

        <div className="relative max-w-[1200px] mx-auto px-10 pt-24 pb-32">
          <div className="flex items-center gap-20">
            {/* left — text */}
            <div className="flex-1 max-w-[580px]">
              <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-full py-[6px] px-4">
                <Image
                  src="/logos/nbu-mark.png"
                  alt="NBU"
                  width={14}
                  height={20}
                  className="h-5 w-auto opacity-80"
                />
                <span className="font-sans text-[11px] font-bold uppercase tracking-[1.5px] text-white/70">
                  {t.badge}
                </span>
              </div>

              <h1 className="mt-8">
                <span className="block font-serif text-[52px] font-normal text-white leading-[1.1] tracking-[-0.5px]">
                  {t.heroTitle}
                </span>
                <span className="block font-serif text-[52px] font-normal text-gold-500 leading-[1.1] tracking-[-0.5px]">
                  {t.heroLine2}
                </span>
              </h1>

              <p className="font-sans text-[17px] font-normal text-white/55 leading-[1.7] mt-6 max-w-[480px]">
                {t.heroSub}
              </p>

              <div className="flex items-center gap-5 mt-10">
                <Link
                  href="/business-test"
                  className="group inline-flex items-center gap-2 font-sans text-[15px] font-bold text-navy-900 bg-gold-500 hover:bg-[#E0C17A] rounded-[10px] py-[16px] px-8 shadow-[0_4px_24px_rgba(215,181,109,0.25)] transition-all duration-200"
                >
                  {t.cta}
                  <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                    className="transition-transform duration-200 group-hover:translate-x-[3px]"
                  />
                </Link>
                <div className="flex items-center gap-[6px]">
                  <Shield size={14} className="text-white/25" strokeWidth={2} />
                  <span className="font-sans text-[13px] font-medium text-white/25">
                    {t.trust}
                  </span>
                </div>
              </div>
            </div>

            {/* right — floating preview cards */}
            <div className="relative w-[380px] h-[420px] shrink-0 hidden xl:block">
              {/* AI Score card */}
              <div className="absolute top-0 right-0 w-[210px] animate-float-1 bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold-500">
                  {t.cardScore}
                </div>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="font-mono text-[44px] font-bold text-white leading-none">
                    74
                  </span>
                  <span className="font-mono text-[16px] text-white/35">
                    /100
                  </span>
                </div>
                <div className="h-[4px] bg-white/[0.08] rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full w-[74%] rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #193F72, #D7B56D)",
                    }}
                  />
                </div>
              </div>

              {/* SWOT card */}
              <div className="absolute top-[170px] -left-6 w-[230px] animate-float-2 bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-white/45">
                  {t.cardSwot}
                </div>
                <div className="grid grid-cols-2 gap-[6px] mt-3">
                  <div className="bg-emerald-500/15 rounded-lg py-[6px] px-2 text-[10px] font-bold text-emerald-400 text-center">
                    S
                  </div>
                  <div className="bg-red-500/15 rounded-lg py-[6px] px-2 text-[10px] font-bold text-red-400 text-center">
                    W
                  </div>
                  <div className="bg-blue-500/15 rounded-lg py-[6px] px-2 text-[10px] font-bold text-blue-400 text-center">
                    O
                  </div>
                  <div className="bg-amber-500/15 rounded-lg py-[6px] px-2 text-[10px] font-bold text-amber-400 text-center">
                    T
                  </div>
                </div>
              </div>

              {/* Credit card */}
              <div className="absolute bottom-[10px] right-[20px] w-[200px] animate-float-3 bg-white/[0.07] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-gold-500">
                  {t.cardCredit}
                </div>
                <div className="font-mono text-[28px] font-bold text-white leading-none mt-2">
                  15%
                </div>
                <span className="font-sans text-[12px] text-white/35">
                  84 {t.cardMonths} · 2 mlrd UZS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 48"
            fill="none"
            className="w-full h-auto block"
          >
            <path
              d="M0 48h1440V24C1320 6 1140 0 960 0S600 12 480 24 120 42 0 36v12z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white pt-6 pb-12">
        <div className="max-w-[820px] mx-auto flex justify-between px-10">
          {stats.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-mono text-[32px] font-bold text-navy-900 leading-none">
                {s.n}
              </div>
              <div className="font-sans text-[13px] text-steel-500 mt-1">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS — timeline ─── */}
      <section className="bg-[#F8F9FB] py-20 px-10">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex font-sans text-[11px] font-bold uppercase tracking-[2px] text-gold-500">
              {t.howBadge}
            </span>
            <h2 className="font-serif text-[36px] font-normal text-carbon mt-3 leading-[1.2]">
              {t.howHeading}
            </h2>
            <p className="font-sans text-[15px] text-gray-600 mt-2 max-w-[460px] mx-auto leading-[1.6]">
              {t.howSub}
            </p>
          </div>

          <div className="relative">
            {/* connecting line */}
            <div
              className="absolute top-[28px] left-[12%] right-[12%] h-[2px]"
              style={{
                background:
                  "linear-gradient(90deg, #D9DADA, #D7B56D 40%, #D7B56D 60%, #D9DADA)",
              }}
            />

            <div className="grid grid-cols-4 gap-6">
              {t.steps.map((step, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="relative z-10 w-14 h-14 rounded-full bg-white border-2 border-gold-500 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                      <Icon
                        size={22}
                        strokeWidth={2}
                        className="text-navy-900"
                      />
                    </div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[1.5px] text-gold-500 mt-4">
                      {t.stepLabel} {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-sans text-[15px] font-semibold text-carbon mt-2">
                      {step.title}
                    </h3>
                    <p className="font-sans text-[13px] text-gray-600 mt-1 leading-[1.5] max-w-[180px]">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-white py-20 px-10">
        <div className="max-w-[700px] mx-auto text-center">
          <div className="relative bg-white border border-border rounded-[20px] py-14 px-10 shadow-[0_4px_20px_rgba(25,63,114,0.04)] overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{
                background:
                  "linear-gradient(90deg, #193F72, #D7B56D, #193F72)",
              }}
            />

            <h2 className="font-serif text-[32px] font-normal text-carbon">
              {t.ctaTitle}
            </h2>
            <p className="font-sans text-[15px] text-gray-600 mt-2 max-w-[440px] mx-auto leading-[1.6]">
              {t.ctaSub}
            </p>

            <div className="mt-8">
              <Link
                href="/business-test"
                className="group inline-flex items-center gap-2 font-sans text-[15px] font-bold text-white bg-navy-900 hover:bg-navy-700 rounded-[10px] py-[16px] px-10 transition-colors duration-200"
              >
                {t.cta}
                <ArrowRight
                  size={18}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-[3px]"
                />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-[6px] mt-4">
              <Shield
                size={13}
                className="text-steel-500/50"
                strokeWidth={2}
              />
              <span className="font-sans text-[12px] text-steel-500/50">
                {t.ctaTrust}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#0F2847] py-10 px-10">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/nbu-mark.png"
              alt="NBU"
              width={16}
              height={24}
              className="h-6 w-auto opacity-60"
            />
            <div>
              <span className="font-sans text-[13px] font-semibold text-white/70">
                NBU
              </span>
              <span className="font-sans text-[13px] text-white/30 ml-2">
                {t.footerDesc}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              className="font-sans text-[13px] text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              {t.privacy}
            </a>
            <span className="font-sans text-[13px] text-white/20">
              {t.footer}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
