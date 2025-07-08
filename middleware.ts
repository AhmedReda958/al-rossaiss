import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  // Handle authentication for dashboard routes
  if (req.nextUrl.pathname.includes("/dashboard")) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const locale = req.nextUrl.pathname.split("/")[1];
      const isValidLocale = routing.locales.includes(locale as "en" | "ar");
      const redirectUrl = isValidLocale
        ? new URL(`/${locale}/login`, req.url)
        : new URL(`/${routing.defaultLocale}/login`, req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Handle i18n routing
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
