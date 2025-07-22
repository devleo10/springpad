"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Only apply fixed positioning on the home page
  const isHomePage = pathname === "/";

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`${isHomePage ? 'fixed top-6' : 'sticky top-0'} left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl`}>
      <div className="flex justify-between rounded-full bg-transparent backdrop-blur-lg shadow-2xl items-center transition duration-300 border border-white/20 dark:border-white/10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-sm px-2 py-1 text-black dark:text-white"
        >
          <img src="/logo.png" alt="SpringPad Logo" className=" p-3 h-22 w-auto object-contain" />
          {/* <span className="font-medium">SpringPad</span> */}
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-4">
          {navItems.map((item, idx) => (
            <Link
              key={`nav-${idx}`}
              href={item.href}
              className="text-sm px-5 py-2 rounded-md text-neutral-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition font-medium"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side (Theme + Auth) */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm px-5 py-2 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition font-medium">
            Login
          </Link>
          <Link href="/signup" className="text-sm mx-3 px-6 py-2 rounded-full bg-yellow-600 hover:bg-yellow-700 text-white transition shadow-lg font-semibold">
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
