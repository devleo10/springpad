"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function LumpsumTargetCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number>(1000000);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);

  const calculateLumpsumTarget = () => {
    // Calculate required lumpsum investment to achieve target amount
    const requiredInvestment =
      targetAmount / Math.pow(1 + expectedReturn / 100, timePeriod);

    return {
      requiredInvestment: Math.round(requiredInvestment),
      targetAmount: targetAmount,
      totalReturns: Math.round(targetAmount - requiredInvestment),
    };
  };

  const result = calculateLumpsumTarget();

  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Lumpsum Target Calculator</h1>
        <p className="text-gray-600 mb-10">
          Calculate the lumpsum investment required to achieve your financial
          goal.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Goal Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Amount (₹)
                </label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Results</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Required Investment:</span>
                <span className="font-bold text-xl text-blue-600">
                  ₹{result.requiredInvestment.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expected Returns:</span>
                <span className="font-semibold text-lg text-green-600">
                  ₹{result.totalReturns.toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Target Amount:</span>
                  <span className="font-bold text-xl text-green-600">
                    ₹{result.targetAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
