"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaUserShield,
  FaCalculator,
  FaHeartbeat,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function HumanLifeValueCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentIncome, setCurrentIncome] = useState<number>(1000000);
  const [incomeGrowthRate, setIncomeGrowthRate] = useState<number>(6);
  const [discountRate, setDiscountRate] = useState<number>(8);
  const [personalExpenses, setPersonalExpenses] = useState<number>(30);
  const [existingLifeInsurance, setExistingLifeInsurance] =
    useState<number>(500000);
  const [result, setResult] = useState<{
    humanLifeValue: string;
    insuranceNeeded: string;
    totalEarnings: string;
    netContribution: string;
    yearsOfIncome: number;
  } | null>(null);

  const calculateHumanLifeValue = () => {
    const yearsOfIncome = retirementAge - currentAge;
    const netIncomePercentage = (100 - personalExpenses) / 100;

    let totalEarnings = 0;
    let totalNetContribution = 0;

    // Calculate year by year income and present value
    for (let year = 1; year <= yearsOfIncome; year++) {
      const futureIncome =
        currentIncome * Math.pow(1 + incomeGrowthRate / 100, year);
      const netContribution = futureIncome * netIncomePercentage;
      const presentValue =
        netContribution / Math.pow(1 + discountRate / 100, year);

      totalEarnings += futureIncome;
      totalNetContribution += presentValue;
    }

    const humanLifeValue = totalNetContribution;
    const insuranceNeeded = Math.max(0, humanLifeValue - existingLifeInsurance);

    setResult({
      humanLifeValue: humanLifeValue.toFixed(0),
      insuranceNeeded: insuranceNeeded.toFixed(0),
      totalEarnings: totalEarnings.toFixed(0),
      netContribution: totalNetContribution.toFixed(0),
      yearsOfIncome: yearsOfIncome,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLakhs = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return formatCurrency(amount);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaUserShield className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Human Life Value Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate the economic value of your life to determine adequate life
          insurance coverage for your family.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaHeartbeat className="text-red-500" />
              Personal Information
            </h2>

            <div className="space-y-4">
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
                  min={currentAge + 1}
                  max="75"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Annual Income (₹)
                </label>
                <input
                  type="number"
                  value={currentIncome}
                  onChange={(e) => setCurrentIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="100000"
                  step="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Income Growth Rate (% per year)
                </label>
                <input
                  type="number"
                  value={incomeGrowthRate}
                  onChange={(e) => setIncomeGrowthRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  max="20"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Typically 5-8% considering inflation and promotions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Discount Rate (% per year)
                </label>
                <input
                  type="number"
                  value={discountRate}
                  onChange={(e) => setDiscountRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="3"
                  max="15"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Rate to discount future earnings to present value
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Personal Expenses (% of income)
                </label>
                <input
                  type="number"
                  value={personalExpenses}
                  onChange={(e) => setPersonalExpenses(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="10"
                  max="60"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Expenses that benefit only you (not family)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Existing Life Insurance Coverage (₹)
                </label>
                <input
                  type="number"
                  value={existingLifeInsurance}
                  onChange={(e) =>
                    setExistingLifeInsurance(Number(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  step="100000"
                />
              </div>

              <button
                onClick={calculateHumanLifeValue}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate Life Value
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" />
              Life Value Analysis
            </h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h3 className="text-sm font-medium text-gray-600">
                    Human Life Value (Present Value)
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatLakhs(Number(result.humanLifeValue))}
                  </p>
                  <p className="text-xs text-gray-500">
                    Economic value of your future earnings
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                  <h3 className="text-sm font-medium text-gray-600">
                    Additional Insurance Needed
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {formatLakhs(Number(result.insuranceNeeded))}
                  </p>
                  <p className="text-xs text-gray-500">
                    Gap in your current coverage
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Working Years Remaining
                  </h3>
                  <p className="text-xl font-bold text-purple-600">
                    {result.yearsOfIncome} Years
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Existing Insurance Coverage
                  </h3>
                  <p className="text-xl font-bold text-green-600">
                    {formatLakhs(existingLifeInsurance)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Future Earnings (Nominal)
                  </h3>
                  <p className="text-lg font-bold text-gray-700">
                    {formatLakhs(Number(result.totalEarnings))}
                  </p>
                  <p className="text-xs text-gray-500">
                    Future value without discounting
                  </p>
                </div>

                {/* Insurance Recommendation */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Insurance Recommendation
                  </h3>
                  {Number(result.insuranceNeeded) > 0 ? (
                    <div className="text-sm text-gray-700">
                      <p className="mb-2">
                        💡 You need{" "}
                        <strong>
                          {formatLakhs(Number(result.insuranceNeeded))}
                        </strong>{" "}
                        additional life insurance coverage.
                      </p>
                      <p className="text-xs">
                        This will ensure your family can maintain their current
                        lifestyle even without your income.
                      </p>
                    </div>
                  ) : (
                    <div className="text-sm text-green-700">
                      <p className="mb-2">
                        ✅ Your current insurance coverage appears adequate
                        based on your Human Life Value.
                      </p>
                      <p className="text-xs">
                        Consider reviewing this calculation annually as your
                        income and circumstances change.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your personal information and click calculate to see your
                life value analysis
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Understanding Human Life Value
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">What is Human Life Value?</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Present value of your future earning capacity</li>
                <li>
                  • Economic loss your family would face without your income
                </li>
                <li>• Foundation for determining life insurance needs</li>
                <li>• Excludes personal expenses that benefit only you</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Key Considerations</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Review annually as income and age change</li>
                <li>• Consider inflation and career growth prospects</li>
                <li>• Factor in spouse&apos;s earning capacity</li>
                <li>• Include other financial obligations and debts</li>
                <li>• Consider children&apos;s education and marriage costs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
