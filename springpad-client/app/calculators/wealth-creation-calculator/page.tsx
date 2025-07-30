"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaGem,
  FaCalculator,
  FaChartLine,
  FaShieldAlt,
  FaArrowUp,
} from "react-icons/fa";

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

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaGem className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Wealth Creation Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate your wealth growth potential and plan your investment
          strategy for long-term wealth creation.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaArrowUp className="text-green-500" />
                Investment Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target Wealth (₹)
                  </label>
                  <Input
                    type="number"
                    value={targetWealth}
                    onChange={(e) => setTargetWealth(Number(e.target.value))}
                    min={100000}
                    step={100000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your desired wealth goal
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Investment Period (Years)
                  </label>
                  <Input
                    type="number"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    min={1}
                    max={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Time to build wealth
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
                    min={1}
                    max={30}
                    step={0.5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Typical equity funds: 12-15%
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Investment (₹)
                  </label>
                  <Input
                    type="number"
                    value={currentInvestment}
                    onChange={(e) =>
                      setCurrentInvestment(Number(e.target.value))
                    }
                    min={0}
                    step={10000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Existing lump sum investment
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Monthly Investment (₹)
                  </label>
                  <Input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) =>
                      setMonthlyInvestment(Number(e.target.value))
                    }
                    min={0}
                    step={1000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Regular SIP amount for systematic investing
                  </p>
                </div>
              </div>

              <button
                onClick={calculateWealth}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate Wealth Projection
              </button>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">
                Wealth Creation Tips
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Investment Strategy</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Start investing early to maximize compounding</li>
                    <li>
                      • Diversify across asset classes for risk management
                    </li>
                    <li>• Consider step-up SIP for growing income</li>
                    <li>• Stay invested for long-term goals</li>
                    <li>• Review and rebalance portfolio periodically</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Wealth Building Tips</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Combine lump sum and SIP investments</li>
                    <li>• Increase investment with salary increments</li>
                    <li>• Use tax-saving instruments like ELSS</li>
                    <li>• Avoid timing the market</li>
                    <li>• Reinvest dividends for faster growth</li>
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
                    Wealth Projection
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <h3 className="text-sm font-medium text-green-800 mb-1">
                        Future Wealth Value
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(Number(result.futureValue))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        Total Investment
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(result.totalInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">
                        Total Returns
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(Number(result.totalReturns))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                      <h3 className="text-sm font-medium text-yellow-800 mb-1">
                        Wealth Multiplier
                      </h3>
                      <p className="text-xl font-bold text-yellow-600">
                        {result.wealthMultiplier}x
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Target Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <h4 className="text-sm font-medium text-orange-800 mb-1">
                        Monthly SIP for Target
                      </h4>
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(
                          Number(result.requiredMonthlyToReachTarget)
                        )}
                      </p>
                      <p className="text-xs text-orange-700 mt-1">
                        Required to reach ₹
                        {(targetWealth / 10000000).toFixed(1)} Cr goal
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Goal Achievement Status
                      </h4>
                      {Number(result.futureValue) >= targetWealth ? (
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-lg">✅</span>
                          <span className="text-green-700 font-medium">
                            Target Achieved!
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 text-lg">⚠️</span>
                          <span className="text-yellow-700 font-medium">
                            Shortfall:{" "}
                            {formatCurrency(
                              targetWealth - Number(result.futureValue)
                            )}
                          </span>
                        </div>
                      )}
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
                        Target Wealth:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(targetWealth)}
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
                        Expected Return:
                      </span>
                      <span className="font-semibold">
                        {expectedReturn}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Investment:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(currentInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly SIP:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(monthlyInvestment)}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Projected Wealth:
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(Number(result.futureValue))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4">
                    Wealth Building Strategy
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700 mb-2">
                        Asset Allocation
                      </h4>
                      <ul className="space-y-1 text-xs text-green-600">
                        <li>• Equity: 70-80% for long-term growth</li>
                        <li>• Debt: 15-25% for stability</li>
                        <li>• Gold: 5-10% for diversification</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Investment Approach
                      </h4>
                      <ul className="space-y-1 text-xs text-blue-600">
                        <li>• Use SIP for rupee cost averaging</li>
                        <li>• Invest lump sum during market dips</li>
                        <li>• Increase SIP with salary growth</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-700 mb-2">
                        Long-term Focus
                      </h4>
                      <ul className="space-y-1 text-xs text-purple-600">
                        <li>• Stay invested through market cycles</li>
                        <li>• Don&apos;t panic during volatility</li>
                        <li>• Review annually, don&apos;t trade frequently</li>
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
                    Enter your investment details and click &quot;Calculate
                    Wealth Projection&quot; to see your wealth building plan.
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
