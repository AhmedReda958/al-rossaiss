import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        city: {
          include: {
            region: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const nameAr = formData.get("nameAr") as string;
    const cityId = formData.get("cityId") as string;
    const unitType = formData.get("unitType") as string;
    const space = formData.get("space") as string;
    const unitsCount = formData.get("unitsCount") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;
    const descriptionAr = formData.get("descriptionAr") as string;
    const image = formData.get("image") as File | string;
    const labelDirection = formData.get("labelDirection") as string;
    const soldOut = formData.get("soldOut") as string;
    const points = formData.get("points") as string;

    const updateData: {
      name: string;
      nameAr: string;
      cityId: number;
      unitType: string;
      space: number;
      unitsCount: number;
      url: string | null;
      description: string | null;
      descriptionAr: string | null;
      labelDirection: string;
      soldOut: boolean;
      points: number[];
      image?: string;
    } = {
      name,
      nameAr,
      cityId: parseInt(cityId),
      unitType,
      space: parseFloat(space),
      unitsCount: parseInt(unitsCount),
      url: url || null,
      description: description || null,
      descriptionAr: descriptionAr || null,
      labelDirection,
      soldOut: soldOut === "true",
      points: JSON.parse(points),
    };

    if (image && typeof image !== "string") {
      const fileExtension = image.name.split(".").pop();
      const filename = `projects/${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${fileExtension}`;

      const blob = await put(filename, image, {
        access: "public",
      });

      updateData.image = blob.url;
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = parseInt(id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { error: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete the project
    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
