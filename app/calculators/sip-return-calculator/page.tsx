"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaChartLine, FaCalculator } from "react-icons/fa";

export default function SipReturnCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);
  const [result, setResult] = useState<{
    futureValue: string;
    totalInvestment: string;
    totalReturns: string;
  } | null>(null);

  const calculateSipReturns = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;

    // SIP Future Value formula: FV = PMT * [((1 + r)^n - 1) / r] * (1 + r)
    let futureValue: number;

    if (monthlyRate === 0) {
      futureValue = monthlyInvestment * totalMonths;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      futureValue =
        monthlyInvestment *
        ((compoundFactor - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    const totalInvestment = monthlyInvestment * totalMonths;
    const totalReturns = futureValue - totalInvestment;

    setResult({
      futureValue: futureValue.toFixed(0),
      totalInvestment: totalInvestment.toFixed(0),
      totalReturns: totalReturns.toFixed(0),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 pt-18">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SIP Return Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate the future value of your SIP investments and see how your
          money grows over time.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="500"
                  step="500"
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
                  max="30"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Investment Period (Years)
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

              <button
                onClick={calculateSipReturns}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate Returns
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Results</h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Future Value
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(Number(result.futureValue))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Investment
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(Number(result.totalInvestment))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Returns
                  </h3>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(Number(result.totalReturns))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Return Percentage
                  </h3>
                  <p className="text-xl font-bold text-yellow-600">
                    {(
                      (Number(result.totalReturns) /
                        Number(result.totalInvestment)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your investment details and click calculate to see results
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">About SIP Returns</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • SIP (Systematic Investment Plan) allows you to invest a fixed
              amount regularly
            </li>
            <li>
              • Returns are compounded monthly, which helps in wealth creation
              over time
            </li>
            <li>
              • Dollar-cost averaging through SIP helps reduce the impact of
              market volatility
            </li>
            <li>
              • The earlier you start, the more you benefit from the power of
              compounding
            </li>
            <li>
              • Past performance doesn&apos;t guarantee future results. Actual
              returns may vary
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
