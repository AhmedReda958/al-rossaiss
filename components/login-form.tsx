"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("Auth");
  const pathname = usePathname();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("loginFailed"));
      } else {
        // Redirect or show success
        window.location.href = `/${currentLocale}/dashboard`;
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
          {t("adminLoginPanel")}
        </h1>
        <p className="text-xs text-[#7c7c7c]">{t("welcomeBack")}</p>
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
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("password")}
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
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" size="lg" className="mt-2" disabled={loading}>
          {loading ? t("loggingIn") : t("login")}
        </Button>
        <div className="text-center mt-4">
          <Link
            href={`/${currentLocale}/forgot-password`}
            className="text-sm text-primary hover:opacity-80 underline"
          >
            {t("forgotPassword")}
          </Link>
        </div>
      </form>
    </div>
  );
}
