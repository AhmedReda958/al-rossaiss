import { useRef, useState } from "react";
import Konva from "konva";

/**
 * Custom hook to manage the cities layer state
 */
export const useCitiesLayer = () => {
  const layerRef = useRef<Konva.Layer>(null);
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);

  return {
    layerRef,
    hoveredCityId,
    setHoveredCityId,
  };
};
