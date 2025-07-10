"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { useTranslations } from "next-intl";
import { Play, RotateCcw, MapPin } from "lucide-react";

interface DrawingControlsProps {
  showWhenReady?: boolean;
  translationNamespace?: "Cities" | "Projects";
}

const DrawingControls: React.FC<DrawingControlsProps> = ({
  showWhenReady = true,
  translationNamespace = "Projects",
}) => {
  const { isDrawingMode, currentPoints, startDrawing, clearDrawing } =
    usePolygonMarkerStore();

  const t = useTranslations(translationNamespace);

  // Don't show controls if we're not supposed to show them when ready
  if (!showWhenReady) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin className="h-4 w-4" />
        <span>{t("polygonDrawingControls")}</span>
      </div>

      {/* Drawing Instructions */}
      {isDrawingMode && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">
            {t("drawingActive")}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {t("drawingInstructions")}
          </p>
        </div>
      )}

      {/* Drawing Control Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          variant={isDrawingMode ? "secondary" : "default"}
          size="sm"
          onClick={startDrawing}
          disabled={isDrawingMode}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {t("startDrawing")}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearDrawing}
          disabled={!isDrawingMode && currentPoints.length === 0}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t("clearDrawing")}
        </Button>
      </div>

      {/* Points Counter */}
      {isDrawingMode && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          <div className="flex flex-col-reverse items-center justify-between">
            <span>{t("pointsAdded", { count: currentPoints.length })}</span>
            {currentPoints.length >= 3 && (
              <span className="text-green-600 font-medium">
                {t("readyToSave")}
              </span>
            )}
            {currentPoints.length < 3 && (
              <span className="text-orange-600 font-medium">
                {3 - currentPoints.length === 1
                  ? t("needMorePoints", { count: 3 - currentPoints.length })
                  : t("needMorePointsPlural", {
                      count: 3 - currentPoints.length,
                    })}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Help text when not drawing */}
      {!isDrawingMode && currentPoints.length === 0 && (
        <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
          {t("drawingHelpText")}
        </div>
      )}
    </div>
  );
};

export default DrawingControls;
