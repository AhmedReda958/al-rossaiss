"use client";

import { useState, useEffect, useCallback } from "react";
import ProjectsHeader from "./header";
import ProjectCard from "./project-card";
import { Project } from "@/app/types";
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({
      page: currentPage.toString(),
      pageSize: "12",
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
    const response = await fetch(`/api/projects?${params.toString()}`);
    const data = await response.json();
    setProjects(data.projects);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  }, [currentPage, debouncedSearchTerm, selectedRegion, selectedCity]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    async function fetchRegions() {
      const response = await fetch("/api/regions");
      const data = await response.json();
      setRegions(data);
    }
    fetchRegions();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      const params = new URLSearchParams();
      if (selectedRegion !== "all") {
        params.append("regionId", selectedRegion);
      }
      const response = await fetch(`/api/cities?${params.toString()}`);
      const data = await response.json();
      setCities(data.cities || []);
      // Reset city selection when region changes
      setSelectedCity("all");
    }
    fetchCities();
  }, [selectedRegion]);

  return (
    <>
      <ProjectsHeader />
      <main className="py-8">
        <div className="flex justify-start items-center mb-6 gap-4">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              placeholder="Search for Project"
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
        </div>

        {isLoading ? (
          <div className="text-center col-span-4">Loading...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onProjectDeleted={fetchProjects}
              />
            ))}
          </div>
        ) : (
          <div className="text-center col-span-4 text-gray-500 mt-8">
            No projects found.
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
