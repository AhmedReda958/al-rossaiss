"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Landmark } from "@/types";
import { LANDMARK_TYPES } from "@/lib/constants";
import {
  LandmarkIcon,
  GraduationCap,
  Hospital,
  TreePine,
  Eye,
  Trash2,
} from "lucide-react";
import { FaRegMoon } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ConfirmDeleteDialog from "@/components/ui/confirm-delete-dialog";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getLocalizedName } from "@/lib/utils";

interface LandmarksTableProps {
  landmarks: Landmark[];
  isLoading: boolean;
  onLandmarkDeleted?: () => void;
}

// Define colors for different landmark types (same as landmark-pin)
const LANDMARK_COLORS = {
  [LANDMARK_TYPES.LANDMARK]: "#2F80ED", // blue
  [LANDMARK_TYPES.SHOP]: "#ED912F", // orange
  [LANDMARK_TYPES.EDUCATION]: "#ED2FE7", // pink
  [LANDMARK_TYPES.HOSPITAL]: "#ED2F38", // red
  [LANDMARK_TYPES.PARK]: "#219653", // green
  [LANDMARK_TYPES.MOSQUE]: "#EDD42F", // yellow
  default: "#757575", // gray
} as const;

// Function to get the appropriate icon based on landmark type
const getLandmarkIcon = (type: string) => {
  switch (type) {
    case LANDMARK_TYPES.SHOP:
      return IoBagHandle;
    case LANDMARK_TYPES.EDUCATION:
      return GraduationCap;
    case LANDMARK_TYPES.HOSPITAL:
      return Hospital;
    case LANDMARK_TYPES.PARK:
      return TreePine;
    case LANDMARK_TYPES.MOSQUE:
      return FaRegMoon;
    case LANDMARK_TYPES.LANDMARK:
    default:
      return LandmarkIcon;
  }
};

const getLandmarkTypeStyle = (type: string) => {
  const color =
    LANDMARK_COLORS[type as keyof typeof LANDMARK_COLORS] ||
    LANDMARK_COLORS.default;
  return {
    color: color,
  };
};

export default function LandmarksTable({
  landmarks,
  isLoading,
  onLandmarkDeleted,
}: LandmarksTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [landmarkToDelete, setLandmarkToDelete] = useState<Landmark | null>(
    null
  );
  const [deletingLandmarkId, setDeletingLandmarkId] = useState<number | null>(
    null
  );
  const t = useTranslations("Landmarks");
  const tCommon = useTranslations("Common");

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  const handleViewLandmark = (landmark: Landmark) => {
    if (landmark.cityId) {
      router.push(`/dashboard/cities/${landmark.cityId}`);
    }
  };

  const handleDeleteClick = (landmark: Landmark) => {
    setLandmarkToDelete(landmark);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!landmarkToDelete) return;

    try {
      setDeletingLandmarkId(landmarkToDelete.id);
      const response = await fetch(`/api/landmarks/${landmarkToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(tCommon("landmarkDeletedSuccess"));
        setDeleteDialogOpen(false);
        setLandmarkToDelete(null);
        // Refresh the landmarks list
        if (onLandmarkDeleted) {
          onLandmarkDeleted();
        }
      } else {
        console.error("Failed to delete landmark");
        toast.error(tCommon("deleteFailed"));
      }
    } catch (error) {
      console.error("Error deleting landmark:", error);
      toast.error(tCommon("deleteError"));
    } finally {
      setDeletingLandmarkId(null);
    }
  };
  if (isLoading) {
    return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead className="font-semibold ps-6">
                {t("landmarkName")}
              </TableHead>
              <TableHead className="font-semibold">
                {t("landmarkType")}
              </TableHead>
              <TableHead className="font-semibold">{tCommon("city")}</TableHead>
              <TableHead className="font-semibold">
                {tCommon("region")}
              </TableHead>
              <TableHead className="font-semibold text-right rtl:text-left">
                {tCommon("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="flex items-center justify-end space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (landmarks.length === 0) {
    return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead className="font-semibold">
                {t("landmarkName")}
              </TableHead>
              <TableHead className="font-semibold">
                {t("landmarkType")}
              </TableHead>
              <TableHead className="font-semibold">{tCommon("city")}</TableHead>
              <TableHead className="font-semibold">
                {tCommon("region")}
              </TableHead>
              <TableHead className="font-semibold text-right">
                {tCommon("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-12 text-gray-500"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <p className="text-lg font-medium">{t("noLandmarksFound")}</p>
                  <p className="text-sm">{tCommon("tryAdjustingCriteria")}</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table className="">
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead className="font-semibold ps-6">
                {t("landmarkName")}
              </TableHead>
              <TableHead className="font-semibold">
                {t("landmarkType")}
              </TableHead>
              <TableHead className="font-semibold">{tCommon("city")}</TableHead>
              <TableHead className="font-semibold">
                {tCommon("region")}
              </TableHead>
              <TableHead className="font-semibold text-right rtl:text-left pe-8">
                {tCommon("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {landmarks.map((landmark) => {
              const IconComponent = getLandmarkIcon(landmark.type);
              const typeStyle = getLandmarkTypeStyle(landmark.type);

              // Get localized names
              const landmarkName = getLocalizedName(landmark, currentLocale);
              const cityName = landmark.city
                ? getLocalizedName(landmark.city, currentLocale)
                : tCommon("unknown");
              const regionName = landmark.city?.region
                ? getLocalizedName(landmark.city.region, currentLocale)
                : tCommon("unknown");

              return (
                <TableRow key={landmark.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium ps-6">
                    {landmarkName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <IconComponent
                        size={16}
                        style={{ color: typeStyle.color }}
                      />
                      <span className="border-0" style={typeStyle}>
                        {landmark.type.charAt(0).toUpperCase() +
                          landmark.type.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{cityName}</TableCell>
                  <TableCell>{regionName}</TableCell>
                  <TableCell className="text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start ">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewLandmark(landmark)}
                        className="hover:bg-blue-50 hover:text-blue-600 text-blue-400 p-2"
                        title={t("Common.view")}
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(landmark)}
                        disabled={deletingLandmarkId === landmark.id}
                        className="hover:bg-red-50 hover:text-red-600 text-red-400 p-2 disabled:opacity-50"
                        title={t("Common.delete")}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title={t("Dialogs.deleteLandmark")}
        description={t("Dialogs.deleteLandmarkConfirmation")}
        isLoading={deletingLandmarkId !== null}
      />
    </>
  );
}
