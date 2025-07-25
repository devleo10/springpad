"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Info,
  BarChart3,
} from "lucide-react";

export default function FundComparisonPage() {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample fund data - in a real app, this would come from an API
  const sampleFunds = [
    {
      id: "1",
      name: "HDFC Top 100 Fund",
      category: "Large Cap",
      nav: 756.32,
      returns: { "1Y": 15.2, "3Y": 12.8, "5Y": 14.5 },
      expenseRatio: 1.05,
      aum: "₹25,000 Cr",
      riskLevel: "Moderate",
    },
    {
      id: "2",
      name: "Axis Bluechip Fund",
      category: "Large Cap",
      nav: 68.45,
      returns: { "1Y": 14.8, "3Y": 13.2, "5Y": 15.1 },
      expenseRatio: 0.95,
      aum: "₹18,500 Cr",
      riskLevel: "Moderate",
    },
    {
      id: "3",
      name: "Mirae Asset Large Cap Fund",
      category: "Large Cap",
      nav: 89.23,
      returns: { "1Y": 16.5, "3Y": 14.1, "5Y": 16.2 },
      expenseRatio: 1.25,
      aum: "₹12,800 Cr",
      riskLevel: "Moderate",
    },
  ];

  const toggleFundSelection = (fundId: string) => {
    setSelectedFunds((prev) =>
      prev.includes(fundId)
        ? prev.filter((id) => id !== fundId)
        : prev.length < 3
        ? [...prev, fundId]
        : prev
    );
  };

  const selectedFundData = sampleFunds.filter((fund) =>
    selectedFunds.includes(fund.id)
  );

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
              Fund{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Comparison
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare up to 3 mutual funds side by side to make informed
              investment decisions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Fund Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select Funds to Compare
          </h2>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for mutual funds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid gap-4">
            {sampleFunds
              .filter((fund) =>
                fund.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((fund) => (
                <div
                  key={fund.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedFunds.includes(fund.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleFundSelection(fund.id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {fund.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {fund.category} • NAV: ₹{fund.nav}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="font-semibold">
                          {fund.returns["1Y"]}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">1 Year Return</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Selected: {selectedFunds.length}/3 funds
          </p>
        </div>

        {/* Comparison Table */}
        {selectedFundData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Fund Comparison
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Metric
                    </th>
                    {selectedFundData.map((fund) => (
                      <th
                        key={fund.id}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      >
                        {fund.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Category
                    </td>
                    {selectedFundData.map((fund) => (
                      <td
                        key={fund.id}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        {fund.category}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Current NAV
                    </td>
                    {selectedFundData.map((fund) => (
                      <td
                        key={fund.id}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        ₹{fund.nav}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      1 Year Return
                    </td>
                    {selectedFundData.map((fund) => (
                      <td key={fund.id} className="px-6 py-4 text-sm">
                        <span
                          className={`flex items-center ${
                            fund.returns["1Y"] > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {fund.returns["1Y"] > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {fund.returns["1Y"]}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      3 Year Return
                    </td>
                    {selectedFundData.map((fund) => (
                      <td key={fund.id} className="px-6 py-4 text-sm">
                        <span
                          className={`flex items-center ${
                            fund.returns["3Y"] > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {fund.returns["3Y"] > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {fund.returns["3Y"]}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      5 Year Return
                    </td>
                    {selectedFundData.map((fund) => (
                      <td key={fund.id} className="px-6 py-4 text-sm">
                        <span
                          className={`flex items-center ${
                            fund.returns["5Y"] > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {fund.returns["5Y"] > 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {fund.returns["5Y"]}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Expense Ratio
                    </td>
                    {selectedFundData.map((fund) => (
                      <td
                        key={fund.id}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        {fund.expenseRatio}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      AUM
                    </td>
                    {selectedFundData.map((fund) => (
                      <td
                        key={fund.id}
                        className="px-6 py-4 text-sm text-gray-600"
                      >
                        {fund.aum}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Risk Level
                    </td>
                    {selectedFundData.map((fund) => (
                      <td key={fund.id} className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            fund.riskLevel === "High"
                              ? "bg-red-100 text-red-800"
                              : fund.riskLevel === "Moderate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {fund.riskLevel}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                How to Use Fund Comparison
              </h3>
              <p className="text-sm text-blue-700">
                Select up to 3 mutual funds to compare their performance,
                expenses, and risk profiles. This helps you make informed
                decisions based on historical data and fund characteristics.
                Remember that past performance doesn&apos;t guarantee future
                results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
