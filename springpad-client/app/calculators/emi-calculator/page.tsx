"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaHome,
  FaCalculator,
  FaMoneyBillWave,
  FaShieldAlt,
  FaArrowUp,
  FaLightbulb,
  FaChartLine,
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
interface EMIResult {
  emi: string;
  totalPayment: string;
  totalInterest: string;
  principalPercentage: string;
  interestPercentage: string;
}

interface ChartDataPoint {
  year: number;
  principalPaid: number;
  interestPaid: number;
  outstandingBalance: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_LOAN_AMOUNT = 100000;
const MAX_LOAN_AMOUNT = 100000000;
const MIN_INTEREST_RATE = 1;
const MAX_INTEREST_RATE = 30;
const MIN_TENURE = 1;
const MAX_TENURE = 30;

// UI Components
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg shadow-md border p-6 ${className}`}>
    {children}
  </div>
);

const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

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

// EMI Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureYears: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = tenureYears * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return emi;
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

const validateLoanAmount = (value: number): boolean => {
  return value >= MIN_LOAN_AMOUNT && value <= MAX_LOAN_AMOUNT;
};

const validateInterestRate = (value: number): boolean => {
  return value >= MIN_INTEREST_RATE && value <= MAX_INTEREST_RATE;
};

const validateTenure = (value: number): boolean => {
  return value >= MIN_TENURE && value <= MAX_TENURE;
};

const sanitizeInput = (value: string, maxLength: number = 10): string => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  return cleaned.substring(0, maxLength);
};

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<number | "">(2500000);
  const [interestRate, setInterestRate] = useState<number | "">(8.5);
  const [tenure, setTenure] = useState<number | "">(20);
  const [result, setResult] = useState<EMIResult | null>(null);

  // Validation messages
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (loanAmount !== "" && !validateLoanAmount(Number(loanAmount))) {
      messages.push(
        `Loan amount should be between ₹${MIN_LOAN_AMOUNT.toLocaleString()} and ₹${MAX_LOAN_AMOUNT.toLocaleString()}`
      );
    }

    if (interestRate !== "" && !validateInterestRate(Number(interestRate))) {
      messages.push(
        `Interest rate should be between ${MIN_INTEREST_RATE}% and ${MAX_INTEREST_RATE}%`
      );
    }

    if (tenure !== "" && !validateTenure(Number(tenure))) {
      messages.push(
        `Tenure should be between ${MIN_TENURE} and ${MAX_TENURE} years`
      );
    }

    return messages;
  }, [loanAmount, interestRate, tenure]);

  // Input validation
  const inputsValid = useMemo(() => {
    return (
      isValidInput(loanAmount) &&
      validateLoanAmount(Number(loanAmount)) &&
      isValidInput(interestRate) &&
      validateInterestRate(Number(interestRate)) &&
      isValidInput(tenure) &&
      validateTenure(Number(tenure))
    );
  }, [loanAmount, interestRate, tenure]);

  // Calculate EMI
  const calculateEMIReturns = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const principal = Number(loanAmount);
    const rate = Number(interestRate);
    const years = Number(tenure);

    const emi = calculateEMI(principal, rate, years);
    const totalPayment = emi * years * 12;
    const totalInterest = totalPayment - principal;
    const principalPercentage = (principal / totalPayment) * 100;
    const interestPercentage = (totalInterest / totalPayment) * 100;

    setResult({
      emi: emi.toString(),
      totalPayment: totalPayment.toString(),
      totalInterest: totalInterest.toString(),
      principalPercentage: principalPercentage.toString(),
      interestPercentage: interestPercentage.toString(),
    });
  }, [loanAmount, interestRate, tenure, inputsValid]);

  // Chart data generation
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const principal = Number(loanAmount);
    const rate = Number(interestRate);
    const years = Number(tenure);
    const emi = Number(result.emi);
    const monthlyRate = rate / 100 / 12;

    const data: ChartDataPoint[] = [];
    let remainingBalance = principal;
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;

    for (let year = 1; year <= years; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12 && remainingBalance > 0; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = Math.min(
          emi - interestPayment,
          remainingBalance
        );

        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;
      }

      totalPrincipalPaid += yearlyPrincipal;
      totalInterestPaid += yearlyInterest;

      data.push({
        year,
        principalPaid: totalPrincipalPaid,
        interestPaid: totalInterestPaid,
        outstandingBalance: Math.max(0, remainingBalance),
      });
    }

    return data;
  }, [result, loanAmount, interestRate, tenure, inputsValid]);

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
        calculateEMIReturns();
      }
    },
    [calculateEMIReturns]
  );

  // Auto-calculate with debounce
  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateEMIReturns();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [loanAmount, interestRate, tenure, calculateEMIReturns, inputsValid]);

  // Summary data
  const summaryData = useMemo(() => {
    if (!result) return null;

    const totalPayment = Number(result.totalPayment);
    const totalInterest = Number(result.totalInterest);
    const principal = Number(loanAmount);

    const interestToEMIRatio = ((totalInterest / totalPayment) * 100).toFixed(
      1
    );
    const affordabilityRatio = (
      ((Number(result.emi) * 12) / (principal * 0.3)) *
      100
    ).toFixed(1);

    return {
      interestToEMIRatio,
      affordabilityRatio,
    };
  }, [result, loanAmount]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaHome className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">EMI Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate your Equated Monthly Installment (EMI) for home loans,
          personal loans, and other financing options.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" />
              Loan Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(loanAmount)}
                  onChange={handleInputChange(
                    setLoanAmount,
                    validateLoanAmount,
                    "Loan Amount"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  placeholder="2500000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_LOAN_AMOUNT.toLocaleString()} - ₹
                  {MAX_LOAN_AMOUNT.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Interest Rate (% per annum)
                </label>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={handleInputChange(
                    setInterestRate,
                    validateInterestRate,
                    "Interest Rate"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  step={0.1}
                  placeholder="8.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_INTEREST_RATE}% - {MAX_INTEREST_RATE}% (Home
                  loans: 7-12%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Tenure (Years)
                </label>
                <Input
                  type="number"
                  value={tenure}
                  onChange={handleInputChange(
                    setTenure,
                    validateTenure,
                    "Tenure"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  placeholder="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_TENURE} - {MAX_TENURE} years (Longer tenure =
                  lower EMI)
                </p>
              </div>
            </div>

            <button
              onClick={calculateEMIReturns}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate EMI" : "Enter Valid Inputs"}
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
                  Monthly EMI
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.emi))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Total Payment
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(result.totalPayment))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-purple-800 mb-2">
                  Total Interest
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(Number(result.totalInterest))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Interest %
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {Number(result.interestPercentage).toFixed(1)}%
                </p>
              </div>
            </section>

            {/* Chart and Summary Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    Loan Repayment Breakdown
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
                            if (value >= 10000000)
                              return `₹${(value / 10000000).toFixed(1)}Cr`;
                            else if (value >= 100000)
                              return `₹${(value / 100000).toFixed(1)}L`;
                            else if (value >= 1000)
                              return `₹${(value / 1000).toFixed(1)}K`;
                            else return `₹${value.toFixed(0)}`;
                          }}
                        />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "principalPaid")
                              return [
                                formatCurrency(Number(value)),
                                "Principal Paid",
                              ];
                            else if (name === "interestPaid")
                              return [
                                formatCurrency(Number(value)),
                                "Interest Paid",
                              ];
                            return [formatCurrency(Number(value)), name];
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
                          dataKey="principalPaid"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Principal Paid"
                        />
                        <Area
                          type="monotone"
                          dataKey="interestPaid"
                          stackId="1"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.6}
                          name="Interest Paid"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Principal Paid</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Interest Paid</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="h-full">
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    Loan Summary & Tips
                  </h3>

                  {/* Loan Summary */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Loan Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Loan Amount:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(loanAmount) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Interest Rate:
                        </span>
                        <span className="font-semibold">
                          {interestRate || "0"}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Loan Tenure:
                        </span>
                        <span className="font-semibold">
                          {tenure || "0"} years
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total EMIs:
                        </span>
                        <span className="font-semibold">
                          {(Number(tenure) || 0) * 12}
                        </span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Interest to Total:
                          </span>
                          <span className="font-bold text-red-600 text-lg">
                            {summaryData.interestToEMIRatio}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Tips */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-3 text-green-600">
                      Smart Loan Tips
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 text-sm mb-1">
                          Lower Interest Rate
                        </h5>
                        <p className="text-xs text-green-600">
                          Shop around for the best rates
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Prepayment Benefits
                        </h5>
                        <p className="text-xs text-blue-600">
                          Pay extra when possible to save interest
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <h5 className="font-medium text-purple-700 text-sm mb-1">
                          EMI-to-Income Ratio
                        </h5>
                        <p className="text-xs text-purple-600">
                          Keep EMI under 40% of monthly income
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
                  EMI Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>
                          EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]
                        </strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>
                          <strong>EMI</strong> = Equated Monthly Installment
                        </div>
                        <div>
                          <strong>P</strong> = Principal Loan Amount
                        </div>
                        <div>
                          <strong>r</strong> = Monthly Interest Rate (Annual
                          Rate ÷ 12)
                        </div>
                        <div>
                          <strong>n</strong> = Total Number of Monthly Payments
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
                          <span>Principal (P):</span>
                          <span className="font-semibold">
                            ₹{Number(loanAmount) || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Rate:</span>
                          <span className="font-semibold">
                            {Number(interestRate) || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Rate (r):</span>
                          <span className="font-semibold">
                            {((Number(interestRate) || 0) / 12).toFixed(4)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tenure:</span>
                          <span className="font-semibold">
                            {Number(tenure) || 0} years
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Payments (n):</span>
                          <span className="font-semibold">
                            {(Number(tenure) || 0) * 12}
                          </span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Monthly EMI:</span>
                            <span className="text-green-600">
                              {result
                                ? formatCurrency(Number(result.emi))
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
                    <strong>How it works:</strong> The EMI formula ensures that
                    you pay the same amount every month throughout the loan
                    tenure. Initially, a larger portion goes toward interest,
                    and as the principal reduces, more of your EMI goes toward
                    the principal repayment.
                  </p>
                </div>
              </Card>
            </section>

            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  About EMI & Loan Management
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      EMI Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Fixed monthly payment for easy budgeting",
                        "Spread large purchases over time",
                        "Build credit history with timely payments",
                        "Predictable payment schedule",
                        "Tax benefits on certain loan types",
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
                      Loan Management Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Compare interest rates from multiple lenders",
                        "Consider shorter tenure to save on interest",
                        "Make prepayments when possible",
                        "Maintain good credit score for better rates",
                        "Read all terms and conditions carefully",
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
                  Enter your loan details above and see your EMI breakdown and
                  payment schedule visualization in real-time.
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
