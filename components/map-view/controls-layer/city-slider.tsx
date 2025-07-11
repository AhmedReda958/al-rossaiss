import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMapStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { getLocalizedName } from "@/lib/utils";

interface City {
  id: string;
  name: string;
  nameAr?: string;
  regionId: string;
  region: {
    id: string;
    name: string;
    nameAr?: string;
  };
}

interface CitiesResponse {
  cities: City[];
  total: number;
  totalPages: number;
}

const CitySlider = () => {
  const { setSelectedCity, selectedCity } = useMapStore();
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";
  const [cities, setCities] = React.useState<City[]>([]);

  React.useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch("/api/cities");
        const data: CitiesResponse = await response.json();
        setCities(data.cities);
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleCityClick = (cityId: string) => {
    setSelectedCity(cityId);
    router.push(`/dashboard/cities/${cityId}`);
  };

  if (!cities.length) return null;

  return (
    <Carousel
      id="city-slider"
      opts={{
        align: "start",
      }}
      className="max-w-lg min-w-md"
    >
      <CarouselContent className="-ml-4">
        {cities.map((city) => {
          const cityName = getLocalizedName(city, currentLocale);

          return (
            <CarouselItem key={city.id} className="pl-4 basis-1/4">
              <Button
                variant={selectedCity == city.id ? "default" : "outline"}
                onClick={() => handleCityClick(city.id)}
                className="w-full rounded-sm border-none"
              >
                {cityName}
              </Button>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CitySlider;
