"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations("Cities");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: t("allCities"), href: "/" },
          { label: t("addCity"), isCurrentPage: true },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="add-city" />
      </div>
    </>
  );
};

export default Page;
