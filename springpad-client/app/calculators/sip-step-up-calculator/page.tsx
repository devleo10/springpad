"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaChartPie,
  FaCalculator,
  FaArrowUp,
  FaShieldAlt,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";

// Types
interface StepUpSipResult {
  regularSipValue: number;
  stepUpSipValue: number;
  additionalWealth: number;
  totalInvestment: number;
  regularSipInvestment: number;
}

interface ChartDataPoint {
  year: number;
  regularSipValue: number;
  stepUpSipValue: number;
  sipAmount: number;
  regularInvestment: number;
  stepUpInvestment: number;
  regularReturns: number;
  stepUpReturns: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_INVESTMENT = 500;
const MAX_INVESTMENT = 1000000;
const MIN_RETURN = 1;
const MAX_RETURN = 30;
const MIN_YEARS = 1;
const MAX_YEARS = 40;
const MIN_STEP_UP = 1;
const MAX_STEP_UP = 30;

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
const validateMonthlyInvestment = (value: number): boolean => {
  return value >= MIN_INVESTMENT && value <= MAX_INVESTMENT;
};

const validateReturnRate = (value: number): boolean => {
  return value >= MIN_RETURN && value <= MAX_RETURN;
};

const validateTimePeriod = (value: number): boolean => {
  return value >= MIN_YEARS && value <= MAX_YEARS;
};

const validateStepUpPercentage = (value: number): boolean => {
  return value >= MIN_STEP_UP && value <= MAX_STEP_UP;
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

export default function SipStepUpCalculator() {
  const [initialSip, setInitialSip] = useState<number | "">(5000);
  const [stepUpPercentage, setStepUpPercentage] = useState<number | "">(10);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [timePeriod, setTimePeriod] = useState<number | "">(15);
  const [result, setResult] = useState<StepUpSipResult | null>(null);

  // Validation messages for better UX
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (initialSip !== "" && !validateMonthlyInvestment(Number(initialSip))) {
      messages.push(
        `Initial SIP should be between ₹${MIN_INVESTMENT.toLocaleString()} and ₹${MAX_INVESTMENT.toLocaleString()}`
      );
    }

    if (
      stepUpPercentage !== "" &&
      !validateStepUpPercentage(Number(stepUpPercentage))
    ) {
      messages.push(
        `Step-up percentage should be between ${MIN_STEP_UP}% and ${MAX_STEP_UP}%`
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
  }, [initialSip, stepUpPercentage, expectedReturn, timePeriod]);

  // Enhanced validation of inputs
  const inputsValid = useMemo(() => {
    return (
      isValidInput(initialSip) &&
      validateMonthlyInvestment(Number(initialSip)) &&
      isValidInput(stepUpPercentage) &&
      validateStepUpPercentage(Number(stepUpPercentage)) &&
      isValidInput(expectedReturn) &&
      validateReturnRate(Number(expectedReturn)) &&
      isValidInput(timePeriod) &&
      validateTimePeriod(Number(timePeriod))
    );
  }, [initialSip, stepUpPercentage, expectedReturn, timePeriod]);

  // Optimized calculation function
  const calculateStepUpSip = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const totalMonths = Number(timePeriod) * 12;

    // Calculate regular SIP future value
    let regularSipFutureValue: number;
    if (monthlyRate === 0) {
      regularSipFutureValue = Number(initialSip) * totalMonths;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      regularSipFutureValue =
        Number(initialSip) *
        ((compoundFactor - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    // Calculate step-up SIP future value
    let stepUpFutureValue = 0;
    let stepUpTotalInvestment = 0;
    let currentSipAmount = Number(initialSip);

    for (let year = 1; year <= Number(timePeriod); year++) {
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
      if (year < Number(timePeriod)) {
        currentSipAmount =
          currentSipAmount * (1 + Number(stepUpPercentage) / 100);
      }
    }

    const regularSipInvestment = Number(initialSip) * totalMonths;
    const additionalWealth = stepUpFutureValue - stepUpTotalInvestment;

    setResult({
      regularSipValue: regularSipFutureValue,
      stepUpSipValue: stepUpFutureValue,
      additionalWealth: additionalWealth,
      totalInvestment: stepUpTotalInvestment,
      regularSipInvestment: regularSipInvestment,
    });
  }, [initialSip, stepUpPercentage, expectedReturn, timePeriod, inputsValid]);

  // Memoized chart data generation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const monthlyRate = Number(expectedReturn) / 100 / 12;
    const data: ChartDataPoint[] = [];

    for (let year = 1; year <= Number(timePeriod); year++) {
      // Calculate regular SIP value for this year
      const regularMonths = year * 12;
      let regularSipValue: number;
      if (monthlyRate === 0) {
        regularSipValue = Number(initialSip) * regularMonths;
      } else {
        const compoundFactor = Math.pow(1 + monthlyRate, regularMonths);
        regularSipValue =
          Number(initialSip) *
          ((compoundFactor - 1) / monthlyRate) *
          (1 + monthlyRate);
      }

      // Calculate step-up SIP value for this year
      let stepUpValue = 0;
      let stepUpInvestmentForYear = 0;
      let currentSipAmount = Number(initialSip);

      for (let y = 1; y <= year; y++) {
        const yearStartMonth = (y - 1) * 12 + 1;
        const yearEndMonth = y * 12;
        const monthsInThisYear = yearEndMonth - yearStartMonth + 1;

        stepUpInvestmentForYear += currentSipAmount * monthsInThisYear;

        if (monthlyRate === 0) {
          stepUpValue += currentSipAmount * monthsInThisYear;
        } else {
          const yearlyContribution =
            currentSipAmount *
            ((Math.pow(1 + monthlyRate, monthsInThisYear) - 1) / monthlyRate) *
            (1 + monthlyRate);
          stepUpValue +=
            yearlyContribution *
            Math.pow(1 + monthlyRate, regularMonths - yearEndMonth);
        }

        if (y < year) {
          currentSipAmount =
            currentSipAmount * (1 + Number(stepUpPercentage) / 100);
        }
      }

      // Calculate investments and returns
      const regularInvestment = Number(initialSip) * year * 12;
      const regularReturns = regularSipValue - regularInvestment;
      const stepUpReturns = stepUpValue - stepUpInvestmentForYear;

      // Current year SIP amount
      const yearSipAmount =
        Number(initialSip) *
        Math.pow(1 + Number(stepUpPercentage) / 100, year - 1);

      data.push({
        year,
        regularSipValue: Math.round(regularSipValue),
        stepUpSipValue: Math.round(stepUpValue),
        sipAmount: Math.round(yearSipAmount),
        regularInvestment: Math.round(regularInvestment),
        stepUpInvestment: Math.round(stepUpInvestmentForYear),
        regularReturns: Math.round(regularReturns),
        stepUpReturns: Math.round(stepUpReturns),
      });
    }

    return data;
  }, [
    result,
    initialSip,
    stepUpPercentage,
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
        calculateStepUpSip();
      }
    },
    [calculateStepUpSip]
  );

