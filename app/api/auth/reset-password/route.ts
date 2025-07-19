import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    console.log("Reset password attempt:", {
      token: token ? `${token.substring(0, 10)}...` : "missing",
      passwordProvided: !!password,
      passwordLength: password?.length || 0,
    });

    if (!token || !password) {
      console.log("Missing token or password");
      return NextResponse.json(
        { error: "Token and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log("Password too short:", password.length);
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    console.log("Looking for user with token:", token.substring(0, 10) + "...");
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    console.log("User lookup result:", {
      found: !!user,
      userId: user?.id,
      email: user?.email,
      tokenExpires: user?.resetPasswordExpires,
    });

    if (!user) {
      console.log("No valid user found with token");
      return NextResponse.json(
        { error: "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return NextResponse.json({
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
