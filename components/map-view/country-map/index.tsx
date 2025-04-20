import React from "react";
import { Image, Layer } from "react-konva";
import { useMapStore } from "@/lib/store";
import { useRegionsLayer } from "@/lib/hooks/useRegionsLayer";
import RegionsLayer from "./regions-layer";
import PolygonMarker from "../polygon-marker";

const CountryMap = () => {
  const { mapSize } = useMapStore();
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

  //   console.log(position, scale, isZooming);

  return (
    <Layer
      ref={layerRef}
      draggable={!isZooming}
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
      <PolygonMarker />
    </Layer>
  );
};

export default CountryMap;
