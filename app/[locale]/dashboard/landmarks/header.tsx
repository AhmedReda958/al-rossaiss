"use client";

import React from "react";
import PageHeader from "@/components/layout/page-header";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const LandmarksHeader = () => {
  const t = useTranslations("Landmarks");
  const tBreadcrumbs = useTranslations("Breadcrumbs");

  return (
    <PageHeader
      title={t("title")}
      breadcrumbs={[
        { label: tBreadcrumbs("dashboard"), href: "/dashboard" },
        { label: t("title"), isCurrentPage: true },
      ]}
      action={{
        label: t("addLandmark"),
        icon: PlusIcon,
        href: "/dashboard/landmarks/add",
      }}
    ></PageHeader>
  );
};

export default LandmarksHeader;
