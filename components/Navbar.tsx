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
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`${isHomePage ? 'fixed top-2' : 'sticky top-0'} left-1/2 transform -translate-x-1/2 z-50 w-[99%] max-w-4xl`}>
      <div className="flex justify-between rounded-2xl bg-transparent backdrop-blur-lg shadow items-center transition duration-300 border border-white/20 dark:border-white/10 py-0.5 px-1">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-[11px] px-0.5 py-0 text-black dark:text-white"
        >
          <Image src="/logo.png" alt="SpringPad Logo" className="p-2 h-18 w-auto object-contain" />
          {/* <span className="font-medium">SpringPad</span> */}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1.5">
          {navItems.map((item, idx) => (
            <Link
              key={`nav-${idx}`}
              href={item.href}
              className="text-sm px-4 py-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition font-medium"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side (Theme + Auth) */}
        <div className="hidden md:flex items-center space-x-1.5">
          <ThemeToggle />
          <Link href="/login" className="text-sm px-4 py-2s rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition font-medium">
            Login
          </Link>
          <Link href="/signup" className="text-sm mx-1 px-5 py-2 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white transition shadow font-semibold">
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-0.5"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden absolute top-[calc(100%+2px)] left-0 right-0 mx-1 rounded-2xl transition-all shadow bg-white dark:bg-black p-1.5 space-y-0.5 ${
          isMobileMenuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {navItems.map((item, idx) => (
          <Link
            key={`mobile-${idx}`}
            href={item.href}
            className="block py-1 text-sm text-black dark:text-white rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.name}
          </Link>
        ))}
        <div className="pt-0.5 border-t border-black/10 dark:border-white/20 space-y-0.5">
          <Link
            href="/login"
            className="block py-1 text-sm text-black dark:text-white rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block py-1 text-sm text-black dark:text-white rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </div>
        <div className="pt-0.5 border-t border-black/10 dark:border-white/20">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
