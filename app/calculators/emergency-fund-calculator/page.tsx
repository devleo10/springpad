"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaShieldAlt, FaCalculator, FaChartLine } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

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

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaShieldAlt className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Emergency Fund Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate how much you need to save monthly to build an adequate
          emergency fund for financial security.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">
                Emergency Fund Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Expenses (₹)
                  </label>
                  <Input
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                    min={5000}
                    step={5000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Emergency Fund Duration (Months)
                  </label>
                  <Input
                    type="number"
                    value={emergencyMonths}
                    onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                    min={3}
                    max={24}
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
                  <Input
                    type="number"
                    value={timeToSave}
                    onChange={(e) => setTimeToSave(Number(e.target.value))}
                    min={0.5}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Annual Return (%)
                  </label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    min={1}
                    max={15}
                    step={0.5}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Emergency funds should be in low-risk investments (6-10%)
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Current Emergency Savings (₹)
                  </label>
                  <Input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    min={0}
                    step={5000}
                  />
                </div>
              </div>

              <button
                onClick={calculateEmergencyFund}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </Card>

            {/* Information Section */}
            <Card>
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
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    Emergency Fund Plan
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Emergency Fund Target
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(Number(result.emergencyFundTarget))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Monthly Investment Needed
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(result.monthlyInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Investment Required
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(Number(result.totalInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Future Value of Current Savings
                      </h3>
                      <p className="text-xl font-bold text-yellow-600">
                        {formatCurrency(
                          Number(result.futureValueOfCurrentSavings)
                        )}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Returns
                      </h3>
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(Number(result.totalReturns))}
                      </p>
                    </div>

                    <div
                      className={`bg-gradient-to-r p-4 rounded-lg ${
                        Number(result.adequacyRatio) >= 100
                          ? "from-green-50 to-green-100"
                          : "from-red-50 to-red-100"
                      }`}
                    >
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
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
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Planning Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly Expenses:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(monthlyExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Coverage Duration:
                      </span>
                      <span className="font-semibold">
                        {emergencyMonths} months
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Time to Build:
                      </span>
                      <span className="font-semibold">{timeToSave} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Expected Returns:
                      </span>
                      <span className="font-semibold">
                        {expectedReturn}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Savings:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(currentSavings)}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Monthly SIP Required:
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(Number(result.monthlyInvestment))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">Fund Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Target Emergency Fund:
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(Number(result.emergencyFundTarget))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        From Current Savings:
                      </span>
                      <span className="font-semibold text-yellow-600">
                        {formatCurrency(
                          Number(result.futureValueOfCurrentSavings)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        From Monthly SIPs:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(
                          Number(result.emergencyFundTarget) -
                            Number(result.futureValueOfCurrentSavings)
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Returns Earned:
                        </span>
                        <span className="font-bold text-orange-600">
                          {formatCurrency(Number(result.totalReturns))}
                        </span>
                      </div>
                    </div>
                    {Number(result.adequacyRatio) >= 100 ? (
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          ✓ Your emergency fund plan will adequately cover{" "}
                          {emergencyMonths} months of expenses.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">
                          ⚠ Consider increasing your savings rate or extending
                          the timeline to reach your target.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Enter your emergency fund details and click
                    &quot;Calculate&quot; to see your financial safety plan.
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
