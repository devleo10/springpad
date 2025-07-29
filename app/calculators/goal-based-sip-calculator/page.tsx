"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaChartPie,
  FaCalculator,
  FaBullseye,
  FaShieldAlt,
  FaChartLine,
  FaRupeeSign,
} from "react-icons/fa";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
} from "recharts";

// Types
interface GoalBasedSipResult {
  requiredSIP: string;
  totalInvestment: string;
  targetAmount: string;
  totalReturns: string;
  returnOnInvestment: string;
}

interface ChartDataPoint {
  year: number;
  investment: number;
  returns: number;
  totalValue: number;
  yearlyTarget: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_INVESTMENT = 500;
const MAX_INVESTMENT = 1000000;
const MIN_RETURN = 1;
const MAX_RETURN = 30;
const MIN_YEARS = 1;
const MAX_YEARS = 40;
const MIN_TARGET = 100000;
const MAX_TARGET = 100000000;

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

export default function GoalBasedSIPCalculatorPage() {
  const [targetAmount, setTargetAmount] = useState<number | "">(1000000);
  const [timePeriod, setTimePeriod] = useState<number | "">(10);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [result, setResult] = useState<GoalBasedSipResult | null>(null);

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

    return messages;
  }, [targetAmount, expectedReturn, timePeriod]);

  // Enhanced validation of inputs
  const inputsValid = useMemo(() => {
    return (
      isValidInput(targetAmount) &&
      validateTargetAmount(Number(targetAmount)) &&
      isValidInput(expectedReturn) &&
      validateReturnRate(Number(expectedReturn)) &&
      isValidInput(timePeriod) &&
      validateTimePeriod(Number(timePeriod))
    );
  }, [targetAmount, expectedReturn, timePeriod]);

  // Optimized calculation function
  const calculateGoalBasedSIP = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const months = Number(timePeriod) * 12;

    // Calculate required monthly SIP to achieve target amount
    let requiredSIP: number;
    if (monthlyRate === 0) {
      requiredSIP = Number(targetAmount) / months;
    } else {
      requiredSIP =
        Number(targetAmount) /
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate));
    }

    const totalInvestment = requiredSIP * months;
    const totalReturns = Number(targetAmount) - totalInvestment;
    const returnOnInvestment = (totalReturns / totalInvestment) * 100;

    setResult({
      requiredSIP: requiredSIP.toFixed(0),
      totalInvestment: totalInvestment.toFixed(0),
      targetAmount: targetAmount.toString(),
      totalReturns: totalReturns.toFixed(0),
      returnOnInvestment: returnOnInvestment.toFixed(1),
    });
  }, [targetAmount, expectedReturn, timePeriod, inputsValid]);

  // Memoized chart data generation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const requiredMonthlySIP = Number(result.requiredSIP);
    const data: ChartDataPoint[] = [];

    for (let year = 1; year <= Number(timePeriod); year++) {
      const months = year * 12;
      let totalValue: number;

      if (monthlyRate === 0) {
        totalValue = requiredMonthlySIP * months;
      } else {
        const compoundFactor = Math.pow(1 + monthlyRate, months);
        totalValue =
          requiredMonthlySIP *
          ((compoundFactor - 1) / monthlyRate) *
          (1 + monthlyRate);
      }

      const totalInvestment = requiredMonthlySIP * months;
      const totalReturns = totalValue - totalInvestment;
      const yearlyTarget = (Number(targetAmount) / Number(timePeriod)) * year;

      data.push({
        year,
        investment: Math.round(totalInvestment),
        returns: Math.round(totalReturns),
        totalValue: Math.round(totalValue),
        yearlyTarget: Math.round(yearlyTarget),
      });
    }

    return data;
  }, [result, expectedReturn, timePeriod, targetAmount, inputsValid]);

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
        calculateGoalBasedSIP();
      }
    },
    [calculateGoalBasedSIP]
  );

  // Auto-calculate with debounce
  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateGoalBasedSIP();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [
    targetAmount,
    expectedReturn,
    timePeriod,
    calculateGoalBasedSIP,
    inputsValid,
  ]);

  // Memoized computed values for summary
  const summaryData = useMemo(() => {
    if (!result) return null;

    const requiredSIP = Number(result.requiredSIP);
    const totalInvestment = Number(result.totalInvestment);
    const targetAmount = Number(result.targetAmount);

    // Prevent division by zero and handle edge cases
    if (totalInvestment === 0) {
      return {
        wealthMultiplier: "1.0",
        monthlySavingsPercent: "0.0",
        achievabilityScore: "Low",
      };
    }

    const wealthMultiplier = (targetAmount / totalInvestment).toFixed(1);

    // Assume average monthly income for calculation (this is estimation)
    const estimatedMonthlyIncome = 50000; // You can make this configurable
    const monthlySavingsPercent = (
      (requiredSIP / estimatedMonthlyIncome) *
      100
    ).toFixed(1);

    // Simple achievability score based on SIP amount
    let achievabilityScore = "High";
    if (requiredSIP > 20000) achievabilityScore = "Moderate";
    if (requiredSIP > 50000) achievabilityScore = "Challenging";

    return {
      wealthMultiplier,
      monthlySavingsPercent,
      achievabilityScore,
    };
  }, [result]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaBullseye className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Goal Based SIP Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate the monthly SIP amount required to achieve your specific
          financial goal within your target timeframe.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaRupeeSign className="text-green-500" />
              Goal Planning Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
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
                  step={10000}
                  placeholder="1000000"
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
                  placeholder="10"
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
            </div>

            <button
              onClick={calculateGoalBasedSIP}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate Required SIP" : "Enter Valid Inputs"}
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
            {/* Chart and Summary Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    Goal Achievement Visualization
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
                            } else if (name === "totalValue") {
                              return [formatCurrency(value), "Portfolio Value"];
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
                        <Line
                          type="monotone"
                          dataKey="yearlyTarget"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="yearlyTarget"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Investment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Returns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-yellow-500 rounded"></div>
                      <span>Target Progress</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="h-full">
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaBullseye className="text-green-500" />
                    Goal Summary & Analysis
                  </h3>

                  {/* Goal Summary */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Investment Requirements
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Required Monthly SIP:
                        </span>
                        <span className="font-bold text-lg text-blue-600">
                          {formatCurrency(Number(result.requiredSIP) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Target Amount:
                        </span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(Number(targetAmount) || 0)}
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
                          Expected Return:
                        </span>
                        <span className="font-semibold">
                          {expectedReturn || "0"}% p.a.
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

                  {/* Goal Achievability */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-3 text-green-600">
                      Goal Achievability
                    </h4>
                    <div className="space-y-3">
                      <div
                        className={`p-3 rounded-lg border ${
                          summaryData.achievabilityScore === "High"
                            ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
                            : summaryData.achievabilityScore === "Moderate"
                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
                            : "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
                        }`}
                      >
                        <h5
                          className={`font-medium text-sm mb-1 ${
                            summaryData.achievabilityScore === "High"
                              ? "text-green-700"
                              : summaryData.achievabilityScore === "Moderate"
                              ? "text-yellow-700"
                              : "text-red-700"
                          }`}
                        >
                          Achievability: {summaryData.achievabilityScore}
                        </h5>
                        <p
                          className={`text-xs ${
                            summaryData.achievabilityScore === "High"
                              ? "text-green-600"
                              : summaryData.achievabilityScore === "Moderate"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          Required SIP:{" "}
                          {formatCurrency(Number(result.requiredSIP))}
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Start Early Advantage
                        </h5>
                        <p className="text-xs text-blue-600">
                          Starting 5 years earlier can reduce monthly SIP by
                          30-40%
                        </p>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <h5 className="font-medium text-purple-700 text-sm mb-1">
                          Stay Consistent
                        </h5>
                        <p className="text-xs text-purple-600">
                          Regular investments compound over time
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Results Summary Cards */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  Required Monthly SIP
                </h3>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{Number(result.requiredSIP).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  To achieve your goal
                </p>
              </Card>

              <Card className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-green-600">
                  Target Amount
                </h3>
                <p className="text-2xl font-bold text-green-700">
                  ₹{Number(result.targetAmount).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Your financial goal
                </p>
              </Card>

              <Card className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-purple-600">
                  Total Investment
                </h3>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{Number(result.totalInvestment).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">Your contribution</p>
              </Card>

              <Card className="text-center">
                <h3 className="text-lg font-semibold mb-2 text-orange-600">
                  Total Returns
                </h3>
                <p className="text-2xl font-bold text-orange-700">
                  ₹{Number(result.totalReturns).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Power of compounding
                </p>
              </Card>
            </section>

            {/* Formula Section */}
            <section className="mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCalculator className="text-purple-500" />
                  Goal-Based SIP Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>
                          P = FV ÷ [((1 + r)^n - 1) ÷ r × (1 + r)]
                        </strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <strong>P</strong> = Required Monthly SIP Amount
                        </div>
                        <div>
                          <strong>FV</strong> = Target Amount (Future Value)
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
                          <span>Target Amount (FV):</span>
                          <span className="font-semibold">
                            ₹{Number(targetAmount) || 0}
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
                            <span>Required Monthly SIP (P):</span>
                            <span className="text-green-600">
                              {result
                                ? formatCurrency(Number(result.requiredSIP))
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
                    <strong>How it works:</strong> The Goal-Based SIP formula
                    calculates the required monthly investment by working
                    backwards from your target amount. It considers the compound
                    growth effect where each monthly payment earns returns for
                    the remaining investment period, helping you achieve your
                    specific financial goal within the desired timeframe.
                  </p>
                </div>
              </Card>
            </section>

            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4">
                  About Goal-Based SIP
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Goal-Based SIP Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Goal-oriented investment approach",
                        "Disciplined monthly investments",
                        "Rupee cost averaging reduces risk",
                        "Power of compounding over time",
                        "Flexibility to adjust targets",
                        "Clear timeline for achievement",
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
                        "Start early to reduce monthly burden",
                        "Choose funds based on goal timeline",
                        "Review and adjust goals annually",
                        "Stay invested during market volatility",
                        "Consider tax-saving options (ELSS)",
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
          <section>
            <Card>
              <div className="text-center py-12">
                <FaChartPie className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-600">
                  Enter Your Goal Details
                </h3>
                <p className="text-gray-500">
                  Fill in your target amount, time period, and expected returns
                  to see the required monthly SIP
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
