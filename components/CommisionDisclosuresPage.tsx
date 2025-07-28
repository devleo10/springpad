"use client";

import { useState } from "react";

export default function CommissionDisclosuresPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const commissionData = [
    {
      name: "Aditya Birla",
      equity: { min: 0.75, max: 1.1 },
      hybrid: { min: 0.6, max: 0.75 },
      liquid: { min: 0.07, max: 0.08 },
      debtFunds: { min: 0.25, max: 0.4 },
    },
    {
      name: "Axis",
      equity: { min: 0.7, max: 1.15 },
      hybrid: { min: 0.6, max: 0.8 },
      liquid: { min: 0.02, max: 0.02 },
      debtFunds: { min: 0.4, max: 0.55 },
    },
    {
      name: "Bandhan",
      equity: { min: 0.9, max: 1.35 },
      hybrid: { min: 0.6, max: 1.25 },
      liquid: { min: 0.08, max: 0.08 },
      debtFunds: { min: 0.3, max: 0.3 },
    },
    {
      name: "Canara Robeco",
      equity: { min: 0.9, max: 1.4 },
      hybrid: { min: 1.2, max: 1.2 },
      liquid: { min: 0.09, max: 0.09 },
      debtFunds: { min: 0.7, max: 0.75 },
    },
    {
      name: "DSP",
      equity: { min: 0.85, max: 1.3 },
      hybrid: { min: 0.7, max: 1.2 },
      liquid: { min: 0.02, max: 0.05 },
      debtFunds: { min: 0.3, max: 0.2 },
    },
    {
      name: "Edelweiss",
      equity: { min: 0.8, max: 1.0 },
      hybrid: { min: 0.6, max: 1.0 },
      liquid: { min: 0.05, max: 0.1 },
      debtFunds: { min: 0.3, max: 0.8 },
    },
    {
      name: "Franklin Templeton",
      equity: { min: 0.3, max: 0.95 },
      hybrid: { min: 0.55, max: 1.1 },
      liquid: { min: 0.05, max: 0.05 },
      debtFunds: { min: 0.45, max: 0.8 },
    },
    {
      name: "HDFC",
      equity: { min: 0.72, max: 1.3 },
      hybrid: { min: 0.8, max: 1.0 },
      liquid: { min: 0.1, max: 0.1 },
      debtFunds: { min: 0.45, max: 0.75 },
    },
    {
      name: "ICICI",
      equity: { min: 0.4, max: 0.9 },
      hybrid: { min: 0.3, max: 0.55 },
      liquid: { min: 0.05, max: 0.05 },
      debtFunds: { min: 0.45, max: 0.8 },
    },
    {
      name: "Kotak",
      equity: { min: 1.15, max: 1.5 },
      hybrid: { min: 0.95, max: 1.15 },
      liquid: { min: 0.02, max: 0.03 },
      debtFunds: { min: 0.75, max: 1.05 },
    },
    {
      name: "Mirae",
      equity: { min: 0.7, max: 1.25 },
      hybrid: { min: 0.7, max: 1.3 },
      liquid: { min: 0.1, max: 0.1 },
      debtFunds: { min: 1.0, max: 0.4 },
    },
    {
      name: "Motilal Oswal",
      equity: { min: 1.0, max: 1.15 },
      hybrid: { min: 1.3, max: 1.15 },
      liquid: { min: 0.15, max: 0.15 },
      debtFunds: { min: 0.07, max: 0.07 },
    },
    {
      name: "Nippon",
      equity: { min: 0.95, max: 1.35 },
      hybrid: { min: 0.35, max: 1.3 },
      liquid: { min: 0.05, max: 0.05 },
      debtFunds: { min: 0.25, max: 1.1 },
    },
    {
      name: "Parag Parikh",
      equity: { min: 0.75, max: 1.1 },
      hybrid: { min: 0.3, max: 0.3 },
      liquid: { min: 0.1, max: 0.1 },
      debtFunds: { min: "N.A.", max: "N.A." },
    },
    {
      name: "SBI",
      equity: { min: 0.55, max: 1.25 },
      hybrid: { min: 0.81, max: 0.95 },
      liquid: { min: 0.1, max: 0.1 },
      debtFunds: { min: 0.37, max: 0.52 },
    },
    {
      name: "Sundaram",
      equity: { min: 1.2, max: 1.3 },
      hybrid: { min: 1.2, max: 1.2 },
      liquid: { min: 0.25, max: 0.25 },
      debtFunds: { min: 0.9, max: 0.9 },
    },
    {
      name: "Tata",
      equity: { min: 0.8, max: 1.3 },
      hybrid: { min: 0.5, max: 0.95 },
      liquid: { min: 0.05, max: 0.2 },
      debtFunds: { min: 0.4, max: 0.65 },
    },
    {
      name: "UTI",
      equity: { min: 0.9, max: 1.45 },
      hybrid: { min: 0.45, max: 1.2 },
      liquid: { min: 0.05, max: 0.05 },
      debtFunds: { min: 0.5, max: 0.85 },
    },
  ];

  const categories = [
    { key: "all", label: "All Categories" },
    { key: "equity", label: "Equity" },
    { key: "hybrid", label: "Hybrid" },
    { key: "liquid", label: "Liquid" },
    { key: "debtFunds", label: "Debt Funds" },
  ];

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-slate-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="animated-underline">Commission</span> Disclosures
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Transparent commission rates across different fund categories. All
            rates are displayed as annualized percentages.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.key
                  ? "bg-yellow-400 text-black shadow-lg"
                  : "bg-white text-gray-700 hover:bg-yellow-500 hover:text-black border border-gray-300"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Commission Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-4">
          <div className="overflow-x-auto px-8 py-6">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                <tr>
                  <th className="px-8 py-5 text-left font-semibold">
                    Fund House
                  </th>
                  {(selectedCategory === "all" ||
                    selectedCategory === "equity") && (
                    <>
                      <th className="px-6 py-5 text-center font-semibold border-l border-yellow-600">
                        <div className="text-sm font-medium">Equity</div>
                        <div className="flex justify-between text-xs mt-1 opacity-80">
                          <span>Min</span>
                          <span>Max</span>
                        </div>
                      </th>
                    </>
                  )}
                  {(selectedCategory === "all" ||
                    selectedCategory === "hybrid") && (
                    <>
                      <th className="px-6 py-5 text-center font-semibold border-l border-yellow-600">
                        <div className="text-sm font-medium">Hybrid</div>
                        <div className="flex justify-between text-xs mt-1 opacity-80">
                          <span>Min</span>
                          <span>Max</span>
                        </div>
                      </th>
                    </>
                  )}
                  {(selectedCategory === "all" ||
                    selectedCategory === "liquid") && (
                    <>
                      <th className="px-6 py-5 text-center font-semibold border-l border-yellow-600">
                        <div className="text-sm font-medium">Liquid</div>
                        <div className="flex justify-between text-xs mt-1 opacity-80">
                          <span>Min</span>
                          <span>Max</span>
                        </div>
                      </th>
                    </>
                  )}
                  {(selectedCategory === "all" ||
                    selectedCategory === "debtFunds") && (
                    <>
                      <th className="px-6 py-5 text-center font-semibold border-l border-yellow-600">
                        <div className="text-sm font-medium">Debt Funds</div>
                        <div className="flex justify-between text-xs mt-1 opacity-80">
                          <span>Min</span>
                          <span>Max</span>
                        </div>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {commissionData.map((fund, index) => (
                  <tr
                    key={fund.name}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-yellow-100 transition-colors duration-200`}
                  >
                    <td className="px-8 py-5 font-medium text-gray-900">
                      {fund.name}
                    </td>
                    {(selectedCategory === "all" ||
                      selectedCategory === "equity") && (
                      <td className="px-6 py-5 text-center border-l border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm">{fund.equity.min}</span>
                          <span className="text-sm">{fund.equity.max}</span>
                        </div>
                      </td>
                    )}
                    {(selectedCategory === "all" ||
                      selectedCategory === "hybrid") && (
                      <td className="px-6 py-5 text-center border-l border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm">{fund.hybrid.min}</span>
                          <span className="text-sm">{fund.hybrid.max}</span>
                        </div>
                      </td>
                    )}
                    {(selectedCategory === "all" ||
                      selectedCategory === "liquid") && (
                      <td className="px-6 py-5 text-center border-l border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm">{fund.liquid.min}</span>
                          <span className="text-sm">{fund.liquid.max}</span>
                        </div>
                      </td>
                    )}
                    {(selectedCategory === "all" ||
                      selectedCategory === "debtFunds") && (
                      <td className="px-6 py-5 text-center border-l border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-sm">{fund.debtFunds.min}</span>
                          <span className="text-sm">{fund.debtFunds.max}</span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes Section */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-8 mx-4">
          <h3 className="text-lg font-semibold text-amber-800 mb-4">
            Important Notes:
          </h3>
          <ul className="space-y-2 text-sm text-amber-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">(i)</span>
              <span>
                Commissions quoted are on annualized basis; these are no upfront
                brokerages.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">(ii)</span>
              <span>
                Commission structure mentioned above pertains to the quarter
                April - May - June 2024.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">(iii)</span>
              <span>
                Commission structure pertains to only large choice where schemes
                get distributed.
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">(iv)</span>
              <span>Structure provided on basis of commission received.</span>
            </li>
          </ul>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-8 mx-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            About Commission Disclosures
          </h3>
          <p className="text-sm text-yellow-700 leading-relaxed">
            At SpringPad, we believe in complete transparency regarding our
            commission structure. The above table provides detailed information
            about the commission rates we receive from various Asset Management
            Companies (AMCs) across different fund categories. These commissions
            are paid by the AMCs and do not affect your investment returns
            directly. We are committed to providing you with the best investment
            advice regardless of commission variations.
          </p>
        </div>
      </div>
    </div>
  );
}
