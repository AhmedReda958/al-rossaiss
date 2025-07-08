"use client";

import React from "react";
import PageHeader from "@/components/layout/page-header";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

const Header = () => {
  const t = useTranslations("Cities");
  const tBreadcrumbs = useTranslations("Breadcrumbs");
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  return (
    <PageHeader
      title={t("title")}
      breadcrumbs={[
        {
          label: tBreadcrumbs("dashboard"),
          href: `/${currentLocale}/dashboard`,
        },
        { label: t("allCities"), isCurrentPage: true },
      ]}
      action={{
        label: t("addCity"),
        icon: PlusIcon,
        href: `/${currentLocale}/dashboard/cities/add`,
      }}
    />
  );
};

export default Header;
