"use client";

import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  FaRupeeSign,
  FaCalculator,
  FaChartLine,
  FaUserGraduate,
  FaPiggyBank,
  FaWallet,
  FaUserShield,
  FaChild,
  FaClipboardList,
  FaBalanceScale,
  FaChartPie,
  FaCoins,
  FaMoneyCheckAlt,
  FaUniversity,
  FaRegClock,
  FaHome,
  FaGem,
  FaRing,
  FaShieldAlt,
} from "react-icons/fa";

// slugify label to route
const slugify = (label: string) =>
  "/" +
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const calculatorSections = [
  {
    title: "Investment",
    items: [
      { label: "Become Crorepati Calculator", icon: <FaRupeeSign /> },
      { label: "SIP Return Calculator", icon: <FaChartLine /> },
      { label: "Retirement Planning Calculator", icon: <FaRegClock /> },
      { label: "SWP Calculator", icon: <FaMoneyCheckAlt /> },
      { label: "EMI Calculator", icon: <FaWallet /> },
      { label: "SIP Step-up Calculator", icon: <FaChartPie /> },
    ],
  },
  {
    title: "Goal Planning",
    items: [
      { label: "Goal Setting Calculator", icon: <FaClipboardList /> },
      {
        label: "Composite Financial Goal Calculator",
        icon: <FaBalanceScale />,
      },
      { label: "Children Education Planner", icon: <FaChild /> },
      { label: "Human Life Value Calculator", icon: <FaUserShield /> },
      { label: "Dream Home Calculator", icon: <FaHome /> },
      { label: "Wealth Creation Calculator", icon: <FaGem /> },
      { label: "Child's Wedding Calculator", icon: <FaRing /> },
      { label: "Emergency Fund Calculator", icon: <FaShieldAlt /> },
    ],
  },
  {
    title: "Financial Tools",
    items: [
      { label: "Asset Allocation Calculator", icon: <FaCoins /> },
      { label: "Networth Calculator", icon: <FaPiggyBank /> },
      { label: "Compounding Calculator", icon: <FaUniversity /> },
      { label: "Spending Less Calculator", icon: <FaWallet /> },
      { label: "PPF Calculator", icon: <FaUserGraduate /> },
      { label: "EPF Calculator", icon: <FaCalculator /> },
    ],
  },
];

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Calculators</h1>
        <p className="text-gray-600 mb-10">
          Simplify your financial decision with our calculators.
        </p>

        {calculatorSections.map((section, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {section.items.map((item, i) => (
                <Link
                  key={i}
                  href={`/calculators${slugify(item.label)}`}
                  className="flex items-center w-full gap-3 bg-white border border-gray-200 hover:border-yellow-400 rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md"
                >
                  <div className="bg-yellow-50 px-4 py-3 flex items-center justify-center text-yellow-600">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}
