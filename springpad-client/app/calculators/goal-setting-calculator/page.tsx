"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaClipboardList, FaChartLine } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function GoalSettingCalculator() {
  const [dreamAmount, setDreamAmount] = useState<number | "">(100000);
  const [years, setYears] = useState<number | "">(10);
  const [inflationRate, setInflationRate] = useState<number | "">(8);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [currentSavings, setCurrentSavings] = useState<number | "">(0);
  // Format number with Indian commas (lakhs/crores)
  const formatNumberWithCommas = (value: string | number): string => {
    if (value === "" || isNaN(Number(value))) return "";
    return Number(value).toLocaleString("en-IN");
  };
  const [result, setResult] = useState<{
    monthlySIP: string;
    totalInvested: string;
    totalGrowth: string;
    inflationAdjustedAmount: string;
    savingsGrowth: string;
    finalTargetAmount: string;
  } | null>(null);

  useEffect(() => {
    // Type guards for empty string values
    const dreamAmt = dreamAmount === "" ? 0 : Number(dreamAmount);
    const yrs = years === "" ? 0 : Number(years);
    const inflRate = inflationRate === "" ? 0 : Number(inflationRate);
    const expReturn = expectedReturn === "" ? 0 : Number(expectedReturn);
    const currSavings = currentSavings === "" ? 0 : Number(currentSavings);

    // Inflation adjusted dream amount
    const inflationAdjustedAmount = dreamAmt * Math.pow(1 + inflRate / 100, yrs);

    // Monthly rate and months
    const monthlyRate = expReturn / 100 / 12;
    const totalMonths = yrs * 12;

    // Growth of current savings
    const savingsGrowth = currSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Final target amount minus savings growth
    const finalTargetAmount = inflationAdjustedAmount - savingsGrowth;

    // Calculate required monthly SIP using future value formula
    // FV = PMT * [((1 + r)^n - 1) / r]
    // PMT = FV / [((1 + r)^n - 1) / r]
    let monthlySIP = 0;
    if (finalTargetAmount > 0 && monthlyRate > 0) {
      const futureValueFactor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      monthlySIP = finalTargetAmount / futureValueFactor;
    }

    const totalInvested = monthlySIP * totalMonths;
    const totalGrowth = finalTargetAmount - totalInvested;

    setResult({
      monthlySIP: monthlySIP.toFixed(0),
      totalInvested: totalInvested.toFixed(0),
      totalGrowth: totalGrowth.toFixed(0),
      inflationAdjustedAmount: inflationAdjustedAmount.toFixed(0),
      savingsGrowth: savingsGrowth.toFixed(0),
      finalTargetAmount: finalTargetAmount.toFixed(0),
    });
  }, [dreamAmount, years, inflationRate, expectedReturn, currentSavings]);

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
        <h1 className="text-3xl font-bold">Dream Goal Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan for your dream purchase (car, house, holiday) by factoring inflation and investment returns.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Goal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Dream Amount (₹)</label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatNumberWithCommas(dreamAmount)}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const cleaned = rawValue.replace(/[^0-9.]/g, "");
                      setDreamAmount(cleaned === "" ? "" : Number(cleaned));
                    }}
                    min={100000}
                    step={10000}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Years to Goal</label>
                  <Input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    min={1}
                    max={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Inflation Rate (% p.a.)</label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    min={0}
                    max={15}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Expected Investment Return (% p.a.)</label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    min={0}
                    max={20}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Savings (₹)</label>
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
              {/* Calculate button removed, auto-calculation enabled */}
            </Card>
            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Calculates inflation-adjusted dream amount</li>
                <li>• Factors in growth of your current savings</li>
                <li>• Computes required monthly SIP to reach your goal</li>
                <li>• Shows total invested, growth, and final target</li>
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
                    Your Dream Plan
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly SIP Amount</h3>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(Number(result.monthlySIP))}</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Total Amount Invested through SIP</h3>
                      <p className="text-xl font-bold text-blue-600">{formatCurrency(Number(result.totalInvested))}</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Total Growth Amount</h3>
                      <p className="text-xl font-bold text-yellow-600">{formatCurrency(Number(result.totalGrowth))}</p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Targeted Dream Amount (Inflation adjusted)</h3>
                      <p className="text-xl font-bold text-orange-600">{formatCurrency(Number(result.inflationAdjustedAmount))}</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Growth of your Savings Amount</h3>
                      <p className="text-xl font-bold text-purple-600">{formatCurrency(Number(result.savingsGrowth))}</p>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Final Targeted Amount (Minus growth of savings)</h3>
                      <p className="text-xl font-bold text-red-600">{formatCurrency(Number(result.finalTargetAmount))}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">Number of years to achieve your goal</h3>
                      <p className="text-xl font-bold text-gray-800">{years} Years</p>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>Enter your dream goal details and click &quot;Calculate&quot; to see your investment plan.</p>
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
