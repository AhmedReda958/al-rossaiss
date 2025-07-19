import { NextRequest, NextResponse } from "next/server";
import {
  verifyResendConfiguration,
  sendPasswordResetEmail,
} from "@/lib/email-service";

export async function GET() {
  try {
    const config = await verifyResendConfiguration();

    return NextResponse.json({
      configuration: config,
      environment: {
        hasApiKey: !!process.env.RESEND_API_KEY,
        hasFromEmail: !!process.env.RESEND_FROM_EMAIL,
        fromEmail: process.env.RESEND_FROM_EMAIL || "Not set",
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "Not set",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check configuration", details: error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, locale = "en" } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required for testing" },
        { status: 400 }
      );
    }

    // Send a test email
    const result = await sendPasswordResetEmail({
      to: email,
      resetToken: "test-token-123456789",
      locale,
    });

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? "Test email sent successfully"
        : "Failed to send test email",
      details: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send test email", details: error },
      { status: 500 }
    );
  }
}
