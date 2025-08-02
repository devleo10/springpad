"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaUserShield,
  FaCalculator,
  FaChartLine,
  FaHeartbeat,
} from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const MAX_INCOME = 100000000;
const MAX_GROWTH = 200;
const MAX_YEARS = 50;
const DEBOUNCE_DELAY = 400;

type HLValueResult = {
  humanLifeValue: string;
  projectedIncome: string;
  outstandingLoan: string;
  growthPercent: string;
  years: string;
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

const sanitizeNumeric = (value: string) => {
  return value.replace(/[^0-9.]/g, "");
};

export default function HumanLifeValueCalculatorSimple() {
  const [currentAnnualIncome, setCurrentAnnualIncome] = useState<number>(2500000);
  const [currentAnnualIncomeDisplay, setCurrentAnnualIncomeDisplay] =
    useState<string>("25,00,000");

  const [expectedIncreasePercent, setExpectedIncreasePercent] = useState<number>(10);
  const [outstandingLoan, setOutstandingLoan] = useState<number>(0);
  const [outstandingLoanDisplay, setOutstandingLoanDisplay] =
    useState<string>("0");
  const [years, setYears] = useState<number>(10);

  const [result, setResult] = useState<HLValueResult | null>(null);
  const [touched, setTouched] = useState<boolean>(false);

  const inputsValid = useMemo(() => {
    return (
      currentAnnualIncome >= 0 &&
      currentAnnualIncome <= MAX_INCOME &&
      expectedIncreasePercent >= 0 &&
      expectedIncreasePercent <= MAX_GROWTH &&
      outstandingLoan >= 0 &&
      years >= 1 &&
      years <= MAX_YEARS &&
      Number.isInteger(years)
    );
  }, [currentAnnualIncome, expectedIncreasePercent, outstandingLoan, years]);

  const validationMessages = useMemo(() => {
    const msgs: string[] = [];
    if (currentAnnualIncome < 0 || currentAnnualIncome > MAX_INCOME) {
      msgs.push(
        `Current annual income must be between ₹0 and ₹${MAX_INCOME.toLocaleString()}`
      );
    }
    if (expectedIncreasePercent < 0 || expectedIncreasePercent > MAX_GROWTH) {
      msgs.push(`Expected increase must be between 0% and ${MAX_GROWTH}%`);
    }
    if (outstandingLoan < 0) {
      msgs.push(`Outstanding loan cannot be negative`);
    }
    if (!Number.isInteger(years) || years < 1 || years > MAX_YEARS) {
      msgs.push(`Number of years must be an integer between 1 and ${MAX_YEARS}`);
    }
    return msgs;
  }, [currentAnnualIncome, expectedIncreasePercent, outstandingLoan, years]);

  const computeHumanLifeValue = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }
    const I = currentAnnualIncome;
    const g = expectedIncreasePercent / 100;
    const N = years;
    let projectedIncome = 0;
    for (let year = 1; year <= N; year++) {
      projectedIncome += I * Math.pow(1 + g, year);
    }
    const humanLifeValue = Math.max(0, projectedIncome - outstandingLoan);
    setResult({
      humanLifeValue: humanLifeValue.toFixed(0),
      projectedIncome: projectedIncome.toFixed(0),
      outstandingLoan: outstandingLoan.toFixed(0),
      growthPercent: expectedIncreasePercent.toString(),
      years: years.toString(),
    });
  }, [currentAnnualIncome, expectedIncreasePercent, outstandingLoan, years, inputsValid]);

  useEffect(() => {
    if (!touched) return;
    const timer = setTimeout(() => {
      computeHumanLifeValue();
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [currentAnnualIncome, expectedIncreasePercent, outstandingLoan, years, computeHumanLifeValue, touched]);

  const handleIncomeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTouched(true);
      const raw = e.target.value.replace(/,/g, "");
      if (raw === "") {
        setCurrentAnnualIncome(0);
        setCurrentAnnualIncomeDisplay("");
        return;
      }
      const sanitized = sanitizeNumeric(raw);
      const num = Number(sanitized);
      if (isNaN(num) || num < 0) return;
      setCurrentAnnualIncome(num);
      setCurrentAnnualIncomeDisplay(num.toLocaleString("en-IN"));
    },
    []
  );

  const handleLoanChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTouched(true);
      const raw = e.target.value.replace(/,/g, "");
      if (raw === "") {
        setOutstandingLoan(0);
        setOutstandingLoanDisplay("");
        return;
      }
      const sanitized = sanitizeNumeric(raw);
      const num = Number(sanitized);
      if (isNaN(num) || num < 0) return;
      setOutstandingLoan(num);
      setOutstandingLoanDisplay(num.toLocaleString("en-IN"));
    },
    []
  );

  const handleGrowthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTouched(true);
      const raw = e.target.value;
      if (raw === "") {
        setExpectedIncreasePercent(0);
        return;
      }
      const sanitized = sanitizeNumeric(raw);
      const num = Number(sanitized);
      if (isNaN(num) || num < 0 || num > MAX_GROWTH) return;
      setExpectedIncreasePercent(num);
    },
    []
  );

  const handleYearsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTouched(true);
      const raw = e.target.value;
      if (raw === "") {
        setYears(0);
        return;
      }
      const num = Number(raw);
      if (
        isNaN(num) ||
        num < 1 ||
        num > MAX_YEARS ||
        !Number.isInteger(Number(num))
      )
        return;
      setYears(num);
    },
    []
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") computeHumanLifeValue();
    },
    [computeHumanLifeValue]
  );

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaUserShield className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Human Life Value Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Estimate the economic value of your life based on future income growth
          and existing liabilities.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaHeartbeat className="text-red-500" />
                Income & Liability Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Annual Income */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Current Annual Income (Rs)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={currentAnnualIncomeDisplay}
                    onChange={handleIncomeChange}
                    onKeyDown={handleKeyPress}
                    placeholder="25,00,000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your gross yearly income.
                  </p>
                </div>

                {/* Expected increase */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected increase in income (% per annum)
                  </label>
                  <Input
                    type="number"
                    value={expectedIncreasePercent}
                    onChange={handleGrowthChange}
                    onKeyDown={handleKeyPress}
                    min={0}
                    max={MAX_GROWTH}
                    step={0.5}
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Growth rate per year (e.g., promotions/inflation)
                  </p>
                </div>

                {/* Outstanding loan */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Outstanding loan amount (Rs)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={outstandingLoanDisplay}
                    onChange={handleLoanChange}
                    onKeyDown={handleKeyPress}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Existing liabilities to subtract from value.
                  </p>
                </div>

                {/* Number of Years */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Years
                  </label>
                  <Input
                    type="number"
                    value={years}
                    onChange={handleYearsChange}
                    onKeyDown={handleKeyPress}
                    min={1}
                    max={MAX_YEARS}
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Projection horizon (1 - {MAX_YEARS} years)
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setTouched(true);
                  computeHumanLifeValue();
                }}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate Life Value
              </button>

              {validationMessages.length > 0 && touched && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-sm font-medium text-red-800 mb-2">
                    Please fix:
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationMessages.map((m, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Info Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">
                Understanding Human Life Value
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">
                    What is Human Life Value?
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      • Present value of your future income growth over chosen
                      years
                    </li>
                    <li>
                      • Reflects economic support your dependents would lose
                    </li>
                    <li>
                      • Outstanding loans reduce the net value available to
                      family
                    </li>
                    <li>
                      • Helps decide how much life insurance is appropriate
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Key Notes</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Income increases are compounded annually</li>
                    <li>• No discounting is applied in this version</li>
                    <li>• Review periodically as income and obligations change</li>
                    <li>• Use conservative growth assumptions if uncertain</li>
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
                    <FaChartLine className="text-green-500" />
                    Life Value Analysis
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Human Life Value
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatLakhs(Number(result.humanLifeValue))}
                      </p>
                      <p className="text-xs text-gray-500">
                        Total projected income minus outstanding loan
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border-l-4 border-purple-500">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Projected Income (Growth Applied)
                      </h3>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatLakhs(Number(result.projectedIncome))}
                      </p>
                      <p className="text-xs text-gray-500">
                        Based on {result.growthPercent}% increase over {result.years} years
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border-l-4 border-red-500">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Outstanding Loan Deducted
                      </h3>
                      <p className="text-2xl font-bold text-red-600">
                        {formatLakhs(Number(result.outstandingLoan))}
                      </p>
                      <p className="text-xs text-gray-500">
                        Liability reducing the human life value
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Analysis Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Annual Income:
                      </span>
                      <span className="font-semibold">
                        {formatLakhs(currentAnnualIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Expected Increase:
                      </span>
                      <span className="font-semibold">
                        {expectedIncreasePercent}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Projection Horizon:
                      </span>
                      <span className="font-semibold">{years} years</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Outstanding Loan:
                      </span>
                      <span className="font-semibold">
                        {formatLakhs(outstandingLoan)}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Coverage Recommendation
                  </h3>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="text-orange-500 text-lg">💡</div>
                      <div>
                        <p className="text-sm text-orange-800 mb-1">
                          <strong>Suggested Life Cover:</strong>
                        </p>
                        <p className="text-xl font-bold text-orange-700 mb-1">
                          {formatLakhs(Number(result.humanLifeValue))}
                        </p>
                        <p className="text-xs text-orange-700">
                          Ensure your dependents can replace your projected
                          income after accounting for existing liabilities.
                        </p>
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
                    Fill in the income, growth, loan and years above and click
                    “Calculate Life Value” to see your analysis.
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
