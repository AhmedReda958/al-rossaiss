import React from "react";
import { useMapStore } from "@/lib/store";

const ProjectsLayer = () => {
  const { projects } = useMapStore();

  return (
    <>
      {/* TODO: Map projects to polygon components */}
      {projects.map((project) => (
        <div key={project.id}>Project Polygon (TODO): {project.name}</div>
      ))}
    </>
  );
};

export default ProjectsLayer;
