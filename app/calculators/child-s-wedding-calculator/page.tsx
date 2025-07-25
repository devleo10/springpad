"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaRing, FaCalculator, FaChartLine } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ChildWeddingCalculator() {
  const [weddingCost, setWeddingCost] = useState<number>(2000000);
  const [childAge, setChildAge] = useState<number>(5);
  const [weddingAge, setWeddingAge] = useState<number>(25);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [result, setResult] = useState<{
    timeHorizon: string;
    futureWeddingCost: string;
    monthlyInvestment: string;
    totalInvestment: string;
    totalReturns: string;
    futureValueOfCurrentSavings: string;
  } | null>(null);

  const calculateWedding = () => {
    const timeHorizon = weddingAge - childAge;

    if (timeHorizon <= 0) {
      alert("Wedding age should be greater than current age");
      return;
    }

    // Calculate future wedding cost with inflation
    const futureWeddingCost =
      weddingCost * Math.pow(1 + inflationRate / 100, timeHorizon);

    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timeHorizon * 12;

    // Future value of current savings
    const futureValueOfCurrentSavings =
      currentSavings * Math.pow(1 + monthlyRate, totalMonths);

    // Remaining amount needed from SIP
    const remainingAmount = futureWeddingCost - futureValueOfCurrentSavings;

    if (remainingAmount <= 0) {
      setResult({
        timeHorizon: timeHorizon.toString(),
        futureWeddingCost: futureWeddingCost.toFixed(0),
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
        timeHorizon: timeHorizon.toString(),
        futureWeddingCost: futureWeddingCost.toFixed(0),
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
          <FaRing className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">
            Child&apos;s Wedding Calculator
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan and save for your child&apos;s wedding expenses with
          inflation-adjusted calculations.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">
                Wedding Planning Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Wedding Cost (₹)
                  </label>
                  <Input
                    type="number"
                    value={weddingCost}
                    onChange={(e) => setWeddingCost(Number(e.target.value))}
                    min={100000}
                    step={50000}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Child&apos;s Current Age
                  </label>
                  <Input
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    min={0}
                    max={30}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Wedding Age
                  </label>
                  <Input
                    type="number"
                    value={weddingAge}
                    onChange={(e) => setWeddingAge(Number(e.target.value))}
                    min={18}
                    max={40}
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Inflation Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    min={1}
                    max={15}
                    step={0.5}
                  />
                </div>

                <div>
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
                onClick={calculateWedding}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate
              </button>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">
                Wedding Planning Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • Start saving early to reduce the monthly investment burden
                </li>
                <li>
                  • Consider inflation when planning for future wedding expenses
                </li>
                <li>
                  • Wedding costs typically increase by 6-8% annually due to
                  inflation
                </li>
                <li>
                  • Create a separate investment account dedicated to this goal
                </li>
                <li>• Review and adjust your savings plan annually</li>
              </ul>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-pink-500" />
                    Wedding Planning Results
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Time to Wedding
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {result.timeHorizon} Years
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Future Wedding Cost
                      </h3>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(Number(result.futureWeddingCost))}
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
                      <span className="text-sm text-gray-600">
                        Child&apos;s Current Age:
                      </span>
                      <span className="font-semibold">{childAge} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Expected Wedding Age:
                      </span>
                      <span className="font-semibold">{weddingAge} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Planning Period:
                      </span>
                      <span className="font-semibold">
                        {result.timeHorizon} years
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Wedding Cost:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(weddingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Inflation Rate:
                      </span>
                      <span className="font-semibold">
                        {inflationRate}% p.a.
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Expected Returns:
                        </span>
                        <span className="font-bold text-green-600">
                          {expectedReturn}% p.a.
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
                    Enter wedding planning details and click
                    &quot;Calculate&quot; to see your comprehensive wedding
                    savings plan.
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
