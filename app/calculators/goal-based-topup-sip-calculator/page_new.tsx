"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import {
  FaCalculator,
  FaLightbulb,
  FaChartPie,
} from "react-icons/fa6";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// UI Components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

// Types
interface GoalBasedTopupSipResult {
  initialSIP: string;
  finalSIP: string;
  totalInvestment: string;
  targetAmount: string;
  totalReturns: string;
  returnOnInvestment: string;
  averageSIP: string;
}

interface ChartDataPoint {
  year: number;
  investment: number;
  returns: number;
  totalValue: number;
  yearlyTarget: number;
  sipAmount: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_RETURN = 1;
const MAX_RETURN = 30;
const MIN_YEARS = 1;
const MAX_YEARS = 40;
const MIN_TARGET = 100000;
const MAX_TARGET = 100000000;
const MIN_INITIAL_SIP = 500;
const MAX_INITIAL_SIP = 1000000;
const MIN_TOPUP = 0;
const MAX_TOPUP = 50;

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

// Enhanced validation functions
const validateTargetAmount = (value: number): boolean => {
  return value >= MIN_TARGET && value <= MAX_TARGET;
};

const validateReturnRate = (value: number): boolean => {
  return value >= MIN_RETURN && value <= MAX_RETURN;
};

const validateTimePeriod = (value: number): boolean => {
  return value >= MIN_YEARS && value <= MAX_YEARS;
};

const validateInitialSIP = (value: number): boolean => {
  return value >= MIN_INITIAL_SIP && value <= MAX_INITIAL_SIP;
};

const validateTopupRate = (value: number): boolean => {
  return value >= MIN_TOPUP && value <= MAX_TOPUP;
};

const sanitizeInput = (value: string, maxLength: number = 10): string => {
  // Remove any non-numeric characters except decimal point
  const cleaned = value.replace(/[^0-9.]/g, "");
  // Ensure only one decimal point
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  // Limit length to prevent extremely large numbers
  return cleaned.substring(0, maxLength);
};

export default function GoalBasedTopupSIPCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | "">(5000000);
  const [timePeriod, setTimePeriod] = useState<number | "">(15);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [initialSIP, setInitialSIP] = useState<number | "">(5000);
  const [topupRate, setTopupRate] = useState<number | "">(10);
  const [result, setResult] = useState<GoalBasedTopupSipResult | null>(null);

  // Validation messages for better UX
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (targetAmount !== "" && !validateTargetAmount(Number(targetAmount))) {
      messages.push(
        `Target amount should be between ₹${MIN_TARGET.toLocaleString()} and ₹${MAX_TARGET.toLocaleString()}`
      );
    }

    if (expectedReturn !== "" && !validateReturnRate(Number(expectedReturn))) {
      messages.push(
        `Expected return should be between ${MIN_RETURN}% and ${MAX_RETURN}%`
      );
    }

    if (timePeriod !== "" && !validateTimePeriod(Number(timePeriod))) {
      messages.push(
        `Time period should be between ${MIN_YEARS} and ${MAX_YEARS} years`
      );
    }

    if (initialSIP !== "" && !validateInitialSIP(Number(initialSIP))) {
      messages.push(
        `Initial SIP should be between ₹${MIN_INITIAL_SIP.toLocaleString()} and ₹${MAX_INITIAL_SIP.toLocaleString()}`
      );
    }

    if (topupRate !== "" && !validateTopupRate(Number(topupRate))) {
      messages.push(
        `Top-up rate should be between ${MIN_TOPUP}% and ${MAX_TOPUP}%`
      );
    }

