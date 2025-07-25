"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaRegClock,
  FaCalculator,
  FaChartLine,
  FaPiggyBank,
  FaShieldAlt,
} from "react-icons/fa";

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
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaRegClock className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Retirement Planning Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan your retirement with our comprehensive calculator. Determine how
          much you need to save monthly for a comfortable retirement.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaPiggyBank className="text-blue-500" />
                Retirement Planning Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Age
                  </label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    min={18}
                    max={65}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Retirement Age
                  </label>
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    min={50}
                    max={75}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Monthly Expenses (₹)
                  </label>
                  <Input
                    type="number"
                    value={currentExpenses}
                    onChange={(e) => setCurrentExpenses(Number(e.target.value))}
                    min={10000}
                    step={5000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Inflation Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    min={3}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Annual Return (%)
                  </label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    min={8}
                    max={20}
                    step={0.5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Existing Retirement Savings (₹)
                  </label>
                  <Input
                    type="number"
                    value={existingSavings}
                    onChange={(e) => setExistingSavings(Number(e.target.value))}
                    min={0}
                    step={50000}
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
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">
                Retirement Planning Tips
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Key Principles</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      • The 25x rule: You need 25 times your annual expenses
                    </li>
                    <li>• Start early to benefit from compounding</li>
                    <li>• Consider inflation while planning expenses</li>
                    <li>• Diversify across different asset classes</li>
                    <li>• Review and adjust periodically</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Investment Options</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• ELSS for tax-efficient equity exposure</li>
                    <li>• PPF for long-term tax-free savings</li>
                    <li>• NPS for retirement-focused investing</li>
                    <li>• Mutual funds for diversification</li>
                    <li>• Fixed deposits for stability</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    Retirement Analysis
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        Years to Retirement
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {result.yearsToRetirement} Years
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                      <h3 className="text-sm font-medium text-red-800 mb-1">
                        Future Monthly Expenses
                      </h3>
                      <p className="text-lg font-bold text-red-600">
                        {formatCurrency(Number(result.futureExpenses))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">
                        Corpus Required
                      </h3>
                      <p className="text-lg font-bold text-purple-600">
                        {formatCurrencyLakhs(Number(result.corpusRequired))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <h3 className="text-sm font-medium text-green-800 mb-1">
                        Existing Savings Future Value
                      </h3>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrencyLakhs(
                          Number(result.existingCorpusValue)
                        )}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-300">
                      <h3 className="text-sm font-medium text-yellow-800 mb-1">
                        Monthly SIP Required
                      </h3>
                      <p className="text-xl font-bold text-yellow-600">
                        {Number(result.monthlySipRequired) === 0
                          ? "No Additional SIP Required!"
                          : formatCurrency(Number(result.monthlySipRequired))}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Investment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Age:
                      </span>
                      <span className="font-semibold">{currentAge} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Retirement Age:
                      </span>
                      <span className="font-semibold">
                        {retirementAge} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Monthly Expenses:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(currentExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Expected Return:
                      </span>
                      <span className="font-semibold">
                        {expectedReturn}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Inflation Rate:
                      </span>
                      <span className="font-semibold">
                        {inflationRate}% p.a.
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          SIP Required:
                        </span>
                        <span className="font-bold text-yellow-600">
                          {Number(result.monthlySipRequired) === 0
                            ? "₹0"
                            : formatCurrency(Number(result.monthlySipRequired))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4">
                    Retirement Strategy
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700 mb-2">
                        Early Stage (20-35)
                      </h4>
                      <ul className="space-y-1 text-xs text-green-600">
                        <li>• Focus on growth assets</li>
                        <li>• Higher equity allocation</li>
                        <li>• Take advantage of time</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Mid Stage (35-50)
                      </h4>
                      <ul className="space-y-1 text-xs text-blue-600">
                        <li>• Balanced approach</li>
                        <li>• Diversify across assets</li>
                        <li>• Increase savings rate</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-700 mb-2">
                        Pre-Retirement (50+)
                      </h4>
                      <ul className="space-y-1 text-xs text-purple-600">
                        <li>• Reduce risk exposure</li>
                        <li>• Focus on preservation</li>
                        <li>• Plan withdrawal strategy</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaShieldAlt className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Enter your retirement details and click &quot;Calculate
                    Retirement Plan&quot; to see your analysis.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
