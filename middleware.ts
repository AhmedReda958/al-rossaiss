import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const intlMiddleware = createMiddleware(routing);

export function middleware(req: NextRequest) {
  // Handle authentication for dashboard routes
  if (req.nextUrl.pathname.includes("/dashboard")) {
    const token = req.cookies.get("auth_token")?.value;
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!token || !JWT_SECRET) {
      const locale = req.nextUrl.pathname.split("/")[1];
      const isValidLocale = routing.locales.includes(locale as "en" | "ar");
      const redirectUrl = isValidLocale
        ? new URL(`/${locale}/login`, req.url)
        : new URL(`/${routing.defaultLocale}/login`, req.url);
      return NextResponse.redirect(redirectUrl);
    }

    try {
      // Verify the JWT token
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // Token is invalid or expired, redirect to login
      console.error("Invalid or expired token:", error);
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
