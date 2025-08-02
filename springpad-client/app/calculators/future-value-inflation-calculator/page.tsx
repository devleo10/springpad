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
interface FVResult {
  futureValue: string;
  currentCost: string;
  inflation: string;
}

interface ChartDataPoint {
  year: number;
  futureValue: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_COST = 100000;
const MAX_COST = 10000000;
const MIN_INFLATION = 1;
const MAX_INFLATION = 20;
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

// Future Value with Inflation: FV = PV * (1 + r)^n
const calculateFutureValue = (
  currentCost: number,
  inflation: number,
  years: number
): number => {
  const r = inflation / 100;
  const n = years;
  return currentCost * Math.pow(1 + r, n);
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

const validateCost = (value: number): boolean => {
  return value >= MIN_COST && value <= MAX_COST;
};

const validateInflation = (value: number): boolean => {
  return value >= MIN_INFLATION && value <= MAX_INFLATION;
};

const validateYears = (value: number): boolean => {
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

export default function FutureValueInflationCalculator() {
  const [currentCost, setCurrentCost] = useState<number | "">(2500000);
  const [currentCostDisplay, setCurrentCostDisplay] = useState<string>(
    formatCurrency(2500000).replace(/\u20B9|INR|\s/g, "")
  );
  const [inflation, setInflation] = useState<number | "">(6);
  const [years, setYears] = useState<number | "">(10);
  const [result, setResult] = useState<FVResult | null>(null);

  const validationMessages = useMemo(() => {
    const messages: string[] = [];
    if (currentCost !== "" && !validateCost(Number(currentCost))) {
      messages.push(
        `Current cost should be between ₹${MIN_COST.toLocaleString()} and ₹${MAX_COST.toLocaleString()}`
      );
    }
    if (inflation !== "" && !validateInflation(Number(inflation))) {
      messages.push(
        `Inflation rate should be between ${MIN_INFLATION}% and ${MAX_INFLATION}%`
      );
    }
    if (years !== "" && !validateYears(Number(years))) {
      messages.push(
        `Number of years should be between ${MIN_YEARS} and ${MAX_YEARS}`
      );
    }
    return messages;
  }, [currentCost, inflation, years]);

  const inputsValid = useMemo(() => {
    return (
      isValidInput(currentCost) &&
      validateCost(Number(currentCost)) &&
      isValidInput(inflation) &&
      validateInflation(Number(inflation)) &&
      isValidInput(years) &&
      validateYears(Number(years))
    );
  }, [currentCost, inflation, years]);

  const calculateFV = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }
    const cost = Number(currentCost);
    const inf = Number(inflation);
    const yrs = Number(years);
    const futureValue = calculateFutureValue(cost, inf, yrs);
    setResult({
      futureValue: futureValue.toString(),
      currentCost: cost.toString(),
      inflation: inf.toString(),
    });
  }, [currentCost, inflation, years, inputsValid]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];
    const cost = Number(currentCost);
    const inf = Number(inflation);
    const yrs = Number(years);
    const data: ChartDataPoint[] = [];
    for (let year = 1; year <= yrs; year++) {
      const futureValue = calculateFutureValue(cost, inf, year);
      data.push({ year, futureValue });
    }
    return data;
  }, [result, currentCost, inflation, years, inputsValid]);

  // Custom handler for Current Cost with comma formatting
  const handleCurrentCostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/,/g, "");
      if (rawValue === "") {
        setCurrentCost("");
        setCurrentCostDisplay("");
        return;
      }
      const sanitizedValue = sanitizeInput(rawValue);
      const numericValue = Number(sanitizedValue);
      if (isNaN(numericValue) || numericValue < 0) {
        return;
      }
      setCurrentCost(numericValue);
      setCurrentCostDisplay(
        sanitizedValue ? Number(sanitizedValue).toLocaleString("en-IN") : ""
      );
    },
    []
  );

  // Generic handler for other fields
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
        calculateFV();
      }
    },
    [calculateFV]
  );

  useEffect(() => {
    if (!inputsValid) return;
    const timer = setTimeout(() => {
      calculateFV();
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [currentCost, inflation, years, calculateFV, inputsValid]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">
            Future Value Inflation Calculator
          </h1>
        </header>
        <p className="text-gray-600 mb-8">
          Calculate the future cost of your goals by factoring in inflation over
          time.
        </p>
        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              Cost & Inflation Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Cost (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={currentCostDisplay}
                  onChange={handleCurrentCostChange}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_COST}
                  max={MAX_COST}
                  step={10000}
                  placeholder="25,00,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_COST.toLocaleString()} - ₹
                  {MAX_COST.toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Inflation Rate (% p.a.)
                </label>
                <Input
                  type="number"
                  value={inflation}
                  onChange={handleInputChange(
                    setInflation,
                    validateInflation,
                    "Inflation Rate"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_INFLATION}
                  max={MAX_INFLATION}
                  step={0.5}
                  placeholder="6"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_INFLATION}% - {MAX_INFLATION}%
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Years
                </label>
                <Input
                  type="number"
                  value={years}
                  onChange={handleInputChange(
                    setYears,
                    validateYears,
                    "Number of Years"
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
                  Range: {MIN_YEARS} - {MAX_YEARS} years
                </p>
              </div>
            </div>
            <button
              onClick={calculateFV}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate Future Value" : "Enter Valid Inputs"}
            </button>
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
        {result ? (
          <>
            {/* Results Grid */}
            <section className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Future Cost
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.futureValue))}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Current Cost
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(result.currentCost))}
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Inflation Rate
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {result.inflation}%
                </p>
              </div>
            </section>
            {/* Chart and Summary Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    Future Cost Growth Visualization
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
                          formatter={(value: number) => [
                            formatCurrency(value),
                            "Future Cost",
                          ]}
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
                          dataKey="futureValue"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Future Cost"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Future Cost</span>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="h-full">
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    Inflation Summary & Principles
                  </h3>
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Calculation Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Current Cost:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(currentCost) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Inflation Rate:
                        </span>
                        <span className="font-semibold">
                          {inflation || "0"}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Years:</span>
                        <span className="font-semibold">
                          {years || "0"} years
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-3 text-green-600">
                      Key Principles
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 text-sm mb-1">
                          Plan for Inflation
                        </h5>
                        <p className="text-xs text-green-600">
                          Inflation erodes purchasing power, plan ahead for
                          future costs.
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Review Periodically
                        </h5>
                        <p className="text-xs text-blue-600">
                          Revisit your goals and adjust for actual inflation
                          rates.
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg border border-yellow-200">
                        <h5 className="font-medium text-yellow-700 text-sm mb-1">
                          Be Realistic
                        </h5>
                        <p className="text-xs text-yellow-600">
                          Use conservative inflation estimates for long-term
                          planning.
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
                  Inflation Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>
                          FV = PV × (1 + r)<sup>n</sup>
                        </strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <strong>FV</strong> = Future Value (Future Cost)
                        </div>
                        <div>
                          <strong>PV</strong> = Present Value (Current Cost)
                        </div>
                        <div>
                          <strong>r</strong> = Inflation Rate (as decimal)
                        </div>
                        <div>
                          <strong>n</strong> = Number of Years
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
                          <span>Current Cost (PV):</span>
                          <span className="font-semibold">
                            ₹{Number(currentCost) || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inflation Rate:</span>
                          <span className="font-semibold">
                            {Number(inflation) || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Years (n):</span>
                          <span className="font-semibold">
                            {Number(years) || 0}
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
                    <strong>How it works:</strong> The formula projects the
                    future cost by compounding the current cost at the given
                    inflation rate for the specified number of years.
                  </p>
                </div>
              </Card>
            </section>
            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  About Inflation Planning
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Why Plan for Inflation?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Helps estimate future cost of goals",
                        "Prepares for rising expenses",
                        "Improves accuracy of financial planning",
                        "Avoids underfunding long-term goals",
                        "Builds realistic savings targets",
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
                      Tips for Inflation Planning
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Use realistic inflation rates",
                        "Review and update plans regularly",
                        "Consider different rates for different goals",
                        "Plan for longer time horizons",
                        "Consult a financial advisor if needed",
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
                  Enter your cost, inflation rate, and years above to see your
                  future cost projections in real-time.
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
