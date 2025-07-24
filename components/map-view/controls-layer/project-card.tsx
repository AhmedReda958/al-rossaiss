import React, { useState } from "react";
import Image from "next/image";
import { Project } from "./projects-list";
import { cn, getLocalizedName, getLocalizedText } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Grid2x2Icon,
  Building2Icon,
  Building,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isSelected = false,
  onClick,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("Common");
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Get localized names
  const projectName = getLocalizedName(project, currentLocale);
  const projectDescription = getLocalizedText(
    project.description || "",
    project.descriptionAr,
    currentLocale
  );
  const unitTypeName = getLocalizedText(
    project.unitType,
    project.unitTypeAr,
    currentLocale
  );
  return (
    <Card
      className={cn(
        "p-3 gap-2 cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "border-2 border-primary shadow-lg bg-primary/5"
      )}
      onClick={onClick}
    >
      <div className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={project.image || "/logo.svg"}
            alt={projectName}
            fill
            objectFit="cover"
            className="rounded-lg"
          />
          {project.soldOut && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">{t("soldOut")}</Badge>
            </div>
          )}
        </div>
      </div>

      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{projectName}</h3>
          </div>
          <div className="flex items-center gap-1 text-md font-thin text-primary">
            <Building2Icon className="h-4 w-4" />
            {unitTypeName}
          </div>
        </div>
      </div>

      <div className="mb-2 flex gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Building className="h-4 w-4 text-primary" strokeWidth={1.2} />
          <span className="font-normal text-accent-foreground">
            {t("units")}:
          </span>
          <span className="font-thin">{project.unitsCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <Grid2x2Icon className="h-4 w-4 text-primary" strokeWidth={1.2} />
          <span className="font-normal text-accent-foreground">
            {t("space")}:
          </span>
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
              {t("visitWebsite")}
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
            {t("showDetails")}
            <ChevronDown className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isExpanded && projectDescription && (
        <div>
          <p className="text-gray-500 my-2 leading-5 text-xs ">
            {projectDescription}
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
