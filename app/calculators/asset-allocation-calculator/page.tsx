"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaCoins, FaCalculator, FaChartPie } from "react-icons/fa";

interface AssetClass {
  name: string;
  allocation: number;
  color: string;
}

export default function AssetAllocationCalculator() {
  const [age, setAge] = useState<number>(30);
  const [riskTolerance, setRiskTolerance] = useState<
    "Conservative" | "Moderate" | "Aggressive"
  >("Moderate");
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000000);
  const [timeHorizon, setTimeHorizon] = useState<number>(10);
  const [customAllocation, setCustomAllocation] = useState<boolean>(false);
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([
    { name: "Equity", allocation: 60, color: "#3B82F6" },
    { name: "Debt", allocation: 30, color: "#10B981" },
    { name: "Gold", allocation: 5, color: "#F59E0B" },
    { name: "Real Estate", allocation: 5, color: "#8B5CF6" },
  ]);
  const [result, setResult] = useState<{
    recommendedAllocation: AssetClass[];
    allocationByAmount: Array<{ name: string; amount: string; color: string }>;
    totalAllocation: number;
  } | null>(null);

  const getRecommendedAllocation = () => {
    let equityPercent = 0;
    let debtPercent = 0;
    const goldPercent = 5;
    const realEstatePercent = 5;

    // Age-based allocation (100 minus age rule for equity)
    const baseEquity = Math.max(30, Math.min(80, 100 - age));

    // Adjust based on risk tolerance
    switch (riskTolerance) {
      case "Conservative":
        equityPercent = Math.max(20, baseEquity - 20);
        debtPercent = 90 - goldPercent - realEstatePercent - equityPercent;
        break;
      case "Moderate":
        equityPercent = baseEquity;
        debtPercent = 90 - goldPercent - realEstatePercent - equityPercent;
        break;
      case "Aggressive":
        equityPercent = Math.min(85, baseEquity + 15);
        debtPercent = 90 - goldPercent - realEstatePercent - equityPercent;
        break;
    }

    // Adjust for time horizon
    if (timeHorizon < 3) {
      equityPercent = Math.max(20, equityPercent - 20);
      debtPercent = 90 - goldPercent - realEstatePercent - equityPercent;
    } else if (timeHorizon > 15) {
      equityPercent = Math.min(80, equityPercent + 10);
      debtPercent = 90 - goldPercent - realEstatePercent - equityPercent;
    }

    return [
      { name: "Equity", allocation: equityPercent, color: "#3B82F6" },
      { name: "Debt", allocation: debtPercent, color: "#10B981" },
      { name: "Gold", allocation: goldPercent, color: "#F59E0B" },
      { name: "Real Estate", allocation: realEstatePercent, color: "#8B5CF6" },
    ];
  };

  const calculateAllocation = () => {
    const allocations = customAllocation
      ? assetClasses
      : getRecommendedAllocation();
    const totalAllocation = allocations.reduce(
      (sum, asset) => sum + asset.allocation,
      0
    );

    const allocationByAmount = allocations.map((asset) => ({
      name: asset.name,
      amount: ((asset.allocation / 100) * investmentAmount).toFixed(0),
      color: asset.color,
    }));

    setResult({
      recommendedAllocation: allocations,
      allocationByAmount,
      totalAllocation,
    });
  };

  const updateAssetAllocation = (index: number, newAllocation: number) => {
    const newAssets = [...assetClasses];
    newAssets[index].allocation = newAllocation;
    setAssetClasses(newAssets);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-800 pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaCoins className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Asset Allocation Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Determine the optimal mix of asset classes for your investment
          portfolio based on your risk profile and goals.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Investment Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="18"
                    max="80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Investment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) =>
                      setInvestmentAmount(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="10000"
                    step="10000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Risk Tolerance
                  </label>
                  <select
                    value={riskTolerance}
                    onChange={(e) =>
                      setRiskTolerance(
                        e.target.value as
                          | "Conservative"
                          | "Moderate"
                          | "Aggressive"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Investment Time Horizon (Years)
                  </label>
                  <input
                    type="number"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                    max="40"
                  />
                </div>
              </div>
            </div>

            {/* Custom Allocation */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Asset Allocation</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={customAllocation}
                    onChange={(e) => setCustomAllocation(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Custom Allocation</span>
                </label>
              </div>

              {customAllocation && (
                <div className="space-y-4 mb-4">
                  {assetClasses.map((asset, index) => (
                    <div key={asset.name} className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: asset.color }}
                      ></div>
                      <span className="w-24 text-sm font-medium">
                        {asset.name}
                      </span>
                      <input
                        type="number"
                        value={asset.allocation}
                        onChange={(e) =>
                          updateAssetAllocation(index, Number(e.target.value))
                        }
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500">
                    Total:{" "}
                    {assetClasses.reduce(
                      (sum, asset) => sum + asset.allocation,
                      0
                    )}
                    %
                  </p>
                </div>
              )}

              <button
                onClick={calculateAllocation}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                {customAllocation
                  ? "Calculate Custom Allocation"
                  : "Get Recommended Allocation"}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Pie Chart Visualization */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartPie className="text-blue-500" />
                    Allocation Summary
                  </h2>

                  {result.totalAllocation !== 100 && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm">
                      Warning: Total allocation is {result.totalAllocation}%.
                      Should be 100%.
                    </div>
                  )}

                  <div className="space-y-3">
                    {result.recommendedAllocation.map((asset, index) => (
                      <div
                        key={asset.name}
                        className="bg-white p-3 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: asset.color }}
                            ></div>
                            <span className="font-medium text-sm">
                              {asset.name}
                            </span>
                          </div>
                          <span className="font-bold text-sm">
                            {asset.allocation}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {formatCurrency(
                            Number(
                              result.allocationByAmount[index]?.amount || 0
                            )
                          )}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              backgroundColor: asset.color,
                              width: `${asset.allocation}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">
                    Allocation Rationale
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      • <strong>Age {age}:</strong> {100 - age}% equity
                      allocation base (100 minus age rule)
                    </p>
                    <p>
                      • <strong>{riskTolerance} Risk:</strong>{" "}
                      {riskTolerance === "Conservative"
                        ? "Lower equity, higher debt for stability"
                        : riskTolerance === "Moderate"
                        ? "Balanced allocation for steady growth"
                        : "Higher equity allocation for maximum growth potential"}
                    </p>
                    <p>
                      • <strong>{timeHorizon} Year Horizon:</strong>{" "}
                      {timeHorizon < 3
                        ? "Short-term focus on capital preservation"
                        : timeHorizon > 15
                        ? "Long-term growth orientation"
                        : "Medium-term balanced approach"}
                    </p>
                  </div>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                Enter your investment profile and click calculate to see your
                recommended asset allocation
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Asset Class Guide</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Asset Classes Explained</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  • <strong>Equity:</strong> Stocks, mutual funds - High growth,
                  high risk
                </li>
                <li>
                  • <strong>Debt:</strong> Bonds, FDs, debt funds - Stable
                  income, low risk
                </li>
                <li>
                  • <strong>Gold:</strong> Physical/digital gold - Inflation
                  hedge, moderate risk
                </li>
                <li>
                  • <strong>Real Estate:</strong> Property, REITs - Long-term
                  appreciation
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Allocation Principles</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Diversification reduces overall portfolio risk</li>
                <li>• Younger investors can take more equity risk</li>
                <li>
                  • Rebalance portfolio annually or when allocations drift
                </li>
                <li>• Consider tax implications of different asset classes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
