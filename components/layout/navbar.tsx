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

const navigationLinks = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Cities", href: "/dashboard/cities", icon: CityIcon },
  { name: "Projects", href: "/dashboard/projects", icon: BoxIcon },
  { name: "Landmarks", href: "/dashboard/landmarks", icon: LandMarkIcon },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="container bg-white mx-auto mt-8 mb-8 px-5 rounded-lg">
      <div className="flex justify-between md:justify-start items-center gap-16 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Al Rossais Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>{" "}
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
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
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="text-muted-foreground hover:text-primary focus:outline-none focus:text-primary"
            aria-label="Toggle menu"
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
