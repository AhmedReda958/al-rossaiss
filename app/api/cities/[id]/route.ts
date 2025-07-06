import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cityId = parseInt(params.id);

    if (isNaN(cityId)) {
      return NextResponse.json(
        { error: "Invalid city ID" },
        { status: 400 }
      );
    }

    // Check if the city exists
    const existingCity = await prisma.city.findUnique({
      where: { id: cityId },
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

    // Check if the city has associated projects or landmarks
    if (existingCity._count.projects > 0 || existingCity._count.landmarks > 0) {
      return NextResponse.json(
        { 
          error: "Cannot delete city with associated projects or landmarks. Please remove them first.",
          details: {
            projects: existingCity._count.projects,
            landmarks: existingCity._count.landmarks,
          }
        },
        { status: 400 }
      );
    }

    // Delete the city
    await prisma.city.delete({
      where: { id: cityId },
    });

    return NextResponse.json(
      { message: "City deleted successfully" },
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
