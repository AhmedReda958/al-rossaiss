import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const landmarkId = parseInt(await params.id);

    if (isNaN(landmarkId)) {
      return NextResponse.json(
        { error: "Invalid landmark ID" },
        { status: 400 }
      );
    }

    // Check if landmark exists
    const existingLandmark = await prisma.landmark.findUnique({
      where: { id: landmarkId },
    });

    if (!existingLandmark) {
      return NextResponse.json(
        { error: "Landmark not found" },
        { status: 404 }
      );
    }

    // Delete the landmark
    await prisma.landmark.delete({
      where: { id: landmarkId },
    });

    return NextResponse.json({ message: "Landmark deleted successfully" });
  } catch (error) {
    console.error("Error deleting landmark:", error);
    return NextResponse.json(
      { error: "Failed to delete landmark" },
      { status: 500 }
    );
  }
}
