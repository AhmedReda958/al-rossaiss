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

// Define form schema with Zod
const formSchema = z.object({
  cityId: z.string().min(1, { message: "City is required" }),
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters",
  }),
  unitType: z.enum(Object.values(UNIT_TYPES) as [string, ...string[]]),
  space: z.number().min(1, { message: "Space must be greater than 0" }),
  unitsCount: z
    .number()
    .min(1, { message: "Number of units must be greater than 0" }),
  url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  image: z.instanceof(File).or(z.string()).optional(),
  description: z.string().optional(),
  labelDirection: z.enum(["up", "down", "left", "right"]),
  soldOut: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const AddProjectForm: React.FC = () => {
  const { selectedRegion, selectedCity, setInstructions, setSelectedCity } =
    useMapStore();
  const router = useRouter();

  const [cityImagePreview, setCityImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);

  const {
    setIsDrawingMode,
    clearCurrentPoints,
    currentPoints,
    pointsToFlatArray,
  } = usePolygonMarkerStore();

  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityId: selectedCity || "",
      name: "",
      unitType: UNIT_TYPES.APARTMENT,
      space: 0,
      unitsCount: 1,
      url: "",
      description: "",
      image: undefined,
      labelDirection: "up",
      soldOut: false,
    },
  });

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

  useEffect(() => {
    if (selectedRegion && selectedCity) {
      setIsDrawingMode(true);
      setInstructions("Draw the project polygon on the city map.");
    } else {
      setIsDrawingMode(false);
      setInstructions(
        !selectedRegion
          ? "Please select a region on the map to start adding a project."
          : "Please select a city in the selected region."
      );
    }
    return () => {
      setIsDrawingMode(false);
      setInstructions(null);
    };
  }, [selectedRegion, selectedCity, setIsDrawingMode, setInstructions]);

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
    if (!selectedRegion) {
      alert("Please select a region on the map.");
      return;
    }
    if (!selectedCity) {
      alert("Please select a city in the selected region.");
      return;
    }
    if (currentPoints.length < 3) {
      alert("A polygon needs at least 3 points.");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("cityId", values.cityId);
      formData.append("unitType", values.unitType);
      formData.append("space", String(values.space));
      formData.append("unitsCount", String(values.unitsCount));
      if (values.url) formData.append("url", values.url);
      if (values.description)
        formData.append("description", values.description);
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }
      formData.append("labelDirection", values.labelDirection);
      formData.append("soldOut", String(values.soldOut));
      formData.append(
        "points",
        JSON.stringify(pointsToFlatArray(currentPoints))
      );

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Project created successfully!");
        clearCurrentPoints();
        setIsDrawingMode(false);
        router.push("/dashboard/projects");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    router.push("/dashboard/projects");
  };

  // Only show form if both region and city are selected
  if (!selectedRegion || !selectedCity) return null;

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Add Project</h2>
        <p className="text-xs text-muted mb-1">
          Draw the project polygon on the city map
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <Label>City</Label>
                <select
                  className="w-full border rounded px-2 py-2"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setSelectedCity(e.target.value);
                  }}
                  value={field.value}
                >
                  <option value="">Select a city</option>
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
                <Label>Project Name</Label>
                <FormControl>
                  <Input className="w-full" {...field} />
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
                <Label>Unit Type</Label>
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
                <Label>Space (m²)</Label>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter space in square meters"
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
                <Label>Number of Units</Label>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Enter number of units"
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
                <Label>Project Website URL</Label>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional link to the project&apos;s website or landing page
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
                        Upload Project Image
                      </h3>
                      <p className="text-xs text-muted">
                        Upload an image to represent your project (optional).
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
                        Upload
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
                <Label>Description</Label>
                <FormControl>
                  <Input
                    placeholder="Description (optional)"
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
            name="labelDirection"
            render={({ field }) => (
              <FormItem>
                <Label>Label Direction</Label>
                <ToggleGroup
                  type="single"
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  variant="outline"
                  className="text-primary"
                >
                  <ToggleGroupItem value="up" aria-label="Up">
                    <ArrowUp width={20} height={20} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="down" aria-label="Down">
                    <ArrowDown width={20} height={20} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="left" aria-label="Left">
                    <ArrowLeft width={20} height={20} />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Right">
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
                <Label>Sold Out</Label>
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

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              className="w-[114px]"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-[114px]" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AddProjectForm;
