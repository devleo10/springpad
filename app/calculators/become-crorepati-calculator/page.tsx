"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaRupeeSign, FaCalculator } from "react-icons/fa";

export default function BecomeCrorepatiCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [targetAmount, setTargetAmount] = useState<number>(10000000); // 1 Crore
  const [result, setResult] = useState<{
    timeInYears: string;
    timeInMonths: number;
    totalInvestment: string;
    totalReturns: string;
  } | null>(null);

  const calculateCrorepati = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const targetAmountNumber = targetAmount;

    // Calculate time to reach target using SIP formula
    // FV = PMT * [((1 + r)^n - 1) / r]
    // Solving for n: n = log(1 + (FV * r) / PMT) / log(1 + r)

    if (monthlyRate === 0) {
      const timeInMonths = targetAmountNumber / monthlyInvestment;
      const timeInYears = timeInMonths / 12;
      setResult({
        timeInYears: timeInYears.toFixed(1),
        timeInMonths: Math.ceil(timeInMonths),
        totalInvestment: (monthlyInvestment * timeInMonths).toFixed(0),
        totalReturns: "0",
      });
    } else {
      const numerator = Math.log(
        1 + (targetAmountNumber * monthlyRate) / monthlyInvestment
      );
      const denominator = Math.log(1 + monthlyRate);
      const timeInMonths = numerator / denominator;
      const timeInYears = timeInMonths / 12;
      const totalInvestment = monthlyInvestment * timeInMonths;
      const totalReturns = targetAmountNumber - totalInvestment;

      setResult({
        timeInYears: timeInYears.toFixed(1),
        timeInMonths: Math.ceil(timeInMonths),
        totalInvestment: totalInvestment.toFixed(0),
        totalReturns: totalReturns.toFixed(0),
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
          <FaRupeeSign className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Become Crorepati Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate how long it will take to become a crorepati with your
          monthly SIP investments.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="500"
                  step="500"
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
                  Target Amount (₹)
                </label>
                <select
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value={1000000}>10 Lakh</option>
                  <option value={2500000}>25 Lakh</option>
                  <option value={5000000}>50 Lakh</option>
                  <option value={10000000}>1 Crore</option>
                  <option value={25000000}>2.5 Crore</option>
                  <option value={50000000}>5 Crore</option>
                  <option value={100000000}>10 Crore</option>
                </select>
              </div>

              <button
                onClick={calculateCrorepati}
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
                    Time to Reach Target
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {result.timeInYears} Years
                  </p>
                  <p className="text-sm text-gray-500">
                    ({result.timeInMonths} months)
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Investment
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(Number(result.totalInvestment))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Returns
                  </h3>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(Number(result.totalReturns))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Target Amount
                  </h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {formatCurrency(targetAmount)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your investment details and click calculate to see results
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • This calculator uses the SIP (Systematic Investment Plan)
              formula to determine the time needed to reach your target amount
            </li>
            <li>
              • The calculation assumes a consistent monthly investment and
              expected annual return
            </li>
            <li>
              • Returns are compounded monthly for more accurate calculations
            </li>
            <li>
              • Past performance doesn&apos;t guarantee future results. Actual
              returns may vary
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
