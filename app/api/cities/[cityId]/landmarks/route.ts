import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LandmarkType } from "@/lib/constants";
import { put } from "@vercel/blob";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId: cityIdParam } = await params;
    const cityId = parseInt(cityIdParam);
    const landmarks = await prisma.landmark.findMany({
      where: { cityId },
    });

    return NextResponse.json(landmarks);
  } catch (error) {
    console.error("Error fetching landmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch landmarks" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId: cityIdParam } = await params;
    const cityId = parseInt(cityIdParam);
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const nameAr = formData.get("nameAr") as string;
    const type = formData.get("type") as LandmarkType;
    const coordinates = JSON.parse(formData.get("coordinates") as string);
    const image = formData.get("image") as File | null;

    if (!name || !nameAr || !type || !coordinates) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      // Handle file upload to Vercel Blob
      const fileExtension = image.name.split(".").pop();
      const filename = `landmarks/${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${fileExtension}`;

      const blob = await put(filename, image, {
        access: "public",
      });

      imageUrl = blob.url;
    }

    const landmark = await prisma.landmark.create({
      data: {
        name,
        nameAr,
        type,
        image: imageUrl,
        coordinates,
        cityId,
      },
    });

    return NextResponse.json(landmark);
  } catch (error) {
    console.error("Error creating landmark:", error);
    return NextResponse.json(
      { error: "Failed to create landmark" },
      { status: 500 }
    );
  }
}
