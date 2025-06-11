import React, { useEffect, useRef, useCallback, useLayoutEffect } from "react";
import Konva from "konva";
import { renderToStaticMarkup } from "react-dom/server";
import regions from "@/components/map-view/country-map/regions";
import useImage from "use-image";
import { useMapStore } from "@/lib/store";

export const useRegionsLayer = () => {
  const [pathDataMap, setPathDataMap] = React.useState<Record<string, string>>(
    {}
  );
  const [mapImage] = useImage("/map.jpg");
  const layerRef = useRef<Konva.Layer>(null);
  const pathRefs = useRef<Record<string, Konva.Path>>({});

  // Use Zustand store for shared state
  const {
    hoveredRegion: hoveredRegionId,
    setHoveredRegion: setHoveredRegionId,
    scale,
    position,
    isZooming,
    regionBounds,
    selectedRegion,
    mapSize,
    setRegionBounds,
    setSelectedRegion,
    setLayerRef,
    zoomToRegion: storeZoomToRegion,
    resetZoom,
  } = useMapStore();

  const effectiveMapWidth = mapSize.width * 1.25; // Account for scaleX of the image
  const effectiveMapHeight = mapSize.height * 1.25; // Account for scaleY of the image

  // Set the layer reference in the store
  useLayoutEffect(() => {
    if (layerRef.current) {
      setLayerRef({ current: layerRef.current });
    }
  }, [setLayerRef]);

  // Extract path data on client-side only
  useLayoutEffect(() => {
    const extractedData: Record<string, string> = {};

    regions.forEach(({ Component, id }) => {
      const markup = renderToStaticMarkup(<Component />);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = markup;
      const pathElement = tempDiv.querySelector("path");
      extractedData[id] = pathElement?.getAttribute("d") || "";
    });

    setPathDataMap(extractedData);
  }, []);

  // Calculate region bounds once paths are rendered
  useEffect(() => {
    if (Object.keys(pathRefs.current).length !== regions.length) {
      return;
    }

    const calculatedBounds: Record<
      string,
      { x: number; y: number; width: number; height: number }
    > = {};

    // Calculate bounds for each region based on actual path dimensions
    Object.entries(pathRefs.current).forEach(([id, path]) => {
      if (path) {
        const box = path.getClientRect();

        // Apply group transformation to get actual coordinates
        calculatedBounds[id] = {
          x: box.x,
          y: box.y,
          width: box.width,
          height: box.height,
        };
      }
    });
    console.log("calculatedBounds", calculatedBounds);
    setRegionBounds(calculatedBounds);
  }, [pathDataMap, setRegionBounds]);

  // Reset zoom when no region is selected
  useEffect(() => {
    if (selectedRegion === null && scale !== 1) {
      resetZoom();
    }
  }, [selectedRegion, scale, resetZoom]);

  // Zoom to selected region
  useEffect(() => {
    if (selectedRegion && layerRef.current && regionBounds[selectedRegion]) {
      storeZoomToRegion(selectedRegion);
    }
  }, [selectedRegion, regionBounds, storeZoomToRegion]);

  const handleRegionClick = (id: string) => {
    setSelectedRegion(id);
    storeZoomToRegion(id);
  };

  const assignPathRef = (id: string, node: Konva.Path | null) => {
    if (node) {
      pathRefs.current[id] = node;
    }
  };

  const limitDragBoundaries = useCallback(
    (pos: { x: number; y: number }) => {
      if (isZooming) return pos;

      const stage = layerRef.current?.getStage();

      if (!stage) return pos;

      const stageWidth = stage.width();
      const stageHeight = stage.height();

      // Calculate drag limits - adjusting based on scale
      const scaledMapWidth = effectiveMapWidth * scale;
      const scaledMapHeight = effectiveMapHeight * scale;

      // Add padding to allow for some overflow
      const xMin = Math.min(0, stageWidth - scaledMapWidth + 580 * scale);
      const yMin = Math.min(0, stageHeight - scaledMapHeight + 580 * scale);

      // Return constrained position
      return {
        x: Math.max(xMin, Math.min(0, pos.x)),
        y: Math.max(yMin, Math.min(0, pos.y)),
      };
    },
    [effectiveMapWidth, effectiveMapHeight, scale, isZooming]
  );

  return {
    pathDataMap,
    mapImage,
    layerRef,
    pathRefs,
    hoveredRegionId,
    setHoveredRegionId,
    scale,
    position,
    isZooming,
    selectedRegion,
    effectiveMapWidth,
    effectiveMapHeight,
    handleRegionClick,
    assignPathRef,
    limitDragBoundaries,
  };
};
