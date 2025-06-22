import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: { cityId: string } }
) {
  try {
    const cityId = parseInt(params.cityId, 10);
    if (isNaN(cityId)) {
      return NextResponse.json({ error: "Invalid city ID" }, { status: 400 });
    }

    const city = await prisma.city.findUnique({
      where: {
        id: cityId,
      },
      include: {
        region: true,
      },
    });

    if (!city) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }

    return NextResponse.json(city);
  } catch (error) {
    console.error("Error fetching city:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { cityId: string } }
) {
  try {
    const cityId = parseInt(params.cityId, 10);
    if (isNaN(cityId)) {
      return NextResponse.json({ error: "Invalid city ID" }, { status: 400 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const image = formData.get("image") as File | string;
    const labelDirection = formData.get("labelDirection") as string;
    const points = formData.get("points") as string;
    const regionId = formData.get("regionId") as string;

    const updateData: {
      name: string;
      labelDirection: string;
      points: number[];
      image?: string;
    } = {
      name,
      labelDirection,
      points: JSON.parse(points),
    };

    if (image && typeof image !== "string") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = Date.now() + image.name.replaceAll(" ", "_");
      const uploadDir = path.join(process.cwd(), "public", "uploads", "cities");

      await mkdir(uploadDir, { recursive: true });

      const imagePath = path.join(uploadDir, filename);

      await writeFile(imagePath, buffer);
      updateData.image = `/uploads/cities/${filename}`;
    }

    const updatedCity = await prisma.city.update({
      where: { id: cityId },
      data: {
        ...updateData,
        region: {
          connect: { id: parseInt(regionId, 10) },
        },
      },
    });

    return NextResponse.json(updatedCity);
  } catch (error) {
    console.error("Error updating city:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
