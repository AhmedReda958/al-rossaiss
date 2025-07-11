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
    mapType,
    editingCity,
    setRegionBounds,
    setSelectedRegion,
    setLayerRef,
    zoomToRegion: storeZoomToRegion,
    resetZoom,
    setCities,
    addLoadingOperation,
    removeLoadingOperation,
    updateInitialPosition,
  } = useMapStore();

  const effectiveMapWidth = mapSize.width; // Account for scaleX of the image
  const effectiveMapHeight = mapSize.height; // Account for scaleY of the image

  // Set the layer reference in the store
  useLayoutEffect(() => {
    if (layerRef.current) {
      setLayerRef({ current: layerRef.current });
      
      // Update initial position based on screen size
      // Use a timeout to ensure the stage is fully initialized
      const stage = layerRef.current.getStage();
      if (stage) {
        const updatePosition = () => {
          const stageWidth = stage.width();
          const stageHeight = stage.height();
          
          // Only update if we have valid dimensions
          if (stageWidth > 0 && stageHeight > 0) {
            updateInitialPosition(stageWidth, stageHeight);
          } else {
            // If dimensions are not ready, try again after a short delay
            setTimeout(updatePosition, 100);
          }
        };
        
        // Initial attempt
        updatePosition();
      }
    }
  }, [setLayerRef, updateInitialPosition]);

  // Add resize listener to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const stage = layerRef.current?.getStage();
      if (stage && scale === 1) { // Only recenter if not zoomed
        const stageWidth = stage.width();
        const stageHeight = stage.height();
        
        if (stageWidth > 0 && stageHeight > 0) {
          updateInitialPosition(stageWidth, stageHeight);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateInitialPosition, scale]);

  // Start initial loading
  useLayoutEffect(() => {
    addLoadingOperation("initial-map-load");
  }, [addLoadingOperation]);

  // Handle initial map loading
  useEffect(() => {
    if (mapImage && Object.keys(pathDataMap).length > 0) {
      // Map image and regions are loaded, we can stop the initial loading
      removeLoadingOperation("initial-map-load");
      
      // Ensure proper centering after map is loaded
      const stage = layerRef.current?.getStage();
      if (stage) {
        const stageWidth = stage.width();
        const stageHeight = stage.height();
        
        if (stageWidth > 0 && stageHeight > 0) {
          updateInitialPosition(stageWidth, stageHeight);
        }
      }
    }
  }, [mapImage, pathDataMap, removeLoadingOperation, updateInitialPosition]);

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

  // Click the region when a city is being edited
  useEffect(() => {
    if (editingCity && editingCity.region?.key) {
      handleRegionClick(editingCity.region?.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCity]);

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

  const handleRegionClick = async (id: string) => {
    // Prevent region changes when in edit-city mode
    if (mapType === "edit-city") {
      return;
    }

    setSelectedRegion(id);
    // Don't show loading when selecting a region

    try {
      const response = await fetch(`/api/cities/region/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cities for region ${id}`);
      }
      const cities = await response.json();
      setCities(cities);
    } catch (error) {
      console.error(error);
      setCities([]); // Clear cities in case of an error
    }
    // No loading operation to remove since we're not showing loading

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
      const xMin = Math.min(0, stageWidth - scaledMapWidth + scale);
      const yMin = Math.min(0, stageHeight - scaledMapHeight + scale);

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
    storeZoomToRegion,
    handleRegionClick,
    assignPathRef,
    limitDragBoundaries,
  };
};
