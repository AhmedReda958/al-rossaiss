"use client";

import React from "react";
import { Group } from "react-konva";
import { useMapStore } from "@/lib/store";
import Polygon from "@/components/map-view/polygon/polygon";
import { CityPolygon } from "@/lib/store/polygon-marker-store";
import { Project } from "@/app/types";

const mapProjectToCityPolygon = (project: Project): CityPolygon => {
  let direction = project.labelDirection || "up";
  if (direction === "up") {
    direction = "up";
  } else if (direction === "down") {
    direction = "down";
  } else if (direction === "left") {
    direction = "left";
  } else if (direction === "right") {
    direction = "right";
  }

  return {
    id: String(project.id),
    name: project.name,
    points: project.points,
    regionId: String(project.city?.regionId || ""), // Use city's regionId
    labelDirection: direction as CityPolygon["labelDirection"],
  };
};

const ProjectsLayer = () => {
  const { projects } = useMapStore();

  if (!projects.length) {
    return null;
  }

  return (
    <Group>
      {projects.map((project) => (
        <Polygon
          key={project.id}
          polygon={mapProjectToCityPolygon(project)}
          fillColor="rgba(255, 165, 0, 0.3)" // Orange with transparency for projects
          strokeColor="#ff8c00" // Darker orange for the border
          type="project"
        />
      ))}
    </Group>
  );
};

export default ProjectsLayer;
