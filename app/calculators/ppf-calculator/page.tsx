"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaUserGraduate,
  FaCalculator,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

interface PPFData {
  year: number;
  startingBalance: number;
  contribution: number;
  interest: number;
  endingBalance: number;
}

export default function PPFCalculator() {
  const [yearlyContribution, setYearlyContribution] = useState<number>(150000);
  const [currentPPFBalance, setCurrentPPFBalance] = useState<number>(0);
  const [accountAge, setAccountAge] = useState<number>(0);
  const [calculationType, setCalculationType] = useState<"fresh" | "existing">(
    "fresh"
  );
  const [interestRate, setInterestRate] = useState<number>(7.1);
  const [extensionYears, setExtensionYears] = useState<number>(0);
  const [result, setResult] = useState<{
    maturityAmount: string;
    totalContributions: string;
    totalInterest: string;
    taxSavings: string;
    yearlyBreakdown: PPFData[];
    extensionProjection?: {
      maturityAmount: string;
      totalInterest: string;
      totalYears: number;
    };
  } | null>(null);

  const calculatePPF = () => {
    const rate = interestRate / 100;
    let currentBalance = currentPPFBalance;
    let totalContributions = currentPPFBalance;
    const yearlyBreakdown: PPFData[] = [];

    // For fresh account, calculate for 15 years
    // For existing account, calculate remaining years
    const remainingYears =
      calculationType === "fresh" ? 15 : Math.max(0, 15 - accountAge);

    // Calculate PPF growth for remaining maturity period
    for (let year = 1; year <= remainingYears; year++) {
      const startingBalance = currentBalance;
      const contribution = Math.min(yearlyContribution, 150000); // PPF limit is 1.5L
      const interestEarned = (startingBalance + contribution) * rate;
      const endingBalance = startingBalance + contribution + interestEarned;

      totalContributions += contribution;
      currentBalance = endingBalance;

      yearlyBreakdown.push({
        year: accountAge + year,
        startingBalance,
        contribution,
        interest: interestEarned,
        endingBalance,
      });
    }

    const totalInterest = currentBalance - totalContributions;
    const taxSavings = (totalContributions - currentPPFBalance) * 0.3; // Assuming 30% tax bracket

    let extensionProjection;

    // Calculate extension projection if specified
    if (extensionYears > 0) {
      let extensionBalance = currentBalance;
      let extensionInterest = 0;

      for (let year = 1; year <= extensionYears; year++) {
        const yearInterest = extensionBalance * rate;
        extensionBalance += yearInterest;
        extensionInterest += yearInterest;
      }

      extensionProjection = {
        maturityAmount: extensionBalance.toFixed(0),
        totalInterest: (totalInterest + extensionInterest).toFixed(0),
        totalYears: remainingYears + extensionYears,
      };
    }

    setResult({
      maturityAmount: currentBalance.toFixed(0),
      totalContributions: totalContributions.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      taxSavings: taxSavings.toFixed(0),
      yearlyBreakdown,
      extensionProjection,
    });
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

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaUserGraduate className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">PPF Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate your Public Provident Fund returns and plan your long-term
          tax-saving investments.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-green-500" />
                PPF Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Account Type
                  </label>
                  <select
                    value={calculationType}
                    onChange={(e) =>
                      setCalculationType(e.target.value as "fresh" | "existing")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="fresh">New PPF Account</option>
                    <option value="existing">Existing PPF Account</option>
                  </select>
                </div>

                {calculationType === "existing" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Current PPF Balance (₹)
                      </label>
                      <input
                        type="number"
                        value={currentPPFBalance}
                        onChange={(e) =>
                          setCurrentPPFBalance(Number(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        min="0"
                        step="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Account Age (Years)
                      </label>
                      <input
                        type="number"
                        value={accountAge}
                        onChange={(e) => setAccountAge(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        min="0"
                        max="14"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Years since account opening (max 14)
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Annual Contribution (₹)
                  </label>
                  <input
                    type="number"
                    value={yearlyContribution}
                    onChange={(e) =>
                      setYearlyContribution(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="500"
                    max="150000"
                    step="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: ₹500, Maximum: ₹1,50,000
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current PPF Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="5"
                    max="12"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current rate: 7.1% (FY 2023-24)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Extension Period (Years)
                  </label>
                  <input
                    type="number"
                    value={extensionYears}
                    onChange={(e) => setExtensionYears(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                    max="50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Extend PPF beyond 15 years (without contributions)
                  </p>
                </div>

                <button
                  onClick={calculatePPF}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCalculator />
                  Calculate PPF Returns
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium text-green-800 mb-1">
                      Maturity Amount (15 years)
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatLakhs(Number(result.maturityAmount))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Total Interest Earned
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      {formatLakhs(Number(result.totalInterest))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-sm font-medium text-purple-800 mb-1">
                      Total Contributions
                    </h3>
                    <p className="text-xl font-bold text-purple-600">
                      {formatLakhs(Number(result.totalContributions))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-sm font-medium text-orange-800 mb-1">
                      Tax Savings (30%)
                    </h3>
                    <p className="text-xl font-bold text-orange-600">
                      {formatLakhs(Number(result.taxSavings))}
                    </p>
                  </div>
                </div>

                {/* Extension Projection */}
                {result.extensionProjection && (
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                      Extended PPF Projection (
                      {result.extensionProjection.totalYears} years total)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-yellow-700">
                          Final Maturity Amount
                        </p>
                        <p className="text-xl font-bold text-yellow-800">
                          {formatLakhs(
                            Number(result.extensionProjection.maturityAmount)
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-yellow-700">
                          Total Interest (Including Extension)
                        </p>
                        <p className="text-xl font-bold text-yellow-800">
                          {formatLakhs(
                            Number(result.extensionProjection.totalInterest)
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Yearly Breakdown */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FaChartLine className="text-blue-500" />
                      Year-wise PPF Growth
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Year
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Opening Balance
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Contribution
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Interest
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Closing Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {result.yearlyBreakdown.map((data) => (
                          <tr key={data.year} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">
                              {data.year}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatCurrency(data.startingBalance)}
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600">
                              {formatCurrency(data.contribution)}
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600">
                              {formatCurrency(data.interest)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              {formatCurrency(data.endingBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* PPF Benefits */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    PPF Benefits Summary
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">
                        Tax Benefits
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Contribution: 80C deduction</li>
                        <li>• Interest: Tax-free</li>
                        <li>• Maturity: Tax-free</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Features
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• 15-year lock-in period</li>
                        <li>• Government guaranteed</li>
                        <li>• Partial withdrawal after 7 years</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-purple-700 mb-2">
                        Limits
                      </h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• Min: ₹500 per year</li>
                        <li>• Max: ₹1,50,000 per year</li>
                        <li>• One account per person</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-gray-50 p-12 rounded-lg text-center text-gray-500">
                <FaUserGraduate className="mx-auto text-4xl mb-4 text-gray-400" />
                <p>
                  Enter your PPF details and click calculate to see your returns
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            About Public Provident Fund (PPF)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Key Features</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 15-year mandatory lock-in period</li>
                <li>• EEE (Exempt-Exempt-Exempt) tax status</li>
                <li>• Interest compounded annually</li>
                <li>• Loan facility available from 3rd year</li>
                <li>• Partial withdrawal from 7th year</li>
                <li>• Account can be extended in blocks of 5 years</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Investment Strategy</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Ideal for long-term wealth creation</li>
                <li>• Perfect for retirement planning</li>
                <li>• Contribute maximum ₹1.5L annually for best returns</li>
                <li>• Make contributions early in the financial year</li>
                <li>• Consider extension for tax-free growth</li>
                <li>
                  • Combine with other 80C investments for diversification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
