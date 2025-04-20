import React from "react";
import ControlsLayerHeader from "./header";
import ControlsLayerFooter from "./footer";

const MapControlsLayer = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ControlsLayerHeader />
      {children}
      <ControlsLayerFooter />
    </>
  );
};

export default MapControlsLayer;
