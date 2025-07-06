"use client";

import React from "react";
import Image from "next/image";

interface MapLoadingProps {
  isLoading: boolean;
}

const MapLoading: React.FC<MapLoadingProps> = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }
  return (
    <div className="absolute inset-0 z-50 overflow-hidden">
      {/* Background map image */}
      <div className="absolute inset-0">
        <Image
          src="/map.jpg"
          alt="Map background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Blur overlay with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-white/10 to-black/70 backdrop-blur-lg" />

      {/* Loading content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Logo container with gentle pulse */}
          <div className="relative">
            <div className="absolute inset-0  bg-black/10 blur-xl animate-pulse" />
            <div className="relative bg-white  p-2 shadow-lg rounded-md">
              <Image
                src="/logo.svg"
                alt="Loading..."
                width={60}
                height={60}
                className="animate-pulse"
              />
            </div>
          </div>

          {/* Loading text and progress indicator */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 bg-white/65 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-white/65 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-white/65 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLoading;
