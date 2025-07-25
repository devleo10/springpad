"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaGem, FaCalculator } from "react-icons/fa";

export default function WealthCreationCalculator() {
  const [targetWealth, setTargetWealth] = useState<number>(10000000);
  const [timeHorizon, setTimeHorizon] = useState<number>(15);
  const [expectedReturn, setExpectedReturn] = useState<number>(14);
  const [currentInvestment, setCurrentInvestment] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [result, setResult] = useState<{
    futureValue: string;
    totalInvestment: string;
    totalReturns: string;
    wealthMultiplier: string;
    requiredMonthlyToReachTarget: string;
  } | null>(null);

  const calculateWealth = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeHorizon * 12;

    // Future value of current investment (lump sum)
    const futureValueOfCurrent =
      currentInvestment * Math.pow(1 + monthlyRate, totalMonths);

    // Future value of monthly SIP
    const futureValueOfSIP =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    const totalFutureValue = futureValueOfCurrent + futureValueOfSIP;
    const totalInvestment = currentInvestment + monthlyInvestment * totalMonths;
    const totalReturns = totalFutureValue - totalInvestment;
    const wealthMultiplier =
      totalInvestment > 0 ? totalFutureValue / totalInvestment : 0;

    // Calculate required monthly investment to reach target
    const remainingTargetAfterCurrent = targetWealth - futureValueOfCurrent;
    const requiredMonthlyToReachTarget =
      remainingTargetAfterCurrent > 0
        ? remainingTargetAfterCurrent /
          ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
        : 0;

    setResult({
      futureValue: totalFutureValue.toFixed(0),
      totalInvestment: totalInvestment.toFixed(0),
      totalReturns: totalReturns.toFixed(0),
      wealthMultiplier: wealthMultiplier.toFixed(2),
      requiredMonthlyToReachTarget: Math.max(
        0,
        requiredMonthlyToReachTarget
      ).toFixed(0),
    });
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
          <FaGem className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Wealth Creation Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate your wealth growth potential and plan your investment
          strategy for long-term wealth creation.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Wealth (₹)
                </label>
                <input
                  type="number"
                  value={targetWealth}
                  onChange={(e) => setTargetWealth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="100000"
                  step="100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1"
                  max="50"
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
                  Current Investment (₹)
                </label>
                <input
                  type="number"
                  value={currentInvestment}
                  onChange={(e) => setCurrentInvestment(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  step="10000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Investment (₹)
                </label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  step="1000"
                />
              </div>

              <button
                onClick={calculateWealth}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Wealth Projection</h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Future Wealth Value
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(Number(result.futureValue))}
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
                    Wealth Multiplier
                  </h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {result.wealthMultiplier}x
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Monthly SIP for Target
                  </h3>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(
                      Number(result.requiredMonthlyToReachTarget)
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your investment details and click calculate to see
                projections
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Wealth Creation Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • Start investing early to maximize the power of compounding
            </li>
            <li>
              • Diversify your portfolio across asset classes for better risk
              management
            </li>
            <li>
              • Consider increasing your investment amount annually (step-up
              SIP)
            </li>
            <li>
              • Stay invested for the long term to ride out market volatility
            </li>
            <li>• Review and rebalance your portfolio periodically</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
