import React from "react";
import PageHeader from "@/components/layout/page-header";
import { PlusIcon } from "lucide-react";

const ProjectsHeader = () => {
  return (
    <PageHeader
      title="Projects"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Projects", isCurrentPage: true },
      ]}
      action={{
        label: "Create Project",
        icon: PlusIcon,
        href: "/dashboard/projects/add",
        variant: "default",
      }}
    />
  );
};

export default ProjectsHeader;
