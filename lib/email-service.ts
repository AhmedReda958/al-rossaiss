import { Resend } from "resend";
import {
  getPasswordResetEmailTemplate,
  type PasswordResetEmailData,
} from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendPasswordResetEmailProps {
  to: string;
  resetToken: string;
  userName?: string;
  locale?: string;
}

export async function sendPasswordResetEmail({
  to,
  resetToken,
  userName,
  locale = "en",
}: SendPasswordResetEmailProps) {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      throw new Error("RESEND_FROM_EMAIL environment variable is not set");
    }

    // Generate email content
    const emailData: PasswordResetEmailData = {
      email: to,
      resetToken,
      userName,
      locale,
    };

    const { subject, html, text } = getPasswordResetEmailTemplate(emailData);

    // Send email using Resend
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject,
      html,
      text,
      tags: [
        {
          name: "category",
          value: "password-reset",
        },
        {
          name: "locale",
          value: locale,
        },
      ],
    });

    // Log the full response for debugging
    console.log("Resend API Response:", JSON.stringify(result, null, 2));

    console.log("Password reset email sent successfully:", {
      id: result.data?.id,
      to,
      locale,
      error: result.error,
    });

    return {
      success: true,
      messageId: result.data?.id,
      message: "Password reset email sent successfully",
    };
  } catch (error) {
    console.error("Failed to send password reset email:", error);

    // Don't expose internal errors to the user
    return {
      success: false,
      error: "Failed to send reset email",
      details: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function verifyResendConfiguration() {
  try {
    if (!process.env.RESEND_API_KEY) {
      return {
        valid: false,
        error: "RESEND_API_KEY not configured",
      };
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      return {
        valid: false,
        error: "RESEND_FROM_EMAIL not configured",
      };
    }

    // Test the API key by checking domains (optional)
    // This is a light check that doesn't send an actual email
    const domains = await resend.domains.list();

    return {
      valid: true,
      message: "Resend configuration is valid",
      domainsCount: domains.data?.data?.length || 0,
    };
  } catch (error) {
    return {
      valid: false,
      error:
        error instanceof Error ? error.message : "Configuration check failed",
    };
  }
}
