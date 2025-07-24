import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { setRequestLocale } from "next-intl/server";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

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
      {/* Centered login panel */}
      <div className="flex flex-1 items-start justify-center mt-30">
        <div className="w-full max-w-lg">
          <LoginForm className="bg-transparent p-0 shadow-none" />
        </div>
      </div>
    </div>
  );
}
