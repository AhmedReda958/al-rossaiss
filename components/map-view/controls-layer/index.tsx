import React from "react";
import ControlsLayerHeader from "./header";
import ControlsLayerFooter from "./footer";
import MapForms from "./forms";

const MapControlsLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ControlsLayerHeader />
      {children}
      <MapForms />
      <ControlsLayerFooter />
    </>
  );
};

export default MapControlsLayer;
