import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
  // For now, just parse JSON body (no file upload yet)
  const body = await req.json();
  const { name, description, image, labelDirection, points, cityId } = body;
  if (!name || !points || !cityId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  const project = await prisma.project.create({
    data: {
      name,
      description,
      image: image || null,
      labelDirection,
      points: points as number[],
      cityId,
    },
  });
  return NextResponse.json({ project });
}
