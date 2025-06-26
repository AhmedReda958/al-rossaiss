import React from "react";
import MapView from "@/components/map-view";

const EditProjectPage = () => {
  // TODO: Fetch project data by projectId from params
  // TODO: Handle loading and error states
  return (
    <div>
      <h1>Edit Project</h1>
      {/* TODO: Add breadcrumbs */}
      <MapView type="edit-project" />
    </div>
  );
};

export default EditProjectPage;
