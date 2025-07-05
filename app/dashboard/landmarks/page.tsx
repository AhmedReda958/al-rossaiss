"use client";

import { useState, useEffect, useCallback } from "react";
import LandmarksHeader from "./header";
import LandmarksTable from "@/components/landmarks-table";
import { Landmark, LandmarksApiResponse } from "@/app/types";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Region, City } from "@prisma/client";
import { Search } from "lucide-react";
import { PaginationWithNumbers } from "@/components/ui/pagination-with-numbers";
import { LANDMARK_TYPES } from "@/lib/constants";

export default function LandmarksPage() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedRegion, selectedCity, selectedType]);

  const fetchLandmarks = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      pageSize: "10",
    });
    if (debouncedSearchTerm) {
      params.append("search", debouncedSearchTerm);
    }
    if (selectedRegion && selectedRegion !== "all") {
      params.append("regionId", selectedRegion);
    }
    if (selectedCity && selectedCity !== "all") {
      params.append("cityId", selectedCity);
    }
    if (selectedType && selectedType !== "all") {
      params.append("type", selectedType);
    }

    try {
      const response = await fetch(`/api/landmarks?${params.toString()}`);
      const data: LandmarksApiResponse = await response.json();
      setLandmarks(data.landmarks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching landmarks:", error);
      setLandmarks([]);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    debouncedSearchTerm,
    selectedRegion,
    selectedCity,
    selectedType,
  ]);

  useEffect(() => {
    fetchLandmarks();
  }, [fetchLandmarks]);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const response = await fetch("/api/regions");
        const data = await response.json();
        setRegions(data);
      } catch (error) {
        console.error("Error fetching regions:", error);
      }
    }
    fetchRegions();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        const params = new URLSearchParams();
        if (selectedRegion !== "all") {
          params.append("regionId", selectedRegion);
        }
        const response = await fetch(`/api/cities?${params.toString()}`);
        const data = await response.json();
        setCities(data.cities || []);
        // Reset city selection when region changes
        setSelectedCity("all");
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
    fetchCities();
  }, [selectedRegion]);

  return (
    <>
      <LandmarksHeader />
      <main className="py-8">
        <div className="flex justify-start items-center mb-6 gap-4 flex-wrap">
          <div className="relative w-full sm:w-1/3 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              placeholder="Search for Landmark"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="pl-10 h-12"
            />
          </div>

          <Select
            value={selectedRegion}
            onValueChange={(value) => setSelectedRegion(value)}
          >
            <SelectTrigger className="!h-12 min-w-48">
              <SelectValue placeholder="Filter by Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id.toString()}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedCity}
            onValueChange={(value) => setSelectedCity(value)}
          >
            <SelectTrigger className="!h-12 min-w-48">
              <SelectValue placeholder="Filter by City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
          >
            <SelectTrigger className="!h-12 min-w-48">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(LANDMARK_TYPES).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <LandmarksTable
          landmarks={landmarks}
          isLoading={isLoading}
          onLandmarkDeleted={fetchLandmarks}
        />

        {!isLoading && totalPages > 1 && (
          <div className="mt-8">
            <PaginationWithNumbers
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </main>
    </>
  );
}
