"use client";

import React, { useState, useRef, useEffect } from "react";
import { AuthModal } from "./AuthModal";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronRight, Calculator, TrendingUp, Target, GraduationCap, BarChart3, User, Building } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openNestedDropdown, setOpenNestedDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [openMobileNested, setOpenMobileNested] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<"login" | "signup">("signup");
  
  const pathname = usePathname();
  const closeDropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const closeNestedTimeout = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Organized calculator sections (excluding goals)
  const calculatorSections: NavItem[] = [
    {
      name: "SIP & Investment",
      href: "/calculators/sip-investment",
      icon: <TrendingUp className="w-4 h-4" />,
      children: [
        { name: "SIP Calculator", href: "/calculators/sip-calculator" },
        { name: "SIP Step-up Calculator", href: "/calculators/sip-step-up-calculator" },
        { name: "Goal Based SIP Calculator", href: "/calculators/goal-based-sip-calculator" },
        { name: "Lumpsum Calculator", href: "/calculators/lumpsum-calculator" },
        { name: "Lumpsum Target Calculator", href: "/calculators/lumpsum-target-calculator" },
        { name: "SWP Calculator", href: "/calculators/swp-calculator" },
      ],
    },
    {
      name: "Portfolio & Proposals",
      href: "/calculators/portfolio-tools",
      icon: <BarChart3 className="w-4 h-4" />,
      children: [
        { name: "Investment Proposal Calculator", href: "/calculators/investment-proposal-calculator" },  
        { name: "Model Portfolio Calculator", href: "/calculators/model-portfolio-calculator" },
        { name: "Compare Funds Calculator", href: "/calculators/compare-funds-calculator" },
      ],
    },
    {
      name: "Loan & EMI Calculators",
      href: "/calculators/loan-emi",
      icon: <Building className="w-4 h-4" />,
      children: [
        { name: "EMI Calculator", href: "/calculators/emi-calculator" },
        { name: "Home Loan EMI Calculator", href: "/calculators/home-loan-emi-calculator" },
        { name: "Personal Loan EMI Calculator", href: "/calculators/personal-loan-emi-calculator" },
        { name: "Car Loan EMI Calculator", href: "/calculators/car-loan-emi-calculator" },
        { name: "Education Loan EMI Calculator", href: "/calculators/education-loan-emi-calculator" },
      ],
    },
    {
      name: "Tax & Retirement",
      href: "/calculators/tax-retirement",
      icon: <GraduationCap className="w-4 h-4" />,
      children: [
        { name: "Become Crorepati Calculator", href: "/calculators/become-crorepati-calculator" },
        { name: "PPF Calculator", href: "/calculators/ppf-calculator" },
        { name: "EPF Calculator", href: "/calculators/epf-calculator" },
        { name: "NPS Calculator", href: "/calculators/nps-calculator" },
        { name: "Compounding Calculator", href: "/calculators/compounding-calculator" },
      ],
    },
    {
      name: "Inflation & Future Value",
      href: "/calculators/inflation-tools",
      icon: <BarChart3 className="w-4 h-4" />,
      children: [
        { name: "Future Value Inflation Calculator", href: "/calculators/future-value-inflation-calculator" },
        { name: "Cost Inflation Index Calculator", href: "/calculators/cost-inflation-index-calculator" },
      ],
    },
    {
      name: "Financial Assessment",
      href: "/calculators/financial-assessment",
      icon: <User className="w-4 h-4" />,
      children: [
        { name: "Asset Allocation Calculator", href: "/calculators/asset-allocation-calculator" },
        { name: "Networth Calculator", href: "/calculators/networth-calculator" },
        { name: "Human Life Value Calculator", href: "/calculators/human-life-value-calculator" },
        { name: "Spending Less Calculator", href: "/calculators/spending-less-calculator" },
      ],
    },
  ];

  // Separate Goals section
  const goalsSections: NavItem[] = [
    { name: "Goal Setting Calculator", href: "/calculators/goal-setting-calculator" },
    { name: "Composite Financial Goal Calculator", href: "/calculators/composite-financial-goal-calculator" },
    { name: "Children Education Planner", href: "/calculators/children-education-planner" },
    { name: "Dream Home Calculator", href: "/goals/dream-home-calculator" },
    { name: "Wealth Creation Calculator", href: "/goals/wealth-creation-calculator" },
    { name: "Child's Wedding Calculator", href: "/goals/child-s-wedding-calculator" },
    { name: "Emergency Fund Calculator", href: "/goals/emergency-fund-calculator" },
    { name: "Retirement Planning Calculator", href: "/goals/retirement-planning-calculator" },
  ];

  const navItems: NavItem[] = [
    { name: "About", href: "/about" },
    {
      name: "Calculators",
      href: "/calculators",
      icon: <Calculator className="w-4 h-4" />,
      children: calculatorSections,
    },
    {
      name: "Goals",
      href: "/goals",
      icon: <Target className="w-4 h-4" />,
      children: goalsSections,
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
    { name: "Contact", href: "/contact" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
        setOpenNestedDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle main dropdown interactions
  const handleDropdownEnter = (name: string) => {
    if (closeDropdownTimeout.current) {
      clearTimeout(closeDropdownTimeout.current);
      closeDropdownTimeout.current = null;
    }
    setOpenDropdown(name);
    setOpenNestedDropdown(null);
  };

  const handleDropdownLeave = () => {
    closeDropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(null);
      setOpenNestedDropdown(null);
    }, 150);
  };

  // Handle nested dropdown interactions
  const handleNestedEnter = (name: string) => {
    if (closeNestedTimeout.current) {
      clearTimeout(closeNestedTimeout.current);
      closeNestedTimeout.current = null;
    }
    setOpenNestedDropdown(name);
  };

  const handleNestedLeave = () => {
    closeNestedTimeout.current = setTimeout(() => {
      setOpenNestedDropdown(null);
    }, 150);
  };

  // Enhanced dropdown renderer with nested support
  const renderDropdown = (children: NavItem[], isCalculators = false, isGoals = false) => (
    <div className={`bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-1 animate-fade-in ${
      isCalculators ? 'min-w-[300px] max-w-[350px]' : isGoals ? 'min-w-[280px]' : 'min-w-[220px]'
    }`}>
      {isCalculators ? (
        // Special layout for calculators with nested dropdowns
        <div className="space-y-1">
          {children.map((category, cidx) => (
            <div 
              key={`calc-category-${cidx}`} 
              className="group relative"
              onMouseEnter={() => handleNestedEnter(category.name)}
              onMouseLeave={handleNestedLeave}
            >
              <div className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-all duration-200">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </div>
              
              {/* Nested dropdown */}
              {openNestedDropdown === category.name && category.children && (
                <div className="absolute left-full top-0 ml-2 min-w-[250px] z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 px-1 animate-fade-in">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-600 border-b border-gray-100 mb-2">
                      {category.name}
                    </div>
                    {category.children.map((calc, calcIdx) => (
                      <Link
                        key={`nested-calc-${calcIdx}`}
                        href={calc.href}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-blue-50 rounded-lg transition-all duration-200 hover:translate-x-1"
                        onClick={() => {
                          setOpenDropdown(null);
                          setOpenNestedDropdown(null);
                        }}
                      >
                        {calc.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : isGoals ? (
        // Goals dropdown layout
        <div className="space-y-0.5">
          <div className="px-3 py-2 text-xs font-semibold text-gray-600 border-b border-gray-100 mb-2">
            Goal Planning & Life Milestones
          </div>
          {children.map((goal, gidx) => (
            <Link
              key={`goal-${gidx}`}
              href={goal.href}
              className="block px-3 py-2 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-blue-50 rounded-lg transition-all duration-200 hover:translate-x-1"
              onClick={() => setOpenDropdown(null)}
            >
              {goal.name}
            </Link>
          ))}
        </div>
      ) : (
        // Regular dropdown layout
        children.map((child, cidx) => (
          <Link
            key={`dropdown-${cidx}`}
            href={child.href}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:text-[#2C5282] hover:bg-blue-50 rounded-lg transition-all duration-200 hover:translate-x-1"
            onClick={() => setOpenDropdown(null)}
          >
            {child.name}
          </Link>
        ))
      )}
    </div>
  );

  // Mobile dropdown toggle
  const toggleMobileDropdown = (name: string) => {
    setOpenMobileDropdown(openMobileDropdown === name ? null : name);
    setOpenMobileNested(null);
  };

  const toggleMobileNested = (name: string) => {
    setOpenMobileNested(openMobileNested === name ? null : name);
  };

  return (
    <>
      <nav ref={navRef} className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="flex justify-between items-center rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg border border-gray-200/50 py-2 px-6 transition-all duration-300 hover:shadow-xl">
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
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, idx) => {
              const hasDropdown = item.children && item.children.length > 0;
              const isActive = pathname.startsWith(item.href);
              
              return hasDropdown ? (
                <div
                  key={`nav-${idx}`}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(item.name)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-yellow-200 text-[#2C5282] shadow-sm"
                        : "text-gray-700 hover:text-[#2C5282] hover:bg-yellow-100"
                    }`}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === item.name}
                  >
                    {item.icon}
                    {item.name}
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      openDropdown === item.name ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {openDropdown === item.name && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-40">
                      <div className="w-0 h-0 mx-auto mb-[-6px] border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"></div>
                      {renderDropdown(
                        item.children ?? [],
                        item.name === "Calculators",
                        item.name === "Goals"
                      )}
                      </div>
                  )}
                </div>
              ) : (
                <Link
                  key={`nav-${idx}`}
                  href={item.href}
                  className={`text-sm px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-200 text-[#2C5282] shadow-sm"
                      : "text-gray-700 hover:text-[#2C5282] hover:bg-yellow-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <button
              className="text-sm px-6 py-2.5 rounded-xl bg-yellow-300  hover:bg-yellow-400 text-[#2C5282] transition-all duration-200 shadow-md hover:shadow-lg font-semibold transform hover:scale-105"
              onClick={() => {
                setAuthInitialTab("signup");
                setIsAuthOpen(true);
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors text-gray-700"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-[calc(100%+8px)] left-0 right-0 mx-2 rounded-2xl transition-all duration-300 shadow-xl bg-white/95 backdrop-blur-xl border border-gray-200/50 ${
            isMobileMenuOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="p-4 max-h-[70vh] overflow-y-auto space-y-2">
            {navItems.map((item, idx) => {
              const hasDropdown = item.children && item.children.length > 0;
              const isOpen = openMobileDropdown === item.name;
              
              return hasDropdown ? (
                <div key={`mobile-${idx}`} className="space-y-1">
                  <button
                    onClick={() => toggleMobileDropdown(item.name)}
                    className="flex items-center justify-between w-full py-3 px-4 text-sm font-medium text-gray-700 hover:text-[#2C5282] hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {isOpen && (
                    <div className="pl-4 space-y-1 animate-fade-in">
                      {item.name === "Calculators" ? (
                        // Special mobile layout for calculators with nested dropdowns
                        calculatorSections.map((section, secIdx) => (
                          <div key={`mobile-calc-section-${secIdx}`} className="mb-2">
                            <button
                              onClick={() => toggleMobileNested(section.name)}
                              className="flex items-center justify-between w-full py-2 px-3 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
                            >
                              <div className="flex items-center gap-2">
                                {section.icon}
                                <span>{section.name}</span>
                              </div>
                              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                                openMobileNested === section.name ? 'rotate-180' : ''
                              }`} />
                            </button>
                            
                            {openMobileNested === section.name && (
                              <div className="pl-2 mt-1 space-y-0.5 animate-fade-in">
                                {section.children?.map((calc, calcIdx) => (
                                  <Link
                                    key={`mobile-nested-calc-${calcIdx}`}
                                    href={calc.href}
                                    className="block py-2 px-3 text-sm text-gray-600 hover:text-[#2C5282] hover:bg-blue-50 rounded-lg transition-all duration-200"
                                    onClick={() => {
                                      setIsMobileMenuOpen(false);
                                      setOpenMobileDropdown(null);
                                      setOpenMobileNested(null);
                                    }}
                                  >
                                    {calc.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : item.name === "Goals" ? (
                        // Goals mobile layout
                        <div className="space-y-0.5">
                          <div className="py-2 px-3 text-xs font-semibold text-gray-600 bg-gray-50 rounded-lg mb-2">
                            Goal Planning & Life Milestones
                          </div>
                          {goalsSections.map((goal, goalIdx) => (
                            <Link
                              key={`mobile-goal-${goalIdx}`}
                              href={goal.href}
                              className="block py-2 px-3 text-sm text-gray-600 hover:text-[#2C5282] hover:bg-blue-50 rounded-lg transition-all duration-200"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenMobileDropdown(null);
                              }}
                            >
                              {goal.name}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        // Regular mobile dropdown
                        item.children?.map((child, childIdx) => (
                          <Link
                            key={`mobile-child-${childIdx}`}
                            href={child.href}
                            className="block py-2 px-6 text-sm text-gray-600 hover:text-[#2C5282] hover:bg-blue-50 rounded-lg transition-all duration-200"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setOpenMobileDropdown(null);
                            }}
                          >
                            {child.name}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={`mobile-${idx}`}
                  href={item.href}
                  className="block py-3 px-4 text-sm font-medium text-gray-700 hover:text-[#2C5282] hover:bg-gray-50 rounded-xl transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            
            {/* Mobile CTA */}
            <div className="pt-4 border-t border-gray-200/50">
              <button
                className="w-full py-3 px-4 text-sm text-center bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#2C5282] rounded-xl transition-all duration-200 font-semibold shadow-md"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setAuthInitialTab("signup");
                  setIsAuthOpen(true);
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        open={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialTab={authInitialTab}
      />

      {/* Custom Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}