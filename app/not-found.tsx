"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { useEffect, useState } from "react";

export default function GlobalNotFound() {
  const pathname = usePathname();
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState<object | null>(null);

  useEffect(() => {
    // Detect locale from pathname or default to 'en'
    const detectedLocale = pathname.startsWith("/ar") ? "ar" : "en";
    setLocale(detectedLocale);

    // Load messages for the detected locale
    const loadMessages = async () => {
      try {
        const msgs = await import(`../messages/${detectedLocale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
        // Fallback to English
        const fallbackMsgs = await import(`../messages/en.json`);
        setMessages(fallbackMsgs.default);
      }
    };

    loadMessages();
  }, [pathname]);

  if (!messages) {
    return (
      <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
        <body>
          <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="animate-pulse">Loading...</div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <NotFoundContent />
    </NextIntlClientProvider>
  );
}

function NotFoundContent() {
  const t = useTranslations("NotFound");
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg text-gray-600 mb-8">{t("message")}</p>
          <Link
            href={`/${locale}`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("goHome")}
          </Link>
        </div>
      </body>
    </html>
  );
}
