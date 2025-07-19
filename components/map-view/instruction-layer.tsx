import React, { useEffect } from "react";
import { useMapStore } from "@/lib/store";
import { useTranslations, useLocale } from "next-intl";

interface InstructionTooltip {
  id: string;
  target: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    transform?: string;
  };
  arrowPosition: "top" | "bottom" | "left" | "right";
  textKey: string;
}

const InstructionLayer = () => {
  const {
    showInstructionLayer,
    setShowInstructionLayer,
    mapType,
    selectedRegion,
    selectedCity,
  } = useMapStore();
  const t = useTranslations("Instructions");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Define instruction tooltips based on map state
  const getInstructionTooltips = (): InstructionTooltip[] => {
    const tooltips: InstructionTooltip[] = [];

    // Always show projects list when visible
    if (mapType === "main") {
      tooltips.push({
        id: "projects-list",
        target: "projects-list",
        position: { 
          top: "50%", 
          [isRTL ? "right" : "left"]: "120px", 
          transform: "translateY(-50%)" 
        },
        arrowPosition: isRTL ? "right" : "left",
        textKey: "projectsList",
      });
    }

    // Show regions instructions when on main map without region selected
    if (mapType === "main" && !selectedRegion) {
      tooltips.push({
        id: "regions-map",
        target: "regions-map",
        position: {
          top: "90%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        arrowPosition: "top",
        textKey: "regionsMap",
      });
    }

    // Show city selection instructions when region is selected but no city
    if (selectedRegion && !selectedCity) {
      tooltips.push({
        id: "city-selection",
        target: "city-selection",
        position: {
          top: "90%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        arrowPosition: "top",
        textKey: "citySelection",
      });
    }

    // Show city map instructions when city is selected
    if (selectedCity) {
      // Cities slider
      tooltips.push({
        id: "city-slider",
        target: "city-slider",
        position: {
          bottom: "100px",
          left: "50%",
          transform: "translateX(-50%)",
        },
        arrowPosition: "bottom",
        textKey: "citySlider",
      });

      // Landmarks filter (only show on larger screens)
      tooltips.push({
        id: "landmark-filter",
        target: "landmark-filter",
        position: { top: "90px", left: "50%", transform: "translateX(-50%)" },
        arrowPosition: "top",
        textKey: "landmarkFilter",
      });
    }

    return tooltips;
  };

  const instructionTooltips = getInstructionTooltips();

  // Close instruction layer when clicking outside
  const handleLayerClick = () => {
    setShowInstructionLayer(false);
  };

  // Prevent closing when clicking on tooltips
  const handleTooltipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Close instruction layer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showInstructionLayer) {
        setShowInstructionLayer(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showInstructionLayer, setShowInstructionLayer]);

  if (!showInstructionLayer) return null;

  return (
    <div
      className="absolute inset-0 z-50 bg-black/50  animate-in fade-in duration-300"
      onClick={handleLayerClick}
    >
      {/* Instruction tooltips */}
      {instructionTooltips.map((tooltip) => (
        <div
          key={tooltip.id}
          className="absolute animate-in slide-in-from-top-2 duration-500 z-50"
          style={{
            top: tooltip.position.top,
            left: tooltip.position.left,
            right: tooltip.position.right,
            bottom: tooltip.position.bottom,
            transform: tooltip.position.transform,
            animationDelay: `${instructionTooltips.indexOf(tooltip) * 150}ms`,
          }}
          onClick={handleTooltipClick}
        >
          <div className="relative">
            {/* Tooltip content */}
            <div className="bg-white rounded-lg shadow-xl p-4 max-w-xs border border-gray-200 backdrop-blur-sm">
              <p 
                className="text-sm text-gray-700 leading-relaxed font-medium"
                dir={isRTL ? "rtl" : "ltr"}
              >
                {t(tooltip.textKey)}
              </p>
            </div>

            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 ${
                tooltip.arrowPosition === "top"
                  ? "border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-white -top-1 left-1/2 -translate-x-1/2"
                  : tooltip.arrowPosition === "bottom"
                  ? "border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white -bottom-1 left-1/2 -translate-x-1/2"
                  : tooltip.arrowPosition === "left"
                  ? "border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-white -left-1 top-1/2 -translate-y-1/2"
                  : tooltip.arrowPosition === "right"
                  ? "border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-white -right-1 top-1/2 -translate-y-1/2"
                  : ""
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InstructionLayer;
