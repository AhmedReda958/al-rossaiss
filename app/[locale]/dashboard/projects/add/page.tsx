"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useTranslations } from "next-intl";

const AddProjectPage = () => {
  const t = useTranslations("Projects");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: t("allProjects"), href: "/" },
          { label: t("addProject"), isCurrentPage: true },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="add-project" />
      </div>
    </>
  );
};

export default AddProjectPage;
