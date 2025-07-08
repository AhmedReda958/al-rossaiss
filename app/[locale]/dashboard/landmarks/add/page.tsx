"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useTranslations } from "next-intl";

const AddLandmarkPage = () => {
  const t = useTranslations("Landmarks");

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: t("allLandmarks"), href: "/dashboard/landmarks" },
          { label: t("addLandmark"), isCurrentPage: true },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="add-landmark" />
      </div>
    </>
  );
};

export default AddLandmarkPage;
