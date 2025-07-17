import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const regionNameMapping: { [key: string]: string } = {
  "Western Region": "western",
  "Eastern Region": "eastern",
  "Northern Region": "northern",
  "Southern Region": "southern",
  "Central Region": "central",
};

export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      include: {
        cities: {
          include: {
            _count: {
              select: { projects: true },
            },
          },
        },
      },
    });

    const regionCounts = regions.reduce((acc, region) => {
      const shortName = regionNameMapping[region.name];
      if (shortName) {
        // Sum up all projects from all cities in this region
        acc[shortName] = region.cities.reduce(
          (sum, city) => sum + city._count.projects,
          0
        );
      }
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(regionCounts);
  } catch (error) {
    console.error("Error fetching region counts:", error);
    return NextResponse.json(
      { error: "Failed to fetch region counts" },
      { status: 500 }
    );
  }
}
