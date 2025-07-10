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
  FormDescription,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePolygonMarkerStore } from "@/lib/store/polygon-marker-store";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { UNIT_TYPES } from "@/lib/constants";
import ArrowUp from "@/svgs/arrow-up";
import ArrowDown from "@/svgs/arrow-down";
import ArrowLeft from "@/svgs/arrow-left";
import ArrowRight from "@/svgs/arrow-right";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import DrawingControls from "../drawing-controls";

// Define form schema function that takes translation function
const createFormSchema = (t: (key: string) => string) =>
  z.object({
    cityId: z.string().min(1, { message: t("cityRequired") }),
    name: z.string().min(2, {
      message: t("projectNameRequired"),
    }),
    nameAr: z.string().min(2, {
      message: t("projectNameArRequired"),
    }),
    unitType: z.enum(Object.values(UNIT_TYPES) as [string, ...string[]]),
    space: z.number().min(1, { message: t("spaceRequired") }),
    unitsCount: z.number().min(1, { message: t("unitsRequired") }),
    url: z
      .string()
      .url({ message: t("validURLRequired") })
      .optional()
      .or(z.literal("")),
    image: z.instanceof(File).or(z.string()).optional(),
    description: z.string().optional(),
    descriptionAr: z.string().optional(),
    labelDirection: z.enum(["up", "down", "left", "right"]),
    soldOut: z.boolean(),
  });

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

