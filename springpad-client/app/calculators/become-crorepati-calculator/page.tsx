"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaRupeeSign, FaCalculator, FaChartLine } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function BecomeCrorepatiCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [targetAmount, setTargetAmount] = useState<number>(10000000); // 1 Crore
  const [result, setResult] = useState<{
    timeInYears: string;
    timeInMonths: number;
    totalInvestment: string;
    totalReturns: string;
  } | null>(null);

  const calculateCrorepati = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const targetAmountNumber = targetAmount;

    // Calculate time to reach target using SIP formula
    // FV = PMT * [((1 + r)^n - 1) / r]
    // Solving for n: n = log(1 + (FV * r) / PMT) / log(1 + r)

    if (monthlyRate === 0) {
      const timeInMonths = targetAmountNumber / monthlyInvestment;
      const timeInYears = timeInMonths / 12;
      setResult({
        timeInYears: timeInYears.toFixed(1),
        timeInMonths: Math.ceil(timeInMonths),
        totalInvestment: (monthlyInvestment * timeInMonths).toFixed(0),
        totalReturns: "0",
      });
    } else {
      const numerator = Math.log(
        1 + (targetAmountNumber * monthlyRate) / monthlyInvestment
      );
      const denominator = Math.log(1 + monthlyRate);
      const timeInMonths = numerator / denominator;
      const timeInYears = timeInMonths / 12;
      const totalInvestment = monthlyInvestment * timeInMonths;
      const totalReturns = targetAmountNumber - totalInvestment;

      setResult({
        timeInYears: timeInYears.toFixed(1),
        timeInMonths: Math.ceil(timeInMonths),
        totalInvestment: totalInvestment.toFixed(0),
        totalReturns: totalReturns.toFixed(0),
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
          <FaRupeeSign className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Become Crorepati Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate how long it will take to become a crorepati with your
          monthly SIP investments.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Investment Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) =>
                      setMonthlyInvestment(Number(e.target.value))
                    }
                    min={500}
                    step={500}
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
                    max={30}
                    step={0.5}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Target Amount (₹)
                  </label>
                  <select
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value={1000000}>10 Lakh</option>
                    <option value={2500000}>25 Lakh</option>
                    <option value={5000000}>50 Lakh</option>
                    <option value={10000000}>1 Crore</option>
                    <option value={25000000}>2.5 Crore</option>
                    <option value={50000000}>5 Crore</option>
                    <option value={100000000}>10 Crore</option>
                  </select>
                </div>
              </div>

              <button
                onClick={calculateCrorepati}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • This calculator uses the SIP (Systematic Investment Plan)
                  formula to determine the time needed to reach your target
                  amount
                </li>
                <li>
                  • The calculation assumes a consistent monthly investment and
                  expected annual return
                </li>
                <li>
                  • Returns are compounded monthly for more accurate
                  calculations
                </li>
                <li>
                  • Past performance doesn&apos;t guarantee future results.
                  Actual returns may vary
                </li>
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
                    Results Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Time to Reach Target
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {result.timeInYears} Years
                      </p>
                      <p className="text-sm text-gray-500">
                        ({result.timeInMonths} months)
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Investment
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(result.totalInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Returns
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(Number(result.totalReturns))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Target Amount
                      </h3>
                      <p className="text-xl font-bold text-yellow-600">
                        {formatCurrency(targetAmount)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Investment Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly SIP:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(monthlyInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Annual Return:
                      </span>
                      <span className="font-semibold">{expectedReturn}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Investment Period:
                      </span>
                      <span className="font-semibold">
                        {result.timeInYears} years
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Target Achievement:
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(targetAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Enter your investment details and click
                    &quot;Calculate&quot; to see your crorepati journey
                    timeline.
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
