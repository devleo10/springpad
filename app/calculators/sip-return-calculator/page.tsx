"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaChartLine,
  FaCalculator,
  FaPiggyBank,
  FaShieldAlt,
  FaArrowUp,
} from "react-icons/fa";

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
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SIP Return Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate the future value of your SIP investments and see how your
          money grows over time.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaPiggyBank className="text-green-500" />
                Investment Details
              </h2>
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
                  <p className="text-xs text-gray-500 mt-1">Minimum: ₹500</p>
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
                  <p className="text-xs text-gray-500 mt-1">
                    Typical equity funds: 10-15%
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Investment Period (Years)
                  </label>
                  <Input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    min={1}
                    max={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Longer investment periods benefit more from compounding
                  </p>
                </div>
              </div>

              <button
                onClick={calculateSipReturns}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate Returns
              </button>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">About SIP Returns</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">SIP Benefits</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Regular fixed amount investment</li>
                    <li>• Monthly compounding for wealth creation</li>
                    <li>• Dollar-cost averaging reduces volatility</li>
                    <li>• Disciplined investment approach</li>
                    <li>• Flexibility to increase or pause</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Investment Tips</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Start early to benefit from compounding</li>
                    <li>• Choose funds based on risk appetite</li>
                    <li>• Review and rebalance periodically</li>
                    <li>• Stay invested for long-term goals</li>
                    <li>
                      • Past performance doesn&apos;t guarantee future results
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    Investment Results
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <h3 className="text-sm font-medium text-green-800 mb-1">
                        Future Value
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(Number(result.futureValue))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <h3 className="text-sm font-medium text-blue-800 mb-1">
                        Total Investment
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(result.totalInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <h3 className="text-sm font-medium text-purple-800 mb-1">
                        Total Returns
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(Number(result.totalReturns))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                      <h3 className="text-sm font-medium text-yellow-800 mb-1">
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
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Investment Summary
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
                        Expected Return:
                      </span>
                      <span className="font-semibold">
                        {expectedReturn}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Investment Period:
                      </span>
                      <span className="font-semibold">{timePeriod} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Installments:
                      </span>
                      <span className="font-semibold">{timePeriod * 12}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Wealth Multiplier:
                        </span>
                        <span className="font-bold text-green-600">
                          {(
                            Number(result.futureValue) /
                            Number(result.totalInvestment)
                          ).toFixed(1)}
                          x
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-4">
                    Investment Strategy
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-700 mb-2">
                        Power of Compounding
                      </h4>
                      <ul className="space-y-1 text-xs text-green-600">
                        <li>• Your returns earn returns</li>
                        <li>• Exponential growth over time</li>
                        <li>• Time is your biggest asset</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-700 mb-2">
                        Rupee Cost Averaging
                      </h4>
                      <ul className="space-y-1 text-xs text-blue-600">
                        <li>• Buy more units when prices are low</li>
                        <li>• Buy fewer units when prices are high</li>
                        <li>• Reduces average cost per unit</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-purple-700 mb-2">
                        Stay Disciplined
                      </h4>
                      <ul className="space-y-1 text-xs text-purple-600">
                        <li>• Continue SIP during market volatility</li>
                        <li>• Don&apos;t try to time the market</li>
                        <li>• Focus on long-term goals</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaShieldAlt className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Enter your investment details and click &quot;Calculate
                    Returns&quot; to see your SIP projections.
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
