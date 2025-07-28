"use client";

import React, { useState } from "react";
import { LoginModal } from "./LoginModal";
import { SignupModal } from "./SignupModal";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";


interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();


  const navItems: NavItem[] = [
    { name: "About", href: "/about" },
    {
      name: "Calculators",
      href: "/calculators",
      children: [
        {
          name: "Investment",
          href: "/calculators#investment",
          children: [
            { name: "Become Crorepati Calculator", href: "/calculators/become-crorepati-calculator" },
            { name: "SIP Return Calculator", href: "/calculators/sip-return-calculator" },
            { name: "Retirement Planning Calculator", href: "/calculators/retirement-planning-calculator" },
            { name: "SWP Calculator", href: "/calculators/swp-calculator" },
            { name: "EMI Calculator", href: "/calculators/emi-calculator" },
            { name: "SIP Step-up Calculator", href: "/calculators/sip-step-up-calculator" },
          ],
        },
        {
          name: "Goal Planning",
          href: "/calculators#goal-planning",
          children: [
            { name: "Goal Setting Calculator", href: "/calculators/goal-setting-calculator" },
            { name: "Composite Financial Goal Calculator", href: "/calculators/composite-financial-goal-calculator" },
            { name: "Children Education Planner", href: "/calculators/children-education-planner" },
            { name: "Human Life Value Calculator", href: "/calculators/human-life-value-calculator" },
            { name: "Dream Home Calculator", href: "/calculators/dream-home-calculator" },
            { name: "Wealth Creation Calculator", href: "/calculators/wealth-creation-calculator" },
            { name: "Child's Wedding Calculator", href: "/calculators/child-s-wedding-calculator" },
            { name: "Emergency Fund Calculator", href: "/calculators/emergency-fund-calculator" },
          ],
        },
        {
          name: "Financial Tools",
          href: "/calculators#financial-tools",
          children: [
            { name: "Asset Allocation Calculator", href: "/calculators/asset-allocation-calculator" },
            { name: "Networth Calculator", href: "/calculators/networth-calculator" },
            { name: "Compounding Calculator", href: "/calculators/compounding-calculator" },
            { name: "Spending Less Calculator", href: "/calculators/spending-less-calculator" },
            { name: "PPF Calculator", href: "/calculators/ppf-calculator" },
            { name: "EPF Calculator", href: "/calculators/epf-calculator" },
          ],
        },
      ],
    },
    { name: "Mutual Fund", href: "/mutual-funds" },
    {
      name: "MF Research",
      href: "/mf-research",
      children: [
        { name: "Explore Funds", href: "/mf-research/explore" },
        { name: "Top Performing Funds", href: "/mf-research/top-funds" },
      ],
    },
    {
      name: "Goals",
      href: "/goals",
      children: [
        { name: "Dream Home", href: "/goals/dream-home-calculator" },
        { name: "Wealth Creation", href: "/goals/wealth-creation-calculator" },
        { name: "Retirement Planning", href: "/goals/retirement-planning-calculator" },
        { name: "Child's Education", href: "/goals/children-education-calculator" },
        { name: "Child's Wedding", href: "/goals/child-s-wedding-calculator" },
        { name: "Emergency Fund", href: "/goals/emergency-fund-calculator" },
      ],
    },
    { name: "Contact", href: "/contact" },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeDropdownTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleDropdownEnter = (name: string) => {
    if (closeDropdownTimeout.current) {
      clearTimeout(closeDropdownTimeout.current);
      closeDropdownTimeout.current = null;
    }
    setOpenDropdown(name);
  };

  const handleDropdownLeave = () => {
    closeDropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 120); // 120ms delay before closing
  };

  // Helper for nested dropdown rendering
  const renderDropdown = (children: NavItem[]) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 px-2 animate-fade-in">
      {children.map((child, cidx) => (
        child.children ? (
          <div key={`nav-dd-group-${cidx}`} className="group relative">
            <Link
              href={child.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-yellow-50 rounded-lg transition-all duration-200 font-semibold"
            >
              {child.name}
            </Link>
            {/* Nested dropdown */}
            <div className="absolute left-full top-0 ml-2 min-w-[220px] z-40 hidden group-hover:block">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 px-2 animate-fade-in">
                {child.children.map((sub, scidx) => (
                  <Link
                    key={`nav-dd-sub-link-${scidx}`}
                    href={sub.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-yellow-50 rounded-lg transition-all duration-200"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={`nav-dd-link-${cidx}`}
            href={child.href}
            className="block px-4 py-2 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-yellow-50 rounded-lg transition-all duration-200"
          >
            {child.name}
          </Link>
        )
      ))}
    </div>
  );

  return (
    <>
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="flex justify-between items-center rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50 py-2 px-6 transition-all duration-300">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#2C5282] hover:opacity-80 transition-opacity"
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
          <div className="hidden md:flex items-center lg:space-x-1">
            {navItems.map((item, idx) => {
              const hasDropdown = ["Calculators", "MF Research", "Goals"].includes(item.name) && item.children;
              return hasDropdown ? (
                <div
                  key={`nav-dd-${idx}`}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                  tabIndex={0}
                  onFocus={() => handleDropdownEnter(item.name)}
                  onBlur={handleDropdownLeave}
                >
                  <button
                    className={`flex items-center gap-1 text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      pathname.startsWith(item.href)
                        ? "bg-yellow-200 text-[#2C5282]"
                        : "text-gray-700 hover:text-[#2C5282] hover:bg-gray-100/80"
                    }`}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.name}
                  >
                    {item.name}
                    <span className="ml-1">
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  {/* Dropdown menu with triangle */}
                  {openDropdown === item.name && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 min-w-[220px] z-30">
                      {/* Triangle */}
                      <div className="w-0 h-0 mx-auto mb-[-6px] border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                      {item.children ? renderDropdown(item.children) : null}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={`nav-${idx}`}
                  href={item.href}
                  className={`text-sm px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? "bg-yellow-200 text-[#2C5282]"
                      : "text-gray-700 hover:text-[#2C5282] hover:bg-gray-100/80"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons (Desktop) */}
          {/* Auth Buttons (Desktop) - modal logic */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              className="text-sm px-4 py-2 rounded-xl text-gray-700 hover:text-[#2C5282] hover:bg-gray-100/80 transition-all duration-200 font-medium"
              onClick={() => setIsLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="text-sm px-5 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-[#2C5282] transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
              onClick={() => setIsSignupOpen(true)}
            >
              Sign Up
            </button>
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
          {navItems.map((item, idx) => {
            const hasDropdown = ["Calculators", "MF Research", "Goals"].includes(item.name) && item.children;
            return hasDropdown ? (
              <div key={`mobile-dd-${idx}`}> 
                <Link
                  href={item.href}
                  className="block py-3 px-4 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-gray-100/80 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
                <div className="pl-6">
                  {item.children?.map((child, cidx) => (
                    <Link
                      key={`mobile-dd-link-${cidx}`}
                      href={child.href}
                      className="block py-2 px-4 text-sm text-gray-600 hover:text-[#2C5282] hover:bg-yellow-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={`mobile-${idx}`}
                href={item.href}
                className="block py-3 px-4 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-gray-100/80 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-gray-200/50 space-y-2">
            <button
              className="block w-full py-3 px-4 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-gray-100/80 rounded-xl transition-all duration-200 font-medium text-left"
              onClick={() => { setIsMobileMenuOpen(false); setIsLoginOpen(true); }}
            >
              Login
            </button>
            <button
              className="block w-full py-3 px-4 text-sm text-center bg-yellow-500 hover:bg-yellow-600 text-[#2C5282] rounded-xl transition-all duration-200 font-semibold shadow-md"
              onClick={() => { setIsMobileMenuOpen(false); setIsSignupOpen(true); }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <SignupModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)} />
    </>
  );
}
