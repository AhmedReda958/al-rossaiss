import React, { useCallback } from "react";

import { BiSolidGridAlt } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import { GoZoomOut } from "react-icons/go";
import Image from "next/image";
import { useMapStore } from "@/lib/store";
import CitySlider from "./city-slider";

const ControlsLayerFooter = () => {
  const { resetZoom, setSelectedCity, selectedRegion, selectedCity } =
    useMapStore();

  const openFullScreen = useCallback(() => {
    const element = document.getElementById("map_view");
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        element.requestFullscreen().catch((err) => {
          console.error(
            `Error attempting to enable fullscreen: ${err.message}`
          );
        });
      }
    }
  }, []);

  return (
    <nav className="flex items-end justify-between z-10 absolute bottom-0 left-0 w-full h-16 p-5 ">
      <div></div>
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-5 md:block hidden"
        hidden={!selectedCity}
      >
        <CitySlider />
      </div>
      {/* controls */}

      <div className="flex items-end gap-20">
        {selectedRegion && !selectedCity && (
          <Button
            variant="light"
            size={"lg"}
            className="bg-[#EAFBFF] hover:bg-white !p-2 !py-1 rounded-sm"
            onClick={resetZoom}
          >
            <GoZoomOut className="w-6 h-6" />
            Zoom out
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

        <Button variant="light" size={"icon-sm"} onClick={openFullScreen}>
          <BiSolidGridAlt className="w-3 h-3" />
        </Button>
      </div>
    </nav>
  );
};

export default ControlsLayerFooter;
