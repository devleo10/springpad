"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaUniversity, FaCalculator, FaChartLine } from "react-icons/fa";

interface CompoundingData {
  year: number;
  startingAmount: number;
  contribution: number;
  interest: number;
  endingAmount: number;
}

export default function CompoundingCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [annualRate, setAnnualRate] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [compoundingFrequency, setCompoundingFrequency] = useState<
    "Annually" | "Monthly" | "Quarterly"
  >("Monthly");
  const [result, setResult] = useState<{
    finalAmount: string;
    totalContributions: string;
    totalInterest: string;
    yearlyBreakdown: CompoundingData[];
    effectiveRate: string;
  } | null>(null);

  const calculateCompounding = () => {
    const rate = annualRate / 100;
    let currentAmount = principal;
    let totalContributions = principal;
    const yearlyBreakdown: CompoundingData[] = [];

    // Determine rates for different compounding frequencies
    const monthlyRate = rate / 12;
    const quarterlyRate = rate / 4;

    for (let year = 1; year <= timePeriod; year++) {
      const startingAmount = currentAmount;
      let yearContributions = 0;

      if (compoundingFrequency === "Monthly") {
        // Compound monthly with monthly contributions
        for (let month = 1; month <= 12; month++) {
          currentAmount = currentAmount * (1 + monthlyRate);
          currentAmount += monthlyContribution;
          yearContributions += monthlyContribution;
        }
      } else if (compoundingFrequency === "Quarterly") {
        // Compound quarterly with monthly contributions (add contributions monthly, compound quarterly)
        for (let quarter = 1; quarter <= 4; quarter++) {
          for (let month = 1; month <= 3; month++) {
            currentAmount += monthlyContribution;
            yearContributions += monthlyContribution;
          }
          currentAmount = currentAmount * (1 + quarterlyRate);
        }
      } else {
        // Compound annually with monthly contributions
        for (let month = 1; month <= 12; month++) {
          currentAmount += monthlyContribution;
          yearContributions += monthlyContribution;
        }
        currentAmount = currentAmount * (1 + rate);
      }

      totalContributions += yearContributions;
      const yearInterest = currentAmount - startingAmount - yearContributions;

      yearlyBreakdown.push({
        year,
        startingAmount,
        contribution: yearContributions,
        interest: yearInterest,
        endingAmount: currentAmount,
      });
    }

    const totalInterest = currentAmount - totalContributions;

    // Calculate effective annual rate
    const effectiveRate =
      compoundingFrequency === "Monthly"
        ? ((1 + monthlyRate) ** 12 - 1) * 100
        : compoundingFrequency === "Quarterly"
        ? ((1 + quarterlyRate) ** 4 - 1) * 100
        : rate * 100;

    setResult({
      finalAmount: currentAmount.toFixed(0),
      totalContributions: totalContributions.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      yearlyBreakdown,
      effectiveRate: effectiveRate.toFixed(2),
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
    <div className="relative min-h-screen bg-white text-neutral-800 pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaUniversity className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Compounding Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          See the magic of compound interest in action. Calculate how your
          investments grow over time with regular contributions.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Initial Investment (₹)
                  </label>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Contribution (₹)
                  </label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) =>
                      setMonthlyContribution(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                    step="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Annual Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0.1"
                    max="50"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time Period (Years)
                  </label>
                  <input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Compounding Frequency
                  </label>
                  <select
                    value={compoundingFrequency}
                    onChange={(e) =>
                      setCompoundingFrequency(
                        e.target.value as "Annually" | "Monthly" | "Quarterly"
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How often interest is calculated and added
                  </p>
                </div>

                <button
                  onClick={calculateCompounding}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCalculator />
                  Calculate Growth
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium text-green-800 mb-1">
                      Final Amount
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatLakhs(Number(result.finalAmount))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Total Contributions
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      {formatLakhs(Number(result.totalContributions))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-sm font-medium text-purple-800 mb-1">
                      Interest Earned
                    </h3>
                    <p className="text-xl font-bold text-purple-600">
                      {formatLakhs(Number(result.totalInterest))}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">
                        Effective Annual Rate:
                      </span>{" "}
                      {result.effectiveRate}%
                    </div>
                    <div>
                      <span className="font-medium">Growth Multiple:</span>{" "}
                      {(
                        Number(result.finalAmount) /
                        Number(result.totalContributions)
                      ).toFixed(2)}
                      x
                    </div>
                  </div>
                </div>

                {/* Yearly Breakdown Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FaChartLine className="text-blue-500" />
                      Year-wise Growth Breakdown
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
                            Starting Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Contributions
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Interest
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Ending Amount
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
                              {formatCurrency(data.startingAmount)}
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600">
                              {formatCurrency(data.contribution)}
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600">
                              {formatCurrency(data.interest)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              {formatCurrency(data.endingAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual Growth Chart (Simple representation) */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Growth Visualization
                  </h3>
                  <div className="grid grid-cols-10 gap-1 h-32">
                    {result.yearlyBreakdown.slice(0, 10).map((data, index) => {
                      const maxAmount = Math.max(
                        ...result.yearlyBreakdown.map((d) => d.endingAmount)
                      );
                      const height = (data.endingAmount / maxAmount) * 100;
                      return (
                        <div key={index} className="flex flex-col justify-end">
                          <div
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t min-h-1"
                            style={{ height: `${height}%` }}
                            title={`Year ${data.year}: ${formatCurrency(
                              data.endingAmount
                            )}`}
                          ></div>
                          <div className="text-xs text-center mt-1">
                            {data.year}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-gray-50 p-12 rounded-lg text-center text-gray-500">
                <FaUniversity className="mx-auto text-4xl mb-4 text-gray-400" />
                <p>
                  Enter your investment details and click calculate to see the
                  power of compounding
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Understanding Compound Interest
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">What is Compound Interest?</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  • Interest earned on both principal and previously earned
                  interest
                </li>
                <li>• Creates exponential growth over time</li>
                <li>• More powerful with longer time periods</li>
                <li>
                  • Einstein called it &quot;the eighth wonder of the
                  world&quot;
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Maximizing Compound Growth</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Start investing as early as possible</li>
                <li>• Make regular, consistent contributions</li>
                <li>• Choose investments with higher compounding frequency</li>
                <li>• Reinvest all dividends and interest</li>
                <li>• Stay invested for the long term</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
