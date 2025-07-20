import React from "react";
import { Image, Layer } from "react-konva";
import { useMapStore } from "@/lib/store";
import { useRegionsLayer } from "@/lib/hooks/useRegionsLayer";
import RegionsLayer from "./regions-layer";
import MarkersLayer from "../polygon/markers-layer";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import CitiesLayer from "./cities-layer";
import CountriesLayer from "./countries-layer";

const CountryMap = () => {
  const { mapSize, setSelectedProject } = useMapStore();
  const { isDrawingMode } = usePolygonMarkerStore();
  const {
    mapImage,
    layerRef,
    scale,
    position,
    isZooming,
    limitDragBoundaries,
    handleDragEnd,
  } = useRegionsLayer();

  // Handle background click to clear project selection
  const handleLayerClick = () => {
    setSelectedProject(null);
  };

  return (
    <Layer
      ref={layerRef}
      draggable={!isZooming && !isDrawingMode}
      dragBoundFunc={limitDragBoundaries}
      x={position.x}
      y={position.y}
      scaleX={scale}
      scaleY={scale}
      onDragEnd={handleDragEnd}
      onClick={handleLayerClick}
    >
      {mapImage && (
        <Image
          image={mapImage}
          width={mapSize.width}
          height={mapSize.height}
          alt="map"
        />
      )}

      <RegionsLayer />
      <CitiesLayer />
      <CountriesLayer />
      <MarkersLayer />
    </Layer>
  );
};

export default CountryMap;
