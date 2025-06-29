import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft, MapPin, Search } from "lucide-react";
import { useMapStore } from "@/lib/store";
import ProjectCard from "./project-card";
import { UnitType } from "@/lib/constants";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";

export interface Project {
  id: number;
  name: string;
  description?: string;
  image?: string;
  labelDirection: string;
  points: number[];
  cityId: number;
  space: number;
  unitsCount: number;
  soldOut: boolean;
  url?: string | null;
  unitType: UnitType;
  city?: {
    id: number;
    name: string;
    region?: {
      id: number;
      name: string;
    };
  };
}

interface ProjectsResponse {
  projects: Project[];
  total: number;
  totalPages: number;
}

const ProjectsList = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    selectedCityId,
    selectedRegion,
    selectedProject,
    setSelectedProject,
  } = useMapStore();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
      });

      if (selectedCityId) params.append("cityId", selectedCityId.toString());
      if (selectedRegion) params.append("regionId", selectedRegion);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const response = await fetch(`/api/projects?${params}`);
      const data: ProjectsResponse = await response.json();

      if (page === 1) {
        setProjects(data.projects);
      } else {
        setProjects((prev) => [...prev, ...data.projects]);
      }

      setTotal(data.total);
      setHasMore(page < data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      fetchProjects();
    }
  }, [isOpen, selectedCityId, selectedRegion, debouncedSearch]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProject(projectId);
  };

  const currentCity = projects[0]?.city;
  const currentRegion = currentCity?.region;

  const getHeaderTitle = () => {
    if (selectedCityId && currentCity) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">{currentCity.name}</h2>
          <div className="flex items-center gap-2 text-md text-gray-400">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{currentRegion?.name}</span>
            <span className="text-md font-bold text-primary">•</span>
            <span>
              {total} {total === 1 ? "Project" : "Projects"}
            </span>
          </div>
        </div>
      );
    } else if (selectedRegion && currentRegion) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">{currentRegion.name}</h2>
          <div className="flex items-center gap-2 text-md text-gray-400">
            <span>
              {total} {total === 1 ? "Project" : "Projects"}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">All Projects</h2>
          <div className="flex items-center gap-2 text-md text-gray-400">
            <span>
              {total} {total === 1 ? "Project" : "Projects"}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="absolute left-4 top-4 bottom-4 z-50 h-[calc(100vh-2rem)]">
      {/* Projects Panel */}
      <Button
        variant="secondary"
        className="absolute -left-4 text-xs font-thin top-1/2 -translate-y-1/2 shadow-lg z-10 rounded-s-none rounded-e-md !pe-2"
        onClick={() => setIsOpen(true)}
        hidden={isOpen}
      >
        All Projects
        <ChevronRight className="h-4 w-4" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="bg-white rounded-lg shadow-md w-80 h-[calc(100vh-3rem)] left-4"
          >
            <div className="relative h-full">
              {/* Toggle Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute -right-10 top-1/2 -translate-y-1/2 shadow-lg z-10"
                onClick={() => setIsOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="p-4 pe-0 h-[calc(100%-3rem)]">
                {/* Header Section */}
                <div className="mb-6 pe-4">
                  <div className="flex items-center justify-between mb-4">
                    {getHeaderTitle()}
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={42}
                      height={42}
                      className="h-8 w-auto"
                    />
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search on Projects"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-4 py-2 bg-gray-100/50"
                    />
                  </div>
                </div>

                <ScrollArea
                  className="h-full"
                  onScrollCapture={(e) => {
                    const target = e.target as HTMLDivElement;
                    if (
                      target.scrollHeight - target.scrollTop ===
                        target.clientHeight &&
                      !loading &&
                      hasMore
                    ) {
                      loadMore();
                    }
                  }}
                >
                  <div className="space-y-4 pe-4">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        isSelected={selectedProject === project.id}
                        onClick={() => handleProjectClick(project.id)}
                      />
                    ))}
                    {loading && (
                      <div className="py-4 text-center text-gray-500">
                        Loading...
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsList;
