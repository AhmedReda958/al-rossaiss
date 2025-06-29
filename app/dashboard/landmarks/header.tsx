"use client";

import React from "react";
import PageHeader from "@/components/layout/page-header";
import { PlusIcon } from "lucide-react";

const LandmarksHeader = () => {
  return (
    <PageHeader
      title="Landmarks"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Landmarks", isCurrentPage: true },
      ]}
      action={{
        label: "Add Landmark",
        icon: PlusIcon,
        href: "/dashboard/landmarks/add",
      }}
    ></PageHeader>
  );
};

export default LandmarksHeader;
