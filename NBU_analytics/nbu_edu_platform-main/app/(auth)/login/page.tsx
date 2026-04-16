import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthHref, getLocaleFromCookieValue, normalizeCallbackUrl } from "@/lib/auth/auth-routing";

export default async function LoginRedirectPage({
  searchParams,
}: PageProps<"/login">) {
  const jar = await cookies();
  const query = await searchParams;
  const locale = getLocaleFromCookieValue(jar.get("locale")?.value);

  redirect(getAuthHref(locale, "login", normalizeCallbackUrl(query.callbackUrl)));
}
