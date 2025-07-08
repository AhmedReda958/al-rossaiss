"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import {
  Pencil,
  Trash2,
  Map,
  Landmark,
  Home,
  Ruler,
  Building2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getLocalizedName, getLocalizedText } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onProjectDeleted?: () => void;
}

export default function ProjectCard({
  project,
  onProjectDeleted,
}: ProjectCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("Common");
  const tDialogs = useTranslations("Dialogs");

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Get localized names and descriptions
  const projectName = getLocalizedName(project, currentLocale);
  const projectDescription = getLocalizedText(
    project.description || "",
    project.descriptionAr,
    currentLocale
  );
  const cityName = project.city
    ? getLocalizedName(project.city, currentLocale)
    : "N/A";
  const regionName = project.city?.region
    ? getLocalizedName(project.city.region, currentLocale)
    : "N/A";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = t("failedToDeleteProject");
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      toast.success(t("projectDeletedSuccess"));
      setIsDeleteDialogOpen(false);
      onProjectDeleted?.();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error(
        error instanceof Error ? error.message : t("failedToDeleteProject")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        className="shadow-md p-3 gap-2"
        onClick={() => {
          if (project.url) {
            window.open(project.url, "_blank");
          }
        }}
      >
        <CardHeader className="p-0">
          <div className="relative h-40 w-full">
            <Image
              src={project.image || "/logo.svg"}
              alt={projectName}
              fill
              objectFit="cover"
              className="rounded-lg"
            />
            {project.soldOut && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive">{t("soldOut")}</Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold">{projectName}</CardTitle>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link
                  href={`/dashboard/projects/edit/${project.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Pencil className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>

          <p className="text-gray-600 mt-2 line-clamp-1">
            {projectDescription}
          </p>
        </CardContent>

        <CardFooter className="py-2 ps-0 pe-2 grid grid-cols-2 gap-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-primary" />
            <span className="font-semibold">{regionName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Landmark className="h-5 w-5 text-primary" />
            <span className="font-semibold">{cityName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Home className="h-5 w-5 text-primary" />
            <span className="font-semibold">{project.unitType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold">{project.unitsCount} Units</span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <Ruler className="h-5 w-5 text-primary" />
            <span className="font-semibold">{project.space} m²</span>
          </div>
        </CardFooter>
      </Card>

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title={tDialogs("deleteProject")}
        description={tDialogs("deleteProjectConfirmation")}
        isLoading={isDeleting}
      />
    </>
  );
}
