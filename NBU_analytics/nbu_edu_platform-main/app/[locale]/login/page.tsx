import { notFound } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { isSupportedLocale } from "@/lib/course-content/locales";
import type { SupportedLocale } from "@/lib/course-content/types";
import { getLoginCopy } from "@/lib/auth/auth-copy";
import { normalizeCallbackUrl } from "@/lib/auth/auth-routing";

function assertValidLocale(value: string): asserts value is SupportedLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    return {};
  }

  const copy = getLoginCopy(locale);
  return {
    title: `${copy.title} — EduPulse`,
    description: copy.subtitle,
  };
}

export default async function LocaleLoginPage({
  params,
  searchParams,
}: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  const query = await searchParams;
  assertValidLocale(locale);

  return (
    <LoginForm
      locale={locale}
      callbackUrl={normalizeCallbackUrl(query.callbackUrl)}
    />
  );
}
