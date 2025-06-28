import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "12", 10);
  const search = searchParams.get("search") || undefined;
  const cityId = searchParams.get("cityId")
    ? parseInt(searchParams.get("cityId")!)
    : undefined;
  const regionId = searchParams.get("regionId")
    ? parseInt(searchParams.get("regionId")!)
    : undefined;

  const where: Prisma.ProjectWhereInput = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (cityId) {
    where.cityId = cityId;
  }
  if (regionId) {
    where.city = { regionId };
  }

  const total = await prisma.project.count({ where });
  const totalPages = Math.ceil(total / pageSize);
  const projects = await prisma.project.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      city: {
        include: {
          region: true,
        },
      },
    },
  });

  return NextResponse.json({ projects, total, totalPages });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const labelDirection = formData.get("labelDirection") as string;
    const points = JSON.parse(formData.get("points") as string) as number[];
    const cityId = parseInt(formData.get("cityId") as string, 10);
    const image = formData.get("image") as File | null;
    const unitType = formData.get("unitType") as string;
    const soldOut = formData.get("soldOut") === "true";
    const space = parseFloat(formData.get("space") as string);
    const unitsCount = parseInt(formData.get("unitsCount") as string, 10);
    const url = formData.get("url") as string | null;

    if (
      !name ||
      !points ||
      !cityId ||
      !unitType ||
      !space ||
      isNaN(space) ||
      !unitsCount ||
      isNaN(unitsCount)
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      // Handle file upload
      const uploadsDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "projects"
      );
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
      imageUrl = `/uploads/projects/${filename}`;

      const buffer = Buffer.from(await image.arrayBuffer());
      await writeFile(imagePath, buffer);
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        image: imageUrl,
        labelDirection,
        points,
        cityId,
        unitType,
        soldOut,
        space,
        unitsCount,
        url,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
