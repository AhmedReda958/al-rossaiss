import React from "react";
import { Group } from "react-konva";

import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";

import DrawingPolygon from "./drawing-polygon";
import Polygon from "./polygon";

const MarkersLayer = () => {
  const { selectedRegion } = useMapStore();
  const { savedPolygons, isDrawingMode, editingPolygonId } =
    usePolygonMarkerStore();

  // Filter polygons based on selected region
  const visiblePolygons = savedPolygons.filter(
    (polygon) => !selectedRegion || polygon.regionId === selectedRegion
  );

  return (
    <Group>
      {isDrawingMode && <DrawingPolygon />}
      {/* Display saved polygons */}
      {visiblePolygons.map(
        (polygon) =>
          editingPolygonId != polygon.id && (
            <Polygon key={polygon.id} polygon={polygon} />
          )
      )}
    </Group>
  );
};

export default MarkersLayer;
