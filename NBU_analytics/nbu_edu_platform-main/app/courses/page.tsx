import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupportedLocale } from "@/lib/course-content";

export default async function CatalogRedirect() {
  const jar = await cookies();
  const raw = jar.get("locale")?.value;
  const locale = raw && isSupportedLocale(raw) ? raw : "ru";
  redirect(`/${locale}/courses`);
}
