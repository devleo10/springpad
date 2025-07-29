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
interface SipResult {
  futureValue: string;
  totalInvestment: string;
  totalReturns: string;
}

interface ChartDataPoint {
  year: number;
  totalInvestment: number;
  totalReturns: number;
  futureValue: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_INVESTMENT = 500;
const MAX_INVESTMENT = 1000000;
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

const calculateSipValue = (
  monthlyAmount: number,
  annualReturn: number,
  years: number
): number => {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    return monthlyAmount * totalMonths;
  }

  // Prevent overflow for extreme values
  const maxReasonableValue = 1e15; // 1000 trillion

  const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);

  // Check for overflow or unrealistic values
  if (!isFinite(compoundFactor) || compoundFactor > 1e10) {
    return maxReasonableValue;
  }

  const futureValue =
    monthlyAmount * ((compoundFactor - 1) / monthlyRate) * (1 + monthlyRate);

  // Cap at reasonable maximum to prevent display issues
  return Math.min(futureValue, maxReasonableValue);
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

// Enhanced validation functions
const validateMonthlyInvestment = (value: number): boolean => {
  return value >= MIN_INVESTMENT && value <= MAX_INVESTMENT;
};

const validateReturnRate = (value: number): boolean => {
  return value >= MIN_RETURN && value <= MAX_RETURN;
};

