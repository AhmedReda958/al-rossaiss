import Image from "next/image";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { setRequestLocale } from "next-intl/server";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;

  // Enable static rendering
  setRequestLocale(locale);

  // Check if user is already authenticated
  const authenticated = await isAuthenticated();
  if (authenticated) {
    redirect(`/${locale}/dashboard`);
  }

  if (!token) {
    return (
      <div className="min-h-screen container mx-auto flex flex-col ">
        {/* Logo at the top left */}
        <div className="p-8">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={64}
            height={64}
            className="h-16 w-auto"
          />
        </div>
        {/* Centered error message */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg text-center">
            <h1 className="text-2xl font-bold mb-3 text-black">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-red-500 mb-4">
              The reset link is missing or invalid. Please request a new
              password reset.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto flex flex-col ">
      {/* Logo at the top left */}
      <div className="p-8">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={64}
          height={64}
          className="h-16 w-auto"
        />
      </div>
      {/* Centered reset password panel */}
      <div className="flex flex-1 items-start justify-center mt-30">
        <div className="w-full max-w-lg">
          <ResetPasswordForm
            token={token}
            className="bg-transparent p-0 shadow-none"
          />
        </div>
      </div>
    </div>
  );
}
