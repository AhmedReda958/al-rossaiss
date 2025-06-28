import React from "react";
import ControlsLayerHeader from "./header";
import ControlsLayerFooter from "./footer";
import MapForms from "./forms";
import ProjectsList from "./projects-list";

const MapControlsLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ProjectsList />
      <ControlsLayerHeader />
      {children}
      <MapForms />
      <ControlsLayerFooter />
    </>
  );
};

export default MapControlsLayer;
