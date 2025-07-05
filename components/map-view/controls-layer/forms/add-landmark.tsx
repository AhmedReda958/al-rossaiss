"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMapStore } from "@/lib/store";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LANDMARK_TYPES, LandmarkType } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Landmark name must be at least 2 characters",
  }),
  type: z.enum(Object.values(LANDMARK_TYPES) as [string, ...string[]], {
    required_error: "Please select a landmark type",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AddLandmarkForm = () => {
  const router = useRouter();
  const {
    selectedCityId,
    setMapType,
    setLandmarkTypeInDrawing,
    setInstructions,
  } = useMapStore();
  const { coordinates, resetMarkers, setIsDrawingMode } =
    usePolygonMarkerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: LANDMARK_TYPES.LANDMARK,
    },
  });

  useEffect(() => {
    if (selectedCityId) {
      setIsDrawingMode(true);
      setLandmarkTypeInDrawing(LANDMARK_TYPES.LANDMARK);
      setInstructions("Click on the map to set the landmark location");
    }
  }, [
    selectedCityId,
    setIsDrawingMode,
    setLandmarkTypeInDrawing,
    setInstructions,
  ]);

  // Watch for changes in the landmark type field and update the drawing mode
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type" && value.type) {
        setLandmarkTypeInDrawing(value.type as LandmarkType);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, setLandmarkTypeInDrawing]);

  // Update instructions when coordinates change
  useEffect(() => {
    if (coordinates.length === 2) {
      setInstructions("Landmark location set! Ready to save.");
    }
  }, [coordinates, setInstructions]);

  const onSubmit = async (data: FormValues) => {
    if (!selectedCityId || coordinates.length !== 2) {
      console.error("Missing required data:", {
        selectedCityId,
        coordinates,
      });
      return;
    }

    setIsSubmitting(true);
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
      form.reset();
      resetMarkers();
      setIsDrawingMode(false);
      setLandmarkTypeInDrawing(null);
      setInstructions(null);
      setMapType("default");

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating landmark:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    form.reset();
    resetMarkers();
    setIsDrawingMode(false);
    setLandmarkTypeInDrawing(null);
    setInstructions(null);
    setMapType("default");
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Add Landmark</h2>
        <p className="text-xs text-muted mb-1">
          Fill in the landmark details below.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Landmark Name</Label>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder="Enter landmark name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <Label>Landmark Type</Label>
                <select className="w-full border rounded px-2 py-2" {...field}>
                  <option value="">Select landmark type</option>
                  {Object.entries(LANDMARK_TYPES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              className="w-[114px]"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-[114px]"
              disabled={isSubmitting || coordinates.length !== 2}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddLandmarkForm;
