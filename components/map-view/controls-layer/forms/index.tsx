"use client";

import { useMapStore } from "@/lib/store";
import AddCityForm from "./add-city";
import { ScrollArea } from "@/components/ui/scroll-area";

const MapForms = () => {
  const { mapType } = useMapStore();

  return (
    <div
      className="absolute left-4 top-4 z-20 bg-white rounded-lg shadow-md w-80"
      hidden={mapType === "main"}
    >
      <ScrollArea className="p-4 h-full">
        {(() => {
          switch (mapType) {
            case "add-city":
              return <AddCityForm />;
            // case "edit-city":
            //   return <EditCityForm />;
            // case "add-project":
            //   return <AddProjectForm />;
            // case "edit-project":
            //   return <EditProjectForm />;
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
