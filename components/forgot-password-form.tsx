"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthRedirect } from "@/lib/hooks/use-auth";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const t = useTranslations("Auth");
  const pathname = usePathname();
  const { isLoading: authLoading } = useAuthRedirect();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: currentLocale }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("unexpectedError"));
      } else {
        setSuccess(data.message || t("resetLinkSent"));
        // Clear the form
        form.reset();
      }
    } catch {
      setError(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 ">
        <h1 className="text-2xl font-bold mb-3 text-black">
          {t("forgotPasswordTitle")}
        </h1>
        <p className="text-xs text-[#7c7c7c]">
          {t("forgotPasswordDescription")}
        </p>
      </div>
      <form
        className={`flex flex-col gap-4 ${className || ""}`}
        {...props}
        onSubmit={handleSubmit}
      >
        <Input
          name="email"
          type="email"
          placeholder={t("email")}
          required
          className="bg-white"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {success && <div className="text-green-500 text-sm">{success}</div>}
        <Button type="submit" size="lg" className="mt-2" disabled={loading}>
          {loading ? t("sendingResetLink") : t("sendResetLink")}
        </Button>
        <div className="text-center mt-4">
          <Link
            href={`/${currentLocale}/login`}
            className="text-sm text-primary hover:opacity-80 underline"
          >
            {t("backToLogin")}
          </Link>
        </div>
      </form>
    </div>
  );
}
