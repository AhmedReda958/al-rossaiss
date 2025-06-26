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
import { City } from "@/app/types";
import { Pencil, Trash2, Map, LayoutGrid } from "lucide-react";
import Link from "next/link";

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  const projectCount = city?.region?._count?.projects ?? 0;

  return (
    <Card className="shadow-md p-3 gap-2">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={city.image || "/map.jpg"}
            alt={city.name}
            fill
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{city.name}</CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/dashboard/cities/edit/${city.id}`}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="py-2 ps-0 pe-2 flex justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Map className="h-5 w-5 text-primary" />
          <span>Region: </span>
          <span className="font-semibold">{city?.region?.name ?? "N/A"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <span>
            Projects: <span className="font-semibold">{projectCount}</span>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
