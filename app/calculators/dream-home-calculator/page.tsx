"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaHome, FaCalculator } from "react-icons/fa";

export default function DreamHomeCalculator() {
  const [homePrice, setHomePrice] = useState<number>(5000000);
  const [downPayment, setDownPayment] = useState<number>(20);
  const [timeHorizon, setTimeHorizon] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [result, setResult] = useState<{
    downPaymentAmount: string;
    monthlyInvestment: string;
    totalInvestment: string;
    totalReturns: string;
    futureValueOfCurrentSavings: string;
  } | null>(null);

  const calculateDreamHome = () => {
    const downPaymentAmount = (homePrice * downPayment) / 100;
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeHorizon * 12;

    // Future value of current savings
    const futureValueOfCurrentSavings =
      currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Remaining amount needed from SIP
    const remainingAmount = downPaymentAmount - futureValueOfCurrentSavings;

    if (remainingAmount <= 0) {
      setResult({
        downPaymentAmount: downPaymentAmount.toFixed(0),
        monthlyInvestment: "0",
        totalInvestment: "0",
        totalReturns: (futureValueOfCurrentSavings - currentSavings).toFixed(0),
        futureValueOfCurrentSavings: futureValueOfCurrentSavings.toFixed(0),
      });
    } else {
      // Calculate required monthly SIP
      const futureValueFactor =
        (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      const monthlyInvestment = remainingAmount / futureValueFactor;
      const totalInvestment = monthlyInvestment * totalMonths;
      const totalReturns =
        remainingAmount -
        totalInvestment +
        (futureValueOfCurrentSavings - currentSavings);

      setResult({
        downPaymentAmount: downPaymentAmount.toFixed(0),
        monthlyInvestment: monthlyInvestment.toFixed(0),
        totalInvestment: totalInvestment.toFixed(0),
        totalReturns: totalReturns.toFixed(0),
        futureValueOfCurrentSavings: futureValueOfCurrentSavings.toFixed(0),
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaHome className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Dream Home Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan and calculate how much you need to save monthly for your dream
          home down payment.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Home Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Home Price (₹)
                </label>
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="100000"
                  step="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Down Payment (%)
                </label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="10"
                  max="100"
                  step="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Time to Buy (Years)
                </label>
                <input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1"
                  max="20"
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
                  min="1"
                  max="30"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Savings (₹)
                </label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  step="10000"
                />
              </div>

              <button
                onClick={calculateDreamHome}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Results</h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Down Payment Required
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(Number(result.downPaymentAmount))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Monthly Investment Needed
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(Number(result.monthlyInvestment))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Investment
                  </h3>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(Number(result.totalInvestment))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Future Value of Current Savings
                  </h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {formatCurrency(Number(result.futureValueOfCurrentSavings))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Returns
                  </h3>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(Number(result.totalReturns))}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your home details and click calculate to see results
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • This calculator helps you plan for your dream home down payment
            </li>
            <li>
              • It calculates the monthly investment needed based on your
              timeline
            </li>
            <li>• Considers your current savings and their growth potential</li>
            <li>• Typical down payment ranges from 10-30% of home value</li>
            <li>• Start early to benefit from compound growth</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
