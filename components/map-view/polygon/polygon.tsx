import colors from "@/lib/colors";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import React from "react";
import { Line } from "react-konva";
import { useMapStore } from "@/lib/store";
const Polygon = ({
  polygon,
}: {
  polygon: { id: string; points: number[] };
}) => {
  const { isDrawingMode, startEditingPolygon } = usePolygonMarkerStore();
  const { isAdmin } = useMapStore();

  return (
    <Line
      key={polygon.id}
      points={polygon.points}
      fill={colors.primary_400}
      closed={true}
      onClick={() => {
        if (!isDrawingMode && isAdmin) {
          startEditingPolygon(polygon.id);
        }
      }}
    />
  );
};

export default Polygon;
