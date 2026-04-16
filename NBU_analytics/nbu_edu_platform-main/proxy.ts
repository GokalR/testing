import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = new Set(["ru", "uz", "en"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/")[1];

  // When visiting a locale-prefixed route, persist the locale in a cookie
  if (firstSegment && SUPPORTED_LOCALES.has(firstSegment)) {
    const current = request.cookies.get("locale")?.value;
    if (current !== firstSegment) {
      const response = NextResponse.next();
      response.cookies.set("locale", firstSegment, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(ru|uz|en)/:path*"],
};
