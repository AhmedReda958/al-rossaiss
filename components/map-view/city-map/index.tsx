"use client";

import React, { useEffect, useState } from "react";
import { Image, Layer } from "react-konva";
import Konva from "konva";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { useCitiesLayer } from "@/lib/hooks/useCitiesLayer";
import ProjectsLayer from "./projects-layer";
import DrawingPolygon from "../polygon/drawing-polygon";
import LandmarksLayer from "./landmarks-layer";

// Define a minimal city data type
interface CityData {
  id: number;
  imageUrl?: string;
  // Add other city fields as needed
}

const CityMap = () => {
  const {
    mapSize,
    selectedCity,
    mapType,
    setSelectedCityId,
    addLoadingOperation,
    removeLoadingOperation,
    editingProject,
    setSelectedProject,
    scale,
    setScale,
    position,
    setPosition,
  } = useMapStore();
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [cityImage, setCityImage] = useState<HTMLImageElement | null>(null);

  const { isDrawingMode, setCoordinates } = usePolygonMarkerStore();
  const { position: cityPosition, limitDragBoundaries, layerRef } = useCitiesLayer();

  // Use store position when zoomed, otherwise use city position
  const activePosition = scale !== 1 ? position : cityPosition;

  // Handle scroll-based zoom for city map (1x to 2x)
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    if (!layerRef.current) return;
    
    const stage = layerRef.current.getStage();
    if (!stage) return;
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    
    // Get current scale
    const currentScale = scale;
    
    // Calculate zoom direction and amount
    const scaleBy = 1.1;
    const deltaY = e.evt.deltaY;
    let newScale = deltaY > 0 ? currentScale / scaleBy : currentScale * scaleBy;
    
    // Clamp scale between 1x and 2x
    newScale = Math.max(1, Math.min(2, newScale));
    
    // If scale hasn't changed (at limits), do nothing
    if (newScale === currentScale) return;
    
    // Calculate new position to zoom towards mouse pointer
    const mousePointTo = {
      x: (pointer.x - position.x) / currentScale,
      y: (pointer.y - position.y) / currentScale,
    };
    
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    
    // Apply the new scale and position
    setScale(newScale);
    setPosition(newPos);
    
    // Update the layer immediately
    layerRef.current.scale({ x: newScale, y: newScale });
    layerRef.current.position(newPos);
  };

  // Handle map click for landmark placement
  const handleLayerClick = () => {
    if (isDrawingMode && mapType === "add-landmark") {
      const layerPoint = layerRef.current?.getRelativePointerPosition();
      if (layerPoint) {
        setCoordinates(layerPoint.x, layerPoint.y);
      }
    } else {
      // Clear project selection and reset zoom when clicking on background
      setSelectedProject(null);
      const { resetZoom } = useMapStore.getState();
      resetZoom();
    }
  };

  // Fetch city data and projects when selectedCity changes
  useEffect(() => {
    if (!selectedCity) {
      setSelectedCityId(null);
      return;
    }

    // Reset zoom when opening a new city
    const { resetZoom } = useMapStore.getState();
    resetZoom();

    // If we're in edit mode and have project data with city, use it instead of fetching
    if (
      mapType === "edit-project" &&
      editingProject &&
      editingProject.city &&
      editingProject.city.id.toString() === selectedCity
    ) {
      const projectCity = editingProject.city;
      setCityData({ id: projectCity.id });
      setSelectedCityId(projectCity.id);

      // Try to get city image from a separate API call, but don't block on it
      const fetchCityImage = async () => {
        try {
          const res = await fetch(`/api/cities/${projectCity.id}`);
          if (res.ok) {
            const cityData = await res.json();
            if (cityData.image) {
              const img = new window.Image();
              img.src = cityData.image;
              img.onload = () => {
                setCityImage(img);
              };
              img.onerror = () => {
                setCityImage(null);
              };
            } else {
              setCityImage(null);
            }
          }
        } catch (error) {
          console.error("Error fetching city image:", error);
          setCityImage(null);
        }
      };

      fetchCityImage();
      return;
    }

    const fetchCity = async () => {
      addLoadingOperation("city-data"); // Start loading when fetching city data

      try {
        const res = await fetch(`/api/cities/${selectedCity}`);
        if (res.ok) {
          const data = await res.json();
          setCityData(data);
          setSelectedCityId(data.id);
          if (data.image) {
            const img = new window.Image();
            img.src = data.image;
            img.onload = () => {
              setCityImage(img);
              removeLoadingOperation("city-data"); // Stop loading when image is loaded
            };
            img.onerror = () => {
              setCityImage(null);
              removeLoadingOperation("city-data"); // Stop loading even if image fails
            };
          } else {
            setCityImage(null);
            removeLoadingOperation("city-data"); // Stop loading if no image
          }
        } else {
          setCityData(null);
          setCityImage(null);
          setSelectedCityId(null);
          removeLoadingOperation("city-data"); // Stop loading on error
        }
      } catch (error) {
        console.error("Error fetching city data:", error);
        setCityData(null);
        setCityImage(null);
        setSelectedCityId(null);
        removeLoadingOperation("city-data"); // Stop loading on error
      }
    };

    fetchCity();
  }, [
    selectedCity,
    setSelectedCityId,
    addLoadingOperation,
    removeLoadingOperation,
    mapType,
    editingProject,
  ]);

  if (!selectedCity || !cityData) return null;

  const showDrawingPolygon =
    isDrawingMode && (mapType === "add-project" || mapType === "edit-project");

  return (
    <Layer
      ref={layerRef}
      draggable={!isDrawingMode}
      dragBoundFunc={limitDragBoundaries}
      x={activePosition.x}
      y={activePosition.y}
      scaleX={scale}
      scaleY={scale}
      onClick={handleLayerClick}
      onWheel={handleWheel}
      onDragEnd={(e) => {
        // Update position in the store to sync with the actual layer position
        const newPos = e.target.position();
        setPosition(newPos);
      }}
    >
      {cityImage && (
        <Image
          image={cityImage}
          width={mapSize.width}
          height={mapSize.height}
          alt="city-map"
        />
      )}
      <ProjectsLayer />
      <LandmarksLayer />
      {showDrawingPolygon && <DrawingPolygon />}
    </Layer>
  );
};

export default CityMap;
