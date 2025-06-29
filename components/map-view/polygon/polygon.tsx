import colors from "@/lib/colors";
import React from "react";
import { Line, Group, Text } from "react-konva";
import { CityPolygon } from "@/lib/store/polygon-marker-store";
import { useMapStore } from "@/lib/store";

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

const Polygon = ({
  polygon,
  fillColor = colors.primary_400,
  strokeColor = colors.primary,
  type = "city",
}: {
  polygon: CityPolygon;
  fillColor?: string;
  strokeColor?: string;
  type?: "city" | "project";
}) => {
  const { setSelectedCity, setSelectedProject } = useMapStore();
  const handlePolygonClick = () => {
    if (type === "city") {
      setSelectedCity(polygon.id);
    } else {
      setSelectedProject(parseInt(polygon.id, 10));
    }
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
        fill={fillColor}
        closed={true}
        onClick={handlePolygonClick}
        onTap={handlePolygonClick}
      />
      <Line points={linePoints} stroke={strokeColor} strokeWidth={1} />
      <Group x={labelPos.x} y={labelPos.y}>
        <Text
          text={polygon.name}
          fontSize={12}
          fontStyle="bold"
          fill={strokeColor}
          width={70}
          align="center"
          verticalAlign="middle"
        />
      </Group>
    </Group>
  );
};

export default Polygon;
