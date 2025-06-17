"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form className={`flex flex-col gap-4 ${className || ""}`} {...props}>
      <Input type="email" placeholder="E-Mail" required className="bg-white" />
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
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
      <Button type="submit" size="lg" className="mt-2">
        Login
      </Button>
    </form>
  );
}
