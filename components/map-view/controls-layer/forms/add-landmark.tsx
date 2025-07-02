"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANDMARK_TYPES } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddLandmarkFormData {
  name: string;
  type: string;
}

const AddLandmarkForm = () => {
  const { selectedCityId, setMapType } = useMapStore();
  const { coordinates, resetMarkers, setIsDrawingMode } =
    usePolygonMarkerStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddLandmarkFormData>();

  useEffect(() => {
    if (selectedCityId) {
      setIsDrawingMode(true);
    }
  }, [selectedCityId]);

  const onSubmit = async (data: AddLandmarkFormData) => {
    if (!selectedCityId || coordinates.length !== 2) {
      console.error("Missing required data:", {
        selectedCityId,
        coordinates,
      });
      return;
    }

    try {
      const response = await fetch(`/api/cities/${selectedCityId}/landmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          coordinates: {
            x: coordinates[0],
            y: coordinates[1],
          },
          cityId: selectedCityId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create landmark");
      }

      // Reset form and state
      reset();
      resetMarkers();
      setIsDrawingMode(false);
      setMapType("default");
    } catch (error) {
      console.error("Error creating landmark:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Landmark Name</Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
          placeholder="Enter landmark name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Landmark Type</Label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={watch("type")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select landmark type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(LANDMARK_TYPES).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <span className="text-red-500 text-sm">{errors.type.message}</span>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          className="w-full"
          disabled={coordinates.length !== 2}
        >
          Add Landmark
        </Button>
        {coordinates.length !== 2 && (
          <p className="text-sm text-gray-500 mt-2">
            Click on the map to set the landmark location
          </p>
        )}
      </div>
    </form>
  );
};

export default AddLandmarkForm;
