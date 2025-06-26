import React from "react";
import { Project } from "@/app/types";

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="project-card">
      <img
        src={project.image || "/logo.svg"}
        alt={project.name}
        className="project-image"
      />
      <div className="project-info">
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        {/* TODO: Show city and region info */}
        <div className="project-actions">
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
};
export default ProjectCard;
