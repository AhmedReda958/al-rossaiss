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
import { Landmark } from "@/app/types";
import { LANDMARK_TYPES } from "@/lib/constants";
import {
  LandmarkIcon,
  GraduationCap,
  Hospital,
  TreePine,
  Eye,
  Trash2,
} from "lucide-react";
import { MdMosque } from "react-icons/md";
import { IoBagHandle } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      return MdMosque;
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
  const [deletingLandmarkId, setDeletingLandmarkId] = useState<number | null>(
    null
  );

  const handleViewLandmark = (landmark: Landmark) => {
    if (landmark.cityId) {
      router.push(`/dashboard/cities/${landmark.cityId}`);
    }
  };

  const handleDeleteLandmark = async (landmarkId: number) => {
    if (window.confirm("Are you sure you want to delete this landmark?")) {
      try {
        setDeletingLandmarkId(landmarkId);
        const response = await fetch(`/api/landmarks/${landmarkId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Refresh the landmarks list
          if (onLandmarkDeleted) {
            onLandmarkDeleted();
          }
        } else {
          console.error("Failed to delete landmark");
          alert("Failed to delete landmark. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting landmark:", error);
        alert(
          "An error occurred while deleting the landmark. Please try again."
        );
      } finally {
        setDeletingLandmarkId(null);
      }
    }
  };
  if (isLoading) {
    return (
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-gray-50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">City</TableHead>
              <TableHead className="font-semibold">Region</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
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
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">City</TableHead>
              <TableHead className="font-semibold">Region</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
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
                  <p className="text-lg font-medium">No landmarks found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table className="">
        <TableHeader>
          <TableRow className="hover:bg-gray-50">
            <TableHead className="font-semibold ps-6">Name</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">City</TableHead>
            <TableHead className="font-semibold">Region</TableHead>
            <TableHead className="font-semibold text-right pe-8">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {landmarks.map((landmark) => {
            const IconComponent = getLandmarkIcon(landmark.type);
            const typeStyle = getLandmarkTypeStyle(landmark.type);

            return (
              <TableRow key={landmark.id} className="hover:bg-gray-50">
                <TableCell className="font-medium ps-6">
                  {landmark.name}
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
                <TableCell>{landmark.city?.name || "Unknown"}</TableCell>
                <TableCell>
                  {landmark.city?.region?.name || "Unknown"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end ">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewLandmark(landmark)}
                      className="hover:bg-blue-50 hover:text-blue-600 text-blue-400 p-2"
                      title="View landmark on map"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLandmark(landmark.id)}
                      disabled={deletingLandmarkId === landmark.id}
                      className="hover:bg-red-50 hover:text-red-600 text-red-400 p-2 disabled:opacity-50"
                      title="Delete landmark"
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
  );
}
