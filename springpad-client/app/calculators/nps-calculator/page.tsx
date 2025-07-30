"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export default function NPSCalculatorPage() {
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [annuityReturn, setAnnuityReturn] = useState<number>(6);

  const calculateNPS = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyRate = expectedReturn / 100 / 12;
    const months = yearsToRetirement * 12;

    // Calculate corpus at retirement
    const corpus =
      monthlyContribution *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate));
    const totalInvestment = monthlyContribution * months;

    // At retirement, 60% can be withdrawn, 40% must be used for annuity
    const lumpsum = corpus * 0.6;
    const annuityAmount = corpus * 0.4;

    // Calculate monthly pension from annuity
    const monthlyPension = (annuityAmount * annuityReturn) / 100 / 12;

    return {
      corpus: Math.round(corpus),
      totalInvestment: Math.round(totalInvestment),
      lumpsum: Math.round(lumpsum),
      annuityAmount: Math.round(annuityAmount),
      monthlyPension: Math.round(monthlyPension),
      totalReturns: Math.round(corpus - totalInvestment),
    };
  };

  const result = calculateNPS();

  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">NPS Calculator</h1>
        <p className="text-gray-600 mb-10">
          Calculate your National Pension System (NPS) returns and retirement
          corpus.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Investment Details</h2>

            <div className="space-y-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Age (Years)
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Retirement Age (Years)
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Annuity Return (%)
                </label>
                <input
                  type="number"
                  value={annuityReturn}
                  onChange={(e) => setAnnuityReturn(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Results</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Investment:</span>
                <span className="font-semibold text-lg">
                  ₹{result.totalInvestment.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Corpus:</span>
                <span className="font-bold text-xl text-blue-600">
                  ₹{result.corpus.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lumpsum (60%):</span>
                <span className="font-semibold text-lg text-green-600">
                  ₹{result.lumpsum.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Annuity Amount (40%):</span>
                <span className="font-semibold text-lg">
                  ₹{result.annuityAmount.toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly Pension:</span>
                  <span className="font-bold text-xl text-orange-600">
                    ₹{result.monthlyPension.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
