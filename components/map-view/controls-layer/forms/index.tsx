"use client";

import { useMapStore } from "@/lib/store";
import AddCityForm from "./add-city";

const MapForms = () => {
  const { mapType, setMapType } = useMapStore();

  const handleClose = () => {
    setMapType("main");
  };

  switch (mapType) {
    case "add-city":
      return <AddCityForm onClose={handleClose} />;
    // case "edit-city":
    //   return <EditCityForm onClose={handleClose} />;
    // case "add-project":
    //   return <AddProjectForm onClose={handleClose} />;
    // case "edit-project":
    //   return <EditProjectForm onClose={handleClose} />;
    // case "add-landmark":
    //   return <AddLandmarkForm onClose={handleClose} />;
    // case "edit-landmark":
    //   return <EditLandmarkForm onClose={handleClose} />;
    default:
      return null;
  }
};

export default MapForms;
