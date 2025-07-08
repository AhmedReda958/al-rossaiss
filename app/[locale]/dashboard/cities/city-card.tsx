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
import { City } from "@/types";
import { Pencil, Trash2, Map, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { useTranslations } from "next-intl";

interface CityCardProps {
  city: City;
  onCityDeleted?: () => void;
}

export default function CityCard({ city, onCityDeleted }: CityCardProps) {
  const projectCount = city?.region?._count?.projects ?? 0;
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("Cities");
  const tDialogs = useTranslations("Dialogs");
  const tCommon = useTranslations("Common");

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/cities/${city.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to parse error response, but handle cases where it might not be JSON
        let errorMessage = tCommon("failedToDeleteCity");
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If JSON parsing fails, use the response status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Only try to parse JSON if response is ok
      const result = await response.json();

      // Show detailed success message
      const projectsCount = result.deletedCounts?.projects || 0;
      const landmarksCount = result.deletedCounts?.landmarks || 0;

      let successMessage = tCommon("cityDeletedSuccess");
      if (projectsCount > 0 || landmarksCount > 0) {
        const deletedItems = [];
        if (projectsCount > 0) {
          const projectsLabel =
            projectsCount > 1 ? tCommon("projects") : tCommon("project");
          deletedItems.push(`${projectsCount} ${projectsLabel}`);
        }
        if (landmarksCount > 0) {
          const landmarksLabel =
            landmarksCount > 1 ? tCommon("landmarks") : tCommon("landmark");
          deletedItems.push(`${landmarksCount} ${landmarksLabel}`);
        }
        successMessage = tCommon("cityDeletedWithItems", {
          items: deletedItems.join(" and "),
        });
      }

      toast.success(successMessage);
      setIsDeleteDialogOpen(false);
      onCityDeleted?.();
    } catch (error) {
      console.error("Error deleting city:", error);
      toast.error(
        error instanceof Error ? error.message : tCommon("failedToDeleteCity")
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
          router.push(`/dashboard/cities/${city.id}`);
        }}
      >
        <CardHeader className="p-0">
          <div className="relative h-40 w-full">
            <Image
              src={city.image || "/map.jpg"}
              alt={city.name}
              fill
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{city.name}</CardTitle>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href={`/dashboard/cities/edit/${city.id}`}>
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
        </CardContent>
        <CardFooter className="py-2 ps-0 pe-2 flex justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-primary" />
            <span>{t("region")}: </span>
            <span className="font-semibold">{city?.region?.name ?? "N/A"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            <span>
              {t("projectsCount")}:{" "}
              <span className="font-semibold">{projectCount}</span>
            </span>
          </div>
        </CardFooter>
      </Card>

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title={tDialogs("deleteCity")}
        description={tDialogs("deleteCityConfirmation")}
        isLoading={isDeleting}
      />
    </>
  );
}
