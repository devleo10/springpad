"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  Info,
  DollarSign,
} from "lucide-react";

export default function SIPReturnsPage() {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [stepUpPercentage, setStepUpPercentage] = useState(0);

  // Calculate SIP returns
  const calculateSIPReturns = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = investmentPeriod * 12;
    let totalInvestment = 0;
    let futureValue = 0;
    let currentSIP = monthlyAmount;

    for (let month = 1; month <= totalMonths; month++) {
      // Apply step-up annually
      if (month > 1 && (month - 1) % 12 === 0 && stepUpPercentage > 0) {
        currentSIP = currentSIP * (1 + stepUpPercentage / 100);
      }

      totalInvestment += currentSIP;
      futureValue +=
        currentSIP * Math.pow(1 + monthlyRate, totalMonths - month + 1);
    }

    const totalGains = futureValue - totalInvestment;

    return {
      totalInvestment: Math.round(totalInvestment),
      futureValue: Math.round(futureValue),
      totalGains: Math.round(totalGains),
      absoluteReturn: (
        ((futureValue - totalInvestment) / totalInvestment) *
        100
      ).toFixed(2),
    };
  };

  const results = calculateSIPReturns();

  // Sample fund suggestions based on expected returns
  const fundSuggestions = [
    {
      name: "HDFC Top 100 Fund",
      category: "Large Cap",
      historicalReturn: "14.2%",
      riskLevel: "Moderate",
      minSIP: "₹500",
    },
    {
      name: "Axis Midcap Fund",
      category: "Mid Cap",
      historicalReturn: "16.8%",
      riskLevel: "High",
      minSIP: "₹500",
    },
    {
      name: "SBI Small Cap Fund",
      category: "Small Cap",
      historicalReturn: "18.5%",
      riskLevel: "Very High",
      minSIP: "₹500",
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/mf-research"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to MF Research
          </Link>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              SIP Returns{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Calculator
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate potential returns from your SIP investments and plan
              your financial goals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calculator className="w-6 h-6 mr-2 text-blue-600" />
              SIP Calculator
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Monthly SIP Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="500"
                    step="500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum: ₹500</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Investment Period (Years)
                </label>
                <input
                  type="number"
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="30"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Historical equity returns: 10-15%
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Annual Step-up (%) - Optional
                </label>
                <input
                  type="number"
                  value={stepUpPercentage}
                  onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="20"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Increase SIP amount annually
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Investment Results
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-blue-600 mb-1">
                    Total Investment
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(results.totalInvestment)}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm font-medium text-green-600 mb-1">
                    Future Value
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(results.futureValue)}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">
                      Total Gains
                    </p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(results.totalGains)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-100 text-sm font-medium">
                      Absolute Return
                    </p>
                    <p className="text-2xl font-bold">
                      {results.absoluteReturn}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Investment Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly SIP:</span>
                    <span className="font-medium">
                      {formatCurrency(monthlyAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Investment Period:</span>
                    <span className="font-medium">
                      {investmentPeriod} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Return:</span>
                    <span className="font-medium">{expectedReturn}% p.a.</span>
                  </div>
                  {stepUpPercentage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Step-up:</span>
                      <span className="font-medium">{stepUpPercentage}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fund Suggestions */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recommended Funds for Your SIP
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {fundSuggestions.map((fund, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {fund.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{fund.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Historical Return:</span>
                    <span className="font-medium text-green-600">
                      {fund.historicalReturn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Risk Level:</span>
                    <span
                      className={`font-medium ${
                        fund.riskLevel === "Very High"
                          ? "text-red-600"
                          : fund.riskLevel === "High"
                          ? "text-orange-600"
                          : fund.riskLevel === "Moderate"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {fund.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min SIP:</span>
                    <span className="font-medium">{fund.minSIP}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Important Notes
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • SIP returns are calculated based on compound annual growth
                  rate (CAGR)
                </li>
                <li>
                  • Past performance doesn&apos;t guarantee future results
                </li>
                <li>• Consider your risk tolerance before investing</li>
                <li>• Mutual fund investments are subject to market risks</li>
                <li>
                  • Step-up SIP helps counter inflation and increase wealth
                  creation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
