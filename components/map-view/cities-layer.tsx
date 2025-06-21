"use client";

import React from "react";
import { Group } from "react-konva";
import { useMapStore, City } from "@/lib/store";
import Polygon from "@/components/map-view/polygon/polygon";
import { CityPolygon } from "@/lib/store/polygon-marker-store";

const mapCityToCityPolygon = (city: City): CityPolygon => {
  let direction = city.labelDirection;
  if (direction === "top") {
    direction = "up";
  } else if (direction === "bottom") {
    direction = "down";
  }

  return {
    id: String(city.id),
    name: city.name,
    points: city.points,
    regionId: String(city.regionId),
    labelDirection: direction as CityPolygon["labelDirection"],
  };
};

const CitiesLayer = () => {
  const { cities } = useMapStore();

  if (!cities.length) {
    return null;
  }

  return (
    <Group>
      {cities.map((city) => (
        <Polygon key={city.id} polygon={mapCityToCityPolygon(city)} />
      ))}
    </Group>
  );
};

export default CitiesLayer;
