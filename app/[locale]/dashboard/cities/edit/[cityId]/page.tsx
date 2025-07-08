"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useEffect, useState } from "react";
import { useMapStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const Page = () => {
  const params = useParams();
  const cityId = params.cityId as string;
  const { setEditingCity, editingCity } = useMapStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Cities");
  const tCommon = useTranslations("Common");

  useEffect(() => {
    if (!cityId) {
      setLoading(false);
      return;
    }
    const fetchCity = async () => {
      try {
        const response = await fetch(`/api/cities/${cityId}`);
        if (!response.ok) {
          throw new Error(tCommon("failedToDeleteCity"));
        }
        const data = await response.json();
        setEditingCity(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(tCommon("unexpectedError"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCity();

    return () => {
      setEditingCity(null);
    };
  }, [cityId, setEditingCity, t, tCommon]);

  if (loading) {
    return <div>{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div>
        {tCommon("error")}: {error}
      </div>
    );
  }

  if (!editingCity) {
    return <div>{t("noCitiesFound")}</div>;
  }

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: t("allCities"), href: "/dashboard/cities" },
          {
            label: `${t("editCity")} ${editingCity.name}`,
            isCurrentPage: true,
          },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="edit-city" />
      </div>
    </>
  );
};

export default Page;
