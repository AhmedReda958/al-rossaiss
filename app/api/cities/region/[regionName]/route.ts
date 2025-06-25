import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const regionNameMapping: { [key: string]: string } = {
  western: "Western Region",
  eastern: "Eastern Region",
  northern: "Northern Region",
  southern: "Southern Region",
  central: "Central Region",
};

export async function GET(
  request: Request,
  { params }: { params: { regionName: string } }
) {
  try {
    const { regionName } = await params;

    const mappedRegionName = regionNameMapping[regionName];

    if (!mappedRegionName) {
      return NextResponse.json(
        { error: "Invalid region name" },
        { status: 400 }
      );
    }

    const region = await prisma.region.findUnique({
      where: { name: mappedRegionName },
    });

    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    const cities = await prisma.city.findMany({
      where: {
        regionId: region.id,
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error fetching cities by region:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities by region" },
      { status: 500 }
    );
  }
}
