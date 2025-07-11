"use client";

import { useMapStore } from "@/lib/store";
import AddCityForm from "./add-city";
import AddProjectForm from "./add-project";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddLandmarkForm from "./add-landmark";
import { usePathname } from "next/navigation";

const MapForms = () => {
  const { mapType, selectedRegion, selectedCity } = useMapStore();
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";
  const isArabic = currentLocale === "ar";

  // Hide forms if mapType is main or if no region/city is selected when required
  const shouldHide =
    mapType === "main" ||
    ((mapType === "add-project" ||
      mapType === "edit-project" ||
      mapType === "add-landmark" ||
      mapType === "edit-landmark") &&
      (!selectedRegion || !selectedCity));

  return (
    <div
      className={`absolute ${
        isArabic ? "right-4" : "left-4"
      } top-4 z-20 bg-white rounded-lg shadow-md w-80 max-h-[calc(100vh-2rem)]`}
      id="map-forms"
      hidden={shouldHide}
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
              return <AddProjectForm />;
            case "add-landmark":
              return <AddLandmarkForm />;
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