    return messages;
  }, [targetAmount, expectedReturn, timePeriod, initialSIP, topupRate]);

  // Enhanced validation of inputs
  const inputsValid = useMemo(() => {
    return (
      isValidInput(targetAmount) &&
      validateTargetAmount(Number(targetAmount)) &&
      isValidInput(expectedReturn) &&
      validateReturnRate(Number(expectedReturn)) &&
      isValidInput(timePeriod) &&
      validateTimePeriod(Number(timePeriod)) &&
      isValidInput(initialSIP) &&
      validateInitialSIP(Number(initialSIP)) &&
      topupRate !== "" &&
      validateTopupRate(Number(topupRate))
    );
  }, [targetAmount, expectedReturn, timePeriod, initialSIP, topupRate]);

  // Optimized calculation function
  const calculateGoalBasedTopupSIP = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const years = Number(timePeriod);
    const initialMonthlySIP = Number(initialSIP);
    const annualTopupRate = Number(topupRate) / 100;

    let totalInvestment = 0;
    let maturityValue = 0;
    let currentSIP = initialMonthlySIP;

    // Calculate year by year with top-up
    for (let year = 1; year <= years; year++) {
      // Calculate value at the end of this year
      for (let month = 1; month <= 12; month++) {
        totalInvestment += currentSIP;
        if (monthlyRate === 0) {
          maturityValue += currentSIP;
        } else {
          const remainingMonths = (years - year) * 12 + (12 - month);
          maturityValue +=
            currentSIP * Math.pow(1 + monthlyRate, remainingMonths);
        }
      }

      // Apply top-up for next year (except for the last year)
      if (year < years) {
        currentSIP = currentSIP * (1 + annualTopupRate);
      }
    }

    const finalSIP = currentSIP;
    const totalReturns = maturityValue - totalInvestment;
    const returnOnInvestment = (totalReturns / totalInvestment) * 100;
    const averageSIP = totalInvestment / (years * 12);

    setResult({
      initialSIP: initialMonthlySIP.toFixed(0),
      finalSIP: finalSIP.toFixed(0),
      totalInvestment: totalInvestment.toFixed(0),
      targetAmount: maturityValue.toFixed(0),
      totalReturns: totalReturns.toFixed(0),
      returnOnInvestment: returnOnInvestment.toFixed(1),
      averageSIP: averageSIP.toFixed(0),
    });
  }, [expectedReturn, timePeriod, initialSIP, topupRate, inputsValid]);

  // Memoized chart data generation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const years = Number(timePeriod);
    const initialMonthlySIP = Number(initialSIP);
    const annualTopupRate = Number(topupRate) / 100;
    const data: ChartDataPoint[] = [];

    let cumulativeInvestment = 0;
    let cumulativeValue = 0;
    let currentSIP = initialMonthlySIP;

    for (let year = 1; year <= years; year++) {
      let yearlyInvestment = 0;
      let yearlyValue = 0;

      // Calculate for each month in the year
      for (let month = 1; month <= 12; month++) {
        yearlyInvestment += currentSIP;
        if (monthlyRate === 0) {
          yearlyValue += currentSIP;
        } else {
          const remainingMonths = (years - year) * 12 + (12 - month);
          yearlyValue +=
            currentSIP * Math.pow(1 + monthlyRate, remainingMonths);
        }
      }

      cumulativeInvestment += yearlyInvestment;
      cumulativeValue += yearlyValue;

      const cumulativeReturns = cumulativeValue - cumulativeInvestment;
      const yearlyTarget = (Number(targetAmount) / years) * year;

      data.push({
        year,
        investment: Math.round(cumulativeInvestment),
        returns: Math.round(cumulativeReturns),
        totalValue: Math.round(cumulativeValue),
        yearlyTarget: Math.round(yearlyTarget),
        sipAmount: Math.round(currentSIP),
      });

      // Apply top-up for next year
      if (year < years) {
        currentSIP = currentSIP * (1 + annualTopupRate);
      }
    }

    return data;
  }, [
    result,
    expectedReturn,
    timePeriod,
    initialSIP,
    topupRate,
    targetAmount,
    inputsValid,
  ]);

  // Enhanced input handlers with validation
  const handleInputChange = useCallback(
    (
        setter: (value: number | "") => void,
        validator: (value: number) => boolean,
        fieldName: string
      ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        // Allow empty string for clearing
        if (rawValue === "") {
          setter("");
          return;
        }

        // Sanitize input to prevent invalid characters and extremely large numbers
        const sanitizedValue = sanitizeInput(rawValue);

        // Update the input field display
        e.target.value = sanitizedValue;

        const numericValue = Number(sanitizedValue);

        // Basic numeric validation
        if (isNaN(numericValue) || numericValue < 0) {
          return;
        }

        // Field-specific validation
        if (!validator(numericValue)) {
          // You could show a warning here, but still allow the input
          console.warn(
            `${fieldName} value ${numericValue} is outside recommended range`
          );
        }

        setter(numericValue);
      },
    []
  );

  // Handle focus to select all text for better UX
  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      // Select all text when input is focused
      e.target.select();
    },
    []
  );

  // Handle input click to allow text selection within the field
  const handleInputClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      // Allow normal text selection behavior
      e.stopPropagation();
    },
    []
  );

  // Handle paste to validate pasted content
  const handleInputPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData("text");
      const sanitized = sanitizeInput(pastedText);

      // If the sanitized text is different from pasted text, prevent the paste
      if (sanitized !== pastedText) {
        e.preventDefault();
        // Set the sanitized value manually
        const target = e.target as HTMLInputElement;
        target.value = sanitized;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      }
    },
    []
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        calculateGoalBasedTopupSIP();
      }
    },
    [calculateGoalBasedTopupSIP]
  );

  // Auto-calculate with debounce
  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateGoalBasedTopupSIP();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [
    targetAmount,
    expectedReturn,
    timePeriod,
    initialSIP,
    topupRate,
    calculateGoalBasedTopupSIP,
    inputsValid,
  ]);

  // Memoized computed values for summary
  const summaryData = useMemo(() => {
    if (!result) return null;

    const totalInvestment = Number(result.totalInvestment);
    const maturityAmount = Number(result.targetAmount);
    const initialSIPValue = Number(result.initialSIP);
    const finalSIPValue = Number(result.finalSIP);

    // Prevent division by zero and handle edge cases
    if (totalInvestment === 0) {
      return {
        wealthMultiplier: "1.0",
        sipGrowthMultiplier: "1.0",
        achievabilityScore: "Low",
      };
    }

    const wealthMultiplier = (maturityAmount / totalInvestment).toFixed(1);
    const sipGrowthMultiplier = (finalSIPValue / initialSIPValue).toFixed(1);

    // Simple achievability score based on final SIP amount
    let achievabilityScore = "High";
    if (finalSIPValue > 25000) achievabilityScore = "Moderate";
    if (finalSIPValue > 75000) achievabilityScore = "Challenging";

    return {
      wealthMultiplier,
      sipGrowthMultiplier,
      achievabilityScore,
    };
  }, [result]);

  return (
    <div className="relative min-h-screen bg-gray-50 text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Goal Based Top-up SIP Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate how a systematic increase in your SIP amount can help you
            achieve your financial goals more effectively with the power of
            compounding and inflation-beating returns.
          </p>
        </header>

        {/* Input Section */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              Investment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Target Amount (₹)
                </label>
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={handleInputChange(
                    setTargetAmount,
                    validateTargetAmount,
                    "Target Amount"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_TARGET}
                  max={MAX_TARGET}
                  step={100000}
                  placeholder="5000000"
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_TARGET.toLocaleString()} - ₹
                  {MAX_TARGET.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Expected Annual Return (%)
                </label>
                <Input
                  type="number"
                  value={expectedReturn}
                  onChange={handleInputChange(
                    setExpectedReturn,
                    validateReturnRate,
                    "Expected Return"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_RETURN}
                  max={MAX_RETURN}
                  step={0.5}
                  placeholder="12"
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_RETURN}% - {MAX_RETURN}%
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Time Period (Years)
                </label>
                <Input
                  type="number"
                  value={timePeriod}
                  onChange={handleInputChange(
                    setTimePeriod,
                    validateTimePeriod,
                    "Time Period"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_YEARS}
                  max={MAX_YEARS}
                  placeholder="15"
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_YEARS} - {MAX_YEARS} years
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Initial Monthly SIP (₹)
                </label>
                <Input
                  type="number"
                  value={initialSIP}
                  onChange={handleInputChange(
                    setInitialSIP,
                    validateInitialSIP,
                    "Initial SIP"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_INITIAL_SIP}
                  max={MAX_INITIAL_SIP}
                  step={500}
                  placeholder="5000"
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_INITIAL_SIP.toLocaleString()} - ₹
                  {MAX_INITIAL_SIP.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Annual Top-up Rate (%)
                </label>
                <Input
                  type="number"
                  value={topupRate}
                  onChange={handleInputChange(
                    setTopupRate,
                    validateTopupRate,
                    "Top-up Rate"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_TOPUP}
                  max={MAX_TOPUP}
                  step={1}
                  placeholder="10"
                  className="text-lg font-semibold"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_TOPUP}% - {MAX_TOPUP}% (Recommended: 10-15%)
                </p>
              </div>
            </div>

            <button
              onClick={calculateGoalBasedTopupSIP}
              disabled={!inputsValid}
              className="w-full mt-8 bg-yellow-500 hover:bg-yellow-600 text-white py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
            >
              <FaCalculator className="text-xl" />
              {inputsValid ? "Calculate Top-up SIP Goal" : "Enter Valid Inputs"}
            </button>

            {/* Validation Messages */}
            {validationMessages.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-3">
                  Please check the following:
                </h4>
                <ul className="text-sm text-red-700 space-y-2">
                  {validationMessages.map((message, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {result && summaryData ? (
          <>
            {/* Results Summary Cards */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-1">
                  Initial SIP
                </h3>
                <p className="text-2xl font-bold text-blue-900">
                  ₹{Number(result.initialSIP).toLocaleString()}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-sm font-medium text-green-800 mb-1">
                  Final SIP
                </h3>
                <p className="text-2xl font-bold text-green-900">
                  ₹{Number(result.finalSIP).toLocaleString()}
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h3 className="text-sm font-medium text-purple-800 mb-1">
                  Total Investment
                </h3>
                <p className="text-2xl font-bold text-purple-900">
                  ₹{Number(result.totalInvestment).toLocaleString()}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-1">
                  Maturity Value
                </h3>
                <p className="text-2xl font-bold text-yellow-900">
                  ₹{Number(result.targetAmount).toLocaleString()}
                </p>
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              {/* Chart Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                    Investment Growth Visualization
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="year"
                          stroke="#666"
                          fontSize={12}
                          label={{
                            value: "Years",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          yAxisId="amount"
                          stroke="#666"
                          fontSize={12}
                          tickFormatter={(value) => {
                            if (value >= 10000000)
                              return `₹${(value / 10000000).toFixed(1)}Cr`;
                            else if (value >= 100000)
                              return `₹${(value / 100000).toFixed(1)}L`;
                            else if (value >= 1000)
                              return `₹${(value / 1000).toFixed(1)}K`;
                            else return `₹${value}`;
                          }}
                        />
                        <YAxis
                          yAxisId="sip"
                          orientation="right"
                          stroke="#f59e0b"
                          fontSize={12}
                          tickFormatter={(value) =>
                            `₹${(value / 1000).toFixed(0)}K`
                          }
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            if (name === "investment")
                              return [
                                formatCurrency(value),
                                "Total Investment",
                              ];
                            else if (name === "returns")
                              return [formatCurrency(value), "Total Returns"];
                            else if (name === "totalValue")
                              return [formatCurrency(value), "Maturity Value"];
                            else if (name === "sipAmount")
                              return [formatCurrency(value), "Monthly SIP"];
                            return [formatCurrency(value), name];
                          }}
                          labelFormatter={(year) => `Year ${year}`}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            padding: "12px",
                          }}
                        />
                        <Area
                          yAxisId="amount"
                          type="monotone"
                          dataKey="investment"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="investment"
                        />
                        <Area
                          yAxisId="amount"
                          type="monotone"
                          dataKey="returns"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="returns"
                        />
                        <Bar
                          yAxisId="sip"
                          dataKey="sipAmount"
                          fill="#f59e0b"
                          fillOpacity={0.7}
                          name="sipAmount"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 flex justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="font-medium">Investment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="font-medium">Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="font-medium">Monthly SIP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary & Projections */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
                    Investment Summary & Projections
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Investment Growth
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Initial SIP:</span>
                          <span className="font-semibold">
                            ₹{Number(result.initialSIP).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Final SIP:</span>
                          <span className="font-semibold">
                            ₹{Number(result.finalSIP).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Average SIP:</span>
                          <span className="font-semibold">
                            ₹{Number(result.averageSIP).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Returns Breakdown
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Total Investment:
                          </span>
                          <span className="font-semibold">
                            ₹{Number(result.totalInvestment).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Returns:</span>
                          <span className="font-semibold text-green-700">
                            ₹{Number(result.totalReturns).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Maturity Value:</span>
                          <span className="font-bold text-green-800">
                            ₹{Number(result.targetAmount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Key Insights
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Wealth Multiplier:
                          </span>
                          <span className="font-semibold">
                            {summaryData.wealthMultiplier}x
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">SIP Growth:</span>
                          <span className="font-semibold">
                            {summaryData.sipGrowthMultiplier}x
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI:</span>
                          <span className="font-semibold">
                            {result.returnOnInvestment}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Section */}
            <section className="mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCalculator className="text-purple-500" />
                  SIP Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>For each year:</strong>
                        <br />
                        SIP(year) = Initial SIP × (1 + Top-up Rate)^(year-1)
                        <br />
                        <strong>Maturity Value:</strong>
                        <br />
                        FV = Σ [SIP(year) × 12 × (1+r)^remaining_months]
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          • r = Monthly interest rate (Annual rate ÷ 12)
                        </div>
                        <div>• SIP increases annually by the top-up rate</div>
                        <div>• Each payment compounds for remaining months</div>
                        <div>• FV = Final maturity value</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Your Calculation
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border text-sm">
                      <div className="space-y-2">
                        <div>
                          <strong>Initial SIP:</strong> ₹
                          {Number(result.initialSIP).toLocaleString()}
                        </div>
                        <div>
                          <strong>Final SIP:</strong> ₹
                          {Number(result.finalSIP).toLocaleString()}
                        </div>
                        <div>
                          <strong>Top-up Rate:</strong> {topupRate}% annually
                        </div>
                        <div>
                          <strong>Expected Return:</strong> {expectedReturn}%
                          per annum
                        </div>
                        <div>
                          <strong>Time Period:</strong> {timePeriod} years
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <strong>Maturity Value:</strong> ₹
                          {Number(result.targetAmount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>How it works:</strong> Top-up SIP systematically
                    increases your monthly investment by a fixed percentage
                    every year. This strategy helps beat inflation, gradually
                    increases your investment capacity as your income grows, and
                    leverages the power of compounding more effectively. The
                    early years build the foundation while later years with
                    higher SIP amounts accelerate wealth creation.
                  </p>
                </div>
              </Card>
            </section>

            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  About SIP Returns
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      SIP Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Disciplined investing approach",
                        "Rupee cost averaging benefits",
                        "Power of compounding over time",
                        "Flexibility to start with small amounts",
                        "Professional fund management",
                        "Tax benefits under Section 80C (ELSS)",
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Investment Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Start early to maximize compounding",
                        "Choose funds based on risk appetite",
                        "Review portfolio periodically",
                        "Stay invested during market volatility",
                        "Increase SIP amount with income growth",
                        "Diversify across asset classes",
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">💡</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium mb-2 text-yellow-800">
                    Important Considerations
                  </h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>
                      • Top-up SIP requires commitment to increasing investment
                      amounts annually
                    </li>
                    <li>
                      • Ensure your income growth can support the projected SIP
                      increases
                    </li>
                    <li>
                      • Past performance doesn&apos;t guarantee future returns
                    </li>
                    <li>
                      • Consider your risk tolerance and investment horizon
                    </li>
                    <li>• Review and rebalance your portfolio periodically</li>
                  </ul>
                </div>
              </Card>
            </section>
          </>
        ) : (
          <section>
            <Card>
              <div className="text-center py-12">
                <FaChartPie className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-600">
                  Enter Your Top-up SIP Details
                </h3>
                <p className="text-gray-500">
                  Fill in your target amount, investment period, expected
                  returns, initial SIP, and top-up rate to see how systematic
                  increases can accelerate your goal achievement
                </p>
              </div>
            </Card>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}