const validateTimePeriod = (value: number): boolean => {
  return value >= MIN_YEARS && value <= MAX_YEARS;
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

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number | "">(5000);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [timePeriod, setTimePeriod] = useState<number | "">(10);
  const [result, setResult] = useState<SipResult | null>(null);

  // Validation messages for better UX
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (
      monthlyInvestment !== "" &&
      !validateMonthlyInvestment(Number(monthlyInvestment))
    ) {
      messages.push(
        `Monthly investment should be between ₹${MIN_INVESTMENT.toLocaleString()} and ₹${MAX_INVESTMENT.toLocaleString()}`
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

    return messages;
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  // Enhanced validation of inputs
  const inputsValid = useMemo(() => {
    return (
      isValidInput(monthlyInvestment) &&
      validateMonthlyInvestment(Number(monthlyInvestment)) &&
      isValidInput(expectedReturn) &&
      validateReturnRate(Number(expectedReturn)) &&
      isValidInput(timePeriod) &&
      validateTimePeriod(Number(timePeriod))
    );
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  // Optimized calculation function
  const calculateSipReturns = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const monthlyAmount = Number(monthlyInvestment);
    const annualReturn = Number(expectedReturn);
    const years = Number(timePeriod);

    const futureValue = calculateSipValue(monthlyAmount, annualReturn, years);
    const totalInvestment = monthlyAmount * years * 12;
    const totalReturns = futureValue - totalInvestment;

    setResult({
      futureValue: Math.round(futureValue).toString(),
      totalInvestment: Math.round(totalInvestment).toString(),
      totalReturns: Math.round(totalReturns).toString(),
    });
  }, [monthlyInvestment, expectedReturn, timePeriod, inputsValid]);

  // Memoized chart data generation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const monthlyAmount = Number(monthlyInvestment);
    const annualReturn = Number(expectedReturn);
    const years = Number(timePeriod);
    const data: ChartDataPoint[] = [];

    for (let year = 1; year <= years; year++) {
      const futureValue = calculateSipValue(monthlyAmount, annualReturn, year);
      const totalInvestment = monthlyAmount * year * 12;
      const totalReturns = futureValue - totalInvestment;

      data.push({
        year,
        totalInvestment: Math.round(totalInvestment),
        totalReturns: Math.round(totalReturns),
        futureValue: Math.round(futureValue),
      });
    }

    return data;
  }, [result, monthlyInvestment, expectedReturn, timePeriod, inputsValid]);

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
        calculateSipReturns();
      }
    },
    [calculateSipReturns]
  );

  // Auto-calculate with debounce
  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateSipReturns();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [
    monthlyInvestment,
    expectedReturn,
    timePeriod,
    calculateSipReturns,
    inputsValid,
  ]);

  // Memoized computed values for summary
  const summaryData = useMemo(() => {
    if (!result) return null;

    const totalInvestment = Number(result.totalInvestment);
    const totalReturns = Number(result.totalReturns);
    const futureValue = Number(result.futureValue);

    // Prevent division by zero and handle edge cases
    if (totalInvestment === 0) {
      return { returnPercentage: "0.0", wealthMultiplier: "1.0" };
    }

    const returnPercentage = ((totalReturns / totalInvestment) * 100).toFixed(
      1
    );
    const wealthMultiplier = (futureValue / totalInvestment).toFixed(1);

    // Cap unrealistic percentages for display
    const cappedReturnPercentage = Math.min(
      Number(returnPercentage),
      9999
    ).toFixed(1);

    return {
      returnPercentage: cappedReturnPercentage,
      wealthMultiplier,
    };
  }, [result]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SIP Return Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate the future value of your SIP investments and see how your
          money grows over time.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              Investment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Investment Amount (₹)
                </label>
                <Input
                  type="number"
                  value={monthlyInvestment}
                  onChange={handleInputChange(
                    setMonthlyInvestment,
                    validateMonthlyInvestment,
                    "Monthly Investment"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_INVESTMENT}
                  max={MAX_INVESTMENT}
                  step={500}
                  placeholder="5000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_INVESTMENT.toLocaleString()} - ₹
                  {MAX_INVESTMENT.toLocaleString()}
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
                  Investment Period (Years)
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
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_YEARS} - {MAX_YEARS} years (Longer periods benefit
                  more from compounding)
                </p>
              </div>
            </div>

            <button
              onClick={calculateSipReturns}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate Returns" : "Enter Valid Inputs"}
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
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Future Value
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.futureValue))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Total Investment
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(result.totalInvestment))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-purple-800 mb-2">
                  Total Returns
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(Number(result.totalReturns))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Return Percentage
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {summaryData.returnPercentage}%
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
                            if (name === "totalInvestment") {
                              return [
                                formatCurrency(value),
                                "Total Investment",
                              ];
                            } else if (name === "totalReturns") {
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
                          dataKey="totalInvestment"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Total Investment"
                        />
                        <Area
                          type="monotone"
                          dataKey="totalReturns"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="Total Returns"
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
                          Monthly SIP:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(monthlyInvestment) || 0)}
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
                          Total Installments:
                        </span>
                        <span className="font-semibold">
                          {(Number(timePeriod) || 0) * 12}
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
                        <strong>
                          FV = P × [((1 + r)^n - 1) / r] × (1 + r)
                        </strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <strong>FV</strong> = Future Value
                        </div>
                        <div>
                          <strong>P</strong> = Monthly Investment Amount
                        </div>
                        <div>
                          <strong>r</strong> = Monthly Interest Rate (Annual
                          Rate ÷ 12)
                        </div>
                        <div>
                          <strong>n</strong> = Total Number of Months
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Your Calculation
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Monthly Investment (P):</span>
                          <span className="font-semibold">
                            ₹{Number(monthlyInvestment) || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Return:</span>
                          <span className="font-semibold">
                            {Number(expectedReturn) || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Rate (r):</span>
                          <span className="font-semibold">
                            {((Number(expectedReturn) || 0) / 12).toFixed(3)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Investment Period:</span>
                          <span className="font-semibold">
                            {Number(timePeriod) || 0} years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Months (n):</span>
                          <span className="font-semibold">
                            {(Number(timePeriod) || 0) * 12}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Future Value (FV):</span>
                            <span className="text-green-600">
                              {result
                                ? formatCurrency(Number(result.futureValue))
                                : "₹0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>How it works:</strong> The SIP formula calculates
                    the future value by considering the compound growth of your
                    monthly investments. Each monthly payment earns returns for
                    the remaining investment period, creating a compounding
                    effect that significantly increases your wealth over time.
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
                        "Regular fixed amount investment",
                        "Monthly compounding for wealth creation",
                        "Dollar-cost averaging reduces volatility",
                        "Disciplined investment approach",
                        "Flexibility to increase or pause",
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
                        "Start early to benefit from compounding",
                        "Choose funds based on risk appetite",
                        "Review and rebalance periodically",
                        "Stay invested for long-term goals",
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
                  Enter your investment details above and see your SIP
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
