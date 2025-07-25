"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Security feature data matching the design
const features = [
  {
    title: "Verified By Verisign",
    description: "",
    image: "/verification.png",
  },
  {
    title: "No Money Can Be Moved",
    description: "",
    image: "/secure-money-2.png",
  },
  {
    title: "Password Encryption",
    description: "",
    image: "/password.png",
  },
  {
    title: "Bank Level Security",
    description: "",
    image: "/bank-level-security.png",
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
  <div className="flex flex-col items-center text-center space-y-4">
    {/* Feature illustration */}
    <div className="w-32 h-32 mb-4">
      <Image
        src={image}
        alt={title}
        width={128}
        height={128}
        className="object-contain w-full h-full"
      />
    </div>
    
    {/* Feature title */}
    <h3 className="text-lg font-semibold text-[#2C5282]">
      {title}
    </h3>
  </div>
);

const FeaturePage = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2C5282] mb-4">
            Reason To Invest With Us
          </h1>
          <h2 className="text-xl md:text-2xl text-[#2C5282] font-medium">
            Trust Us, Your Savings Are In Safe Hands
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>

        {/* Description */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed">
            We value the trust you place in us that's why, we are committed to keeping highest standards for securing
            transactions and customer confidentiality
          </p>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200 shadow-lg">
            Start Investing with us
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-lg">- OR -</span>
            <button className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-200 shadow-lg">
              Get Call Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturePage;
