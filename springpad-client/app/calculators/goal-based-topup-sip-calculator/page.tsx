"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
} from "recharts";
import {
  FaCalculator,
  FaShieldAlt,
  FaArrowUp,
  FaLightbulb,
  FaPiggyBank,
  FaChartLine,
} from "react-icons/fa";
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

// Format number with commas for Indian number system (lakhs/crores)
const formatNumberWithCommas = (value: string | number): string => {
  if (value === "" || isNaN(Number(value))) return "";
  const [integerInit, decimal] = String(value).split(".");
  // Indian system: first 3 digits, then every 2 digits
  const lastThree =
    integerInit.length > 3 ? integerInit.slice(-3) : integerInit;
  let formattedInteger = "";
  if (integerInit.length > 3) {
    const otherNumbers = integerInit.slice(0, -3);
    formattedInteger =
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree;
  } else {
    formattedInteger = lastThree;
  }
  return decimal ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export default function GoalBasedTopupSIPCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | "">(5000000);
  const [timePeriod, setTimePeriod] = useState<number | "">(15);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [initialSIP, setInitialSIP] = useState<number | "">(5000);
  const [topupRate, setTopupRate] = useState<number | "">(10);
  const [inflationRate, setInflationRate] = useState<number | "">(6);
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

  // Optimized calculation function with inflation adjustment
  const calculateGoalBasedTopupSIP = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const years = Number(timePeriod);
    const initialMonthlySIP = Number(initialSIP);
    const annualTopupRate = Number(topupRate) / 100;
    const inflation = Number(inflationRate) / 100;

    // Adjust target amount for inflation
    const inflationAdjustedTarget =
      Number(targetAmount) * Math.pow(1 + inflation, years);

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
      targetAmount: inflationAdjustedTarget.toFixed(0),
      totalReturns: totalReturns.toFixed(0),
      returnOnInvestment: returnOnInvestment.toFixed(1),
      averageSIP: averageSIP.toFixed(0),
    });
  }, [
    expectedReturn,
    timePeriod,
    initialSIP,
    topupRate,
    inflationRate,
    targetAmount,
    inputsValid,
  ]);

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
        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas for processing

        // Allow empty string for clearing
        if (rawValue === "") {
          setter("");
          e.target.value = "";
          return;
        }

        // Sanitize input to prevent invalid characters and extremely large numbers
        const sanitizedValue = sanitizeInput(rawValue);
        const numericValue = Number(sanitizedValue);

        // Basic numeric validation
        if (isNaN(numericValue) || numericValue < 0) {
          e.target.value = "";
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
        // Format with commas for display
        e.target.value = formatNumberWithCommas(sanitizedValue);
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
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">
            Goal Based Top-up SIP Calculator
          </h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate how a systematic increase in your SIP amount can help you
          achieve your financial goals more effectively with the power of
          compounding and inflation-beating returns.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              Goal Planning Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(targetAmount)}
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
                  placeholder="50,00,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_TARGET.toLocaleString()} - ₹
                  {MAX_TARGET.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
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
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_YEARS} - {MAX_YEARS} years (Longer periods reduce
                  monthly SIP)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
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
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_RETURN}% - {MAX_RETURN}% (Typical equity funds:
                  10-15%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Inflation Rate (% p.a.)
                </label>
                <Input
                  type="number"
                  value={inflationRate}
                  onChange={handleInputChange(
                    setInflationRate,
                    (v) => v >= 0 && v <= 20,
                    "Inflation Rate"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={0}
                  max={20}
                  step={0.1}
                  placeholder="6"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Typical: 5-7% (India average)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Monthly SIP (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(initialSIP)}
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
                  placeholder="5,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_INITIAL_SIP.toLocaleString()} - ₹
                  {MAX_INITIAL_SIP.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
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
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_TOPUP}% - {MAX_TOPUP}% (Recommended: 10-15%)
                </p>
              </div>
            </div>

            <button
              onClick={calculateGoalBasedTopupSIP}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate Top-up SIP Goal" : "Enter Valid Inputs"}
            </button>

            {/* Validation Messages */}
            {validationMessages.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Please check the following:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {validationMessages.map((message, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      <span>{message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </section>

        {result && summaryData ? (
          <>
            {/* Results Grid */}
            <section className="grid lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Initial SIP
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(result.initialSIP))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Final SIP
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.finalSIP))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-purple-800 mb-2">
                  Total Investment
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(Number(result.totalInvestment))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Maturity Value
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(Number(result.targetAmount))}
                </p>
              </div>
            </section>

            {/* Chart and Summary Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    Investment Growth Visualization
                  </h3>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
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
                          stroke="#666"
                          fontSize={12}
                          tickFormatter={(value) => {
                            if (value >= 10000000) {
                              return `₹${(value / 10000000).toFixed(1)}Cr`;
                            } else if (value >= 100000) {
                              return `₹${(value / 100000).toFixed(1)}L`;
                            } else if (value >= 1000) {
                              return `₹${(value / 1000).toFixed(1)}K`;
                            } else {
                              return `₹${value.toFixed(0)}`;
                            }
                          }}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            if (name === "investment") {
                              return [
                                formatCurrency(value),
                                "Total Investment",
                              ];
                            } else if (name === "returns") {
                              return [formatCurrency(value), "Total Returns"];
                            }
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
                          type="monotone"
                          dataKey="investment"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="investment"
                        />
                        <Area
                          type="monotone"
                          dataKey="returns"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="returns"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Total Investment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Total Returns</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="h-full">
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    Investment Summary & Principles
                  </h3>

                  {/* Investment Summary */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Investment Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Initial SIP:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(result.initialSIP) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Final SIP:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(result.finalSIP) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Expected Return:
                        </span>
                        <span className="font-semibold">
                          {expectedReturn || "0"}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Investment Period:
                        </span>
                        <span className="font-semibold">
                          {timePeriod || "0"} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Top-up Rate:
                        </span>
                        <span className="font-semibold">
                          {topupRate || "0"}% annually
                        </span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Wealth Multiplier:
                          </span>
                          <span className="font-bold text-green-600 text-lg">
                            {summaryData.wealthMultiplier}x
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Investment Principles */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-3 text-green-600">
                      Key Investment Principles
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 text-sm mb-1">
                          Power of Compounding
                        </h5>
                        <p className="text-xs text-green-600">
                          Time is your biggest asset - start early!
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Rupee Cost Averaging
                        </h5>
                        <p className="text-xs text-blue-600">
                          Reduces average cost through market volatility
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <h5 className="font-medium text-purple-700 text-sm mb-1">
                          Stay Disciplined
                        </h5>
                        <p className="text-xs text-purple-600">
                          Don&apos;t time the market, stay invested long-term
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

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
                  About Top-up SIP
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Top-up SIP Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Disciplined investing approach",
                        "Monthly compounding for wealth creation",
                        "Rupee cost averaging benefits",
                        "Systematic increase with income growth",
                        "Professional fund management",
                        "Beats inflation over time",
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
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
                        "Ensure income growth supports increases",
                        "Past performance doesn't guarantee future results",
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </section>
          </>
        ) : (
          <section className="text-center py-16">
            <Card>
              <div className="text-center py-12 text-gray-500">
                <FaShieldAlt className="mx-auto text-5xl mb-6 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">
                  Ready to Calculate?
                </h3>
                <p className="text-gray-600">
                  Enter your top-up SIP details above and see your investment
                  projections and growth visualization in real-time.
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
