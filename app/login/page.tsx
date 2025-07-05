import Image from "next/image";
import { LoginForm } from "@/components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - Al-Rossais Admin",
  description: "Login to access the Al-Rossais admin dashboard",
};

export default function LoginPage() {
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
          <div className="mb-6 ">
            <h1 className="text-2xl font-bold mb-3 text-black">
              Admin Login Panel
            </h1>
            <p className="text-xs text-[#7c7c7c]">
              Welcome back! Please log in to access the Al Rossais admin
              dashboard, manage projects, update content, and keep your platform
              running smoothly and securely.
            </p>
          </div>
          <LoginForm className="bg-transparent p-0 shadow-none" />
        </div>
      </div>
    </div>
  );
}
