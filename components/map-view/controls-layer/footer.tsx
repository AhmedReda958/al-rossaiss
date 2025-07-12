import React from "react";

import { Button } from "@/components/ui/button";
import { GoZoomOut } from "react-icons/go";
import Image from "next/image";
import { useMapStore } from "@/lib/store";
import CitySlider from "./city-slider";
import { useTranslations } from "next-intl";
import MapMenu from "./map-menu";

const ControlsLayerFooter = () => {
  const { resetZoom, setSelectedCity, selectedRegion, selectedCity } =
    useMapStore();
  const t = useTranslations("Common");

  return (
    <footer className=" flex items-bottom justify-between z-10 absolute bottom-0 left-0 w-full  p-5 pointer-events-auto">
      <div></div>
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-5 md:block hidden"
        hidden={!selectedCity}
      >
        <CitySlider />
      </div>
      {/* controls */}

      <div className="flex items-bottom gap-20">
        {selectedRegion && !selectedCity && (
          <Button
            variant="light"
            size={"lg"}
            className="bg-[#EAFBFF] hover:bg-white  rounded-sm"
            onClick={resetZoom}
          >
            <GoZoomOut className="w-6 h-6" />
            {t("zoomOut")}
          </Button>
        )}

        {selectedRegion && selectedCity && (
          <Image
            src={"/map.jpg"}
            alt="go to map"
            width={75}
            height={52}
            className="w-[75px] h-[52px] rounded-sm border-2 border-primary cursor-pointer"
            onClick={() => setSelectedCity(null)}
          ></Image>
        )}

        <MapMenu />
      </div>
    </footer>
  );
};

export default ControlsLayerFooter;
