import React from "react";
import Image from "next/image";
import { useMapStore } from "@/lib/store";
import LandmarkFilter from "./landmark-filter";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

const ControlsLayerHeader = () => {
  const { mapType, instructions } = useMapStore();
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

  return (
    <nav className="flex items-start justify-between flex-row-reverse gap-4 z-10 absolute top-0 left-0 w-full h-16 p-5">
      {/* logo */}
      <div className="bg-white rounded-sm p-1 " hidden={mapType !== "main"}>
        <Image
          src={"/logo_large.png"}
          alt="Logo"
          width={212}
          height={60}
          className="hidden lg:block selection:hidden"
          draggable={false}
        />
        <Image
          src={"/logo.svg"}
          alt="Logo"
          width={32}
          height={32}
          className="block lg:hidden selection:hidden"
          draggable={false}
        />
      </div>

      {/* Landmark Filter - Center */}
      <div className="flex-1 hidden lg:flex justify-center -me-30">
        <LandmarkFilter />
      </div>

      {/* Instructions */}
      {instructions && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg shadow-lg z-50 backdrop-blur-sm">
          <p className="text-sm">{instructions}</p>
        </div>
      )}

      {/* Language Toggle Button */}
      <div className="flex flex-col gap-3">
        <Button
          variant="light"
          size={"icon-sm"}
          className="text-xs text-muted-foreground"
          onClick={switchLanguage}
        >
          {isArabic ? "EN" : "عر"}
        </Button>
      </div>
    </nav>
  );
};

export default ControlsLayerHeader;
