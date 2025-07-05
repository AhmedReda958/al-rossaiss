"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useMapStore } from "@/lib/store";
import { LANDMARK_TYPES, LandmarkType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LandmarkIcon, GraduationCap, Hospital, TreePine } from "lucide-react";
import { MdMosque } from "react-icons/md";
import { IoBagHandle } from "react-icons/io5";

const landmarkLabels = {
  [LANDMARK_TYPES.LANDMARK]: "Landmarks",
  [LANDMARK_TYPES.SHOP]: "Shop",
  [LANDMARK_TYPES.EDUCATION]: "Education",
  [LANDMARK_TYPES.HOSPITAL]: "Hospitals",
  [LANDMARK_TYPES.PARK]: "Parks",
  [LANDMARK_TYPES.MOSQUE]: "Mosques",
} as const;

// Function to get the appropriate icon based on landmark type (same as landmark pin)
const getLandmarkIcon = (type: LandmarkType) => {
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

const LandmarkFilter = () => {
  const {
    hiddenLandmarkTypes,
    toggleLandmarkTypeVisibility,
    landmarks,
    selectedCity,
    mapType,
  } = useMapStore();

  // Only show filter if there are landmarks and we're viewing a city
  const shouldShowFilter =
    landmarks && landmarks.length > 0 && selectedCity && mapType === "main";

  if (!shouldShowFilter) {
    return null;
  }

  const handleToggleFilter = (type: LandmarkType) => {
    toggleLandmarkTypeVisibility(type);
  };

  return (
    <div className="flex items-center gap-1.5 bg-white  p-2 rounded-md">
      {Object.values(LANDMARK_TYPES).map((type) => {
        const isHidden = hiddenLandmarkTypes.has(type);
        const IconComponent = getLandmarkIcon(type);

        return (
          <Button
            key={type}
            variant="outline"
            onClick={() => handleToggleFilter(type)}
            className={cn(
              "rounded-sm",
              isHidden &&
                "opacity-50 border-gray-400 text-gray-500 bg-gray-50 hover:bg-gray-100 hover:border-gray-600 hover:text-gray-600"
            )}
          >
            <IconComponent size={16} />

            {landmarkLabels[type]}
          </Button>
        );
      })}
    </div>
  );
};

export default LandmarkFilter;
