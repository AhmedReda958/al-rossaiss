import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { put } from "@vercel/blob";

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
  const includeProject = searchParams.get("includeProject")
    ? parseInt(searchParams.get("includeProject")!)
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
  
  // Fetch the main projects based on pagination and filters
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

  // If includeProject is specified, ensure it's included in the results
  if (includeProject) {
    const projectExists = projects.some(p => p.id === includeProject);
    if (!projectExists) {
      const specificProject = await prisma.project.findUnique({
        where: { id: includeProject },
        include: {
          city: {
            include: {
              region: true,
            },
          },
        },
      });
      
      if (specificProject) {
        // Add the specific project to the beginning of the results
        projects.unshift(specificProject);
        // Remove the last project to maintain page size
        if (projects.length > pageSize) {
          projects.pop();
        }
      }
    }
  }

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
      // Handle file upload to Vercel Blob
      const fileExtension = image.name.split('.').pop();
      const filename = `projects/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
      
      const blob = await put(filename, image, {
        access: 'public',
      });
      
      imageUrl = blob.url;
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
