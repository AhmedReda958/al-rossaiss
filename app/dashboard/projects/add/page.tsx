import React from "react";
import MapView from "@/components/map-view";

const AddProjectPage = () => {
  return (
    <div>
      <h1>Add Project</h1>
      {/* TODO: Add breadcrumbs */}
      <MapView type="add-project" />
    </div>
  );
};

export default AddProjectPage;
