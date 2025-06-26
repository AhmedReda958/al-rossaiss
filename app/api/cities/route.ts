import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

const prisma = new PrismaClient();

const regionNameMapping: { [key: string]: string } = {
  western: "Western Region",
  eastern: "Eastern Region",
  northern: "Northern Region",
  southern: "Southern Region",
  central: "Central Region",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const labelDirection = formData.get("labelDirection") as string;
    const points = JSON.parse(formData.get("points") as string) as number[];
    const regionIdString = formData.get("regionId") as string;
    const image = formData.get("image") as File;

    if (!name || !labelDirection || !points || !regionIdString || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const regionName = regionNameMapping[regionIdString];
    if (!regionName) {
      return NextResponse.json({ error: "Invalid region ID" }, { status: 400 });
    }

    const region = await prisma.region.findUnique({
      where: { name: regionName },
    });

    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 });
    }

    // Handle file upload
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "cities");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Ignore error if directory already exists
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") {
        throw error;
      }
    }

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(image.name);
    const filename = `${uniqueSuffix}${fileExtension}`;
    const imagePath = path.join(uploadsDir, filename);
    const imageUrl = `/uploads/cities/${filename}`;

    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(imagePath, buffer);

    const newCity = await prisma.city.create({
      data: {
        name,
        labelDirection,
        points,
        regionId: region.id,
        image: imageUrl,
      },
    });

    return NextResponse.json(newCity, { status: 201 });
  } catch (error) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      { error: "Failed to create city" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const regionName = searchParams.get("region");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const where: Prisma.CityWhereInput = {};

    if (q) {
      where.name = {
        contains: q,
        mode: "insensitive",
      };
    }

    if (regionName && regionName !== "all") {
      const region = await prisma.region.findUnique({
        where: { name: regionName },
      });
      if (region) {
        where.regionId = region.id;
      } else {
        return NextResponse.json({ cities: [], total: 0, totalPages: 0 });
      }
    }

    const total = await prisma.city.count({ where });
    const totalPages = Math.ceil(total / limit);

    const cities = await prisma.city.findMany({
      where,
      include: {
        region: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { projects: true },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ cities, total, totalPages });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities" },
      { status: 500 }
    );
  }
}
