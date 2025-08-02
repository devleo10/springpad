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
  FaUniversity,
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
interface PpfResult {
  maturityAmount: string;
  totalInvestment: string;
  totalReturns: string;
}

interface ChartDataPoint {
  year: number;
  totalInvestment: number;
  totalReturns: number;
  maturityAmount: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_INVESTMENT = 500;
const MAX_INVESTMENT = 150000; // PPF annual limit
const PPF_RATE = 7.1; // Current PPF rate
const PPF_TENURE = 15; // Fixed 15 years

// Helper functions
const formatNumberWithCommas = (value: string | number): string => {
  if (value === "" || isNaN(Number(value))) return "";
  const [integer, decimal] = String(value).split(".");
  const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimal ? `${formattedInt}.${decimal}` : formattedInt;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// PPF Calculation: A = P × [((1 + r)^n - 1) / r]
const calculatePpfValue = (
  annualAmount: number,
  rate: number,
  years: number
): number => {
  const r = rate / 100;
  const n = years;

  if (r === 0) {
    return annualAmount * n;
  }

  const maxReasonableValue = 1e15;
  const compoundFactor = Math.pow(1 + r, n);

  if (!isFinite(compoundFactor) || compoundFactor > 1e10) {
    return maxReasonableValue;
  }

  const maturity = annualAmount * ((compoundFactor - 1) / r);
  return Math.min(maturity, maxReasonableValue);
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

const validateAnnualInvestment = (value: number): boolean => {
  return value >= MIN_INVESTMENT && value <= MAX_INVESTMENT;
};

const sanitizeInput = (value: string, maxLength: number = 10): string => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  return cleaned.substring(0, maxLength);
};

// UI Components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}
  >
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${className}`}
    {...props}
  />
);


export default function PpfCalculator() {
  const [annualInvestment, setAnnualInvestment] = useState<number | "">(150000);
  const [result, setResult] = useState<PpfResult | null>(null);

  // Validation messages
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (
      annualInvestment !== "" &&
      !validateAnnualInvestment(Number(annualInvestment))
    ) {
      messages.push(
        `Annual investment should be between ₹${MIN_INVESTMENT.toLocaleString()} and ₹${MAX_INVESTMENT.toLocaleString()}`
      );
    }

    return messages;
  }, [annualInvestment]);

  const inputsValid = useMemo(() => {
    return (
      isValidInput(annualInvestment) &&
      validateAnnualInvestment(Number(annualInvestment))
    );
  }, [annualInvestment]);

  const calculatePpfReturns = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const yearlyAmount = Number(annualInvestment);
    const maturityAmount = calculatePpfValue(
      yearlyAmount,
      PPF_RATE,
      PPF_TENURE
    );
    const totalInvestment = yearlyAmount * PPF_TENURE;
    const totalReturns = maturityAmount - totalInvestment;

    setResult({
      maturityAmount: maturityAmount.toString(),
      totalInvestment: totalInvestment.toString(),
      totalReturns: totalReturns.toString(),
    });
  }, [annualInvestment, inputsValid]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const yearlyAmount = Number(annualInvestment);
    const data: ChartDataPoint[] = [];

    for (let year = 1; year <= PPF_TENURE; year++) {
      const maturityAmount = calculatePpfValue(yearlyAmount, PPF_RATE, year);
      const totalInvestment = yearlyAmount * year;
      const totalReturns = maturityAmount - totalInvestment;

      data.push({
        year,
        totalInvestment: totalInvestment,
        totalReturns: totalReturns,
        maturityAmount: maturityAmount,
      });
    }

    return data;
  }, [result, annualInvestment, inputsValid]);

  const handleInputChange = useCallback(
    (setter: (value: number | "") => void) =>
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
        calculatePpfReturns();
      }
    },
    [calculatePpfReturns]
  );

  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculatePpfReturns();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [annualInvestment, calculatePpfReturns, inputsValid]);

  const summaryData = useMemo(() => {
    if (!result) return null;

    const totalInvestment = Number(result.totalInvestment);
    const totalReturns = Number(result.totalReturns);
    const maturityAmount = Number(result.maturityAmount);

    if (totalInvestment === 0) {
      return { returnPercentage: "0.0", wealthMultiplier: "1.0" };
    }

    const returnPercentage = ((totalReturns / totalInvestment) * 100).toFixed(
      1
    );
    const wealthMultiplier = (maturityAmount / totalInvestment).toFixed(1);

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
          <FaUniversity className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">PPF Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate your PPF maturity amount and see how your tax-saving
          investment grows over 15 years.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              PPF Investment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Investment Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(annualInvestment)}
                  onChange={handleInputChange(setAnnualInvestment)}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_INVESTMENT}
                  max={MAX_INVESTMENT}
                  step={1000}
                  placeholder="150000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_INVESTMENT.toLocaleString()} - ₹
                  {MAX_INVESTMENT.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current PPF Interest Rate (%)
                </label>
                <Input
                  type="number"
                  value={PPF_RATE}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fixed by Government (Updated quarterly)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  PPF Lock-in Period (Years)
                </label>
                <Input
                  type="number"
                  value={PPF_TENURE}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Fixed 15 years (Can be extended in 5-year blocks)
                </p>
              </div>
            </div>

            <button
              onClick={calculatePpfReturns}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid
                ? "Calculate PPF Returns"
                : "Enter Valid Investment Amount"}
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

        {result && summaryData ? (
          <>
            {/* Results Grid */}
            <section className="grid lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Maturity Amount
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.maturityAmount))}
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
                  Total Return %
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
                    PPF Growth Visualization
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
                    PPF Summary & Benefits
                  </h3>

                  {/* Investment Summary */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Investment Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Annual Investment:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(annualInvestment) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Interest Rate:
                        </span>
                        <span className="font-semibold">{PPF_RATE}% p.a.</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Lock-in Period:
                        </span>
                        <span className="font-semibold">
                          {PPF_TENURE} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Tax Benefit:
                        </span>
                        <span className="font-semibold">80C Deduction</span>
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

                  {/* Key PPF Benefits */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-3 text-green-600">
                      Key PPF Benefits
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 text-sm mb-1">
                          Triple Tax Benefit
                        </h5>
                        <p className="text-xs text-green-600">
                          EEE - Tax-free investment, growth & withdrawal
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Government Backed
                        </h5>
                        <p className="text-xs text-blue-600">
                          100% safe with government guarantee
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <h5 className="font-medium text-purple-700 text-sm mb-1">
                          Long-term Wealth
                        </h5>
                        <p className="text-xs text-purple-600">
                          Compounding for 15 years builds substantial corpus
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
                  PPF Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>A = P × [((1 + r)^n - 1) / r]</strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <strong>A</strong> = Maturity Amount
                        </div>
                        <div>
                          <strong>P</strong> = Annual Investment Amount
                        </div>
                        <div>
                          <strong>r</strong> = Annual Interest Rate
                        </div>
                        <div>
                          <strong>n</strong> = Number of Years (15)
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
                          <span>Annual Investment (P):</span>
                          <span className="font-semibold">
                            ₹{Number(annualInvestment) || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Rate (r):</span>
                          <span className="font-semibold">{PPF_RATE}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Investment Period (n):</span>
                          <span className="font-semibold">
                            {PPF_TENURE} years
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Maturity Amount (A):</span>
                            <span className="text-green-600">
                              {result
                                ? formatCurrency(Number(result.maturityAmount))
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
                    <strong>How it works:</strong> PPF uses compound interest
                    where your annual investment earns interest, and this
                    interest is added to your principal for the next year&apos;s
                    calculation. The tax-free compounding for 15 years creates
                    significant wealth accumulation.
                  </p>
                </div>
              </Card>
            </section>

            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  About PPF Investment
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      PPF Features
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "15-year mandatory lock-in period",
                        "Tax deduction under Section 80C",
                        "Tax-free interest and maturity amount",
                        "Partial withdrawal after 7th year",
                        "Loan facility after 3rd year",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Investment Guidelines
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Minimum ₹500 per year to keep account active",
                        "Maximum ₹1.5 lakh per financial year",
                        "Can be extended in 5-year blocks after maturity",
                        "Interest rates reviewed quarterly by government",
                        "One account per individual allowed",
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
                  Enter your annual investment amount above and see your PPF
                  maturity projections and growth visualization.
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
