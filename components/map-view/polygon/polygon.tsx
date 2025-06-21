import colors from "@/lib/colors";
import React from "react";
import { Line, Group, Text } from "react-konva";
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
  const handlePolygonClick = () => {
    // setSelectedCity(polygon);
  };

  const center = getPolygonCenter(polygon.points);
  const labelOffset = 50;
  let labelPos = { x: 0, y: 0 };
  let linePoints: number[] = [];

  switch (polygon.labelDirection) {
    case "up":
      labelPos = { x: center.x - 35, y: center.y - labelOffset - 20 };
      linePoints = [center.x, center.y, center.x, center.y - labelOffset];
      break;
    case "down":
      labelPos = { x: center.x - 35, y: center.y + labelOffset };
      linePoints = [center.x, center.y, center.x, center.y + labelOffset];
      break;
    case "left":
      labelPos = { x: center.x - labelOffset - 70, y: center.y - 10 };
      linePoints = [center.x, center.y, center.x - labelOffset, center.y];
      break;
    case "right":
      labelPos = { x: center.x + labelOffset, y: center.y - 10 };
      linePoints = [center.x, center.y, center.x + labelOffset, center.y];
      break;
    default:
      labelPos = { x: center.x - 35, y: center.y - 10 };
      linePoints = [];
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
          fontSize={12}
          fontStyle="bold"
          fill={colors.primary}
          width={70}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    </Group>
  );
};

export default Polygon;
