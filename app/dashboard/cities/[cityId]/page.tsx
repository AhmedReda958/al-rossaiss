"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useMapStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const { cityId } = useParams();
  const { setSelectedCity } = useMapStore();

  useEffect(() => {
    setSelectedCity(cityId as string);
    return () => {
      setSelectedCity(null);
    };
  }, [cityId, setSelectedCity]);

  return (
    <>
      <PageHeader
        title="View City"
        breadcrumbs={[
          { label: "All Cities", href: "/dashboard/cities" },
          { label: "View City" },
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
