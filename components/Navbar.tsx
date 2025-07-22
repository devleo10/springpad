"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      <div className="flex justify-between px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 shadow-xl backdrop-blur-md items-center transition duration-200 border border-gray-200 dark:border-white/10 ring-1 ring-gray-300 dark:ring-0">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-sm px-2 py-1 text-black dark:text-white"
        >
          <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm" />
          <span className="font-medium">DeepFundz</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-3">
          {navItems.map((item, idx) => (
            <Link
              key={`nav-${idx}`}
              href={item.href}
              className="text-sm px-4 py-2 rounded-md 
                         text-black 
                         dark:text-white
                         hover:bg-[#F5F5F5] dark:hover:bg-neutral-800 
                         transition"
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
            className="text-sm px-4 py-2 rounded-full 
                       text-black  
                       dark:text-white 
                       hover:bg-gray-100 dark:hover:bg-neutral-800 
                       transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 rounded-full 
                       bg-neutral-900 hover:bg-black/90 
                       text-white transition 
                       shadow-[0px_-1px_0px_0px_#FFFFFF40_inset,_0px_1px_0px_0px_#FFFFFF40_inset]"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden absolute top-[calc(100%+8px)] left-0 right-0 mx-4 rounded-xl transition-all shadow-lg bg-white dark:bg-black p-4 space-y-2 ${
          isMobileMenuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {navItems.map((item, idx) => (
          <Link
            key={`mobile-${idx}`}
            href={item.href}
            className="block py-1 text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        <div className="pt-2 border-t border-black/10 dark:border-white/20 space-y-2">
          <Link
            href="/login"
            className="block py-1 text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block py-1 text-black dark:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
        <div className="pt-2 border-t border-black/10 dark:border-white/20">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
