import { UNIT_TYPES } from "@/lib/constants";

export type Region = {
  id: string;
  name: string;
  nameAr?: string;
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
  nameAr?: string;
  image: string;
  labelDirection: "up" | "down" | "left" | "right";
  points: number[];
  regionId: string;
  region?: Region;
  _count?: {
    projects: number;
  };
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

export type Landmark = {
  id: number;
  name: string;
  nameAr?: string;
  type: string;
  coordinates: { lat: number; lng: number };
  cityId: number;
  city?: {
    id: number;
    name: string;
    nameAr?: string;
    region?: {
      id: number;
      name: string;
      nameAr?: string;
    } | null;
  } | null;
  createdAt: string;
  updatedAt: string;
};

export type LandmarksApiResponse = {
  landmarks: Landmark[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type Project = {
  id: number;
  name: string;
  nameAr?: string;
  description?: string | null;
  descriptionAr?: string | null;
  image?: string | null;
  logo?: string | null;
  labelDirection?: string | null;
  points: number[];
  cityId: number;
  city?: {
    id: number;
    name: string;
    nameAr?: string;
    region?: {
      id: number;
      name: string;
      nameAr?: string;
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
