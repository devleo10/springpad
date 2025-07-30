"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  FaLightbulb,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Types
interface SwpResult {
  totalWithdrawals: string;
  remainingAmount: string;
  canSustain: boolean;
  sustainablePeriod?: number;
}

interface ChartDataPoint {
  year: number;
  remainingBalance: number;
  totalWithdrawn: number;
  cumulativeWithdrawals: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_INITIAL = 100000;
const MAX_INITIAL = 50000000;
const MIN_WITHDRAWAL = 1000;
const MAX_WITHDRAWAL = 500000;
const MIN_RETURN = 1;
const MAX_RETURN = 30;
const MIN_YEARS = 1;
const MAX_YEARS = 40;

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateSwpProjection = (
  initialAmount: number,
  monthlyWithdrawal: number,
  annualReturn: number,
  years: number
): {
  balance: number;
  totalWithdrawn: number;
  canSustain: boolean;
  lastMonth: number;
} => {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;
  let currentBalance = initialAmount;
  let totalWithdrawn = 0;
  let monthCount = 0;

  for (let month = 1; month <= totalMonths; month++) {
    // Add monthly returns first
    currentBalance = currentBalance * (1 + monthlyRate);

    // Then subtract withdrawal
    if (currentBalance >= monthlyWithdrawal) {
      currentBalance -= monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
      monthCount = month;
    } else {
      // Partial withdrawal if balance is insufficient
      totalWithdrawn += currentBalance;
      currentBalance = 0;
      monthCount = month;
      break;
    }
  }

  const canSustain = currentBalance > 0 && monthCount === totalMonths;

  return {
    balance: currentBalance,
    totalWithdrawn,
    canSustain,
    lastMonth: monthCount,
  };
};

const calculateMaxWithdrawal = (
  initialAmount: number,
  annualReturn: number,
  years: number
): number => {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    return initialAmount / totalMonths;
  }

  // PMT formula for annuity
  const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
  const maxWithdrawal =
    (initialAmount * monthlyRate * compoundFactor) / (compoundFactor - 1);

