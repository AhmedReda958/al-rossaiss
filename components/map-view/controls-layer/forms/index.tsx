"use client";

import { useMapStore } from "@/lib/store";
import AddCityForm from "./add-city";
import AddProjectForm from "./add-project";
import { ScrollArea } from "@/components/ui/scroll-area";

const MapForms = () => {
  const { mapType } = useMapStore();

  return (
    <div
      className="absolute left-4 top-4 z-20 bg-white rounded-lg shadow-md w-80 max-h-[calc(100vh-2rem)]"
      hidden={mapType === "main"}
    >
      <ScrollArea className="h-[calc(100vh-12rem)] p-4 pb-8">
        {(() => {
          switch (mapType) {
            case "add-city":
              return <AddCityForm />;
            case "edit-city":
              return <AddCityForm />;
            case "add-project":
              return <AddProjectForm />;
            case "edit-project":
              return <div>Edit Project Form (TODO)</div>;
            // case "add-landmark":
            //   return <AddLandmarkForm />;
            // case "edit-landmark":
            //   return <EditLandmarkForm />;
            default:
              return null;
          }
        })()}
      </ScrollArea>
    </div>
  );
};

export default MapForms;
