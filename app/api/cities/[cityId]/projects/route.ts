import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    const projects = await prisma.project.findMany({
      where: {
        cityId: cityIdNum,
      },
      include: {
        city: {
          include: {
            region: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching city projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
