"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaPiggyBank,
  FaPlus,
  FaTimes,
  FaHome,
  FaCar,
  FaChartLine,
} from "react-icons/fa";

interface AssetItem {
  id: number;
  name: string;
  value: number;
  category:
    | "Real Estate"
    | "Investments"
    | "Cash & Savings"
    | "Personal Assets"
    | "Other";
}

interface LiabilityItem {
  id: number;
  name: string;
  value: number;
  category:
    | "Home Loan"
    | "Personal Loan"
    | "Credit Card"
    | "Vehicle Loan"
    | "Other";
}

export default function NetworthCalculator() {
  const [assets, setAssets] = useState<AssetItem[]>([
    {
      id: 1,
      name: "Primary Residence",
      value: 5000000,
      category: "Real Estate",
    },
    {
      id: 2,
      name: "Savings Account",
      value: 200000,
      category: "Cash & Savings",
    },
    { id: 3, name: "Mutual Funds", value: 500000, category: "Investments" },
  ]);

  const [liabilities, setLiabilities] = useState<LiabilityItem[]>([
    { id: 1, name: "Home Loan", value: 3000000, category: "Home Loan" },
    { id: 2, name: "Credit Card Debt", value: 50000, category: "Credit Card" },
  ]);

  const [newAsset, setNewAsset] = useState<Omit<AssetItem, "id">>({
    name: "",
    value: 0,
    category: "Cash & Savings",
  });

  const [newLiability, setNewLiability] = useState<Omit<LiabilityItem, "id">>({
    name: "",
    value: 0,
    category: "Personal Loan",
  });

  const addAsset = () => {
    if (newAsset.name && newAsset.value > 0) {
      setAssets([...assets, { ...newAsset, id: Date.now() }]);
      setNewAsset({ name: "", value: 0, category: "Cash & Savings" });
    }
  };

  const addLiability = () => {
    if (newLiability.name && newLiability.value > 0) {
      setLiabilities([...liabilities, { ...newLiability, id: Date.now() }]);
      setNewLiability({ name: "", value: 0, category: "Personal Loan" });
    }
  };

  const removeAsset = (id: number) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };

  const removeLiability = (id: number) => {
    setLiabilities(liabilities.filter((liability) => liability.id !== id));
  };

  const updateAssetValue = (id: number, value: number) => {
    setAssets(
      assets.map((asset) => (asset.id === id ? { ...asset, value } : asset))
    );
  };

  const updateLiabilityValue = (id: number, value: number) => {
    setLiabilities(
      liabilities.map((liability) =>
        liability.id === id ? { ...liability, value } : liability
      )
    );
  };

  const calculateNetworth = () => {
    const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0);
    const totalLiabilities = liabilities.reduce(
      (sum, liability) => sum + liability.value,
      0
    );
    return {
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      assetsByCategory: groupByCategory(assets),
      liabilitiesByCategory: groupByCategory(liabilities),
    };
  };

  const groupByCategory = <T extends { category: string; value: number }>(
    items: T[]
  ) => {
    const grouped = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.value;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([category, value]) => ({
      category,
      value,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLakhs = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return formatCurrency(amount);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Real Estate":
        return <FaHome className="text-blue-500" />;
      case "Investments":
        return <FaChartLine className="text-green-500" />;
      case "Personal Assets":
        return <FaCar className="text-purple-500" />;
      default:
        return <FaPiggyBank className="text-yellow-500" />;
    }
  };

  const getCategoryColor = (category: string, isLiability = false) => {
    if (isLiability) {
      return (
        {
          "Home Loan": "bg-red-50 border-red-200",
          "Personal Loan": "bg-orange-50 border-orange-200",
          "Credit Card": "bg-pink-50 border-pink-200",
          "Vehicle Loan": "bg-purple-50 border-purple-200",
          Other: "bg-gray-50 border-gray-200",
        }[category] || "bg-gray-50 border-gray-200"
      );
    } else {
      return (
        {
          "Real Estate": "bg-blue-50 border-blue-200",
          Investments: "bg-green-50 border-green-200",
          "Cash & Savings": "bg-yellow-50 border-yellow-200",
          "Personal Assets": "bg-purple-50 border-purple-200",
          Other: "bg-gray-50 border-gray-200",
        }[category] || "bg-gray-50 border-gray-200"
      );
    }
  };

  const result = calculateNetworth();

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaPiggyBank className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Net Worth Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate your net worth by tracking all your assets and liabilities
          to understand your financial position.
        </p>

        {/* Net Worth Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Total Assets
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {formatLakhs(result.totalAssets)}
            </p>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Total Liabilities
            </h3>
            <p className="text-2xl font-bold text-red-600">
              {formatLakhs(result.totalLiabilities)}
            </p>
          </div>
          <div
            className={`bg-gradient-to-r p-6 rounded-lg border ${
              result.netWorth >= 0
                ? "from-blue-50 to-blue-100 border-blue-200"
                : "from-red-50 to-red-100 border-red-200"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-2 ${
                result.netWorth >= 0 ? "text-blue-800" : "text-red-800"
              }`}
            >
              Net Worth
            </h3>
            <p
              className={`text-2xl font-bold ${
                result.netWorth >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              {formatLakhs(result.netWorth)}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assets Section */}
          <div className="space-y-6">
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold mb-4 text-green-800">
                Assets
              </h2>

              {/* Add New Asset */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Asset name (e.g., Savings Account)"
                  value={newAsset.name}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Value (₹)"
                    value={newAsset.value || ""}
                    onChange={(e) =>
                      setNewAsset({
                        ...newAsset,
                        value: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select
                    value={newAsset.category}
                    onChange={(e) =>
                      setNewAsset({
                        ...newAsset,
                        category: e.target.value as AssetItem["category"],
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="Cash & Savings">Cash & Savings</option>
                    <option value="Investments">Investments</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Personal Assets">Personal Assets</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button
                  onClick={addAsset}
                  className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus />
                  Add Asset
                </button>
              </div>

              {/* Assets List */}
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    className={`p-4 rounded-lg border ${getCategoryColor(
                      asset.category
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(asset.category)}
                        <span className="font-medium">{asset.name}</span>
                      </div>
                      <button
                        onClick={() => removeAsset(asset.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-20">
                        {asset.category}
                      </span>
                      <input
                        type="number"
                        value={asset.value}
                        onChange={(e) =>
                          updateAssetValue(asset.id, Number(e.target.value))
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                      <span className="text-sm font-medium">
                        {formatLakhs(asset.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Assets by Category */}
              <div className="mt-4 pt-4 border-t border-green-200">
                <h3 className="font-medium text-green-800 mb-2">
                  Assets by Category
                </h3>
                <div className="space-y-1">
                  {result.assetsByCategory.map(({ category, value }) => (
                    <div
                      key={category}
                      className="flex justify-between text-sm"
                    >
                      <span>{category}</span>
                      <span className="font-medium">{formatLakhs(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Liabilities Section */}
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h2 className="text-xl font-semibold mb-4 text-red-800">
                Liabilities
              </h2>

              {/* Add New Liability */}
              <div className="grid grid-cols-1 gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Liability name (e.g., Home Loan)"
                  value={newLiability.name}
                  onChange={(e) =>
                    setNewLiability({ ...newLiability, name: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={newLiability.value || ""}
                    onChange={(e) =>
                      setNewLiability({
                        ...newLiability,
                        value: Number(e.target.value),
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <select
                    value={newLiability.category}
                    onChange={(e) =>
                      setNewLiability({
                        ...newLiability,
                        category: e.target.value as LiabilityItem["category"],
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Vehicle Loan">Vehicle Loan</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <button
                  onClick={addLiability}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaPlus />
                  Add Liability
                </button>
              </div>

              {/* Liabilities List */}
              <div className="space-y-3">
                {liabilities.map((liability) => (
                  <div
                    key={liability.id}
                    className={`p-4 rounded-lg border ${getCategoryColor(
                      liability.category,
                      true
                    )}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{liability.name}</span>
                      <button
                        onClick={() => removeLiability(liability.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-20">
                        {liability.category}
                      </span>
                      <input
                        type="number"
                        value={liability.value}
                        onChange={(e) =>
                          updateLiabilityValue(
                            liability.id,
                            Number(e.target.value)
                          )
                        }
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium">
                        {formatLakhs(liability.value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Liabilities by Category */}
              <div className="mt-4 pt-4 border-t border-red-200">
                <h3 className="font-medium text-red-800 mb-2">
                  Liabilities by Category
                </h3>
                <div className="space-y-1">
                  {result.liabilitiesByCategory.map(({ category, value }) => (
                    <div
                      key={category}
                      className="flex justify-between text-sm"
                    >
                      <span>{category}</span>
                      <span className="font-medium">{formatLakhs(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Understanding Net Worth
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">What is Net Worth?</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Total value of everything you own (assets)</li>
                <li>• Minus total amount of money you owe (liabilities)</li>
                <li>• Key indicator of financial health and progress</li>
                <li>• Should generally increase over time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tips for Improving Net Worth</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Increase income and reduce unnecessary expenses</li>
                <li>• Pay off high-interest debt first</li>
                <li>• Invest in appreciating assets</li>
                <li>• Track and review your net worth regularly</li>
                <li>• Avoid lifestyle inflation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
