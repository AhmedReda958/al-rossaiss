import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useMapStore } from "@/lib/store";

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

  const { selectedCityId, selectedRegion, setSelectedProject } = useMapStore();

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
    <div className="absolute left-4 top-4 bottom-4 z-50  h-[calc(100vh-2rem)]">
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

              <div className="p-4 h-[calc(100%-3rem)]">
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
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleProjectClick(project.id)}
                      >
                        {project.image && (
                          <div className="relative h-40 mb-3">
                            <img
                              src={project.image}
                              alt={project.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                            {project.soldOut && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                  Sold Out
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        <h3 className="font-medium text-lg">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {project.description}
                          </p>
                        )}
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          <p>Units: {project.unitsCount}</p>
                          <p>Space: {project.space} M²</p>
                          {project.city && <p>Location: {project.city.name}</p>}
                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline block mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      </div>
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
