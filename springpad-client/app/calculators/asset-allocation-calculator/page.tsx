"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { FaCoins, FaCalculator, FaChartPie } from "react-icons/fa";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface AssetClass {
  name: string;
  allocation: number;
  color: string;
}

export default function AssetAllocationCalculator() {
  const [age, setAge] = useState<string>("30");
  const [riskTolerance, setRiskTolerance] = useState<
    "Conservative" | "Moderate" | "Aggressive"
  >("Moderate");
  const [investmentAmount, setInvestmentAmount] = useState<string>("1000000");
  const [timeHorizon, setTimeHorizon] = useState<string>("10");
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

    const ageNum = Number(age) || 0;
    const timeHorizonNum = Number(timeHorizon) || 0;
    const baseEquity = Math.max(30, Math.min(80, 100 - ageNum));

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

    if (timeHorizonNum < 3) {
      equityPercent = Math.max(20, equityPercent - 20);
      debtPercent = 90 - goldPercent - realEstatePercent - equityPercent;
    } else if (timeHorizonNum > 15) {
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

    const investmentAmountNum = Number(investmentAmount) || 0;
    const allocationByAmount = allocations.map((asset) => ({
      name: asset.name,
      amount: ((asset.allocation / 100) * investmentAmountNum).toFixed(0),
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

  // Format number with commas for lakhs and crores (Indian system)
  const formatNumberWithCommas = (amount: number | string) => {
    const num = typeof amount === "string" ? Number(amount) : amount;
    if (!num) return "";
    return num.toLocaleString("en-IN");
  };

  // Format currency with INR symbol and commas
  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? Number(amount) : amount;
    if (!num) return "";
    return `₹${formatNumberWithCommas(num)}`;
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
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
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Investment Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <Input
                    type="number"
                    value={age === "0" ? "" : age}
                    onChange={(e) => setAge(e.target.value.replace(/^0+/, ""))}
                    min={18}
                    max={80}
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Investment Amount (₹)
                  </label>
                  <Input
                    type="text"
                    value={
                      investmentAmount === "0"
                        ? ""
                        : formatNumberWithCommas(investmentAmount)
                    }
                    onChange={(e) => {
                      // Remove all non-digit characters
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setInvestmentAmount(raw.replace(/^0+/, ""));
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Investment Amount"
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
                  <Input
                    type="number"
                    value={timeHorizon === "0" ? "" : timeHorizon}
                    onChange={(e) =>
                      setTimeHorizon(e.target.value.replace(/^0+/, ""))
                    }
                    min={1}
                    max={40}
                    placeholder="Time Horizon"
                  />
                </div>
              </div>
            </Card>

            <Card>
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
                      <Input
                        type="number"
                        value={asset.allocation === 0 ? "" : asset.allocation}
                        onChange={(e) => {
                          const val = e.target.value.replace(/^0+/, "");
                          updateAssetAllocation(
                            index,
                            val === "" ? 0 : Number(val)
                          );
                        }}
                        min={0}
                        max={100}
                        className="w-20 text-sm"
                        placeholder="%"
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
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartPie className="text-blue-500" />
                    Allocation Summary
                  </h2>
                  <div className="space-y-3">
                    {result.recommendedAllocation.map((asset) => (
                      <div
                        key={asset.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: asset.color }}
                          ></div>
                          <span className="text-sm font-medium">
                            {asset.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          {asset.allocation}%
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Total Allocation:</span>
                      <span>{result.totalAllocation}%</span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h2 className="text-xl font-semibold mb-4">
                    Amount by Asset Class
                  </h2>
                  <div className="space-y-3">
                    {result.allocationByAmount.map((asset) => (
                      <div
                        key={asset.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: asset.color }}
                          ></div>
                          <span className="text-sm font-medium">
                            {asset.name}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatCurrency(Number(asset.amount))}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Total Investment:</span>
                      <span>{formatCurrency(investmentAmount)}</span>
                    </div>
                  </div>
                </Card>

                {result.totalAllocation !== 100 && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          <strong>Note:</strong> Your total allocation is{" "}
                          {result.totalAllocation}%. Consider adjusting to reach
                          100% for optimal portfolio balance.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {!result && (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaChartPie className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Click &quot;Get Recommended Allocation&quot; to see your
                    personalized asset allocation.
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
