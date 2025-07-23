import React from "react";
import {
  IconChartLine,
  IconShieldLock,
  IconTrendingUp,
  IconWallet,
  IconPigMoney,
  IconArrowsDoubleSwNe,
  IconClockDollar,
  IconUsersGroup,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

const features = [
  {
    title: "Smart Portfolio Tracking",
    description:
      "Monitor your mutual fund investments in real time with insights and visualizations.",
    icon: <IconChartLine size={32} stroke={1.5} />,
    bgImage: "/bg-1.png",
  },
  {
    title: "Secure & Compliant",
    description:
      "Your data and transactions are end-to-end encrypted and SEBI-compliant.",
    icon: <IconShieldLock size={32} stroke={1.5} />,
    bgImage: "/bg-2.png",
  },
  {
    title: "High Growth Funds",
    description:
      "Discover top-performing funds based on historical and projected returns.",
    icon: <IconTrendingUp size={32} stroke={1.5} />,
    bgImage: "bg-3.png",
  },
  {
    title: "Easy Withdrawals",
    description:
      "Withdraw your money anytime with minimal processing time and no hidden fees.",
    icon: <IconWallet size={32} stroke={1.5} />,
    bgImage: "/bg-4.png",
  },
  {
    title: "SIP Management",
    description:
      "Manage your Systematic Investment Plans (SIPs) effortlessly in one place.",
    icon: <IconPigMoney size={32} stroke={1.5} />,
    bgImage: "/bg-3.png",
  },
  {
    title: "Risk Analyzer",
    description:
      "Gauge your risk profile and receive fund recommendations accordingly.",
    icon: <IconArrowsDoubleSwNe size={32} stroke={1.5} />,
    bgImage: "/bg-4.png",
  },
  {
    title: "Tax Saving Options",
    description:
      "Explore ELSS and other tax-saving mutual fund options under section 80C.",
    icon: <IconClockDollar size={32} stroke={1.5} />,
    bgImage: "/bg-1.png",
  },
  {
    title: "Community & Support",
    description:
      "Engage with experts and investors. Get support anytime from our advisors.",
    icon: <IconUsersGroup size={32} stroke={1.5} />,
    bgImage: "/bg-2.png",
  },
];

const Feature = ({
  title,
  description,
  icon,
  bgImage,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgImage: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col relative bg-white border border-neutral-200 hover:shadow-md transition-shadow hover-shadow-black rounded-xl p-6 overflow-hidden hover:border-yellow-500 group"
      )}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative z-10 text-black mb-4">{icon}</div>
      <div className="relative z-10 text-lg font-semibold text-neutral-800 mb-2">
        <span className="block group-hover:translate-x-1 transition-transform duration-200">
          {title}
        </span>
        <div className="w-6 h-1 bg-yellow-500 rounded-full mt-1 transition-all scale-x-0 group-hover:scale-x-100 origin-left duration-300" />
      </div>
      <p className="relative z-10 text-sm text-neutral-600">{description}</p>
    </div>
  );
};

const FeaturePage = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800">Why Choose Our Mutual Fund Platform?</h2>
          <p className="mt-2 text-neutral-500 text-sm">
            Everything you need to grow your investments smartly, securely, and efficiently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Feature key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturePage;
