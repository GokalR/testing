import { notFound } from "next/navigation";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { isSupportedLocale } from "@/lib/course-content/locales";
import type { SupportedLocale } from "@/lib/course-content/types";
import { getRegisterCopy } from "@/lib/auth/auth-copy";
import { normalizeCallbackUrl } from "@/lib/auth/auth-routing";

function assertValidLocale(value: string): asserts value is SupportedLocale {
  if (!isSupportedLocale(value)) {
    notFound();
  }
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/register">) {
  const { locale } = await params;
  if (!isSupportedLocale(locale)) {
    return {};
  }

  const copy = getRegisterCopy(locale);
  return {
    title: `${copy.title} — EduPulse`,
    description: copy.subtitle,
  };
}

export default async function LocaleRegisterPage({
  params,
  searchParams,
}: PageProps<"/[locale]/register">) {
  const { locale } = await params;
  const query = await searchParams;
  assertValidLocale(locale);

  return (
    <RegisterForm
      locale={locale}
      callbackUrl={normalizeCallbackUrl(query.callbackUrl)}
    />
  );
}
