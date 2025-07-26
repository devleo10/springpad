"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaMoneyCheckAlt,
  FaCalculator,
  FaChartLine,
  FaShieldAlt,
  FaArrowDown,
} from "react-icons/fa";

export default function SwpCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number>(1000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number>(10000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [result, setResult] = useState<{
    totalWithdrawals: string;
    remainingAmount: string;
    lastMonthBalance: string;
    canSustain: boolean;
    sustainablePeriod?: number;
  } | null>(null);

  const calculateSwp = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;
    let currentBalance = initialInvestment;
    let totalWithdrawn = 0;
    let monthCount = 0;

    // Calculate month by month
    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly returns
      currentBalance = currentBalance * (1 + monthlyRate);

      // Subtract monthly withdrawal
      if (currentBalance >= monthlyWithdrawal) {
        currentBalance -= monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;
        monthCount = month;
      } else {
        // If balance is insufficient, withdraw whatever is left
        totalWithdrawn += currentBalance;
        currentBalance = 0;
        monthCount = month;
        break;
      }
    }

    const canSustain = currentBalance > 0 && monthCount === totalMonths;

    setResult({
      totalWithdrawals: totalWithdrawn.toFixed(0),
      remainingAmount: currentBalance.toFixed(0),
      lastMonthBalance: currentBalance.toFixed(0),
      canSustain,
      sustainablePeriod: canSustain ? undefined : Math.floor(monthCount / 12),
    });
  };

  const calculateMaxWithdrawal = () => {
    // Calculate maximum sustainable monthly withdrawal
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;

    if (monthlyRate === 0) {
      return initialInvestment / totalMonths;
    }

    // Using PMT formula for annuity
    const presentValue = initialInvestment;
    const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
    const maxWithdrawal =
      (presentValue * monthlyRate * compoundFactor) / (compoundFactor - 1);

    return maxWithdrawal;
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
          <FaMoneyCheckAlt className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SWP Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate how long your investments will last with systematic
          withdrawal plan (SWP) and plan your regular income.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaArrowDown className="text-red-500" />
                SWP Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Initial Investment Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) =>
                      setInitialInvestment(Number(e.target.value))
                    }
                    min={100000}
                    step={50000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your starting corpus amount
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Withdrawal Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={monthlyWithdrawal}
                    onChange={(e) =>
                      setMonthlyWithdrawal(Number(e.target.value))
                    }
                    min={1000}
                    step={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Regular income you want to withdraw
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Annual Return (%)
                  </label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    min={6}
                    max={20}
                    step={0.5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Expected fund performance
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Withdrawal Period (Years)
                  </label>
                  <Input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    min={1}
                    max={30}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    How long you need the income
                  </p>
                </div>
              </div>

              <button
                onClick={calculateSwp}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate SWP
              </button>

              <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>💡 Suggested Maximum Monthly Withdrawal:</strong>
                  <br />
                  <span className="text-lg font-bold text-blue-800">
                    {formatCurrency(calculateMaxWithdrawal())}
                  </span>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This amount can be withdrawn sustainably for {timePeriod}{" "}
                  years
                </p>
              </div>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">
                About SWP (Systematic Withdrawal Plan)
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Key Benefits</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Regular income stream from investments</li>
                    <li>• Money continues to earn returns</li>
                    <li>• Tax-efficient compared to FDs</li>
                    <li>• Flexible - can modify or stop anytime</li>
                    <li>• Ideal for retirement planning</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Best Practices</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Keep withdrawal rate under 6-8% annually</li>
                    <li>• Choose balanced or hybrid funds</li>
                    <li>• Monitor fund performance regularly</li>
                    <li>• Have emergency corpus separate</li>
                    <li>• Consider inflation impact over time</li>
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
                    SWP Analysis
                  </h2>

                  <div className="space-y-4">
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        result.canSustain
                          ? "bg-gradient-to-r from-green-50 to-green-100 border-green-300"
                          : "bg-gradient-to-r from-red-50 to-red-100 border-red-300"
                      }`}
                    >
                      <h3
                        className={`text-sm font-medium mb-1 ${
                          result.canSustain ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        Sustainability Status
                      </h3>
                      <p
                        className={`text-lg font-bold ${
                          result.canSustain ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {result.canSustain
                          ? "✅ Sustainable"
                          : "⚠️ Not Sustainable"}
                      </p>
                      {!result.canSustain && result.sustainablePeriod && (
                        <p className="text-sm text-red-600 mt-1">
                          Will last for only {result.sustainablePeriod} years
                        </p>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        Total Withdrawals
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(result.totalWithdrawals))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">
                        Remaining Amount
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(Number(result.remainingAmount))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                      <h3 className="text-sm font-medium text-yellow-800 mb-1">
                        Withdrawal Efficiency
                      </h3>
                      <p className="text-lg font-bold text-yellow-600">
                        {(
                          (Number(result.totalWithdrawals) /
                            initialInvestment) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        of initial investment withdrawn
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
                        Initial Investment:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(initialInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly Withdrawal:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(monthlyWithdrawal)}
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
                        Withdrawal Period:
                      </span>
                      <span className="font-semibold">{timePeriod} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Annual Withdrawal Rate:
                      </span>
                      <span className="font-semibold">
                        {(
                          ((monthlyWithdrawal * 12) / initialInvestment) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Corpus Sustainability:
                        </span>
                        <span
                          className={`font-bold ${
                            result.canSustain
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {result.canSustain ? "Sustainable" : "Insufficient"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4">
                    SWP Strategy Tips
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700 mb-2">
                        Optimal Withdrawal Rate
                      </h4>
                      <ul className="space-y-1 text-xs text-green-600">
                        <li>• Keep annual withdrawal under 6-8%</li>
                        <li>• Monitor and adjust based on performance</li>
                        <li>• Consider inflation impact</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Fund Selection
                      </h4>
                      <ul className="space-y-1 text-xs text-blue-600">
                        <li>• Choose balanced/hybrid funds</li>
                        <li>• Avoid high-risk equity funds</li>
                        <li>• Consider dividend-paying funds</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-700 mb-2">
                        Risk Management
                      </h4>
                      <ul className="space-y-1 text-xs text-purple-600">
                        <li>• Maintain emergency fund separately</li>
                        <li>• Review portfolio quarterly</li>
                        <li>• Have backup income sources</li>
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
                    Enter your SWP details and click &quot;Calculate SWP&quot;
                    to see your withdrawal analysis.
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
