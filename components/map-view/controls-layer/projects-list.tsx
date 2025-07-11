import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { getLocalizedName } from "@/lib/utils";

export interface Project {
  id: number;
  name: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  image?: string;
  logo?: string;
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
    nameAr?: string;
    region?: {
      id: number;
      name: string;
      nameAr?: string;
    };
  };
}

interface ProjectsResponse {
  projects: Project[];
  total: number;
  totalPages: number;
}

const ProjectsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [total, setTotal] = useState(0);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const wasManuallyClosedRef = useRef(false);
  const lastSelectedProjectRef = useRef<number | null>(null);

  const t = useTranslations("Projects");
  const tCommon = useTranslations("Common");
  const tRegions = useTranslations("Regions");
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Helper function to get translated region name
  const getRegionName = (regionId: number) => {
    const regionIdToKey: Record<number, string> = {
      1: "western",
      2: "eastern",
      3: "northern",
      4: "southern",
      5: "central",
    };
    const key = regionIdToKey[regionId];
    return key ? tRegions(key) : `Region ${regionId}`;
  };

  const {
    selectedCityId,
    selectedRegion,
    selectedProject,
    setSelectedProject,
  } = useMapStore();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: "10",
      });

      if (selectedCityId) params.append("cityId", selectedCityId.toString());
      if (selectedRegion) params.append("regionId", selectedRegion);
      if (debouncedSearch) params.append("search", debouncedSearch);

      // Include selected project if it exists
      if (selectedProject) {
        params.append("includeProject", selectedProject.toString());
      }

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
  }, [page, selectedCityId, selectedRegion, debouncedSearch, selectedProject]);

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      fetchProjects();
    }
  }, [isOpen, selectedCityId, selectedRegion, debouncedSearch, fetchProjects]);

  // Auto-open projects list when a project is selected from map
  useEffect(() => {
    // Only auto-open if:
    // 1. A project is selected
    // 2. The list is not already open
    // 3. It's a new project selection (different from the last one)
    if (
      selectedProject &&
      !isOpen &&
      selectedProject !== lastSelectedProjectRef.current
    ) {
      setIsOpen(true);
      wasManuallyClosedRef.current = false;
    }

    // Update the last selected project reference
    lastSelectedProjectRef.current = selectedProject;
  }, [selectedProject, isOpen]);

  // Handle manual close - mark as manually closed and clear selection
  const handleClose = () => {
    setIsOpen(false);
    wasManuallyClosedRef.current = true;
    // Clear the selected project when closing the list
    setSelectedProject(null);
  };

  // Reset manual close flag when a new project is selected
  useEffect(() => {
    if (selectedProject && selectedProject !== lastSelectedProjectRef.current) {
      wasManuallyClosedRef.current = false;
    }
  }, [selectedProject]);

  // Scroll to selected project when projects list is updated
  useEffect(() => {
    if (selectedProject && projects.length > 0) {
      const timer = setTimeout(() => {
        const element = document.getElementById(`project-${selectedProject}`);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [selectedProject, projects]);

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
      const cityName = getLocalizedName(currentCity, currentLocale);
      const regionName = currentRegion?.id
        ? getRegionName(currentRegion.id)
        : currentRegion?.name;

      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">{cityName}</h2>
          <div className="flex items-center gap-2 text-md text-gray-400">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{regionName}</span>
            <span className="text-md font-bold text-primary">•</span>
            <span>
              {total} {total === 1 ? t("title").slice(0, -1) : t("title")}
            </span>
          </div>
        </div>
      );
    } else if (selectedRegion && currentRegion) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {currentRegion?.id
              ? getRegionName(currentRegion.id)
              : currentRegion?.name}
          </h2>
          <div className="flex items-center gap-2 text-md text-gray-400">
            <span>
              {total} {total === 1 ? t("title").slice(0, -1) : t("title")}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {tCommon("allProjects")}
          </h2>
          <div className="flex items-center gap-2 text-md text-gray-400">
            <span>
              {total} {total === 1 ? t("title").slice(0, -1) : t("title")}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div id="projects-list" className="absolute left-4 top-4 bottom-4 z-40 h-[calc(100vh-2rem)]">
      {/* Projects Panel */}
      <Button
        variant="secondary"
        className="absolute -left-4 text-xs font-thin top-1/2 -translate-y-1/2 shadow-lg z-10 rounded-s-none rounded-e-md !pe-2"
        onClick={() => setIsOpen(true)}
        hidden={isOpen}
      >
        {tCommon("allProjects")}
        <ChevronRight className="h-4 w-4" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.2 }}
            className="bg-white rounded-lg shadow-md w-80 h-[calc(100vh-5em)] lg:h-[calc(100vh-3rem)] left-4"
          >
            <div className="relative h-full">
              {/* Toggle Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute -right-10 top-1/2 -translate-y-1/2 shadow-lg z-10"
                onClick={handleClose}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="p-4 pe-0 h-[calc(100%-1rem)] overflow-y-hidden">
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
                      placeholder={tCommon("searchOnProjects")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-4 py-2 bg-gray-100/50"
                    />
                  </div>
                </div>

                <ScrollArea
                  className="h-full b-4"
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
                      <div key={project.id} id={`project-${project.id}`}>
                        <ProjectCard
                          project={project}
                          isSelected={selectedProject === project.id}
                          onClick={() => handleProjectClick(project.id)}
                        />
                      </div>
                    ))}
                    {loading && (
                      <div className="py-4 text-center text-gray-500">
                        {tCommon("loading")}
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
