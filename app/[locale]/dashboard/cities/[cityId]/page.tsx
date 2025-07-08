"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useMapStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const Page = () => {
  const { cityId } = useParams();
  const { setSelectedCity } = useMapStore();
  const t = useTranslations();

  useEffect(() => {
    setSelectedCity(cityId as string);
    return () => {
      setSelectedCity(null);
    };
  }, [cityId, setSelectedCity]);

  return (
    <>
      <PageHeader
        title={t("Cities.title")}
        breadcrumbs={[
          { label: t("Cities.allCities"), href: "/dashboard/cities" },
          { label: t("Cities.title") },
          { label: cityId as string, isCurrentPage: true },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView />
      </div>
    </>
  );
};

export default Page;
