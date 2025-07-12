import React, { useCallback, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BiSolidGridAlt } from "react-icons/bi";
import { BsFullscreen, BsShare } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { FaInstagram, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineExternalLink } from "react-icons/hi";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface MapMenuProps {
  className?: string;
}

const MapMenu: React.FC<MapMenuProps> = ({ className }) => {
  const t = useTranslations("Common");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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

  const shareCurrentPage = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: "Al Rossais",
          text: "Check out this amazing map",
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          // You could add a toast notification here
          console.log("Link copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying to clipboard:", error);
        });
    }
  }, []);

  const goToHome = useCallback(() => {
    window.location.href = "https://alrossais.com/";
  }, []);

  const openSocialLink = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <>
      {isFullscreen ? (
        // In fullscreen mode, show close button
        <Button
          variant="light"
          size="icon-sm"
          onClick={openFullScreen}
          className={`${className} shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white/95 focus:ring-2 focus:ring-blue-500/20`}
        >
          <MdClose className="w-4 h-4 text-gray-700" />
        </Button>
      ) : (
        // Normal mode, show dropdown menu
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="light"
              size="icon-sm"
              className={`${className} shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white/95 focus:ring-2 focus:ring-blue-500/20`}
            >
              <BiSolidGridAlt className="w-3 h-3 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-72 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200"
            side="top"
            sideOffset={8}
          >
            {/* Home Link */}
            <DropdownMenuItem
              onClick={goToHome}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-all duration-150 group mb-1"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Image
                  src="/logo.svg"
                  alt=" logo"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex-1 text-start">
                <span className="text-sm font-medium text-gray-800">
                  {t("companyHome")}
                </span>
              </div>
              <HiOutlineExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-gray-100" />

            {/* Fullscreen */}
            <DropdownMenuItem
              onClick={openFullScreen}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-purple-50 rounded-lg transition-all duration-150 group mb-1"
            >
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <BsFullscreen className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1 text-start">
                <span className="text-sm font-medium text-gray-800">
                  {t("fullscreen")}
                </span>
              </div>
            </DropdownMenuItem>

            {/* Share */}
            <DropdownMenuItem
              onClick={shareCurrentPage}
              className="flex items-center gap-3 px-3 py-3 cursor-pointer hover:bg-green-50 rounded-lg transition-all duration-150 group mb-1"
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <BsShare className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1 text-start">
                <span className="text-sm font-medium text-gray-800">
                  {t("share")}
                </span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-2 bg-gray-100" />

            {/* Social Media */}
            <div className="px-1 pb-1">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => openSocialLink("https://twitter.com")}
                  className="p-3 hover:bg-gray-100 rounded-full transition-all duration-150 hover:scale-110 group relative overflow-hidden"
                  aria-label="Twitter"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                  <FaXTwitter className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors relative z-10" />
                </button>
                <button
                  onClick={() => openSocialLink("https://instagram.com")}
                  className="p-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 rounded-full transition-all duration-150 hover:scale-110 group relative overflow-hidden"
                  aria-label="Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                  <FaInstagram className="w-5 h-5 text-gray-600 group-hover:text-pink-600 transition-colors relative z-10" />
                </button>
                <button
                  onClick={() => openSocialLink("https://youtube.com")}
                  className="p-3 hover:bg-red-50 rounded-full transition-all duration-150 hover:scale-110 group relative overflow-hidden"
                  aria-label="YouTube"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                  <FaYoutube className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors relative z-10" />
                </button>
                <button
                  onClick={() => openSocialLink("https://linkedin.com")}
                  className="p-3 hover:bg-blue-50 rounded-full transition-all duration-150 hover:scale-110 group relative overflow-hidden"
                  aria-label="LinkedIn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity rounded-full"></div>
                  <FaLinkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors relative z-10" />
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default MapMenu;
