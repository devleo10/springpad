"use client";

"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaChartPie, FaCalculator } from "react-icons/fa";

export default function SipStepUpCalculator() {
  const [initialSip, setInitialSip] = useState<number>(5000);
  const [stepUpPercentage, setStepUpPercentage] = useState<number>(10);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(15);
  const [result, setResult] = useState<{
    regularSipValue: string;
    stepUpSipValue: string;
    additionalWealth: string;
    totalInvestment: string;
    regularSipInvestment: string;
  } | null>(null);

  const calculateStepUpSip = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = timePeriod * 12;

    // Calculate regular SIP future value
    let regularSipFutureValue: number;
    if (monthlyRate === 0) {
      regularSipFutureValue = initialSip * totalMonths;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      regularSipFutureValue =
        initialSip * ((compoundFactor - 1) / monthlyRate) * (1 + monthlyRate);
    }

    // Calculate step-up SIP future value
    let stepUpFutureValue = 0;
    let stepUpTotalInvestment = 0;
    let currentSipAmount = initialSip;

    for (let year = 1; year <= timePeriod; year++) {
      const yearStartMonth = (year - 1) * 12 + 1;
      const yearEndMonth = year * 12;
      const monthsInThisYear = yearEndMonth - yearStartMonth + 1;

      if (monthlyRate === 0) {
        stepUpFutureValue += currentSipAmount * monthsInThisYear;
      } else {
        // Calculate future value for this year's SIP amount
        const yearlyContribution =
          currentSipAmount *
          ((Math.pow(1 + monthlyRate, monthsInThisYear) - 1) / monthlyRate) *
          (1 + monthlyRate);
        stepUpFutureValue +=
          yearlyContribution *
          Math.pow(1 + monthlyRate, totalMonths - yearEndMonth);
      }

      stepUpTotalInvestment += currentSipAmount * monthsInThisYear;

      // Increase SIP amount for next year
      if (year < timePeriod) {
        currentSipAmount = currentSipAmount * (1 + stepUpPercentage / 100);
      }
    }

    const regularSipInvestment = initialSip * totalMonths;
    const additionalWealth = stepUpFutureValue - regularSipFutureValue;

    setResult({
      regularSipValue: regularSipFutureValue.toFixed(0),
      stepUpSipValue: stepUpFutureValue.toFixed(0),
      additionalWealth: additionalWealth.toFixed(0),
      totalInvestment: stepUpTotalInvestment.toFixed(0),
      regularSipInvestment: regularSipInvestment.toFixed(0),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyLakhs = (amount: number) => {
    const lakhs = amount / 100000;
    if (lakhs >= 100) {
      const crores = lakhs / 100;
      return `₹${crores.toFixed(1)} Cr`;
    }
    return `₹${lakhs.toFixed(1)} L`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800 pt-18">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaChartPie className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SIP Step-up Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          See how increasing your SIP amount annually can significantly boost
          your wealth creation through the power of compounding.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Step-up SIP Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Monthly SIP (₹)
                </label>
                <input
                  type="number"
                  value={initialSip}
                  onChange={(e) => setInitialSip(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="500"
                  step="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Step-up (%)
                </label>
                <input
                  type="number"
                  value={stepUpPercentage}
                  onChange={(e) => setStepUpPercentage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="5"
                  max="25"
                  step="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 10-15% (typical salary increment)
                </p>
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
                  min="8"
                  max="18"
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
                  min="5"
                  max="30"
                />
              </div>

              <button
                onClick={calculateStepUpSip}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate Step-up Benefits
              </button>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Results */}
            {result ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Regular SIP */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-blue-800">
                      Regular SIP
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-blue-600">Monthly SIP</p>
                        <p className="text-xl font-bold text-blue-800">
                          {formatCurrency(initialSip)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">
                          Total Investment
                        </p>
                        <p className="text-lg font-bold text-blue-800">
                          {formatCurrencyLakhs(
                            Number(result.regularSipInvestment)
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">Future Value</p>
                        <p className="text-2xl font-bold text-blue-800">
                          {formatCurrencyLakhs(Number(result.regularSipValue))}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step-up SIP */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 text-green-800">
                      Step-up SIP
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-green-600">Starting SIP</p>
                        <p className="text-xl font-bold text-green-800">
                          {formatCurrency(initialSip)}
                        </p>
                        <p className="text-xs text-green-600">
                          +{stepUpPercentage}% annually
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600">
                          Total Investment
                        </p>
                        <p className="text-lg font-bold text-green-800">
                          {formatCurrencyLakhs(Number(result.totalInvestment))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600">Future Value</p>
                        <p className="text-2xl font-bold text-green-800">
                          {formatCurrencyLakhs(Number(result.stepUpSipValue))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Wealth */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-200">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2 text-yellow-800">
                      Additional Wealth Created
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600 mb-2">
                      {formatCurrencyLakhs(Number(result.additionalWealth))}
                    </p>
                    <p className="text-sm text-yellow-700">
                      Extra wealth generated through step-up SIP strategy
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-yellow-600">Wealth Increase</p>
                        <p className="font-bold text-yellow-800">
                          {(
                            ((Number(result.stepUpSipValue) -
                              Number(result.regularSipValue)) /
                              Number(result.regularSipValue)) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                      <div>
                        <p className="text-yellow-600">Investment Increase</p>
                        <p className="font-bold text-yellow-800">
                          {(
                            ((Number(result.totalInvestment) -
                              Number(result.regularSipInvestment)) /
                              Number(result.regularSipInvestment)) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Year-wise SIP Preview */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    Year-wise SIP Amount Preview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 text-sm">
                    {Array.from(
                      { length: Math.min(timePeriod, 10) },
                      (_, i) => {
                        const year = i + 1;
                        const sipAmount =
                          initialSip * Math.pow(1 + stepUpPercentage / 100, i);
                        return (
                          <div
                            key={year}
                            className="bg-white p-3 rounded border"
                          >
                            <p className="text-gray-600">Year {year}</p>
                            <p className="font-bold text-blue-600">
                              {formatCurrency(sipAmount)}
                            </p>
                          </div>
                        );
                      }
                    )}
                    {timePeriod > 10 && (
                      <div className="bg-white p-3 rounded border">
                        <p className="text-gray-600">Year {timePeriod}</p>
                        <p className="font-bold text-blue-600">
                          {formatCurrency(
                            initialSip *
                              Math.pow(
                                1 + stepUpPercentage / 100,
                                timePeriod - 1
                              )
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 p-12 rounded-lg text-center">
                <p className="text-gray-500">
                  Enter your step-up SIP details and click calculate to see the
                  comparison
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Benefits of Step-up SIP
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • Step-up SIP helps you invest more as your income grows,
              typically matching salary increments
            </li>
            <li>
              • Even a 10% annual increase can significantly boost your
              long-term wealth creation
            </li>
            <li>
              • Helps maintain the real value of your investments against
              inflation
            </li>
            <li>
              • Accelerates your journey towards financial goals without feeling
              the pinch
            </li>
            <li>
              • Most mutual funds allow automatic step-up feature for
              convenience
            </li>
            <li>
              • The additional investment gets the same benefit of rupee cost
              averaging
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
