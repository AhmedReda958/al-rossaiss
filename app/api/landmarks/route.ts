import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const regionId = searchParams.get("regionId");
    const cityId = searchParams.get("cityId");
    const landmarkType = searchParams.get("type");

    const skip = (page - 1) * pageSize;

    // Build where clause
    const where: {
      name?: { contains: string; mode: "insensitive" };
      type?: string;
      cityId?: number;
      city?: { regionId: number };
    } = {};

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (landmarkType && landmarkType !== "all") {
      where.type = landmarkType;
    }

    if (cityId && cityId !== "all") {
      where.cityId = parseInt(cityId);
    } else if (regionId && regionId !== "all") {
      where.city = {
        regionId: parseInt(regionId),
      };
    }

    const [landmarks, total] = await Promise.all([
      prisma.landmark.findMany({
        where,
        include: {
          city: {
            include: {
              region: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.landmark.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    return NextResponse.json({
      landmarks,
      total,
      totalPages,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    console.error("Error fetching landmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch landmarks" },
      { status: 500 }
    );
  }
}
