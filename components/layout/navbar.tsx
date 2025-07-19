"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import HomeIcon from "@/svgs/home";
import CityIcon from "@/svgs/city";
import BoxIcon from "@/svgs/box";
import LandMarkIcon from "@/svgs/landmark";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("Navigation");
  const router = useRouter();

  // Get current locale from pathname
  const currentLocale = pathname.split("/")[1] || "en";
  const isArabic = currentLocale === "ar";

  // Function to get navigation links with translations
  const getNavigationLinks = () => [
    { name: t("home"), href: `/${currentLocale}/dashboard`, icon: HomeIcon },
    {
      name: t("cities"),
      href: `/${currentLocale}/dashboard/cities`,
      icon: CityIcon,
    },
    {
      name: t("projects"),
      href: `/${currentLocale}/dashboard/projects`,
      icon: BoxIcon,
    },
    {
      name: t("landmarks"),
      href: `/${currentLocale}/dashboard/landmarks`,
      icon: LandMarkIcon,
    },
  ];

  const navigationLinks = getNavigationLinks();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const switchLanguage = () => {
    const newLocale = isArabic ? "en" : "ar";
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const newPath = `/${newLocale}/${pathWithoutLocale}`;
    router.push(newPath);
  };

  const handleLogout = () => {
    // Clear the auth_token cookie
    document.cookie =
      "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Redirect to login page
    router.push(`/${currentLocale}/login`);
  };

  return (
    <nav className="container bg-white mx-auto mt-8 mb-8 px-5 rounded-lg">
      <div className="flex justify-between md:justify-start items-center gap-16 h-16">
        {/* Logo */}
        <Link
          href={`/${currentLocale}`}
          className="flex items-center space-x-2"
        >
          <Image
            src="/logo.svg"
            alt="Al Rossais Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>{" "}
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 flex-1">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 hover:text-primary",
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <IconComponent className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
        {/* Language Toggle Button and Logout */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={switchLanguage}>
            {isArabic ? "English" : "العربية"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            {t("logout")}
            <LogOutIcon className="ml-1 w-4 h-4" />
          </Button>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Language Toggle */}
          <Button variant="ghost" size="sm" onClick={switchLanguage}>
            {isArabic ? "English" : "العربية"}
          </Button>
          {/* Mobile Logout Button */}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            {t("logout")}
            <LogOutIcon className="ml-1 w-4 h-4" />
          </Button>
          <button
            type="button"
            onClick={toggleMenu}
            className="text-muted-foreground hover:text-primary focus:outline-none focus:text-primary"
            aria-label={"toggleMenu"}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>{" "}
      {/* Mobile Navigation Menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1">
          {navigationLinks.map((link) => {
            const isActive = pathname === link.href;
            const IconComponent = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 text-base font-medium transition-colors duration-200",
                  isActive
                    ? "text-primary font-bold bg-accent border-l-4 border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-accent"
                )}
              >
                <IconComponent className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
