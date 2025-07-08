import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { LandmarkType } from "@/lib/constants";

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
    const data = await request.json();

    const landmark = await prisma.landmark.create({
      data: {
        name: data.name,
        nameAr: data.nameAr,
        type: data.type as LandmarkType,
        coordinates: data.coordinates,
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
