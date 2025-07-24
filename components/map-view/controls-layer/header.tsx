import React from "react";
import Image from "next/image";
import { useMapStore } from "@/lib/store";
import LandmarkFilter from "./landmark-filter";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { BsQuestionCircle } from "react-icons/bs";

const ControlsLayerHeader = () => {
  const {
    mapType,
    instructions,
    showInstructionLayer,
    setShowInstructionLayer,
  } = useMapStore();
  const pathname = usePathname();
  const router = useRouter();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";
  const isArabic = currentLocale === "ar";

  const switchLanguage = () => {
    const newLocale = isArabic ? "en" : "ar";
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const newPath = `/${newLocale}/${pathWithoutLocale}`;
    router.push(newPath);
  };

  const toggleInstructionLayer = () => {
    setShowInstructionLayer(!showInstructionLayer);
  };

  return (
    <nav className=" flex items-start justify-between  gap-2 z-10 absolute top-0 left-0 w-full h-16 p-5">
      <div className="flex flex-col gap-3 order-2">
        <Button
          id="language-switch-btn"
          variant="light"
          size={"icon-sm"}
          className="text-xs text-muted-foreground"
          onClick={switchLanguage}
        >
          {isArabic ? "EN" : "ع"}
        </Button>
        <Button
          id="help-button"
          variant="light"
          size={"icon-sm"}
          onClick={toggleInstructionLayer}
          className={
            showInstructionLayer ? "bg-blue-50 border-blue-200 shadow-md" : ""
          }
          hidden={mapType !== "main"}
        >
          <BsQuestionCircle
            className={`w-3 h-3 ${showInstructionLayer ? "text-blue-600" : ""}`}
          />
        </Button>
      </div>
      {/* logo */}
      <div
        id="logo-container"
        className="-mt-1 order-1 w-full lg:w-[250px] relative"
        hidden={mapType !== "main"}
      >
        <Image
          src={"/logo_large.png"}
          alt="Logo"
          width={250}
          height={80}
          className="selection:hidden absolute right-0"
          draggable={false}
        />
      </div>

      {/* Landmark Filter - Center */}
      <div
        id="landmark-filter"
        className="flex-1 hidden lg:flex justify-center -me-80"
      >
        <LandmarkFilter />
      </div>

      {/* Instructions */}
      {instructions && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg shadow-lg z-50 backdrop-blur-sm">
          <p className="text-sm">{instructions}</p>
        </div>
      )}
    </nav>
  );
};

export default ControlsLayerHeader;
