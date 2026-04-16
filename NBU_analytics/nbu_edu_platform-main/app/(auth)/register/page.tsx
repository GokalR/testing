import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthHref, getLocaleFromCookieValue, normalizeCallbackUrl } from "@/lib/auth/auth-routing";

export default async function RegisterRedirectPage({
  searchParams,
}: PageProps<"/register">) {
  const jar = await cookies();
  const query = await searchParams;
  const locale = getLocaleFromCookieValue(jar.get("locale")?.value);

  redirect(getAuthHref(locale, "register", normalizeCallbackUrl(query.callbackUrl)));
}
