import { notFound } from "next/navigation";
import { getStaticLocaleParams, isSupportedLocale } from "@/lib/course-content";
import type { SupportedLocale } from "@/lib/course-content";

function assertValidLocale(value: string): asserts value is SupportedLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export function generateStaticParams() {
  return [...getStaticLocaleParams()];
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  assertValidLocale(locale);

  return <div lang={locale}>{children}</div>;
}
