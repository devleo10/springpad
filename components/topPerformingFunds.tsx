"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Fund {
  id: string;
  name: string;
  category: string;
  logo: string;
  logoColor: string;
  launchDate: string;
  aum: string;
  returns: {
    oneYear: string;
    threeYear: string;
    fiveYear: string;
  };
}

const fetchFunds = async (category: string): Promise<Fund[]> => {
  await new Promise((res) => setTimeout(res, 1000));
  return Array(4)
    .fill(0)
    .map((_, i) => ({
      id: `${i}`,
      name: "Motilal Oswal Flexi Cap Fund Regular Plan-Growth Option",
      category,
      logo: "mo",
      logoColor: "bg-blue-600",
      launchDate: "08-04-2014",
      aum: "1,342.70",
      returns: { oneYear: "12.18", threeYear: "26.05", fiveYear: "20.12" },
    }));
};

export default function TopPerformingFunds() {
  const categories = [
    "Equity: Flexi Cap",
    "Equity: Large Cap",
    "Equity: Mid Cap",
    "Equity: Small Cap",
  ];

  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [funds, setFunds] = useState<Fund[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFunds = async () => {
      setLoading(true);
      const data = await fetchFunds(selectedCategory);
      setFunds(data);
      setLoading(false);
    };
    loadFunds();
  }, [selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-br from-yellow-50 to-yellow-200 py-16 overflow-hidden"
    >
      {/* Blend Top White to Yellow */}
      <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-32 right-1/4 w-40 h-40 bg-orange-200/30 rounded-full blur-2xl animate-float-fast"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 space-y-12">
        {/* Header and Category Filter */}
        <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 bg-clip-text mb-2">
              Top Performing Funds
            </h1>
            <p className="text-gray-600 text-sm">
              Discover the best investment opportunities
            </p>
          </div>

          <div className="relative">
            <motion.button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-white/70 backdrop-blur-lg border border-yellow-200 rounded-xl px-5 py-3 text-gray-700 hover:bg-white/90 hover:shadow-md transition"
            >
              <span className="font-medium">{selectedCategory}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 mt-3 w-72 bg-white border border-yellow-200 rounded-xl shadow-xl z-30"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-yellow-50 text-gray-700 text-sm"
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Cards Section */}
        {loading ? (
          <div className="text-center text-yellow-600 py-20 font-semibold">
            Loading funds...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {funds.map((fund) => (
              <motion.div
                key={fund.id}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative bg-white/60 backdrop-blur-lg rounded-xl p-5 border border-yellow-100 hover:border-yellow-300 hover:shadow-2xl transition-all overflow-hidden"
              >
                {/* Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-yellow-50/30 rounded-xl pointer-events-none" />
                <div className="absolute right-0 top-0 w-16 h-16 bg-yellow-100/50 rounded-bl-2xl blur-2xl opacity-50 group-hover:opacity-70 transition" />

                {/* Fund Header */}
                <div className="relative z-10 flex items-start gap-4 mb-5">
                  <div
                    className={`w-12 h-12 ${fund.logoColor} rounded-lg flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {fund.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1 leading-tight">
                      {fund.name}
                    </h3>
                    <span className="text-[10px] px-2 py-1 rounded-md bg-orange-400 text-white font-semibold inline-block">
                      {fund.category}
                    </span>
                  </div>
                </div>

                {/* Fund Stats */}
                <div className="relative z-10 space-y-4 text-xs text-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-yellow-50/60 rounded p-2 border">
                      <p className="text-[10px] text-gray-500">
                        📅 Launch Date
                      </p>
                      <p className="font-bold text-gray-900">
                        {fund.launchDate}
                      </p>
                    </div>
                    <div className="bg-orange-50/60 rounded p-2 border">
                      <p className="text-[10px] text-gray-500">💰 AUM (Cr)</p>
                      <p className="font-bold text-gray-900">₹{fund.aum}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-2 border">
                    <p className="font-semibold mb-2">📈 Returns (%)</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-green-600 font-bold">
                      <div className="bg-white/60 p-2 rounded border">
                        {fund.returns.oneYear}%
                        <p className="text-[10px] text-gray-500">1Y</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded border">
                        {fund.returns.threeYear}%
                        <p className="text-[10px] text-gray-500">3Y</p>
                      </div>
                      <div className="bg-white/60 p-2 rounded border">
                        {fund.returns.fiveYear}%
                        <p className="text-[10px] text-gray-500">5Y</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-3 bg-yellow-300 hover:bg-yellow-400 text-black font-bold py-2 rounded-lg shadow-sm transition">
                    Invest Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Blend Bottom Yellow to White */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
    </motion.div>
  );
}
