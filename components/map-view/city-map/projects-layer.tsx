"use client";

import React, { useEffect } from "react";
import { Group } from "react-konva";
import { useMapStore } from "@/lib/store";
import Polygon from "@/components/map-view/polygon/polygon";
import { CityPolygon } from "@/lib/store/polygon-marker-store";
import { Project } from "@/app/types";

const mapProjectToCityPolygon = (project: Project): CityPolygon => {
  const direction = project.labelDirection || "up";

  return {
    id: String(project.id),
    name: project.name,
    points: project.points,
    regionId: String(project.city?.regionId || ""), // Use city's regionId
    labelDirection: direction as CityPolygon["labelDirection"],
  };
};

const ProjectsLayer = () => {
  const { projects, setProjects, selectedCityId } = useMapStore();

  useEffect(() => {
    const fetchCityProjects = async () => {
      if (!selectedCityId) return;

      try {
        const response = await fetch(`/api/cities/${selectedCityId}/projects`);
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching city projects:", error);
      }
    };

    fetchCityProjects();
  }, [selectedCityId, setProjects]);

  if (!projects.length) {
    return null;
  }

  return (
    <Group>
      {projects.map((project) => (
        <Polygon
          key={project.id}
          polygon={mapProjectToCityPolygon(project)}
          strokeColor="#fff"
          type="project"
        />
      ))}
    </Group>
  );
};

export default ProjectsLayer;
