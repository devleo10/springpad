"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function SIPTopUpCalculatorPage() {
  const [initialSIP, setInitialSIP] = useState<number>(5000);
  const [topUpPercentage, setTopUpPercentage] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  const calculateSIPTopUp = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    let totalInvestment = 0;
    let futureValue = 0;

    for (let year = 1; year <= timePeriod; year++) {
      const yearlyInvestment =
        initialSIP * Math.pow(1 + topUpPercentage / 100, year - 1);
      const monthsRemaining = (timePeriod - year + 1) * 12;
      const yearlyFutureValue =
        yearlyInvestment *
        12 *
        (((Math.pow(1 + monthlyRate, monthsRemaining) - 1) / monthlyRate) *
          (1 + monthlyRate));

      totalInvestment += yearlyInvestment * 12;
      futureValue += yearlyFutureValue;
    }

    const totalReturns = futureValue - totalInvestment;

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      totalReturns: Math.round(totalReturns),
    };
  };

  const result = calculateSIPTopUp();

  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">SIP TopUp Calculator</h1>
        <p className="text-gray-600 mb-10">
          Calculate returns on your SIP with annual top-up increases.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Monthly SIP Amount (₹)
                </label>
                <input
                  type="number"
                  value={initialSIP}
                  onChange={(e) => setInitialSIP(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Top-up Percentage (%)
                </label>
                <input
                  type="number"
                  value={topUpPercentage}
                  onChange={(e) => setTopUpPercentage(Number(e.target.value))}
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Results</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Investment:</span>
                <span className="font-semibold text-lg">
                  ₹{result.totalInvestment.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Returns:</span>
                <span className="font-semibold text-lg text-green-600">
                  ₹{result.totalReturns.toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Future Value:</span>
                  <span className="font-bold text-xl text-blue-600">
                    ₹{result.futureValue.toLocaleString()}
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
