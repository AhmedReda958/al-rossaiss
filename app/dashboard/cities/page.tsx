"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "./header";
import CityCard from "./city-card";
import { City } from "@/app/types";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Region } from "@prisma/client";
import { Search } from "lucide-react";
import { PaginationWithNumbers } from "@/components/ui/pagination-with-numbers";

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchCities = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "12",
    });
    if (debouncedSearchTerm) {
      params.append("q", debouncedSearchTerm);
    }
    if (selectedRegion && selectedRegion !== "all") {
      params.append("region", selectedRegion);
    }
    const response = await fetch(`/api/cities?${params.toString()}`);
    const data = await response.json();
    setCities(data.cities);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  }, [currentPage, debouncedSearchTerm, selectedRegion]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    async function fetchRegions() {
      const response = await fetch("/api/regions");
      const data = await response.json();
      setRegions(data);
    }
    fetchRegions();
  }, []);

  return (
    <>
      <Header />
      <main className="py-8">
        <div className="flex justify-start items-center mb-6 gap-4">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              placeholder="Search for City"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="pl-10 h-12"
            />
          </div>
          <div className="w-[250px]">
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
                  <SelectItem key={region.id} value={region.name}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center col-span-4">Loading...</div>
        ) : cities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <div className="text-center col-span-4 text-gray-500 mt-8">
            No cities found.
          </div>
        )}

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
