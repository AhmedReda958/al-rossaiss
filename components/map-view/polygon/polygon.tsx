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

const getEdgePoint = (points: number[], direction: string) => {
  const polygonPoints = [];
  for (let i = 0; i < points.length; i += 2) {
    polygonPoints.push({ x: points[i], y: points[i + 1] });
  }

  switch (direction) {
    case "up":
      // Find the topmost point
      return polygonPoints.reduce((topmost, current) =>
        current.y < topmost.y ? current : topmost
      );
    case "down":
      // Find the bottommost point
      return polygonPoints.reduce((bottommost, current) =>
        current.y > bottommost.y ? current : bottommost
      );
    case "left":
      // Find the leftmost point
      return polygonPoints.reduce((leftmost, current) =>
        current.x < leftmost.x ? current : leftmost
      );
    case "right":
      // Find the rightmost point
      return polygonPoints.reduce((rightmost, current) =>
        current.x > rightmost.x ? current : rightmost
      );
    default:
      // Return center if no direction specified
      const center = getPolygonCenter(points);
      return center;
  }
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
  const edgePoint = getEdgePoint(polygon.points, polygon.labelDirection || "");
  const labelOffset = 50;
  let labelPos = { x: 0, y: 0 };
  let linePoints: number[] = [];

  switch (polygon.labelDirection) {
    case "up":
      labelPos = { x: edgePoint.x - 35, y: edgePoint.y - labelOffset - 20 };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x,
        edgePoint.y - labelOffset,
      ];
      break;
    case "down":
      labelPos = { x: edgePoint.x - 35, y: edgePoint.y + labelOffset };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x,
        edgePoint.y + labelOffset,
      ];
      break;
    case "left":
      labelPos = { x: edgePoint.x - labelOffset - 70, y: edgePoint.y - 10 };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x - labelOffset,
        edgePoint.y,
      ];
      break;
    case "right":
      labelPos = { x: edgePoint.x + labelOffset, y: edgePoint.y - 10 };
      linePoints = [
        edgePoint.x,
        edgePoint.y,
        edgePoint.x + labelOffset,
        edgePoint.y,
      ];
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
