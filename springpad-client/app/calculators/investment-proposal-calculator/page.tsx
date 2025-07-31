"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  FaChartLine,
  FaCalculator,
  FaPiggyBank,
  FaShieldAlt,
  FaArrowUp,
  FaLightbulb,
  FaMoneyBillWave,
  FaPercent,
  FaClock,
  FaChartBar
} from "react-icons/fa";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Types
interface ProposalResult {
  finalAmount: string;
  totalInvestment: string;
  totalReturns: string;
  monthlyReturn: string;
  roi: string;
}

interface ChartDataPoint {
  year: number;
  principal: number;
  returns: number;
  totalValue: number;
}

interface BreakdownData {
  name: string;
  value: number;
  color: string;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_INVESTMENT = 10000;
const MAX_INVESTMENT = 10000000;
const MIN_RETURN = 1;
const MAX_RETURN = 30;
const MIN_YEARS = 1;
const MAX_YEARS = 30;

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateCompoundInterest = (
  principal: number,
  annualReturn: number,
  years: number
): number => {
  const rate = annualReturn / 100;
  return principal * Math.pow(1 + rate, years);
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

// Validation functions
const validateInvestment = (value: number): boolean => {
  return value >= MIN_INVESTMENT && value <= MAX_INVESTMENT;
};

const validateReturnRate = (value: number): boolean => {
  return value >= MIN_RETURN && value <= MAX_RETURN;
};

const validateTimePeriod = (value: number): boolean => {
  return value >= MIN_YEARS && value <= MAX_YEARS;
};

const sanitizeInput = (value: string, maxLength: number = 10): string => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  return cleaned.substring(0, maxLength);
};

export default function InvestmentProposalCalculator() {
  const [initialInvestment, setInitialInvestment] = useState<number | "">(100000);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [timePeriod, setTimePeriod] = useState<number | "">(5);
  const [result, setResult] = useState<ProposalResult | null>(null);

  // Validation messages
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (
      initialInvestment !== "" &&
      !validateInvestment(Number(initialInvestment))
    ) {
      messages.push(
        `Initial investment should be between ₹${MIN_INVESTMENT.toLocaleString()} and ₹${MAX_INVESTMENT.toLocaleString()}`
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
  }, [initialInvestment, expectedReturn, timePeriod]);

  // Input validation
  const inputsValid = useMemo(() => {
    return (
      isValidInput(initialInvestment) &&
      validateInvestment(Number(initialInvestment)) &&
      isValidInput(expectedReturn) &&
      validateReturnRate(Number(expectedReturn)) &&
      isValidInput(timePeriod) &&
      validateTimePeriod(Number(timePeriod))
    );
  }, [initialInvestment, expectedReturn, timePeriod]);

  // Calculate investment returns
  const calculateInvestmentReturns = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const principal = Number(initialInvestment);
    const annualReturn = Number(expectedReturn);
    const years = Number(timePeriod);

    const finalAmount = calculateCompoundInterest(principal, annualReturn, years);
    const totalReturns = finalAmount - principal;
    const monthlyReturn = totalReturns / (years * 12);
    const roi = ((totalReturns / principal) * 100);

    setResult({
      finalAmount: Math.round(finalAmount).toString(),
      totalInvestment: Math.round(principal).toString(),
      totalReturns: Math.round(totalReturns).toString(),
      monthlyReturn: Math.round(monthlyReturn).toString(),
      roi: roi.toFixed(1),
    });
  }, [initialInvestment, expectedReturn, timePeriod, inputsValid]);

  // Chart data generation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const principal = Number(initialInvestment);
    const annualReturn = Number(expectedReturn);
    const years = Number(timePeriod);
    const data: ChartDataPoint[] = [];

    for (let year = 1; year <= years; year++) {
      const totalValue = calculateCompoundInterest(principal, annualReturn, year);
      const returns = totalValue - principal;

      data.push({
        year,
        principal: Math.round(principal),
        returns: Math.round(returns),
        totalValue: Math.round(totalValue),
      });
    }

    return data;
  }, [result, initialInvestment, expectedReturn, timePeriod, inputsValid]);

  // Pie chart data
  const pieData = useMemo((): BreakdownData[] => {
    if (!result) return [];

    return [
      {
        name: "Initial Investment",
        value: Number(result.totalInvestment),
        color: "#3b82f6"
      },
      {
        name: "Returns Generated",
        value: Number(result.totalReturns),
        color: "#10b981"
      }
    ];
  }, [result]);

  // Input handlers
  const handleInputChange = useCallback(
    (
        setter: (value: number | "") => void,
        validator: (value: number) => boolean,
        fieldName: string
      ) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        if (rawValue === "") {
          setter("");
          return;
        }

        const sanitizedValue = sanitizeInput(rawValue);
        e.target.value = sanitizedValue;

        const numericValue = Number(sanitizedValue);

        if (isNaN(numericValue) || numericValue < 0) {
          return;
        }

        if (!validator(numericValue)) {
          console.warn(
            `${fieldName} value ${numericValue} is outside recommended range`
          );
        }

        setter(numericValue);
      },
    []
  );

  const handleInputFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    },
    []
  );

  const handleInputClick = useCallback(
    (e: React.MouseEvent<HTMLInputElement>) => {
      e.stopPropagation();
    },
    []
  );

  const handleInputPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      const pastedText = e.clipboardData.getData("text");
      const sanitized = sanitizeInput(pastedText);

      if (sanitized !== pastedText) {
        e.preventDefault();
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
        calculateInvestmentReturns();
      }
    },
    [calculateInvestmentReturns]
  );

  // Auto-calculate with debounce
  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateInvestmentReturns();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [
    initialInvestment,
    expectedReturn,
    timePeriod,
    calculateInvestmentReturns,
    inputsValid,
  ]);

  // Summary data
  const summaryData = useMemo(() => {
    if (!result) return null;

    const totalInvestment = Number(result.totalInvestment);
    const totalReturns = Number(result.totalReturns);
    const finalAmount = Number(result.finalAmount);

    if (totalInvestment === 0) {
      return { 
        returnPercentage: "0.0", 
        wealthMultiplier: "1.0",
        annualizedReturn: "0.0"
      };
    }

    const returnPercentage = ((totalReturns / totalInvestment) * 100).toFixed(1);
    const wealthMultiplier = (finalAmount / totalInvestment).toFixed(1);
    const annualizedReturn = (Number(expectedReturn) || 0).toFixed(1);

    return {
      returnPercentage: Math.min(Number(returnPercentage), 9999).toFixed(1),
      wealthMultiplier,
      annualizedReturn
    };
  }, [result, expectedReturn]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
        <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaMoneyBillWave className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Investment Proposal Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate the potential returns on your lump sum investment and see how your money can grow over time with compound interest.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              Investment Proposal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={initialInvestment}
                  onChange={handleInputChange(
                    setInitialInvestment,
                    validateInvestment,
                    "Initial Investment"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_INVESTMENT}
                  max={MAX_INVESTMENT}
                  step={10000}
                  placeholder="100000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_INVESTMENT.toLocaleString()} - ₹{MAX_INVESTMENT.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Annual Return (%)
                </label>
                <input
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_RETURN}% - {MAX_RETURN}% (Typical equity: 10-15%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Investment Period (Years)
                </label>
                <input
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
                  placeholder="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_YEARS} - {MAX_YEARS} years
                </p>
              </div>
            </div>

            <button
              onClick={calculateInvestmentReturns}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate Investment Returns" : "Enter Valid Inputs"}
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
          </div>
        </section>

        {result && summaryData ? (
          <>
            {/* Results Grid */}
            <section className="grid lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Final Amount
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.finalAmount))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Initial Investment
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
                  ROI Percentage
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {summaryData.returnPercentage}%
                </p>
              </div>
            </section>

            {/* Chart and Summary Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
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
                            if (name === "principal") {
                              return [formatCurrency(value), "Principal Amount"];
                            } else if (name === "returns") {
                              return [formatCurrency(value), "Returns Generated"];
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
                          dataKey="principal"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="principal"
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
                      <span>Principal Amount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Returns Generated</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-full">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    Investment Summary & Analysis
                  </h3>

                  {/* Investment Summary */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Proposal Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Initial Investment:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(initialInvestment) || 0)}
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
                          Monthly Returns:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(result.monthlyReturn))}
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
                      Investment Advantages
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 text-sm mb-1">
                          Compound Growth
                        </h5>
                        <p className="text-xs text-green-600">
                          Your money grows exponentially over time
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Lump Sum Power
                        </h5>
                        <p className="text-xs text-blue-600">
                          Entire amount works from day one
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <h5 className="font-medium text-purple-700 text-sm mb-1">
                          Long-term Wealth
                        </h5>
                        <p className="text-xs text-purple-600">
                          Time maximizes your investment potential
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Breakdown Charts Section */}
            <section className="grid lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartBar className="text-purple-500" />
                  Investment Breakdown
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaPercent className="text-green-500" />
                  Year-wise Growth
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" stroke="#666" fontSize={12} />
                      <YAxis 
                        stroke="#666" 
                        fontSize={12}
                        tickFormatter={(value) => {
                          if (value >= 100000) {
                            return `₹${(value / 100000).toFixed(1)}L`;
                          } else if (value >= 1000) {
                            return `₹${(value / 1000).toFixed(1)}K`;
                          } else {
                            return `₹${value}`;
                          }
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(Number(value))}
                        labelFormatter={(year) => `Year ${year}`}
                      />
                      <Bar dataKey="totalValue" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </section>

            {/* Formula Section */}
           <section className="mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCalculator className="text-purple-500" />
                  Compound Interest Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>A = P(1 + r)^t</strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>A</strong> = Final Amount</div>
                        <div><strong>P</strong> = Principal Amount</div>
                        <div><strong>r</strong> = Annual Interest Rate</div>
                        <div><strong>t</strong> = Time Period in Years</div>
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
                          <span>Principal (P):</span>
                          <span className="font-semibold">₹{Number(initialInvestment) || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Return (r):</span>
                          <span className="font-semibold">{Number(expectedReturn) || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time Period (t):</span>
                          <span className="font-semibold">{Number(timePeriod) || 0} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Compound Factor:</span>
                          <span className="font-semibold">
                            {Math.pow(1 + (Number(expectedReturn) || 0) / 100, Number(timePeriod) || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Final Amount (A):</span>
                            <span className="text-green-600">
                              {result ? formatCurrency(Number(result.finalAmount)) : "₹0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>How it works:</strong> Compound interest allows your investment to grow exponentially as returns are reinvested to generate additional returns. Your initial investment works continuously, and the returns generated also start earning returns, creating a snowball effect over time.
                  </p>
                </div>
              </div>
            </section>

            {/* Information Section */}
            <section>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  Investment Proposal Insights
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Lump Sum Advantages
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Immediate full investment exposure",
                        "Maximum compounding time benefit",
                        "No timing risk for additional investments",
                        "Lower transaction costs compared to multiple investments",
                        "Potential for higher absolute returns with early investment",
                      ].map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Investment Considerations
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Market timing risk for lump sum investments",
                        "Diversification across asset classes recommended",
                        "Consider your risk tolerance and investment horizon",
                        "Regular portfolio review and rebalancing",
                        "Tax implications on investment gains",
                      ].map((consideration, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{consideration}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Additional Analysis */}
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaClock className="text-yellow-600" />
                      <h5 className="font-medium text-yellow-700">Time Impact</h5>
                    </div>
                    <p className="text-sm text-yellow-600">
                      Every additional year can significantly increase your returns due to compound growth.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaArrowUp className="text-green-600" />
                      <h5 className="font-medium text-green-700">Growth Potential</h5>
                    </div>
                    <p className="text-sm text-green-600">
                      Higher returns amplify the compounding effect, but come with increased risk.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaShieldAlt className="text-blue-600" />
                      <h5 className="font-medium text-blue-700">Risk Management</h5>
                    </div>
                    <p className="text-sm text-blue-600">
                      Diversify investments to balance risk and return potential effectively.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="text-center py-16">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12 text-gray-500">
                <FaShieldAlt className="mx-auto text-5xl mb-6 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">
                  Ready to Calculate Your Investment Returns?
                </h3>
                <p className="text-gray-600">
                  Enter your investment proposal details above and see detailed projections, growth visualization, and comprehensive analysis of your investment potential.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
}