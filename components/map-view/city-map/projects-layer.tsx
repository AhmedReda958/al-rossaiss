"use client";

import React, { useEffect } from "react";
import { Group } from "react-konva";
import { useMapStore } from "@/lib/store";
import Polygon from "@/components/map-view/polygon/polygon";
import { CityPolygon } from "@/lib/store/polygon-marker-store";
import { Project } from "@/app/types";
import colors from "@/lib/colors";

const mapProjectToCityPolygon = (project: Project): CityPolygon => {
  const direction = project.labelDirection || "up";

  return {
    id: String(project.id),
    name: project.name,
    points: project.points,
    regionId: String(project.city?.region?.id || ""), // Use city's region id
    labelDirection: direction as CityPolygon["labelDirection"],
  };
};

const ProjectsLayer = () => {
  const { projects, setProjects, selectedCityId, addLoadingOperation, removeLoadingOperation } = useMapStore();

  useEffect(() => {
    const fetchCityProjects = async () => {
      if (!selectedCityId) return;

      addLoadingOperation('projects-data'); // Start loading when fetching projects
      
      try {
        const response = await fetch(`/api/cities/${selectedCityId}/projects`);
        if (!response.ok) throw new Error("Failed to fetch projects");

        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching city projects:", error);
      } finally {
        removeLoadingOperation('projects-data'); // Stop loading after fetching
      }
    };

    fetchCityProjects();
  }, [selectedCityId, setProjects, addLoadingOperation, removeLoadingOperation]);

  if (!projects.length) {
    return null;
  }

  return (
    <Group>
      {projects.map((project) => (
        <Polygon
          key={project.id}
          polygon={mapProjectToCityPolygon(project)}
          strokeColor={colors.primary}
          fillColor={colors.primary_400}
          labelColor={colors.primary}
          type="project"
        />
      ))}
    </Group>
  );
};

export default ProjectsLayer;
