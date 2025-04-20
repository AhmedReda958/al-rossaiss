"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface AddCityFormProps {
  onClose: () => void;
}

// Define form schema with Zod
const formSchema = z.object({
  cityName: z.string().min(2, {
    message: "City name must be at least 2 characters",
  }),
  cityImage: z
    .instanceof(File)
    .or(z.string())
    .refine((val) => val !== undefined, {
      message: "City image is required",
    }),
});

type FormValues = z.infer<typeof formSchema>;

const AddCityForm: React.FC<AddCityFormProps> = ({ onClose }) => {
  const { selectedRegion } = useMapStore();
  const [cityImagePreview, setCityImagePreview] = useState<string | null>(null);

  const { savedPolygons, editingPolygonId, finishPolygon, updatePolygon } =
    usePolygonMarkerStore();

  // Initialize react-hook-form with zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cityName: "",
      cityImage: undefined,
    },
  });

  // When a polygon is selected, update the form with its name
  useEffect(() => {
    if (editingPolygonId) {
      const polygon = savedPolygons.find((p) => p.id === editingPolygonId);
      if (polygon) {
        form.setValue("cityName", polygon.name);
      }
    }
  }, [editingPolygonId, savedPolygons, form]);

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

  const onSubmit = (values: FormValues) => {
    // Handle form submission
    console.log({
      region: selectedRegion,
      cityName: values.cityName,
      cityImage: values.cityImage,
      polygonId: editingPolygonId,
    });

    // If we're in editing mode, apply the name to the polygon
    if (editingPolygonId) {
      updatePolygon(editingPolygonId, { name: values.cityName });
    }

    finishPolygon(selectedRegion || "");

    onClose();
  };

  return (
    <div className="absolute left-4 top-20 z-20 bg-white rounded-lg shadow-md w-80">
      <ScrollArea className="p-4">
        <div className="mb-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Add City</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-muted mb-1">
            Select Mark Type and Pick it on City Map
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="cityName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="City Name"
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
              name="cityImage"
              render={({ field: { onChange, onBlur, name, ref } }) => (
                <FormItem>
                  <div className="border rounded-lg px-3 py-2.5 mt-3">
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
                          Upload City Image
                        </h3>
                        <p className="text-xs text-muted">
                          Upload stunning images of your city to highlight its
                          beauty and vibrance.
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

            <div className="flex justify-end gap-2 mt-3">
              <Button
                variant="ghost"
                className="w-[114px]"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-[114px]">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
};

export default AddCityForm;
