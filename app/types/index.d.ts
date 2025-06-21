export type Region = {
  id: number;
  name: string;
  _count?: {
    projects: number;
  };
};

export type City = {
  id: number;
  name: string;
  image: string;
  region: Region;
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
