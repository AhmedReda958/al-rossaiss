import React, { useState } from "react";
import Image from "next/image";
import { Project } from "./projects-list";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Grid2x2Icon,
  SnowflakeIcon,
  HomeIcon,
  Building2Icon,
  Home,
  HotelIcon,
  DoorClosed,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { UNIT_TYPES } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onClick: () => void;
}

const UnitIcon = ({ icon: Icon }: { icon: LucideIcon }) => {
  return <Icon className="h-4 w-4 text-primary" strokeWidth={1.2} />;
};

const getUnitTypeIcon = (unitType: string) => {
  switch (unitType.toLowerCase()) {
    case UNIT_TYPES.VILLA:
      return <UnitIcon icon={HomeIcon} />;
    case UNIT_TYPES.APARTMENT:
      return <UnitIcon icon={Building2Icon} />;
    case UNIT_TYPES.TOWNHOUSE:
      return <UnitIcon icon={Home} />;
    case UNIT_TYPES.PENTHOUSE:
      return <UnitIcon icon={HotelIcon} />;
    case UNIT_TYPES.STUDIO:
      return <UnitIcon icon={DoorClosed} />;
    default:
      return <UnitIcon icon={HomeIcon} />;
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected = false,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Card
      className={cn(
        "p-3 gap-2 cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "border-1 border-primary"
      )}
      onClick={onClick}
    >
      <div className="p-0">
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
      </div>

      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{project.name}</h3>
          </div>
          <div className="flex items-center gap-1 text-md font-thin text-primary">
            {getUnitTypeIcon(project.unitType)}
            {project.unitType}
          </div>
        </div>
      </div>

      <div className="mb-2 flex gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <SnowflakeIcon className="h-4 w-4 text-primary" strokeWidth={1.2} />
          <span className="font-normal text-accent-foreground">Units:</span>
          <span className="font-thin">{project.unitsCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Grid2x2Icon className="h-4 w-4 text-primary" strokeWidth={1.2} />
          <span className="font-normal text-accent-foreground">Space:</span>
          <span className="font-thin">{project.space} m²</span>
        </div>
      </div>

      <div className="flex gap-2 *:font-bold">
        {project.url && (
          <Button
            variant="outline"
            className="flex-1  bg-transparent rounded-md "
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Visit Website
            </Link>
          </Button>
        )}
        {!isExpanded && (
          <Button
            variant={"outline"}
            className="flex-1 border-none bg-transparent hover:bg-transparent hover:text-primary"
            onClick={() => {
              setIsExpanded(true);
            }}
          >
            Read More
            <ChevronDown className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isExpanded && project.description && (
        <div>
          <p className="text-gray-500 my-2 leading-5 text-xs ">
            {project.description}
          </p>
          <div
            className="flex justify-center"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronUp className="w-4 h-4 text-primary cursor-pointer" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProjectCard;
