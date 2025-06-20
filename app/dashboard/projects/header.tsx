import React from "react";
import PageHeader from "@/components/layout/page-header";
import { FolderPlusIcon } from "lucide-react";

const ProjectsHeader = () => {
  const handleCreateProject = () => {
    console.log("Create project clicked");
  };

  return (
    <PageHeader
      title="Projects"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Projects", isCurrentPage: true },
      ]}
      action={{
        label: "Create Project",
        icon: FolderPlusIcon,
        onClick: handleCreateProject,
        variant: "outline",
      }}
    />
  );
};

export default ProjectsHeader;
