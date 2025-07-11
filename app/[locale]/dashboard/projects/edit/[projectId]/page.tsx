"use client";
import PageHeader from "@/components/layout/page-header";
import MapView from "@/components/map-view";
import { useEffect, useState } from "react";
import { useMapStore } from "@/lib/store";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getLocalizedName } from "@/lib/utils";

const EditProjectPage = () => {
  const params = useParams();
  const pathname = usePathname();
  const projectId = params.projectId as string;
  const {
    setEditingProject,
    editingProject,
    setSelectedRegion,
    setSelectedCity,
    setSelectedCityId,
    setProjects,
  } = useMapStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Projects");
  const tCommon = useTranslations("Common");

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error(tCommon("failedToFetchProject"));
        }
        const data = await response.json();
        setEditingProject(data);

        // Pre-populate map store to avoid unnecessary fetching
        if (data.city?.region) {
          setSelectedRegion(data.city.region.id.toString());
        }
        if (data.city) {
          setSelectedCity(data.city.id.toString());
          setSelectedCityId(data.city.id);
        }

        // Pre-populate projects in the store to avoid fetching
        setProjects([data]);
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

    fetchProject();

    return () => {
      setEditingProject(null);
      setSelectedRegion(null);
      setSelectedCity(null);
      setSelectedCityId(null);
      setProjects([]);
    };
  }, [
    projectId,
    setEditingProject,
    setSelectedRegion,
    setSelectedCity,
    setSelectedCityId,
    setProjects,
    tCommon,
  ]);

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

  if (!editingProject) {
    return <div>{t("noProjectsFound")}</div>;
  }

  const projectName = getLocalizedName(editingProject, currentLocale);

  return (
    <>
      <PageHeader
        title={t("title")}
        breadcrumbs={[
          { label: t("allProjects"), href: "/dashboard/projects" },
          {
            label: `${t("editProject")} ${projectName}`,
            isCurrentPage: true,
          },
        ]}
      />
      <div className="h-[calc(100vh-10rem)] my-10 ">
        <MapView type="edit-project" />
      </div>
    </>
  );
};

export default EditProjectPage;
