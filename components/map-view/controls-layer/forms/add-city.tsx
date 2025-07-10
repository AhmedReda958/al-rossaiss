"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useMapStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ArrowUp from "@/svgs/arrow-up";
import ArrowDown from "@/svgs/arrow-down";
import ArrowLeft from "@/svgs/arrow-left";
import ArrowRight from "@/svgs/arrow-right";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import DrawingControls from "../drawing-controls";

// Define form schema function that takes translation function
const createFormSchema = (t: (key: string) => string) =>
  z.object({
    cityName: z.string().min(2, {
      message: t("cityNameRequired"),
    }),
    cityNameAr: z.string().min(2, {
      message: t("cityNameArRequired"),
    }),
    cityImage: z
      .instanceof(File)
      .or(z.string())
      .refine((val) => val !== undefined && val !== null && val !== "", {
        message: t("cityImageRequired"),
      }),
    labelDirection: z.enum(["up", "down", "left", "right"]),
  });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

const AddCityForm: React.FC = () => {
  const {
    selectedRegion,
    setInstructions,
    setSelectedRegion,
    editingCity: city,
  } = useMapStore();
  const isEditMode = !!city;
  const router = useRouter();
  const t = useTranslations("Cities");
  const tCommon = useTranslations("Common");
  const tInstructions = useTranslations("Instructions");

  const [cityImagePreview, setCityImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    setIsDrawingMode,
    clearCurrentPoints,
    currentPoints,
    pointsToFlatArray,
    setPointsFromFlatArray,
  } = usePolygonMarkerStore();

  // Create schema with translations
  const formSchema = createFormSchema(t);

  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityName: city?.name || "",
      cityNameAr: city?.nameAr || "",
      cityImage: city?.image || undefined,
      labelDirection: city?.labelDirection || "up",
    },
  });

  useEffect(() => {
    if (city?.image) {
      setCityImagePreview(city.image);
    }
  }, [city?.image]);

  useEffect(() => {
    if (isEditMode && city) {
      if (city.points) {
        setPointsFromFlatArray(city.points);
      }
      setIsDrawingMode(true);
      setInstructions(tInstructions("editCityPolygon"));
      setSelectedRegion(city.regionId);
    } else {
      if (selectedRegion) {
        // Don't automatically start drawing mode for new cities, let user control it
        clearCurrentPoints();
        setInstructions(null);
      } else {
        setIsDrawingMode(false);
        setInstructions(tInstructions("selectRegionForCity"));
      }
    }
    return () => {
      setIsDrawingMode(false);
      setInstructions(null);
    };
  }, [
    isEditMode,
    city,
    selectedRegion,
    setIsDrawingMode,
    clearCurrentPoints,
    setInstructions,
    setPointsFromFlatArray,
    setSelectedRegion,
    tInstructions,
  ]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file); // Update form value

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setCityImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const regionForSubmit = isEditMode ? city?.regionId : selectedRegion;
    if (!regionForSubmit) {
      toast.error(tCommon("selectRegionFirst"));
      return;
    }

    if (currentPoints.length < 3) {
      toast.error(tCommon("needThreePoints"));
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.cityName);
      formData.append("nameAr", values.cityNameAr);
      if (values.cityImage instanceof File) {
        formData.append("image", values.cityImage);
      }
      formData.append("labelDirection", values.labelDirection);
      formData.append(
        "points",
        JSON.stringify(pointsToFlatArray(currentPoints))
      );
      formData.append("regionId", regionForSubmit);

      const url = isEditMode ? `/api/cities/${city.id}` : "/api/cities";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        toast.success(
          isEditMode
            ? tCommon("cityUpdatedSuccess")
            : tCommon("cityCreatedSuccess")
        );
        clearCurrentPoints();
        setIsDrawingMode(false);
        router.push("/dashboard/cities");
      } else {
        const errorData = await response.json();
        toast.error(`${tCommon("error")}: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      toast.error(tCommon("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    router.push("/dashboard/cities");
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          {isEditMode ? t("editCity") : t("addCity")}
        </h2>
        <p className="text-xs text-muted mb-1">{t("selectMarkType")}</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="cityName"
            render={({ field }) => (
              <FormItem>
                <Label>{t("cityNameEn")}</Label>
                <FormControl>
                  <Input
                    placeholder={t("cityNameEn")}
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cityNameAr"
            render={({ field }) => (
              <FormItem className="mt-4">
                <Label>{t("cityNameAr")}</Label>
                <FormControl>
                  <Input
                    placeholder={t("cityNameAr")}
                    className="w-full"
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
            name="cityImage"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <FormItem>
                <div className="border rounded-lg px-3 py-2.5 mt-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Image
                      src="/icons/image-icon.svg"
                      alt="Upload"
                      width={44}
                      height={44}
                      className="w-14 h-14 rounded-[6px]"
                      onError={(e) => {
                        // Fallback if image not found
                        e.currentTarget.src =
                          "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==";
                      }}
                    />

                    <div className="w-fit">
                      <h3 className="text-sm font-medium">
                        {t("uploadCityImage")}
                      </h3>
                      <p className="text-xs text-muted">
                        {t("uploadImageDescription")}
                      </p>
                    </div>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full text-base"
                      >
                        <Image
                          src="/icons/upload-icon.svg"
                          alt="Upload"
                          width={24}
                          height={24}
                        />
                        {tCommon("uploadImage")}
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, onChange)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        name={name}
                        ref={ref}
                        onBlur={onBlur}
                      />
                    </div>
                  </FormControl>
                  {cityImagePreview && (
                    <div className="mt-2">
                      <Image
                        src={cityImagePreview}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="max-w-full h-auto rounded-md"
                      />
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="labelDirection"
            render={({ field }) => (
              <FormItem className="mt-6 mb-4">
                <Label className="mb-2">{t("labelDirection")}</Label>
                <ToggleGroup
                  type="single"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  variant="outline"
                  className="text-primary"
                >
                  <ToggleGroupItem value="up" aria-label={tCommon("up")}>
                    <ArrowUp width={20} height={20} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="down" aria-label={tCommon("down")}>
                    <ArrowDown width={20} height={20} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="left" aria-label={tCommon("left")}>
                    <ArrowLeft width={20} height={20} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label={tCommon("right")}>
                    <ArrowRight width={20} height={20} />
                  </ToggleGroupItem>
                </ToggleGroup>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Drawing Controls */}
          {(selectedRegion || (isEditMode && city)) && (
            <div className="border-t pt-4">
              <DrawingControls
                translationNamespace="Cities"
                showWhenReady={true}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-8">
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
              disabled={
                isEditMode ? isSubmitting : !selectedRegion || isSubmitting
              }
            >
              {isSubmitting
                ? tCommon("saving")
                : isEditMode
                ? t("saveChanges")
                : tCommon("save")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddCityForm;
