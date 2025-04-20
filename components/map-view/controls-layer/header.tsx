import React from "react";
import Image from "next/image";
import { BsQuestionCircle } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";

const ControlsLayerHeader = () => {
  const {
    isAdmin,
    selectedCity,
    selectedRegion,
    instructions,
    setIsAddingCity,
    isAddingCity,
  } = useMapStore();
  const { toggleDrawingMode } = usePolygonMarkerStore();

  const handleAddCityClick = () => {
    setIsAddingCity(true);

    if (selectedRegion) {
      toggleDrawingMode(selectedRegion);
    }
  };

  return (
    <nav className="flex items-start justify-between z-10 absolute top-0 left-0 w-full h-16 p-5">
      {/* logo */}
      <Image
        src={"Logo.svg"}
        alt="Logo"
        width={42}
        height={42}
        draggable={false}
      />

      {/* Instructions */}
      {instructions && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/30 text-white/90 px-4 py-2 rounded shadow-lg z-50">
          {instructions}
        </div>
      )}

      {/* controls */}
      <div className="flex flex-col gap-3">
        <Button variant="light" size={"icon-sm"}>
          <BsQuestionCircle className="w-3 h-3" />
        </Button>

        <Button
          variant="light"
          size={"icon-sm"}
          className=" text-xs text-muted-foreground"
        >
          EN
        </Button>

        {isAdmin && selectedRegion && !selectedCity && !isAddingCity && (
          <Button
            variant="light"
            size={"icon-sm"}
            onClick={handleAddCityClick}
            title="Draw City Boundary"
          >
            <PlusIcon className="w-3 h-3" />
          </Button>
        )}
      </div>
    </nav>
  );
};

export default ControlsLayerHeader;
