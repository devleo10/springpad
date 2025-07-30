"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaUserShield,
  FaCalculator,
  FaHeartbeat,
  FaChartLine,
} from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

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

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaUserShield className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Human Life Value Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate the economic value of your life to determine adequate life
          insurance coverage for your family.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" />
                Personal Information
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
                    min={currentAge + 1}
                    max={75}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Annual Income (₹)
                  </label>
                  <Input
                    type="number"
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(Number(e.target.value))}
                    min={100000}
                    step={50000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Income Growth Rate (% per year)
                  </label>
                  <Input
                    type="number"
                    value={incomeGrowthRate}
                    onChange={(e) =>
                      setIncomeGrowthRate(Number(e.target.value))
                    }
                    min={0}
                    max={20}
                    step={0.5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Typically 5-8% considering inflation and promotions
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Rate (% per year)
                  </label>
                  <Input
                    type="number"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    min={3}
                    max={15}
                    step={0.5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rate to discount future earnings to present value
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Personal Expenses (% of income)
                  </label>
                  <Input
                    type="number"
                    value={personalExpenses}
                    onChange={(e) =>
                      setPersonalExpenses(Number(e.target.value))
                    }
                    min={10}
                    max={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Expenses that benefit only you (not family)
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Existing Life Insurance Coverage (₹)
                  </label>
                  <Input
                    type="number"
                    value={existingLifeInsurance}
                    onChange={(e) =>
                      setExistingLifeInsurance(Number(e.target.value))
                    }
                    min={0}
                    step={100000}
                  />
                </div>
              </div>

              <button
                onClick={calculateHumanLifeValue}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate Life Value
              </button>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">
                Understanding Human Life Value
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">
                    What is Human Life Value?
                  </h4>
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
                    <li>
                      • Consider children&apos;s education and marriage costs
                    </li>
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
                    Life Value Analysis
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Human Life Value (Present Value)
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatLakhs(Number(result.humanLifeValue))}
                      </p>
                      <p className="text-xs text-gray-500">
                        Economic value of your future earnings
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-l-4 border-red-500">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Additional Insurance Needed
                      </h3>
                      <p className="text-2xl font-bold text-red-600">
                        {formatLakhs(Number(result.insuranceNeeded))}
                      </p>
                      <p className="text-xs text-gray-500">
                        Gap in your current coverage
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Working Years Remaining
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {result.yearsOfIncome} Years
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Existing Insurance Coverage
                      </h3>
                      <p className="text-xl font-bold text-green-600">
                        {formatLakhs(existingLifeInsurance)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Analysis Summary
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
                        Working Years:
                      </span>
                      <span className="font-semibold">
                        {result.yearsOfIncome} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Annual Income:
                      </span>
                      <span className="font-semibold">
                        {formatLakhs(currentIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Income Growth:
                      </span>
                      <span className="font-semibold">
                        {incomeGrowthRate}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Discount Rate:
                      </span>
                      <span className="font-semibold">
                        {discountRate}% p.a.
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Future Earnings:
                        </span>
                        <span className="font-bold text-gray-700">
                          {formatLakhs(Number(result.totalEarnings))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Insurance Recommendation
                  </h3>
                  {Number(result.insuranceNeeded) > 0 ? (
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-start gap-3">
                        <div className="text-orange-500 text-lg">💡</div>
                        <div>
                          <p className="text-sm text-orange-800 mb-2">
                            <strong>Additional Coverage Needed:</strong>
                          </p>
                          <p className="text-xl font-bold text-orange-700 mb-2">
                            {formatLakhs(Number(result.insuranceNeeded))}
                          </p>
                          <p className="text-xs text-orange-700">
                            This will ensure your family can maintain their
                            current lifestyle even without your income.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="text-green-500 text-lg">✅</div>
                        <div>
                          <p className="text-sm text-green-800 mb-2">
                            <strong>Coverage Appears Adequate</strong>
                          </p>
                          <p className="text-xs text-green-700">
                            Your current insurance coverage appears adequate
                            based on your Human Life Value. Consider reviewing
                            this calculation annually as your income and
                            circumstances change.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Coverage Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Human Life Value:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatLakhs(Number(result.humanLifeValue))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Existing Coverage:
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatLakhs(existingLifeInsurance)}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Coverage Gap:
                        </span>
                        <span
                          className={`font-bold ${
                            Number(result.insuranceNeeded) > 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {Number(result.insuranceNeeded) > 0
                            ? formatLakhs(Number(result.insuranceNeeded))
                            : "Fully Covered"}
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-700">
                          Coverage Ratio:
                        </span>
                        <span className="font-bold text-blue-700">
                          {(
                            (existingLifeInsurance /
                              Number(result.humanLifeValue)) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Enter your personal information and click &quot;Calculate
                    Life Value&quot; to see your life value analysis.
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
