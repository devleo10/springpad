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
    description: "Monitor your mutual fund investments in real time with insights and visualizations.",
    icon: <IconChartLine size={32} stroke={1.5} />,
  },
  {
    title: "Secure & Compliant",
    description: "Your data and transactions are end-to-end encrypted and SEBI-compliant.",
    icon: <IconShieldLock size={32} stroke={1.5} />,
  },
  {
    title: "High Growth Funds",
    description: "Discover top-performing funds based on historical and projected returns.",
    icon: <IconTrendingUp size={32} stroke={1.5} />,
  },
  {
    title: "Easy Withdrawals",
    description: "Withdraw your money anytime with minimal processing time and no hidden fees.",
    icon: <IconWallet size={32} stroke={1.5} />,
  },
  {
    title: "SIP Management",
    description: "Manage your Systematic Investment Plans (SIPs) effortlessly in one place.",
    icon: <IconPigMoney size={32} stroke={1.5} />,
  },
  {
    title: "Risk Analyzer",
    description: "Gauge your risk profile and receive fund recommendations accordingly.",
    icon: <IconArrowsDoubleSwNe size={32} stroke={1.5} />,
  },
  {
    title: "Tax Saving Options",
    description: "Explore ELSS and other tax-saving mutual fund options under section 80C.",
    icon: <IconClockDollar size={32} stroke={1.5} />,
  },
  {
    title: "Community & Support",
    description: "Engage with experts and investors. Get support anytime from our advisors.",
    icon: <IconUsersGroup size={32} stroke={1.5} />,
  },
];

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-white border border-neutral-200 hover:shadow-lg transition-shadow rounded-xl p-6",
        "hover:border-yellow-500 group"
      )}
    >
      <div className="text-yellow-600 mb-4">{icon}</div>
      <div className="text-lg font-semibold text-neutral-800 mb-2 relative">
        <span className="block group-hover:translate-x-1 transition-transform duration-200">
          {title}
        </span>
        <div className="w-6 h-1 bg-yellow-500 rounded-full mt-1 transition-all scale-x-0 group-hover:scale-x-100 origin-left duration-300" />
      </div>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
};

const FeaturePage = () => {
  return (
    <section className="bg-white py-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-800">Why Choose Our Mutual Fund Platform?</h2>
          <p className="mt-2 text-neutral-500 text-sm">
            Everything you need to grow your investments smartly, securely, and efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturePage;
