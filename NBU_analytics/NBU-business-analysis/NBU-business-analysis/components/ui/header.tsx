"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useLang, type Lang } from "@/lib/i18n";

const T = {
  ru: {
    home: "Главная",
    businessTest: "Бизнес-тест",
    about: "О платформе",
    login: "Войти",
    logoAlt: "NBU — Национальный банк Узбекистана",
  },
  uz: {
    home: "Бош саҳифа",
    businessTest: "Бизнес-тест",
    about: "Платформа ҳақида",
    login: "Кириш",
    logoAlt: "NBU — Ўзбекистон Миллий банки",
  },
};

const NAV_KEYS = ["home", "businessTest", "about"] as const;
const NAV_HREFS = ["/", "/business-test", "#about"];

export function Header({ activeNav = "home" }: { activeNav?: string; activeLabel?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLang();
  const t = T[lang];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-white border-b border-border h-16",
        "transition-shadow duration-200",
        scrolled && "shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
      )}
    >
      <div className="max-w-[1440px] mx-auto h-full px-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/nbu-mark.png"
            alt={t.logoAlt}
            width={22}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </div>

        <nav className="flex items-center gap-8 h-full">
          {NAV_KEYS.map((key, i) => {
            const active = key === activeNav;
            return (
              <a
                key={key}
                href={NAV_HREFS[i]}
                className={cn(
                  "relative h-full inline-flex items-center font-sans text-[14px] transition-colors duration-200",
                  active
                    ? "text-navy-900 font-semibold"
                    : "text-steel-500 font-medium hover:text-navy-900",
                )}
              >
                {t[key]}
                {active && (
                  <span className="absolute left-0 right-0 bottom-0 h-[2.5px] bg-gold-500" />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-[2px]">
            {(["RU", "UZ"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l.toLowerCase() as Lang)}
                className={cn(
                  "font-sans text-[12px] font-semibold py-[5px] px-3 rounded-full transition-colors duration-200",
                  lang === l.toLowerCase()
                    ? "bg-navy-900 text-white"
                    : "bg-transparent text-steel-500 hover:text-navy-900",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            className={cn(
              "font-sans text-[14px] font-semibold text-navy-900",
              "border-[1.5px] border-navy-900 rounded-button py-[9px] px-5",
              "hover:bg-navy-900/5 transition-colors duration-200",
            )}
          >
            {t.login}
          </button>
        </div>
      </div>
    </header>
  );
}