  return Math.min(maxWithdrawal, initialAmount * 0.1); // Cap at 10% of initial amount
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

// Enhanced validation functions
const validateInitialAmount = (value: number): boolean => {
  return value >= MIN_INITIAL && value <= MAX_INITIAL;
};

const validateWithdrawalAmount = (value: number): boolean => {
  return value >= MIN_WITHDRAWAL && value <= MAX_WITHDRAWAL;
};

const validateReturnRate = (value: number): boolean => {
  return value >= MIN_RETURN && value <= MAX_RETURN;
};

const validateTimePeriod = (value: number): boolean => {
  return value >= MIN_YEARS && value <= MAX_YEARS;
};

const sanitizeInput = (value: string, maxLength: number = 12): string => {
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

export default function SwpCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number | "">(
    1000000
  );
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState<number | "">(
    10000
  );
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [timePeriod, setTimePeriod] = useState<number | "">(15);
  const [result, setResult] = useState<SwpResult | null>(null);

  // Validation messages for better UX
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (
      initialInvestment !== "" &&
      !validateInitialAmount(Number(initialInvestment))
    ) {
      messages.push(
        `Initial investment should be between ₹${MIN_INITIAL.toLocaleString()} and ₹${MAX_INITIAL.toLocaleString()}`
      );
    }

    if (
      monthlyWithdrawal !== "" &&
      !validateWithdrawalAmount(Number(monthlyWithdrawal))
    ) {
      messages.push(
        `Monthly withdrawal should be between ₹${MIN_WITHDRAWAL.toLocaleString()} and ₹${MAX_WITHDRAWAL.toLocaleString()}`
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

    // Additional validation for withdrawal sustainability
    if (
      initialInvestment !== "" &&
      monthlyWithdrawal !== "" &&
      Number(monthlyWithdrawal) * 12 > Number(initialInvestment)
    ) {
      messages.push(
        "Annual withdrawal cannot exceed initial investment amount"
      );
    }

    return messages;
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, timePeriod]);

  // Enhanced validation of inputs
  const inputsValid = useMemo(() => {
    return (
      isValidInput(initialInvestment) &&
      validateInitialAmount(Number(initialInvestment)) &&
      isValidInput(monthlyWithdrawal) &&
      validateWithdrawalAmount(Number(monthlyWithdrawal)) &&
      isValidInput(expectedReturn) &&
      validateReturnRate(Number(expectedReturn)) &&
      isValidInput(timePeriod) &&
      validateTimePeriod(Number(timePeriod)) &&
      Number(monthlyWithdrawal) * 12 <= Number(initialInvestment)
    );
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, timePeriod]);

  // Optimized calculation function
  const calculateSwpReturns = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const initial = Number(initialInvestment);
    const withdrawal = Number(monthlyWithdrawal);
    const annualReturn = Number(expectedReturn);
    const years = Number(timePeriod);

    const projection = calculateSwpProjection(
      initial,
      withdrawal,
      annualReturn,
      years
    );

    setResult({
      totalWithdrawals: Math.round(projection.totalWithdrawn).toString(),
      remainingAmount: Math.round(projection.balance).toString(),
      canSustain: projection.canSustain,
      sustainablePeriod: projection.canSustain
        ? undefined
        : Math.floor(projection.lastMonth / 12),
    });
  }, [
    initialInvestment,
    monthlyWithdrawal,
    expectedReturn,
    timePeriod,
    inputsValid,
  ]);

  // Memoized chart data generation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const initial = Number(initialInvestment);
    const withdrawal = Number(monthlyWithdrawal);
    const annualReturn = Number(expectedReturn);
    const years = Number(timePeriod);
    const data: ChartDataPoint[] = [];

    let currentBalance = initial;
    let cumulativeWithdrawals = 0;
    const monthlyRate = annualReturn / 100 / 12;

    for (let year = 1; year <= years; year++) {
      let yearlyWithdrawn = 0;

      // Calculate for each month in the year
      for (let month = 1; month <= 12; month++) {
        currentBalance = currentBalance * (1 + monthlyRate);

        if (currentBalance >= withdrawal) {
          currentBalance -= withdrawal;
          yearlyWithdrawn += withdrawal;
          cumulativeWithdrawals += withdrawal;
        } else {
          yearlyWithdrawn += currentBalance;
          cumulativeWithdrawals += currentBalance;
          currentBalance = 0;
          break;
        }
      }

      data.push({
        year,
        remainingBalance: Math.round(Math.max(0, currentBalance)),
        totalWithdrawn: Math.round(yearlyWithdrawn),
        cumulativeWithdrawals: Math.round(cumulativeWithdrawals),
      });

      if (currentBalance <= 0) break;
    }

    return data;
  }, [
    result,
    initialInvestment,
    monthlyWithdrawal,
    expectedReturn,
    timePeriod,
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
        calculateSwpReturns();
      }
    },
    [calculateSwpReturns]
  );

  // Auto-calculate with debounce
  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateSwpReturns();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [
    initialInvestment,
    monthlyWithdrawal,
    expectedReturn,
    timePeriod,
    calculateSwpReturns,
    inputsValid,
  ]);

  // Calculate suggested maximum withdrawal
  const suggestedMaxWithdrawal = useMemo(() => {
    if (!inputsValid) return 0;
    return calculateMaxWithdrawal(
      Number(initialInvestment),
      Number(expectedReturn),
      Number(timePeriod)
    );
  }, [initialInvestment, expectedReturn, timePeriod, inputsValid]);

  // Memoized computed values for summary
  const summaryData = useMemo(() => {
    if (!result) return null;

    const initialAmount = Number(initialInvestment);
    const totalWithdrawn = Number(result.totalWithdrawals);

    const withdrawalEfficiency = (
      (totalWithdrawn / initialAmount) *
      100
    ).toFixed(1);
    const annualWithdrawalRate = (
      ((Number(monthlyWithdrawal) * 12) / initialAmount) *
      100
    ).toFixed(1);

    return {
      withdrawalEfficiency,
      annualWithdrawalRate,
    };
  }, [result, initialInvestment, monthlyWithdrawal]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaMoneyCheckAlt className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SWP Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate how long your investments will last with Systematic
          Withdrawal Plan (SWP) and plan your regular income from mutual funds.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              SWP Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Investment Amount (₹)
                </label>
                <Input
                  type="number"
                  value={initialInvestment}
                  onChange={handleInputChange(
                    setInitialInvestment,
                    validateInitialAmount,
                    "Initial Investment"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_INITIAL}
                  max={MAX_INITIAL}
                  step={50000}
                  placeholder="1000000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_INITIAL.toLocaleString()} - ₹
                  {(MAX_INITIAL / 10000000).toFixed(0)}Cr
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Withdrawal Amount (₹)
                </label>
                <Input
                  type="number"
                  value={monthlyWithdrawal}
                  onChange={handleInputChange(
                    setMonthlyWithdrawal,
                    validateWithdrawalAmount,
                    "Monthly Withdrawal"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_WITHDRAWAL}
                  max={MAX_WITHDRAWAL}
                  step={1000}
                  placeholder="10000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_WITHDRAWAL.toLocaleString()} - ₹
                  {MAX_WITHDRAWAL.toLocaleString()}
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
                  Range: {MIN_RETURN}% - {MAX_RETURN}% (Conservative: 8-12%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Withdrawal Period (Years)
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
                  Range: {MIN_YEARS} - {MAX_YEARS} years (Retirement planning:
                  15-25 years)
                </p>
              </div>
            </div>

            <button
              onClick={calculateSwpReturns}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate SWP" : "Enter Valid Inputs"}
            </button>

            {/* Suggested Maximum Withdrawal */}
            {inputsValid && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>💡 Suggested Maximum Sustainable Withdrawal:</strong>
                </p>
                <p className="text-lg font-bold text-blue-800">
                  {formatCurrency(suggestedMaxWithdrawal)} per month
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This amount can be withdrawn sustainably for {timePeriod}{" "}
                  years at {expectedReturn}% return
                </p>
              </div>
            )}

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
              <div
                className={`p-6 rounded-lg border transform hover:scale-105 transition-transform duration-200 ${
                  result.canSustain
                    ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
                    : "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
                }`}
              >
                <h3
                  className={`text-sm font-medium mb-2 ${
                    result.canSustain ? "text-green-800" : "text-red-800"
                  }`}
                >
                  Sustainability Status
                </h3>
                <p
                  className={`text-xl font-bold ${
                    result.canSustain ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.canSustain ? "✅ Sustainable" : "⚠️ Not Sustainable"}
                </p>
                {!result.canSustain && result.sustainablePeriod && (
                  <p className="text-xs text-red-600 mt-1">
                    Lasts {result.sustainablePeriod} years only
                  </p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Total Withdrawals
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(result.totalWithdrawals))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-purple-800 mb-2">
                  Remaining Amount
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(Number(result.remainingAmount))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Withdrawal Efficiency
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {summaryData.withdrawalEfficiency}%
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  of initial corpus withdrawn
                </p>
              </div>
            </section>

            {/* Chart and Summary Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    SWP Balance Projection
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
                            if (name === "remainingBalance") {
                              return [
                                formatCurrency(value),
                                "Remaining Balance",
                              ];
                            } else if (name === "cumulativeWithdrawals") {
                              return [formatCurrency(value), "Total Withdrawn"];
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
                          dataKey="remainingBalance"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Remaining Balance"
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeWithdrawals"
                          stroke="#10b981"
                          fill="transparent"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          name="Total Withdrawn"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Remaining Balance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 border-2 border-green-500 rounded"
                        style={{ borderStyle: "dashed" }}
                      ></div>
                      <span>Cumulative Withdrawals</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="h-full">
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    SWP Summary & Strategy
                  </h3>

                  {/* SWP Summary */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Withdrawal Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Initial Corpus:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(initialInvestment) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Monthly Withdrawal:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(monthlyWithdrawal) || 0)}
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
                          Withdrawal Period:
                        </span>
                        <span className="font-semibold">
                          {timePeriod || "0"} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Annual Withdrawal Rate:
                        </span>
                        <span className="font-semibold">
                          {summaryData.annualWithdrawalRate}%
                        </span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Sustainability:
                          </span>
                          <span
                            className={`font-bold text-lg ${
                              result.canSustain
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {result.canSustain ? "✓ Yes" : "✗ No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key SWP Principles */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-3 text-green-600">
                      Key SWP Principles
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 text-sm mb-1">
                          Safe Withdrawal Rate
                        </h5>
                        <p className="text-xs text-green-600">
                          Keep annual withdrawal under 6-8% for sustainability
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Fund Selection
                        </h5>
                        <p className="text-xs text-blue-600">
                          Choose balanced or hybrid funds for steady returns
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <h5 className="font-medium text-purple-700 text-sm mb-1">
                          Regular Monitoring
                        </h5>
                        <p className="text-xs text-purple-600">
                          Review and adjust withdrawals based on performance
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
                  SWP Calculation Method
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Calculation Process
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>Month-by-Month Calculation:</strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          1. <strong>Balance</strong> = Previous Balance × (1 +
                          monthly rate)
                        </div>
                        <div>
                          2. <strong>New Balance</strong> = Balance - Monthly
                          Withdrawal
                        </div>
                        <div>
                          3. Repeat until period ends or balance depletes
                        </div>
                        <div>
                          <strong>Monthly Rate</strong> = Annual Return ÷ 12
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Your SWP Details
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Initial Corpus:</span>
                          <span className="font-semibold">
                            {formatCurrency(Number(initialInvestment) || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Withdrawal:</span>
                          <span className="font-semibold">
                            {formatCurrency(Number(monthlyWithdrawal) || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Return:</span>
                          <span className="font-semibold">
                            {Number(expectedReturn) || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Return Rate:</span>
                          <span className="font-semibold">
                            {((Number(expectedReturn) || 0) / 12).toFixed(3)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Months:</span>
                          <span className="font-semibold">
                            {(Number(timePeriod) || 0) * 12}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Sustainability:</span>
                            <span
                              className={
                                result.canSustain
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {result.canSustain
                                ? "Sustainable"
                                : "Not Sustainable"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>How it works:</strong> SWP calculates month-by-month
                    how your corpus grows with returns and decreases with
                    withdrawals. The calculation considers compounding returns
                    while accounting for regular withdrawals, helping you
                    understand if your retirement corpus can sustain your
                    desired lifestyle.
                  </p>
                </div>
              </Card>
            </section>

            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  About SWP (Systematic Withdrawal Plan)
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      SWP Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Regular income stream from investments",
                        "Money continues to earn market returns",
                        "Tax-efficient compared to fixed deposits",
                        "Flexible - can modify or stop anytime",
                        "Ideal for retirement income planning",
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
                      SWP Best Practices
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Keep annual withdrawal rate under 6-8%",
                        "Choose balanced or hybrid mutual funds",
                        "Monitor fund performance regularly",
                        "Maintain separate emergency fund",
                        "Consider inflation impact over time",
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
                  Ready to Plan Your Withdrawals?
                </h3>
                <p className="text-gray-600">
                  Enter your SWP details above and see how long your corpus will
                  last with systematic withdrawals in real-time.
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