const AddProjectForm: React.FC = () => {
  const {
    selectedRegion,
    selectedCity,
    setInstructions,
    setSelectedCity,
    editingProject: project,
    setSelectedRegion,
    setSelectedCityId,
  } = useMapStore();
  const router = useRouter();
  const t = useTranslations("Projects");
  const tCommon = useTranslations("Common");
  const tInstructions = useTranslations("Instructions");

  const isEditMode = !!project;
  const [cityImagePreview, setCityImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

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
      cityId: project?.cityId?.toString() || selectedCity || "",
      name: project?.name || "",
      nameAr: project?.nameAr || "",
      unitType: project?.unitType || UNIT_TYPES.APARTMENT,
      space: project?.space || 0,
      unitsCount: project?.unitsCount || 0,
      url: project?.url || "",
      description: project?.description || "",
      descriptionAr: project?.descriptionAr || "",
      image: project?.image || undefined,
      labelDirection:
        (project?.labelDirection as "up" | "down" | "left" | "right") || "up",
      soldOut: project?.soldOut || false,
    },
  });

  // Set image preview if project has image
  useEffect(() => {
    if (project?.image) {
      setCityImagePreview(project.image);
    }
  }, [project?.image]);

  // Set up edit mode data
  useEffect(() => {
    if (isEditMode && project) {
      // Only set region and city if they're not already set (to avoid triggering fetches)
      if (project.city?.region && !selectedRegion) {
        setSelectedRegion(project.city.region.id.toString());
      }
      if (project.city && !selectedCity) {
        setSelectedCity(project.city.id.toString());
        setSelectedCityId(project.city.id);
      }

      // Set polygon points if they exist
      if (project.points) {
        setPointsFromFlatArray(project.points);
      }

      setIsDrawingMode(true);
      setInstructions(tInstructions("editProjectPolygon"));
    } else {
      // Reset for add mode
      if (selectedRegion && selectedCity) {
        setInstructions(tInstructions("drawProjectPolygon"));
      } else {
        setIsDrawingMode(false);
        setInstructions(
          !selectedRegion
            ? tInstructions("selectRegionForProject")
            : tInstructions("selectCityForProject")
        );
      }
    }

    return () => {
      setIsDrawingMode(false);
      setInstructions(null);
    };
  }, [
    isEditMode,
    project,
    selectedRegion,
    selectedCity,
    setIsDrawingMode,
    setInstructions,
    setSelectedRegion,
    setSelectedCity,
    setSelectedCityId,
    setPointsFromFlatArray,
    tInstructions,
  ]);

  // Fetch cities for the selected region
  useEffect(() => {
    if (!selectedRegion) return;
    const fetchCities = async () => {
      const res = await fetch(`/api/cities/region/${selectedRegion}`);
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      } else {
        setCities([]);
      }
    };
    fetchCities();
  }, [selectedRegion]);

  // Set cityId in form when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      form.setValue("cityId", selectedCity);
    }
  }, [selectedCity, form]);

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
    const regionForSubmit = isEditMode
      ? project?.city?.region?.id?.toString()
      : selectedRegion;
    const cityForSubmit = isEditMode
      ? project?.city?.id?.toString()
      : selectedCity;

    if (!regionForSubmit) {
      toast.error(tCommon("selectRegionFirst"));
      return;
    }
    if (!cityForSubmit) {
      toast.error(tCommon("selectCityFirst"));
      return;
    }
    if (currentPoints.length < 3) {
      toast.error(tCommon("needThreePoints"));
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("nameAr", values.nameAr);
      formData.append("cityId", values.cityId);
      formData.append("unitType", values.unitType);
      formData.append("space", String(values.space));
      formData.append("unitsCount", String(values.unitsCount));
      if (values.url) formData.append("url", values.url);
      if (values.description)
        formData.append("description", values.description);
      if (values.descriptionAr)
        formData.append("descriptionAr", values.descriptionAr);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      formData.append("labelDirection", values.labelDirection);
      formData.append("soldOut", String(values.soldOut));
      formData.append(
        "points",
        JSON.stringify(pointsToFlatArray(currentPoints))
      );

      const url = isEditMode ? `/api/projects/${project.id}` : "/api/projects";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        toast.success(
          isEditMode
            ? tCommon("projectUpdatedSuccess")
            : tCommon("projectCreatedSuccess")
        );
        clearCurrentPoints();
        setIsDrawingMode(false);
        router.push("/dashboard/projects");
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
    router.push("/dashboard/projects");
  };

  // Only show form if both region and city are selected, or if in edit mode
  if (!isEditMode && (!selectedRegion || !selectedCity)) return null;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          {isEditMode ? t("editProject") : t("addProject")}
        </h2>
        <p className="text-xs text-muted mb-1">
          {isEditMode ? t("editProjectPolygon") : t("drawProjectPolygon")}
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <Label>{tCommon("city")}</Label>
                <select
                  className="w-full border rounded px-2 py-2"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setSelectedCity(e.target.value);
                  }}
                  value={field.value}
                >
                  <option value="">{t("selectCity")}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>{t("projectNameEn")}</Label>
                <FormControl>
                  <Input className="w-full" {...field} />
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
                <Label>{t("projectNameAr")}</Label>
                <FormControl>
                  <Input className="w-full" dir="rtl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitType"
            render={({ field }) => (
              <FormItem>
                <Label>{t("unitType")}</Label>
                <select className="w-full border rounded px-2 py-2" {...field}>
                  {Object.entries(UNIT_TYPES).map(([key, value]) => (
                    <option key={key} value={value}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="space"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <Label>{t("space")}</Label>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder={t("enterSpaceInSquareMeters")}
                    className="w-full"
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitsCount"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <Label>{t("numberOfUnits")}</Label>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder={t("enterNumberOfUnits")}
                    className="w-full"
                    onChange={(e) => onChange(parseInt(e.target.value, 10))}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <Label>{t("projectWebsiteURL")}</Label>
                <FormControl>
                  <Input
                    type="url"
                    placeholder={t("urlPlaceholder")}
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {t("optionalWebsiteDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                        {t("uploadProjectImage")}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <Label>{t("descriptionEn")}</Label>
                <FormControl>
                  <Textarea
                    placeholder={t("descriptionPlaceholder")}
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
            name="descriptionAr"
            render={({ field }) => (
              <FormItem>
                <Label>{t("descriptionAr")}</Label>
                <FormControl>
                  <Textarea
                    placeholder={t("descriptionArPlaceholder")}
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
            name="labelDirection"
            render={({ field }) => (
              <FormItem>
                <Label>{t("labelDirection")}</Label>
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

          <FormField
            control={form.control}
            name="soldOut"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <Label>{t("soldOut")}</Label>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Drawing Controls */}
          {((selectedRegion && selectedCity) || isEditMode) && (
            <div className="border-t pt-4">
              <DrawingControls
                translationNamespace="Projects"
                showWhenReady={true}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              className="w-[114px]"
              onClick={onCancel}
              type="button"
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" className="w-[114px]" disabled={isSubmitting}>
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

export default AddProjectForm;
