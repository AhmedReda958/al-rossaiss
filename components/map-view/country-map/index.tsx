import React from "react";
import { Image, Layer } from "react-konva";
import { useMapStore } from "@/lib/store";
import { useRegionsLayer } from "@/lib/hooks/useRegionsLayer";
import RegionsLayer from "./regions-layer";
import MarkersLayer from "../polygon/markers-layer";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";

const CountryMap = () => {
  const { mapSize } = useMapStore();
  const { isDrawingMode } = usePolygonMarkerStore();
  const {
    mapImage,
    layerRef,
    scale,
    position,
    isZooming,
    effectiveMapWidth,
    effectiveMapHeight,
    limitDragBoundaries,
  } = useRegionsLayer();

  return (
    <Layer
      ref={layerRef}
      draggable={!isZooming && !isDrawingMode}
      width={effectiveMapWidth}
      height={effectiveMapHeight}
      dragBoundFunc={limitDragBoundaries}
      x={position.x}
      y={position.y}
      scaleX={scale}
      scaleY={scale}
    >
      {mapImage && (
        <Image
          image={mapImage}
          width={mapSize.width}
          height={mapSize.height}
          alt="map"
          y={-180}
          x={-150}
          scaleX={1.25}
          scaleY={1.25}
        />
      )}

      <RegionsLayer />
      <MarkersLayer />
    </Layer>
  );
};

export default CountryMap;
