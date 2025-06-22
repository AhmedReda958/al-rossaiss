export type Region = {
  id: string;
  name: string;
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
