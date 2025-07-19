"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface ResetPasswordFormProps
  extends React.ComponentPropsWithoutRef<"form"> {
  token: string;
}

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const t = useTranslations("Auth");
  const pathname = usePathname();
  const router = useRouter();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      form.elements.namedItem("confirmPassword") as HTMLInputElement
    )?.value;

    // Validate passwords
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"));
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("passwordResetError"));
      } else {
        setSuccess(data.message || t("passwordResetSuccess"));
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push(`/${currentLocale}/login`);
        }, 2000);
      }
    } catch {
      setError(t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold mb-3 text-black">
          {t("resetPasswordTitle")}
        </h1>
        <div className="text-green-500 text-sm mb-4">{success}</div>
        <p className="text-xs text-[#7c7c7c]">Redirecting to login page...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-6 ">
        <h1 className="text-2xl font-bold mb-3 text-black">
          {t("resetPasswordTitle")}
        </h1>
        <p className="text-xs text-[#7c7c7c]">
          {t("resetPasswordDescription")}
        </p>
      </div>
      <form
        className={`flex flex-col gap-4 ${className || ""}`}
        {...props}
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("newPassword")}
            required
            className="bg-white pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("confirmPassword")}
            required
            className="bg-white pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 focus:outline-none"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" size="lg" className="mt-2" disabled={loading}>
          {loading ? t("resettingPassword") : t("resetPasswordButton")}
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