  // Auto-calculate with debounce
  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateStepUpSip();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [
    initialSip,
    stepUpPercentage,
    expectedReturn,
    timePeriod,
    calculateStepUpSip,
    inputsValid,
  ]);

  const formatCurrencyLakhs = (amount: number) => {
    const lakhs = amount / 100000;
    if (lakhs >= 100) {
      const crores = lakhs / 100;
      return `₹${crores.toFixed(1)} Cr`;
    }
    return `₹${lakhs.toFixed(1)} L`;
  };

  // Memoized computed values for summary
  const summaryData = useMemo(() => {
    if (!result) return null;

    const regularSipInvestment = Number(result.regularSipInvestment);
    const totalInvestment = Number(result.totalInvestment);
    const additionalWealth = Number(result.additionalWealth);
    const regularSipValue = Number(result.regularSipValue);
    const stepUpSipValue = Number(result.stepUpSipValue);

    // Prevent division by zero and handle edge cases
    if (regularSipInvestment === 0) {
      return {
        wealthIncrease: "0.0",
        investmentIncrease: "0.0",
        wealthMultiplier: "1.0",
      };
    }

    const wealthIncrease = ((additionalWealth / regularSipValue) * 100).toFixed(
      1
    );
    const investmentIncrease = (
      ((totalInvestment - regularSipInvestment) / regularSipInvestment) *
      100
    ).toFixed(1);
    const wealthMultiplier = (stepUpSipValue / totalInvestment).toFixed(1);

    return {
      wealthIncrease,
      investmentIncrease,
      wealthMultiplier,
    };
  }, [result]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaChartPie className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">SIP Step-up Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          See how increasing your SIP amount annually can significantly boost
          your wealth creation through the power of compounding.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaArrowUp className="text-green-500" />
              Step-up SIP Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Monthly SIP (₹)
                </label>
                <Input
                  type="number"
                  value={initialSip}
                  onChange={handleInputChange(
                    setInitialSip,
                    validateMonthlyInvestment,
                    "Initial SIP"
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
                  Annual Step-up (%)
                </label>
                <Input
                  type="number"
                  value={stepUpPercentage}
                  onChange={handleInputChange(
                    setStepUpPercentage,
                    validateStepUpPercentage,
                    "Step-up Percentage"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_STEP_UP}
                  max={MAX_STEP_UP}
                  step={1}
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_STEP_UP}% - {MAX_STEP_UP}% (Recommended: 10-15% -
                  typical salary increment)
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
                  placeholder="15"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_YEARS} - {MAX_YEARS} years (Longer periods benefit
                  more from compounding)
                </p>
              </div>
            </div>

            <button
              onClick={calculateStepUpSip}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid
                ? "Calculate Step-up Benefits"
                : "Enter Valid Inputs"}
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
                  Step-up SIP Value
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.stepUpSipValue))}
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
                  Additional Wealth
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(Number(result.additionalWealth))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Wealth Increase
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {summaryData.wealthIncrease}%
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
                            if (name === "stepUpInvestment") {
                              return [
                                formatCurrency(value),
                                "Total Investment",
                              ];
                            } else if (name === "stepUpReturns") {
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
                          dataKey="stepUpInvestment"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="stepUpInvestment"
                        />
                        <Area
                          type="monotone"
                          dataKey="stepUpReturns"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="stepUpReturns"
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
                          {formatCurrency(Number(initialSip) || 0)}
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

            {/* Comparison Cards */}
            <section className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-3 text-blue-800">
                  Regular SIP
                </h3>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">
                        Monthly SIP:
                      </span>
                      <span className="font-bold text-blue-800">
                        {formatCurrency(Number(initialSip) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-600">
                        Total Investment:
                      </span>
                      <span className="font-bold text-blue-800">
                        {formatCurrencyLakhs(
                          Number(result.regularSipInvestment)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm text-blue-600">
                        Future Value:
                      </span>
                      <span className="text-lg font-bold text-blue-800">
                        {formatCurrencyLakhs(Number(result.regularSipValue))}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-lg font-semibold mb-3 text-green-800">
                  Step-up SIP
                </h3>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">
                        Starting SIP:
                      </span>
                      <span className="font-bold text-green-800">
                        {formatCurrency(Number(initialSip) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">
                        Annual Increase:
                      </span>
                      <span className="font-bold text-green-800">
                        +{Number(stepUpPercentage) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-600">
                        Total Investment:
                      </span>
                      <span className="font-bold text-green-800">
                        {formatCurrencyLakhs(Number(result.totalInvestment))}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-sm text-green-600">
                        Future Value:
                      </span>
                      <span className="text-lg font-bold text-green-800">
                        {formatCurrencyLakhs(Number(result.stepUpSipValue))}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* SIP Amount Progression Chart */}
            <section className="mb-8">
              <Card>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaArrowUp className="text-orange-500" />
                  SIP Amount Progression Over Time
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
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
                        tickFormatter={(value) =>
                          `₹${(value / 1000).toFixed(0)}K`
                        }
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Monthly SIP Amount",
                        ]}
                        labelFormatter={(year) => `Year ${year}`}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sipAmount"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                        name="Monthly SIP Amount"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Your monthly SIP amount increases from{" "}
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(Number(initialSip) || 0)}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        (Number(initialSip) || 0) *
                          Math.pow(
                            1 + (Number(stepUpPercentage) || 0) / 100,
                            (Number(timePeriod) || 0) - 1
                          )
                      )}
                    </span>{" "}
                    over {timePeriod || 0} years with {stepUpPercentage || 0}%
                    annual increase
                  </p>
                </div>
              </Card>
            </section>

            {/* Formula Section */}
            <section className="mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCalculator className="text-purple-500" />
                  Step-up SIP Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>
                          Step-up SIP = Σ(Year SIP × Future Value Factor)
                        </strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <strong>Year SIP</strong> = P × (1 + step%)^(year-1)
                        </div>
                        <div>
                          <strong>P</strong> = Initial Monthly SIP Amount
                        </div>
                        <div>
                          <strong>step%</strong> = Annual Step-up Percentage
                        </div>
                        <div>
                          <strong>r</strong> = Monthly Interest Rate
                        </div>
                        <div>
                          <strong>FV Factor</strong> = ((1 + r)^months - 1) / r
                          × (1 + r)
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
                          <span>Initial SIP (P):</span>
                          <span className="font-semibold">
                            ₹{Number(initialSip) || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Step-up:</span>
                          <span className="font-semibold">
                            {Number(stepUpPercentage) || 0}%
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
                          <span>Total Months:</span>
                          <span className="font-semibold">
                            {(Number(timePeriod) || 0) * 12}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Step-up SIP Value:</span>
                            <span className="text-green-600">
                              {result
                                ? formatCurrency(Number(result.stepUpSipValue))
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
                    <strong>How it works:</strong> Step-up SIP calculates the
                    future value by compounding each year&apos;s SIP amount
                    separately. Each year, your SIP amount increases by the
                    step-up percentage, and each amount earns returns for its
                    remaining investment period. This creates a powerful
                    compounding effect that significantly outperforms regular
                    SIP over time.
                  </p>
                </div>
              </Card>
            </section>

            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  Benefits of Step-up SIP
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Key Advantages
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Matches your growing income capacity",
                        "Significantly boosts long-term wealth",
                        "Maintains investment power against inflation",
                        "Accelerates financial goal achievement",
                        "Automatic feature available in most funds",
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
                      Strategy Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Align step-up with salary increments",
                        "Even 10% annual increase makes huge difference",
                        "Benefits from rupee cost averaging",
                        "Start with comfortable initial amount",
                        "Review and adjust annually if needed",
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
                  Enter your step-up SIP details above and see your projections
                  and growth visualization in real-time.
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
