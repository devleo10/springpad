"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaHome, FaCalculator, FaChartLine } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function DreamHomeCalculator() {
  const [homePrice, setHomePrice] = useState<number>(5000000);
  const [downPayment, setDownPayment] = useState<number>(20);
  const [timeHorizon, setTimeHorizon] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [result, setResult] = useState<{
    downPaymentAmount: string;
    monthlyInvestment: string;
    totalInvestment: string;
    totalReturns: string;
    futureValueOfCurrentSavings: string;
  } | null>(null);

  const calculateDreamHome = () => {
    const downPaymentAmount = (homePrice * downPayment) / 100;
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeHorizon * 12;

    // Future value of current savings
    const futureValueOfCurrentSavings =
      currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Remaining amount needed from SIP
    const remainingAmount = downPaymentAmount - futureValueOfCurrentSavings;

    if (remainingAmount <= 0) {
      setResult({
        downPaymentAmount: downPaymentAmount.toFixed(0),
        monthlyInvestment: "0",
        totalInvestment: "0",
        totalReturns: (futureValueOfCurrentSavings - currentSavings).toFixed(0),
        futureValueOfCurrentSavings: futureValueOfCurrentSavings.toFixed(0),
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

      setResult({
        downPaymentAmount: downPaymentAmount.toFixed(0),
        monthlyInvestment: monthlyInvestment.toFixed(0),
        totalInvestment: totalInvestment.toFixed(0),
        totalReturns: totalReturns.toFixed(0),
        futureValueOfCurrentSavings: futureValueOfCurrentSavings.toFixed(0),
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
          <FaHome className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Dream Home Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan and calculate how much you need to save monthly for your dream
          home down payment.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Home Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Home Price (₹)
                  </label>
                  <Input
                    type="number"
                    value={homePrice}
                    onChange={(e) => setHomePrice(Number(e.target.value))}
                    min={100000}
                    step={100000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Down Payment (%)
                  </label>
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    min={10}
                    max={100}
                    step={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time to Buy (Years)
                  </label>
                  <Input
                    type="number"
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(Number(e.target.value))}
                    min={1}
                    max={20}
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
                    Current Savings (₹)
                  </label>
                  <Input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    min={0}
                    step={10000}
                  />
                </div>
              </div>

              <button
                onClick={calculateDreamHome}
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
                  • This calculator helps you plan for your dream home down
                  payment
                </li>
                <li>
                  • It calculates the monthly investment needed based on your
                  timeline
                </li>
                <li>
                  • Considers your current savings and their growth potential
                </li>
                <li>• Typical down payment ranges from 10-30% of home value</li>
                <li>• Start early to benefit from compound growth</li>
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
                    Dream Home Results
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Down Payment Required
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(Number(result.downPaymentAmount))}
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
                        Total Investment
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
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Planning Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Home Price:</span>
                      <span className="font-semibold">
                        {formatCurrency(homePrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Down Payment %:
                      </span>
                      <span className="font-semibold">{downPayment}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Time to Buy:
                      </span>
                      <span className="font-semibold">{timeHorizon} years</span>
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
                  <h3 className="text-lg font-semibold mb-3">
                    Investment Breakdown
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Down Payment Needed:
                      </span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(Number(result.downPaymentAmount))}
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
                          Number(result.downPaymentAmount) -
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
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Enter your home details and click &quot;Calculate&quot; to
                    see your dream home savings plan.
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
