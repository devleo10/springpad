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
  FaFileInvoice,
  FaSave,
  FaBriefcase,
  FaExchangeAlt,
  FaChartBar,
  FaPercentage,
  FaArrowUp,
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
    title: "SIP & Investment Calculators",
    description:
      "Calculate returns from systematic investment plans and lumpsum investments",
    items: [
      { label: "SIP Calculator", icon: <FaChartLine /> },
      { label: "SIP Step-up Calculator", icon: <FaChartPie /> },
      { label: "Goal Based SIP Calculator", icon: <FaClipboardList /> },    
      { label: "Lumpsum Calculator", icon: <FaCoins /> },
      { label: "Lumpsum Target Calculator", icon: <FaBalanceScale /> },
      { label: "SWP Calculator", icon: <FaMoneyCheckAlt /> },
    ],
  },
  {
    title: "Investment Proposal & Portfolio Tools",
    description: "Create, save and manage investment proposals and portfolios",
    items: [
      { label: "Investment Proposal Calculator", icon: <FaFileInvoice /> },
      { label: "Saved Investment Proposal Calculator", icon: <FaSave /> },
      { label: "Model Portfolio Calculator", icon: <FaBriefcase /> },
      { label: "Compare Funds Calculator", icon: <FaExchangeAlt /> },
    ],
  },
  {
    title: "Goal Planning & Life Milestones",
    description: "Plan for major life goals and financial milestones",
    items: [
      { label: "Goal Setting Calculator", icon: <FaClipboardList /> },
      {
        label: "Composite Financial Goal Calculator",
        icon: <FaBalanceScale />,
      },
      { label: "Children Education Planner", icon: <FaChild /> },
      { label: "Dream Home Calculator", icon: <FaHome /> },
      { label: "Wealth Creation Calculator", icon: <FaGem /> },
      { label: "Child's Wedding Calculator", icon: <FaRing /> },
      { label: "Emergency Fund Calculator", icon: <FaShieldAlt /> },
      { label: "Retirement Planning Calculator", icon: <FaRegClock /> },
    ],
  },
  {
    title: "Loan & EMI Calculators",
    description: "Calculate EMIs and loan payments for various types of loans",
    items: [
      { label: "EMI Calculator", icon: <FaCalculator /> },
      { label: "Home Loan EMI Calculator", icon: <FaHome /> },
      { label: "Personal Loan EMI Calculator", icon: <FaUserShield /> },
      { label: "Car Loan EMI Calculator", icon: <FaWallet /> },
      { label: "Education Loan EMI Calculator", icon: <FaUserGraduate /> },
    ],
  },
  {
    title: "Tax & Retirement Planning",
    description: "Calculate tax-saving investments and retirement corpus",
    items: [
      { label: "Become Crorepati Calculator", icon: <FaRupeeSign /> },
      { label: "PPF Calculator", icon: <FaUserGraduate /> },
      { label: "EPF Calculator", icon: <FaPiggyBank /> },
      { label: "NPS Calculator", icon: <FaUniversity /> },
      { label: "Compounding Calculator", icon: <FaChartLine /> },
    ],
  },
  {
    title: "Inflation & Future Value Tools",
    description:
      "Understand the impact of inflation on your investments and goals",
    items: [
      { label: "Future Value Inflation Calculator", icon: <FaChartBar /> },
      { label: "Cost Inflation Index Calculator", icon: <FaPercentage /> },
    ],
  },
  {
    title: "Financial Assessment Tools",
    description: "Assess your current financial position and planning needs",
    items: [
      { label: "Asset Allocation Calculator", icon: <FaCoins /> },
      { label: "Networth Calculator", icon: <FaPiggyBank /> },
      { label: "Human Life Value Calculator", icon: <FaUserShield /> },
      { label: "Spending Less Calculator", icon: <FaWallet /> },
    ],
  },
];

export default function CalculatorsPage() {
  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Financial Calculators</h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive suite of financial calculators to help you make
            informed investment decisions, plan your goals, and understand the
            impact of inflation on your financial future.
          </p>
        </div>

        {calculatorSections.map((section, idx) => (
          <div key={idx} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2 text-[#2C5282]">
                {section.title}
              </h2>
              <p className="text-gray-600 text-sm">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item, i) => (
                <Link
                  key={i}
                  href={`/calculators${slugify(item.label)}`}
                  className="flex items-center w-full gap-3 bg-white border border-gray-200 hover:border-yellow-400 rounded-lg overflow-hidden transition-all shadow-sm hover:shadow-md group"
                >
                  <div className="bg-yellow-50 group-hover:bg-yellow-100 px-4 py-4 flex items-center justify-center text-yellow-600 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-800 group-hover:text-[#2C5282] transition-colors pr-4">
                    {item.label}
                  </span>
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
