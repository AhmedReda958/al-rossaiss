import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMapStore } from "@/lib/store";
import ProjectCard from "./project-card";
import { UnitType } from "@/lib/constants";

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

      const response = await fetch(`/api/projects?${params}`);
      const data: ProjectsResponse = await response.json();

      if (page === 1) {
        setProjects(data.projects);
      } else {
        setProjects((prev) => [...prev, ...data.projects]);
      }

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
  }, [isOpen, selectedCityId, selectedRegion]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleProjectClick = (projectId: number) => {
    setSelectedProject(projectId);
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
                <h2 className="text-xl font-semibold mb-4">Projects</h2>
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
