import { NextResponse } from "next/server";
import prisma, { safeExecute } from "@/lib/prisma";

export async function GET() {
  try {
    const regions = await safeExecute(() => prisma.region.findMany());
    return NextResponse.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { error: "Failed to fetch regions" },
      { status: 500 }
    );
  }
}
