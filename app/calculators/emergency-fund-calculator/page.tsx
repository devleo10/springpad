"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaShieldAlt, FaCalculator } from "react-icons/fa";

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(50000);
  const [emergencyMonths, setEmergencyMonths] = useState<number>(6);
  const [timeToSave, setTimeToSave] = useState<number>(2);
  const [expectedReturn, setExpectedReturn] = useState<number>(8);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [result, setResult] = useState<{
    emergencyFundTarget: string;
    monthlyInvestment: string;
    totalInvestment: string;
    totalReturns: string;
    futureValueOfCurrentSavings: string;
    adequacyRatio: string;
  } | null>(null);

  const calculateEmergencyFund = () => {
    const emergencyFundTarget = monthlyExpenses * emergencyMonths;
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeToSave * 12;

    // Future value of current savings
    const futureValueOfCurrentSavings =
      currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Remaining amount needed from SIP
    const remainingAmount = emergencyFundTarget - futureValueOfCurrentSavings;

    if (remainingAmount <= 0) {
      const adequacyRatio =
        (futureValueOfCurrentSavings / emergencyFundTarget) * 100;
      setResult({
        emergencyFundTarget: emergencyFundTarget.toFixed(0),
        monthlyInvestment: "0",
        totalInvestment: "0",
        totalReturns: (futureValueOfCurrentSavings - currentSavings).toFixed(0),
        futureValueOfCurrentSavings: futureValueOfCurrentSavings.toFixed(0),
        adequacyRatio: adequacyRatio.toFixed(1),
      });
    } else {
      // Calculate required monthly SIP
      const futureValueFactor =
        (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      const monthlyInvestment = remainingAmount / futureValueFactor;
      const totalInvestment = monthlyInvestment * totalMonths;
      const totalReturns =
        remainingAmount -
        totalInvestment +
        (futureValueOfCurrentSavings - currentSavings);

      const adequacyRatio =
        ((futureValueOfCurrentSavings + remainingAmount) /
          emergencyFundTarget) *
        100;

      setResult({
        emergencyFundTarget: emergencyFundTarget.toFixed(0),
        monthlyInvestment: monthlyInvestment.toFixed(0),
        totalInvestment: totalInvestment.toFixed(0),
        totalReturns: totalReturns.toFixed(0),
        futureValueOfCurrentSavings: futureValueOfCurrentSavings.toFixed(0),
        adequacyRatio: adequacyRatio.toFixed(1),
      });
    }
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

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaShieldAlt className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Emergency Fund Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate how much you need to save monthly to build an adequate
          emergency fund for financial security.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Emergency Fund Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Expenses (₹)
                </label>
                <input
                  type="number"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="5000"
                  step="5000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Emergency Fund Duration (Months)
                </label>
                <input
                  type="number"
                  value={emergencyMonths}
                  onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="3"
                  max="24"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 6-12 months for salaried, 12-24 months for
                  business owners
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Time to Build Fund (Years)
                </label>
                <input
                  type="number"
                  value={timeToSave}
                  onChange={(e) => setTimeToSave(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0.5"
                  max="10"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1"
                  max="15"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Emergency funds should be in low-risk investments (6-10%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Emergency Savings (₹)
                </label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="0"
                  step="5000"
                />
              </div>

              <button
                onClick={calculateEmergencyFund}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Emergency Fund Plan</h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Emergency Fund Target
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(Number(result.emergencyFundTarget))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Monthly Investment Needed
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(Number(result.monthlyInvestment))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Investment Required
                  </h3>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(Number(result.totalInvestment))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Future Value of Current Savings
                  </h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {formatCurrency(Number(result.futureValueOfCurrentSavings))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Returns
                  </h3>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(Number(result.totalReturns))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Fund Adequacy
                  </h3>
                  <p
                    className={`text-xl font-bold ${
                      Number(result.adequacyRatio) >= 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.adequacyRatio}%
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your details and click calculate to see your emergency
                fund plan
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Emergency Fund Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • Emergency fund should cover 6-12 months of expenses for
              stability
            </li>
            <li>• Keep emergency funds in liquid, low-risk investments</li>
            <li>
              • Prioritize building emergency fund before other investments
            </li>
            <li>
              • Consider savings accounts, liquid funds, or short-term FDs
            </li>
            <li>• Review and update your emergency fund annually</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
