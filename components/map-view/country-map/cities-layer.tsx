"use client";

import React from "react";
import { Group } from "react-konva";
import { useMapStore, City } from "@/lib/store";
import Polygon from "@/components/map-view/polygon/polygon";
import { CityPolygon } from "@/lib/store/polygon-marker-store";
import colors from "@/lib/colors";

const mapCityToCityPolygon = (city: City): CityPolygon => {
  let direction = city.labelDirection;
  if (direction === "up") {
    direction = "up";
  } else if (direction === "down") {
    direction = "down";
  } else if (direction === "left") {
    direction = "left";
  } else if (direction === "right") {
    direction = "right";
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
        <Polygon
          key={city.id}
          polygon={mapCityToCityPolygon(city)}
          type="city"
          fillColor={colors.primaryHover}
          strokeColor={colors.primary}
          labelColor={colors.primary_100}
        />
      ))}
    </Group>
  );
};

export default CitiesLayer;
