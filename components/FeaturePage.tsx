"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaMoneyBillWave, FaCalculator, FaFileInvoiceDollar } from "react-icons/fa";

import { cn } from "@/lib/utils";

const features = [
  {
    title: "What’s Moving Your Portfolio?",
    description: "Real-time explainable impact summaries",
    icon: <FaChartLine className="w-8 h-8" />,
  },
  {
    title: "Post-Tax XIRR & Cash-in-Hand Returns",
    description: "See true net performance",
    icon: <FaMoneyBillWave className="w-8 h-8" />,
  },
  {
    title: "Smart Tax Harvesting + What-If Simulations",
    description: "Optimize LTCG exemptions",
    icon: <FaCalculator className="w-8 h-8" />,
  },
  {
    title: "Automated FIFO-Based Tax Matching Engine",
    description: "Accurate STCG/LTCG tracking",
    icon: <FaFileInvoiceDollar className="w-8 h-8" />,
  },
];


const Feature = ({ title, description, icon, index }: { title: string; description: string; icon: React.ReactNode; index: number }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-yellow-100 hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 group relative overflow-hidden"
  >
    <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-yellow-700 shadow-lg mb-2">
      {icon}
    </div>
    <div className="font-bold text-neutral-800 text-base md:text-lg tracking-wide mb-2 text-center">
      {title}
    </div>
    <div className="text-sm text-gray-700 text-center mb-2">{description}</div>
    <div className="absolute right-0 top-0 w-16 h-16 bg-yellow-100 rounded-bl-3xl blur-2xl" />
  </motion.div>
);

const FeaturePage = () => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="pb-32 relative bg-white overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-800">Why Choose Our Mutual Fund Platform?</h2>
          <p className="mt-2 text-neutral-500 text-sm">
            Everything you need to grow your investments smartly, securely, and efficiently.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturePage;
