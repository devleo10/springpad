"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaRegClock, FaCalculator } from "react-icons/fa";

export default function RetirementPlanningCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentExpenses, setCurrentExpenses] = useState<number>(50000);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [existingSavings, setExistingSavings] = useState<number>(500000);
  const [result, setResult] = useState<{
    yearsToRetirement: number;
    futureExpenses: string;
    corpusRequired: string;
    monthlySipRequired: string;
    existingCorpusValue: string;
  } | null>(null);

  const calculateRetirement = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;

    // Calculate future monthly expenses considering inflation
    const futureExpenses =
      currentExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);

    // Calculate corpus required (assuming 25x annual expenses for retirement)
    const corpusRequired = futureExpenses * 12 * 25;

    // Calculate future value of existing savings
    const existingCorpusValue =
      existingSavings * Math.pow(1 + expectedReturn / 100, yearsToRetirement);

    // Calculate additional corpus needed
    const additionalCorpusNeeded = Math.max(
      0,
      corpusRequired - existingCorpusValue
    );

    // Calculate monthly SIP required to accumulate additional corpus
    const monthlyRate = expectedReturn / 100 / 12;
    let monthlySipRequired = 0;

    if (additionalCorpusNeeded > 0) {
      if (monthlyRate === 0) {
        monthlySipRequired = additionalCorpusNeeded / monthsToRetirement;
      } else {
        const compoundFactor = Math.pow(1 + monthlyRate, monthsToRetirement);
        monthlySipRequired =
          (additionalCorpusNeeded * monthlyRate) /
          ((compoundFactor - 1) * (1 + monthlyRate));
      }
    }

    setResult({
      yearsToRetirement,
      futureExpenses: futureExpenses.toFixed(0),
      corpusRequired: corpusRequired.toFixed(0),
      monthlySipRequired: monthlySipRequired.toFixed(0),
      existingCorpusValue: existingCorpusValue.toFixed(0),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyLakhs = (amount: number) => {
    const lakhs = amount / 100000;
    if (lakhs >= 100) {
      const crores = lakhs / 100;
      return `₹${crores.toFixed(1)} Cr`;
    }
    return `₹${lakhs.toFixed(1)} L`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 pt-18">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaRegClock className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Retirement Planning Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan your retirement with our comprehensive calculator. Determine how
          much you need to save monthly for a comfortable retirement.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Retirement Planning Details
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="18"
                  max="65"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Retirement Age
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="50"
                  max="75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Monthly Expenses (₹)
                </label>
                <input
                  type="number"
                  value={currentExpenses}
                  onChange={(e) => setCurrentExpenses(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="10000"
                  step="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Inflation Rate (%)
                </label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="3"
                  max="10"
                  step="0.5"
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
                  min="8"
                  max="20"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Existing Retirement Savings (₹)
                </label>
                <input
                  type="number"
                  value={existingSavings}
                  onChange={(e) => setExistingSavings(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  step="50000"
                />
              </div>
            </div>

            <button
              onClick={calculateRetirement}
              className="w-full mt-6 bg-yellow-500 text-white py-3 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              disabled={currentAge >= retirementAge}
            >
              <FaCalculator />
              Calculate Retirement Plan
            </button>

            {currentAge >= retirementAge && (
              <p className="text-red-500 text-sm mt-2 text-center">
                Retirement age should be greater than current age
              </p>
            )}
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Retirement Analysis</h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Years to Retirement
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {result.yearsToRetirement} Years
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Future Monthly Expenses
                  </h3>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(Number(result.futureExpenses))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Corpus Required
                  </h3>
                  <p className="text-lg font-bold text-purple-600">
                    {formatCurrencyLakhs(Number(result.corpusRequired))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Existing Savings Future Value
                  </h3>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrencyLakhs(Number(result.existingCorpusValue))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200">
                  <h3 className="text-sm font-medium text-gray-600">
                    Monthly SIP Required
                  </h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {Number(result.monthlySipRequired) === 0
                      ? "No Additional SIP Required!"
                      : formatCurrency(Number(result.monthlySipRequired))}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your details and click calculate to see your retirement
                plan
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Retirement Planning Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • The 25x rule: You need 25 times your annual expenses as
              retirement corpus
            </li>
            <li>• Start early to benefit from the power of compounding</li>
            <li>• Consider inflation while planning for retirement expenses</li>
            <li>
              • Diversify your retirement portfolio across different asset
              classes
            </li>
            <li>• Review and adjust your retirement plan periodically</li>
            <li>
              • Consider tax-efficient investment options like ELSS, PPF, and
              NPS
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
