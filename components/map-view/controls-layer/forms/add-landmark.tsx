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
import { useTranslations } from "next-intl";

// Define form schema function that takes translation function
const createFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, {
      message: t("landmarkNameRequired"),
    }),
    nameAr: z.string().min(2, {
      message: t("landmarkNameArRequired"),
    }),
    type: z.enum(Object.values(LANDMARK_TYPES) as [string, ...string[]], {
      required_error: t("landmarkTypeRequired"),
    }),
  });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

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
  const t = useTranslations("Landmarks");
  const tCommon = useTranslations("Common");
  const tInstructions = useTranslations("Instructions");
  const tLandmarkTypes = useTranslations("LandmarkTypes");

  // Create schema with translations
  const formSchema = createFormSchema(t);

  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      type: LANDMARK_TYPES.LANDMARK,
    },
  });

  useEffect(() => {
    if (selectedCityId) {
      setIsDrawingMode(true);
      setLandmarkTypeInDrawing(LANDMARK_TYPES.LANDMARK);
      setInstructions(tInstructions("addLandmark"));
    }
  }, [
    selectedCityId,
    setIsDrawingMode,
    setLandmarkTypeInDrawing,
    setInstructions,
    tInstructions,
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
      setInstructions(tInstructions("landmarkLocationSet"));
    }
  }, [coordinates, setInstructions, tInstructions]);

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
      setMapType("main");

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
    setMapType("main");
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">{t("addLandmark")}</h2>
        <p className="text-xs text-muted mb-1">{t("fillLandmarkDetails")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>{t("landmarkNameEn")}</Label>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder={t("enterLandmarkName")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="nameAr"
            render={({ field }) => (
              <FormItem>
                <Label>{t("landmarkNameAr")}</Label>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder={t("enterLandmarkNameAr")}
                    dir="rtl"
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
                <Label>{t("landmarkType")}</Label>
                <select className="w-full border rounded px-2 py-2" {...field}>
                  <option value="">{t("selectLandmarkType")}</option>
                  {Object.entries(LANDMARK_TYPES).map(([key, value]) => (
                    <option key={value} value={value}>
                      {tLandmarkTypes(key)}
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
              {tCommon("cancel")}
            </Button>
            <Button
              type="submit"
              className="w-[114px]"
              disabled={isSubmitting || coordinates.length !== 2}
            >
              {isSubmitting ? tCommon("saving") : tCommon("save")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddLandmarkForm;
