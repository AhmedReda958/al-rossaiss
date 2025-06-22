"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useEffect, useState } from "react";
import { useMapStore } from "@/lib/store";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const cityId = params.cityId as string;
  const { setEditingCity, editingCity } = useMapStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId) {
      setLoading(false);
      return;
    }
    const fetchCity = async () => {
      try {
        const response = await fetch(`/api/cities/${cityId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch city data");
        }
        const data = await response.json();
        setEditingCity(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCity();

    return () => {
      setEditingCity(null);
    };
  }, [cityId, setEditingCity]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!editingCity) {
    return <div>City not found.</div>;
  }

  return (
    <>
      <PageHeader
        title="Cities"
        breadcrumbs={[
          { label: "All Cities", href: "/dashboard/cities" },
          { label: `Edit ${editingCity.name}`, isCurrentPage: true },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="edit-city" />
      </div>
    </>
  );
};

export default Page;
