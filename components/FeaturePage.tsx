"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Dummy feature data with images instead of icons
const features = [
  {
    title: "What’s Moving Your Portfolio?",
    description: "Real-time explainable impact summaries",
    image: "/graph.png",
  },
  {
    title: "Post-Tax XIRR & Cash-in-Hand Returns",
    description: "See true net performance",
    image: "/light.png",
  },
  {
    title: "Smart Tax Harvesting + What-If Simulations",
    description: "Optimize LTCG exemptions",
    image: "/calculator.png",
  },
  {
    title: "Automated FIFO-Based Tax Matching Engine",
    description: "Accurate STCG/LTCG tracking",
    image: "/money.png",
  },
];

const Feature = ({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) => (
  <motion.div
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className="relative flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-yellow-100 group overflow-hidden transition-all duration-300 ease-in-out hover:border-yellow-300 hover:shadow-2xl shadow-xl"
  >
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

    {/* Replacing icon with image */}
    <div className="z-10 w-14 h-14 bg-gradient-to-br to-yellow-400 rounded-xl flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-all ease-in-out duration-300">
      <Image
        src={image}
        alt={title}
        width={28}
        height={28}
        className="object-contain"
      />
    </div>

    <h3 className="z-10 font-semibold text-neutral-800 text-base md:text-lg text-center">
      {title}
    </h3>
    <p className="z-10 text-sm text-gray-700 text-center">{description}</p>

    <div className="z-0 absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 opacity-20 rounded-full blur-2xl pointer-events-none group-hover:opacity-40 transition-opacity duration-300" />
  </motion.div>
);

const FeaturePage = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="py-20 relative bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-neutral-800">
            Why Choose Our Mutual Fund Platform?
          </h2>
          <p className="mt-2 text-neutral-500 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to grow your investments smartly, securely, and
            efficiently.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturePage;
