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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Region } from "@prisma/client";
import { Search } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
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
    const response = await fetch(`/api/projects?${params.toString()}`);
    const data = await response.json();
    setProjects(data.projects);
    setTotalPages(data.totalPages);
    setIsLoading(false);
  }, [currentPage, debouncedSearchTerm, selectedRegion]);

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

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const ellipsis = <PaginationEllipsis />;

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > maxPagesToShow - 2) {
        pages.push(
          <PaginationItem key="start-ellipsis">{ellipsis}</PaginationItem>
        );
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage < 4) {
        startPage = 2;
        endPage = 4;
      }

      if (currentPage > totalPages - 3) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                handlePageChange(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - (maxPagesToShow - 2)) {
        pages.push(
          <PaginationItem key="end-ellipsis">{ellipsis}</PaginationItem>
        );
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

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
                  <SelectItem key={region.id} value={region.id.toString()}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center col-span-4">Loading...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center col-span-4 text-gray-500 mt-8">
            No projects found.
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>
                {renderPagination()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </>
  );
}
