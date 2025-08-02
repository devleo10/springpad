"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaClipboardList, FaCalculator, FaChartLine } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function GoalSettingCalculator() {
  const [goalAmount, setGoalAmount] = useState<number | "">(1000000);
  const [timeHorizon, setTimeHorizon] = useState<number | "">(10);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [currentSavings, setCurrentSavings] = useState<number | "">(0);
  // Format number with commas for input display
  const formatNumberWithCommas = (value: string | number): string => {
    if (value === "" || isNaN(Number(value))) return "";
    const [integer, decimal] = String(value).split(".");
    const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimal ? `${formattedInt}.${decimal}` : formattedInt;
  };
  const [result, setResult] = useState<{
    monthlyInvestment: string;
    totalInvestment: string;
    totalReturns: string;
    futureValueOfCurrentSavings: string;
  } | null>(null);

  const calculateGoal = () => {
    // Type guards for empty string values
    const goalAmt = goalAmount === "" ? 0 : Number(goalAmount);
    const timeH = timeHorizon === "" ? 0 : Number(timeHorizon);
    const expReturn = expectedReturn === "" ? 0 : Number(expectedReturn);
    const currSavings = currentSavings === "" ? 0 : Number(currentSavings);

    const monthlyRate = expReturn / 100 / 12;
    const totalMonths = timeH * 12;

    // Future value of current savings
    const futureValueOfCurrentSavings =
      currSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Remaining amount needed from SIP
    const remainingAmount = goalAmt - futureValueOfCurrentSavings;

    if (remainingAmount <= 0) {
      setResult({
        monthlyInvestment: "0",
        totalInvestment: "0",
        totalReturns: (futureValueOfCurrentSavings - currSavings).toFixed(0),
        futureValueOfCurrentSavings: futureValueOfCurrentSavings.toFixed(0),
      });
    } else {
      // Calculate required monthly SIP using future value formula
      // FV = PMT * [((1 + r)^n - 1) / r]
      // PMT = FV / [((1 + r)^n - 1) / r]
      const futureValueFactor =
        (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      const monthlyInvestment = remainingAmount / futureValueFactor;
      const totalInvestment = monthlyInvestment * totalMonths;
      const totalReturns =
        remainingAmount -
        totalInvestment +
        (futureValueOfCurrentSavings - currSavings);

      setResult({
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

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaClipboardList className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Goal Setting Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan your financial goals and calculate how much you need to invest
          monthly to achieve them.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Goal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Goal Amount (₹)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(goalAmount)}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const cleaned = rawValue.replace(/[^0-9.]/g, "");
                      setGoalAmount(cleaned === "" ? "" : Number(cleaned));
                    }}
                    min={10000}
                    step={10000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time Horizon (Years)
                  </label>
                  <Input
                    type="number"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    min={1}
                    max={50}
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
                    min={1}
                    max={30}
                    step={0.5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Savings (₹)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(currentSavings)}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const cleaned = rawValue.replace(/[^0-9.]/g, "");
                      setCurrentSavings(cleaned === "" ? "" : Number(cleaned));
                    }}
                    min={0}
                    step={1000}
                  />
                </div>
              </div>

              <button
                onClick={calculateGoal}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • This calculator helps you determine the monthly investment
                  needed to achieve your financial goals
                </li>
                <li>
                  • It considers your current savings and their future growth
                  potential
                </li>
                <li>
                  • The calculation uses compound interest to project future
                  values
                </li>
                <li>
                  • Adjust the expected return based on your risk appetite and
                  investment choices
                </li>
                <li>
                  • Review and adjust your goals periodically based on changing
                  circumstances
                </li>
              </ul>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    Goal Plan
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Required Monthly Investment
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(Number(result.monthlyInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Investment Needed
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(result.totalInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Future Value of Current Savings
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(
                          Number(result.futureValueOfCurrentSavings)
                        )}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Returns
                      </h3>
                      <p className="text-xl font-bold text-yellow-600">
                        {formatCurrency(Number(result.totalReturns))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Goal Amount
                      </h3>
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(goalAmount === "" ? 0 : Number(goalAmount))}
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
                        Goal Amount:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(goalAmount === "" ? 0 : Number(goalAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Time Horizon:
                      </span>
                      <span className="font-semibold">{timeHorizon} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Expected Returns:
                      </span>
                      <span className="font-semibold">
                        {expectedReturn}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Savings:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(currentSavings === "" ? 0 : Number(currentSavings))}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Monthly SIP Required:
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(Number(result.monthlyInvestment))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">Goal Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        From Current Savings:
                      </span>
                      <span className="font-semibold text-purple-600">
                        {formatCurrency(
                          Number(result.futureValueOfCurrentSavings)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        From Monthly SIPs:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(
                          (goalAmount === "" ? 0 : Number(goalAmount)) -
                            Number(result.futureValueOfCurrentSavings)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Investment:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(
                          (currentSavings === "" ? 0 : Number(currentSavings)) + Number(result.totalInvestment)
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Returns Earned:
                        </span>
                        <span className="font-bold text-yellow-600">
                          {formatCurrency(Number(result.totalReturns))}
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-700">
                          Returns as % of Investment:
                        </span>
                        <span className="font-bold text-green-700">
                          {(
                            (Number(result.totalReturns) /
                              ((currentSavings === "" ? 0 : Number(currentSavings)) +
                                Number(result.totalInvestment))) *
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
                    Enter your goal details and click &quot;Calculate&quot; to
                    see your investment plan.
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
