import React from "react";
import ControlsLayerHeader from "./header";
import ControlsLayerFooter from "./footer";
import MapForms from "./forms";
import ProjectsList from "./projects-list";
import { useMapStore } from "@/lib/store/map-store";

const MapControlsLayer = ({ children }: { children: React.ReactNode }) => {
  const { mapType } = useMapStore();

  return (
    <>
      {mapType === "main" && <ProjectsList />}
      <ControlsLayerHeader />
      {children}
      <MapForms />
      <ControlsLayerFooter />
    </>
  );
};

export default MapControlsLayer;
