"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
    image: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => {
          if (!file) return true; // Optional field
          return file.size <= 5 * 1024 * 1024; // 5MB limit
        },
        {
          message: "Image size must be less than 5MB",
        }
      ),
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

  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file); // Update form value

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("nameAr", data.nameAr);
      formData.append("type", data.type);
      formData.append(
        "coordinates",
        JSON.stringify({
          x: coordinates[0],
          y: coordinates[1],
        })
      );

      // Only append image if it's a landmark type and image is provided
      if (data.type === LANDMARK_TYPES.LANDMARK && data.image) {
        formData.append("image", data.image);
      }

      const response = await fetch(`/api/cities/${selectedCityId}/landmarks`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create landmark");
      }

      // Reset form and state
      form.reset();
      setImagePreview(null);
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
    setImagePreview(null);
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
          />
          {/* Show image upload field only for landmark type */}
          {form.watch("type") === LANDMARK_TYPES.LANDMARK && (
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <div className="border rounded-lg px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Image
                        src="/icons/image-icon.svg"
                        alt="Upload"
                        width={44}
                        height={44}
                        className="w-14 h-14 rounded-[6px]"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41Ii8+PHBvbHlsaW5lIHBvaW50cz0iMjEgMTUgMTYgMTAgNSAyMSIvPjwvc3ZnPg==";
                        }}
                      />
                      <div className="w-fit">
                        <h3 className="text-sm font-medium">
                          {t("landmarkImage")}
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
                    {imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview}
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
          )}{" "}
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
