import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId } = await params;
    const cityIdNum = parseInt(cityId, 10);
    if (isNaN(cityIdNum)) {
      return NextResponse.json({ error: "Invalid city ID" }, { status: 400 });
    }

    const city = await prisma.city.findUnique({
      where: {
        id: cityIdNum,
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
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId } = await params;
    const cityIdNum = parseInt(cityId, 10);
    if (isNaN(cityIdNum)) {
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
      const fileExtension = image.name.split('.').pop();
      const filename = `cities/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
      
      const blob = await put(filename, image, {
        access: 'public',
      });
      
      updateData.image = blob.url;
    }

    const updatedCity = await prisma.city.update({
      where: { id: cityIdNum },
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ cityId: string }> }
) {
  try {
    const { cityId } = await params;
    const cityIdNum = parseInt(cityId, 10);
    
    if (isNaN(cityIdNum)) {
      return NextResponse.json(
        { error: "Invalid city ID" },
        { status: 400 }
      );
    }

    // Check if the city exists
    const existingCity = await prisma.city.findUnique({
      where: { id: cityIdNum },
      include: {
        _count: {
          select: {
            projects: true,
            landmarks: true,
          },
        },
      },
    });

    if (!existingCity) {
      return NextResponse.json(
        { error: "City not found" },
        { status: 404 }
      );
    }

    // Delete related projects and landmarks first (cascade delete)
    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Delete projects associated with this city
      await tx.project.deleteMany({
        where: { cityId: cityIdNum },
      });

      // Delete landmarks associated with this city
      await tx.landmark.deleteMany({
        where: { cityId: cityIdNum },
      });

      // Delete the city
      await tx.city.delete({
        where: { id: cityIdNum },
      });
    });

    return NextResponse.json(
      { 
        message: "City and all related data deleted successfully",
        deletedCounts: {
          projects: existingCity._count.projects,
          landmarks: existingCity._count.landmarks,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting city:", error);
    return NextResponse.json(
      { error: "Failed to delete city" },
      { status: 500 }
    );
  }
}
