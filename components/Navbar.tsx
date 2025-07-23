"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Only apply fixed positioning on the home page and calculators page
  const isHomePage = pathname === "/" || pathname === "/calculators";

  const navItems = [
    { name: "Calculators", href: "/calculators" },
    { name: "Mutual MF Research", href: "/mutual-funds" },
    { name: "Goals", href: "/goals" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`${
        isHomePage ? "fixed top-4" : "sticky top-0"
      } left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl`}
    >
      <div className="flex justify-between items-center rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50 py-2 px-6 transition-all duration-300">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-black hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="SpringPad Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navItems.map((item, idx) => (
            <Link
              key={`nav-${idx}`}
              href={item.href}
              className="text-sm px-4 py-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100/80 transition-all duration-200 font-medium"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side (Theme + Auth) */}
        <div className="hidden md:flex items-center space-x-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100/80 transition-all duration-200 font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm px-5 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors text-gray-700"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden absolute top-[calc(100%+8px)] left-0 right-0 mx-2 rounded-2xl transition-all duration-300 shadow-xl bg-white/95 backdrop-blur-xl border border-gray-200/50 p-4 space-y-2 ${
          isMobileMenuOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
      >
        {navItems.map((item, idx) => (
          <Link
            key={`mobile-${idx}`}
            href={item.href}
            className="block py-3 px-4 text-sm text-gray-700 hover:text-black hover:bg-gray-100/80 rounded-xl transition-all duration-200 font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        <div className="pt-2 border-t border-gray-200/50 space-y-2">
          <Link
            href="/login"
            className="block py-3 px-4 text-sm text-gray-700 hover:text-black hover:bg-gray-100/80 rounded-xl transition-all duration-200 font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block py-3 px-4 text-sm text-center bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl transition-all duration-200 font-semibold shadow-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
        <div className="pt-2 border-t border-gray-200/50 flex justify-center">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
