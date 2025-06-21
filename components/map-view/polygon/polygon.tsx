import colors from "@/lib/colors";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import React from "react";
import { Line, Group, Text } from "react-konva";
import { useMapStore } from "@/lib/store";
import { CityPolygon } from "@/lib/store/polygon-marker-store";

const getPolygonCenter = (points: number[]) => {
  let x = 0;
  let y = 0;
  for (let i = 0; i < points.length; i += 2) {
    x += points[i];
    y += points[i + 1];
  }
  return {
    x: x / (points.length / 2),
    y: y / (points.length / 2),
  };
};

const Polygon = ({ polygon }: { polygon: CityPolygon }) => {
  const { isDrawingMode, startEditingPolygon } = usePolygonMarkerStore();
  const { isAdmin, setMapType } = useMapStore();

  const handlePolygonClick = () => {
    if (!isDrawingMode && isAdmin) {
      startEditingPolygon(polygon.id);
      setMapType("add-city");
    }
  };

  const center = getPolygonCenter(polygon.points);
  const labelOffset = 100;
  let labelPos = { x: 0, y: 0 };
  let linePoints: number[] = [];

  switch (polygon.labelDirection) {
    case "up":
      labelPos = { x: center.x - 25, y: center.y - labelOffset - 20 };
      linePoints = [center.x, center.y, center.x, center.y - labelOffset];
      break;
    case "down":
      labelPos = { x: center.x - 25, y: center.y + labelOffset };
      linePoints = [center.x, center.y, center.x, center.y + labelOffset];
      break;
    case "left":
      labelPos = { x: center.x - labelOffset - 50, y: center.y - 10 };
      linePoints = [center.x, center.y, center.x - labelOffset, center.y];
      break;
    case "right":
      labelPos = { x: center.x + labelOffset, y: center.y - 10 };
      linePoints = [center.x, center.y, center.x + labelOffset, center.y];
      break;
  }

  return (
    <Group>
      <Line
        key={polygon.id}
        points={polygon.points}
        fill={colors.primary_400}
        closed={true}
        onClick={handlePolygonClick}
      />
      <Line points={linePoints} stroke={colors.primary} strokeWidth={1} />
      <Group x={labelPos.x} y={labelPos.y}>
        <Text
          text={polygon.name}
          fontSize={14}
          fontStyle="bold"
          fill={colors.primary}
          padding={2}
          width={70}
          align="center"
        />
      </Group>
    </Group>
  );
};

export default Polygon;
