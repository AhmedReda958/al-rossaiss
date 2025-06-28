"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Project } from "@/app/types";
import { Pencil, Trash2, Map, Landmark, Home, Ruler } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  onDelete?: () => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const router = useRouter();

  return (
    <Card
      className="shadow-md p-3 gap-2"
      onClick={() => {
        router.push(`/dashboard/projects/${project.id}`);
      }}
    >
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={project.image || "/logo.svg"}
            alt={project.name}
            fill
            objectFit="cover"
            className="rounded-lg"
          />
          {project.soldOut && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">Sold Out</Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link
                href={`/dashboard/projects/edit/${project.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) {
                  onDelete();
                }
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Home className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium capitalize">
              {project.unitType}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Ruler className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{project.space} m²</span>
          </div>
        </div>
        <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
      </CardContent>
      <CardFooter className="py-2 ps-0 pe-2 flex justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Landmark className="h-5 w-5 text-primary" />
          <span>City: </span>
          <span className="font-semibold">{project.city?.name ?? "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Map className="h-5 w-5 text-primary" />
          <span>Region: </span>
          <span className="font-semibold">
            {project.city?.region?.name ?? "N/A"}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
