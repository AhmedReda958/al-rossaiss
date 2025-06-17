"use client";

import React from "react";
import PageHeader from "@/components/layout/page-header";
import { MapPinIcon, DownloadIcon } from "lucide-react";

const LandmarksHeader = () => {
  const handleAddLandmark = () => {
    console.log("Add landmark clicked");
  };

  const handleExportData = () => {
    console.log("Export data clicked");
  };

  return (
    <PageHeader
      title="Landmarks"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Landmarks", isCurrentPage: true },
      ]}
      action={{
        label: "Add Landmark",
        icon: MapPinIcon,
        onClick: handleAddLandmark,
      }}
    >
      {/* Additional action button as children */}
      <button
        onClick={handleExportData}
        className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50"
      >
        <DownloadIcon className="h-4 w-4" />
        Export
      </button>
    </PageHeader>
  );
};

export default LandmarksHeader;
