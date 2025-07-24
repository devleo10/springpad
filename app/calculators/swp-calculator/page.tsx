"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaMoneyCheckAlt, FaCalculator } from "react-icons/fa";

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
    <div className="min-h-screen bg-white text-neutral-800">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaMoneyCheckAlt className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SWP Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate how long your investments will last with systematic
          withdrawal plan (SWP) and plan your regular income.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">SWP Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="100000"
                  step="50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Withdrawal Amount (₹)
                </label>
                <input
                  type="number"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1000"
                  step="1000"
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
                  min="6"
                  max="20"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Withdrawal Period (Years)
                </label>
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1"
                  max="30"
                />
              </div>

              <button
                onClick={calculateSwp}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate SWP
              </button>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Suggested Maximum Monthly Withdrawal:</strong>
                  <br />
                  {formatCurrency(calculateMaxWithdrawal())}
                </p>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">SWP Analysis</h2>

            {result ? (
              <div className="space-y-4">
                <div
                  className={`bg-white p-4 rounded-lg shadow-sm ${
                    !result.canSustain
                      ? "border-l-4 border-red-500"
                      : "border-l-4 border-green-500"
                  }`}
                >
                  <h3 className="text-sm font-medium text-gray-600">
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
                    <p className="text-sm text-red-600">
                      Will last for {result.sustainablePeriod} years only
                    </p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Withdrawals
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(Number(result.totalWithdrawals))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Remaining Amount
                  </h3>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(Number(result.remainingAmount))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Withdrawal Efficiency
                  </h3>
                  <p className="text-lg font-bold text-yellow-600">
                    {(
                      (Number(result.totalWithdrawals) / initialInvestment) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-xs text-gray-500">
                    of initial investment withdrawn
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Monthly Income
                  </h3>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(monthlyWithdrawal)}
                  </p>
                  <p className="text-xs text-gray-500">
                    for {timePeriod} years
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your SWP details and click calculate to see results
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            About SWP (Systematic Withdrawal Plan)
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • SWP allows you to withdraw a fixed amount regularly from your
              mutual fund investments
            </li>
            <li>
              • It provides a steady income stream while keeping your money
              invested
            </li>
            <li>
              • The remaining amount continues to earn returns based on fund
              performance
            </li>
            <li>
              • Ideal for retirees or those needing regular income from
              investments
            </li>
            <li>
              • Tax-efficient compared to traditional fixed deposits for
              long-term withdrawals
            </li>
            <li>
              • You can modify or stop SWP at any time based on your needs
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
