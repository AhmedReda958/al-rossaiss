import { UNIT_TYPES } from "@/lib/constants";

export type Region = {
  id: string;
  name: string;
  key: string;
  lat: number;
  lng: number;
  zoom: number;
  _count?: {
    projects: number;
  };
};

export type City = {
  id: number;
  name: string;
  image: string;
  labelDirection: "up" | "down" | "left" | "right";
  points: number[];
  regionId: string;
  region?: Region;
};

export type CitiesApiResponse = {
  cities: City[];
  total: number;
  totalPages: number;
};

export type RegionApiResponse = {
  id: number;
  name: string;
}[];

export type Project = {
  id: number;
  name: string;
  description?: string | null;
  image?: string | null;
  labelDirection?: string | null;
  points: number[];
  cityId: number;
  city?: {
    id: number;
    name: string;
    region?: {
      id: number;
      name: string;
    } | null;
  } | null;
  unitType: (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES];
  soldOut: boolean;
  space: number;
  unitsCount: number;
  url?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectsApiResponse = {
  projects: Project[];
  total: number;
  totalPages: number;
};
