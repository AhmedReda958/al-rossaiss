"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const pathname = usePathname();
  const t = useTranslations("NotFound");

  // Extract locale from pathname
  const locale = pathname.split("/")[1] || "en";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
      <p className="text-lg text-gray-600 mb-8">{t("message")}</p>
      <a
        href={`/${locale}`}
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
      >
        {t("goHome")}
      </a>
    </div>
  );
}
