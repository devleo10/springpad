"use client";

import React, { useState } from "react";
import { FaHome, FaChartLine } from "react-icons/fa";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DreamHomeGoal() {
  const [cost, setCost] = useState(0);
  const [years, setYears] = useState(10);
  const [inflation, setInflation] = useState(6);
  const [futureValue, setFutureValue] = useState<number | null>(null);

  const calculate = () => {
    const fv = cost * Math.pow(1 + inflation / 100, years);
    setFutureValue(fv);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-6">
          <FaHome className="text-yellow-500 text-3xl" />
          <h1 className="text-3xl font-bold">Dream Home Goal Calculator</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Estimate the future cost of your dream home by factoring in inflation and your time horizon.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <img src="/goals/dream-home.png" alt="Dream Home" className="w-full h-40 object-cover rounded mb-6" />
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Current Home Cost (₹)</label>
              <input
                type="number"
                value={cost}
                onChange={e => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                min={0}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Years Until Purchase</label>
              <input
                type="number"
                value={years}
                onChange={e => setYears(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                min={1}
                max={50}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Expected Inflation Rate (%)</label>
              <input
                type="number"
                value={inflation}
                onChange={e => setInflation(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                min={1}
                max={20}
                step={0.1}
              />
            </div>
            <button
              onClick={calculate}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
            >
              <FaChartLine />
              Calculate
            </button>
          </div>

          {/* Result Card */}
          <div className="flex flex-col justify-center">
            {futureValue !== null ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-8 rounded-xl border border-green-200 shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 justify-center">
                  <FaChartLine className="text-green-500" />
                  Future Home Cost
                </h2>
                <div className="text-4xl font-bold text-green-700 mb-2">
                  {formatCurrency(futureValue)}
                </div>
                <p className="text-gray-600">This is the estimated cost of your dream home after {years} years at {inflation}% inflation.</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 shadow text-center text-gray-400 flex flex-col items-center justify-center h-full">
                <FaHome className="text-4xl mb-4" />
                <p>Enter your details and click "Calculate" to see your future home cost.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

