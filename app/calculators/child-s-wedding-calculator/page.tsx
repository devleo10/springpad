"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaRing, FaCalculator } from "react-icons/fa";

export default function ChildWeddingCalculator() {
  const [weddingCost, setWeddingCost] = useState<number>(2000000);
  const [childAge, setChildAge] = useState<number>(5);
  const [weddingAge, setWeddingAge] = useState<number>(25);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [result, setResult] = useState<{
    timeHorizon: string;
    futureWeddingCost: string;
    monthlyInvestment: string;
    totalInvestment: string;
    totalReturns: string;
    futureValueOfCurrentSavings: string;
  } | null>(null);

  const calculateWedding = () => {
    const timeHorizon = weddingAge - childAge;

    if (timeHorizon <= 0) {
      alert("Wedding age should be greater than current age");
      return;
    }

    // Calculate future wedding cost with inflation
    const futureWeddingCost =
      weddingCost * Math.pow(1 + inflationRate / 100, timeHorizon);

    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeHorizon * 12;

    // Future value of current savings
    const futureValueOfCurrentSavings =
      currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Remaining amount needed from SIP
    const remainingAmount = futureWeddingCost - futureValueOfCurrentSavings;

    if (remainingAmount <= 0) {
      setResult({
        timeHorizon: timeHorizon.toString(),
        futureWeddingCost: futureWeddingCost.toFixed(0),
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
        timeHorizon: timeHorizon.toString(),
        futureWeddingCost: futureWeddingCost.toFixed(0),
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
          <FaRing className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Child&apos;s Wedding Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan and save for your child&apos;s wedding expenses with
          inflation-adjusted calculations.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Wedding Planning Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Wedding Cost (₹)
                </label>
                <input
                  type="number"
                  value={weddingCost}
                  onChange={(e) => setWeddingCost(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="100000"
                  step="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Child&apos;s Current Age
                </label>
                <input
                  type="number"
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  max="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Wedding Age
                </label>
                <input
                  type="number"
                  value={weddingAge}
                  onChange={(e) => setWeddingAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="18"
                  max="40"
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
                  Inflation Rate (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1"
                  max="15"
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
                onClick={calculateWedding}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Wedding Planning Results
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Time to Wedding
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {result.timeHorizon} Years
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Future Wedding Cost
                  </h3>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(Number(result.futureWeddingCost))}
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
                Enter wedding planning details and click calculate to see
                results
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Wedding Planning Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • Start saving early to reduce the monthly investment burden
            </li>
            <li>
              • Consider inflation when planning for future wedding expenses
            </li>
            <li>
              • Wedding costs typically increase by 6-8% annually due to
              inflation
            </li>
            <li>
              • Create a separate investment account dedicated to this goal
            </li>
            <li>• Review and adjust your savings plan annually</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
