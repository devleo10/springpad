"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaChartLine,
  FaCalculator,
  FaPiggyBank,
  FaShieldAlt,
  FaArrowUp,
  FaLightbulb,
  FaUserTie,
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
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Types
interface EpfResult {
  totalAmount: string;
  employeeContribution: string;
  employerContribution: string;
  totalInterest: string;
}

interface ChartDataPoint {
  year: number;
  employeeContribution: number;
  employerContribution: number;
  totalInterest: number;
  totalAmount: number;
}

// Constants
const DEBOUNCE_DELAY = 800;
const MIN_SALARY = 1000;
const MAX_SALARY = 500000;
const MIN_INTEREST = 7;
const MAX_INTEREST = 15;
const MIN_YEARS = 1;
const MAX_YEARS = 40;
const CURRENT_EPF_RATE = 8.25; // Current EPF interest rate

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

// EPF Calculation with compound interest
const calculateEpfValue = (
  basicSalary: number,
  interestRate: number,
  years: number
): {
  totalAmount: number;
  employeeContribution: number;
  employerContribution: number;
  totalInterest: number;
} => {
  const monthlyEmployeeContribution = Math.min(basicSalary * 0.12, 1800); // 12% of basic salary, capped at ₹1,800
  const monthlyEmployerContribution = monthlyEmployeeContribution; // Employer matches employee contribution
  const monthlyTotalContribution = monthlyEmployeeContribution + monthlyEmployerContribution;
  
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalMonths = years * 12;

  let totalAmount = 0;
  
  // Calculate compound interest for each month's contribution
  for (let month = 0; month < totalMonths; month++) {
    const remainingMonths = totalMonths - month;
    const compoundFactor = Math.pow(1 + monthlyInterestRate, remainingMonths);
    totalAmount += monthlyTotalContribution * compoundFactor;
  }

  const totalEmployeeContribution = monthlyEmployeeContribution * totalMonths;
  const totalEmployerContribution = monthlyEmployerContribution * totalMonths;
  const totalContributions = totalEmployeeContribution + totalEmployerContribution;
  const totalInterest = totalAmount - totalContributions;

  return {
    totalAmount,
    employeeContribution: totalEmployeeContribution,
    employerContribution: totalEmployerContribution,
    totalInterest,
  };
};

const isValidInput = (value: number | ""): boolean => {
  return value !== "" && Number(value) > 0;
};

const validateBasicSalary = (value: number): boolean => {
  return value >= MIN_SALARY && value <= MAX_SALARY;
};

const validateInterestRate = (value: number): boolean => {
  return value >= MIN_INTEREST && value <= MAX_INTEREST;
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

export default function EpfCalculator() {
  const [basicSalary, setBasicSalary] = useState<number | "">(25000);
  const [interestRate, setInterestRate] = useState<number | "">(CURRENT_EPF_RATE);
  const [timePeriod, setTimePeriod] = useState<number | "">(20);
  const [result, setResult] = useState<EpfResult | null>(null);

  // Validation messages
  const validationMessages = useMemo(() => {
    const messages: string[] = [];

    if (basicSalary !== "" && !validateBasicSalary(Number(basicSalary))) {
      messages.push(
        `Basic salary should be between ₹${MIN_SALARY.toLocaleString()} and ₹${MAX_SALARY.toLocaleString()}`
      );
    }

    if (interestRate !== "" && !validateInterestRate(Number(interestRate))) {
      messages.push(
        `Interest rate should be between ${MIN_INTEREST}% and ${MAX_INTEREST}%`
      );
    }

    if (timePeriod !== "" && !validateTimePeriod(Number(timePeriod))) {
      messages.push(
        `Time period should be between ${MIN_YEARS} and ${MAX_YEARS} years`
      );
    }

    return messages;
  }, [basicSalary, interestRate, timePeriod]);

  const inputsValid = useMemo(() => {
    return (
      isValidInput(basicSalary) &&
      validateBasicSalary(Number(basicSalary)) &&
      isValidInput(interestRate) &&
      validateInterestRate(Number(interestRate)) &&
      isValidInput(timePeriod) &&
      validateTimePeriod(Number(timePeriod))
    );
  }, [basicSalary, interestRate, timePeriod]);

  const calculateEpfReturns = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const salary = Number(basicSalary);
    const rate = Number(interestRate);
    const years = Number(timePeriod);

    const calculation = calculateEpfValue(salary, rate, years);

    setResult({
      totalAmount: calculation.totalAmount.toString(),
      employeeContribution: calculation.employeeContribution.toString(),
      employerContribution: calculation.employerContribution.toString(),
      totalInterest: calculation.totalInterest.toString(),
    });
  }, [basicSalary, interestRate, timePeriod, inputsValid]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result || !inputsValid) return [];

    const salary = Number(basicSalary);
    const rate = Number(interestRate);
    const years = Number(timePeriod);
    const data: ChartDataPoint[] = [];

    for (let year = 1; year <= years; year++) {
      const calculation = calculateEpfValue(salary, rate, year);
      
      data.push({
        year,
        employeeContribution: calculation.employeeContribution,
        employerContribution: calculation.employerContribution,
        totalInterest: calculation.totalInterest,
        totalAmount: calculation.totalAmount,
      });
    }

    return data;
  }, [result, basicSalary, interestRate, timePeriod, inputsValid]);

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
        calculateEpfReturns();
      }
    },
    [calculateEpfReturns]
  );

  useEffect(() => {
    if (!inputsValid) return;

    const timer = setTimeout(() => {
      calculateEpfReturns();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [basicSalary, interestRate, timePeriod, calculateEpfReturns, inputsValid]);

  const summaryData = useMemo(() => {
    if (!result) return null;

    const totalContributions = Number(result.employeeContribution) + Number(result.employerContribution);
    const totalInterest = Number(result.totalInterest);
    const totalAmount = Number(result.totalAmount);
    const monthlyEmployeeContribution = Math.min(Number(basicSalary) * 0.12, 1800);

    if (totalContributions === 0) {
      return { returnPercentage: "0.0", wealthMultiplier: "1.0", monthlyContribution: 0 };
    }

    const returnPercentage = ((totalInterest / totalContributions) * 100).toFixed(1);
    const wealthMultiplier = (totalAmount / totalContributions).toFixed(1);

    const cappedReturnPercentage = Math.min(Number(returnPercentage), 9999).toFixed(1);

    return {
      returnPercentage: cappedReturnPercentage,
      wealthMultiplier,
      monthlyContribution: monthlyEmployeeContribution,
    };
  }, [result, basicSalary]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaUserTie className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">EPF Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate the future value of your EPF (Employees&apos; Provident Fund) contributions and see how your retirement corpus grows over time.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              EPF Contribution Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Basic Salary (Monthly) (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatNumberWithCommas(basicSalary)}
                  onChange={handleInputChange(
                    setBasicSalary,
                    validateBasicSalary,
                    "Basic Salary"
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  placeholder="25000"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_SALARY.toLocaleString()} - ₹{MAX_SALARY.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  EPF Interest Rate (% p.a.)
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
                  placeholder="8.25"
                  step={0.25}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current EPF rate: {CURRENT_EPF_RATE}% (Range: {MIN_INTEREST}% - {MAX_INTEREST}%)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Period (Years)
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
                  placeholder="20"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: {MIN_YEARS} - {MAX_YEARS} years (Typical service: 20-35 years)
                </p>
              </div>
            </div>

            <button
              onClick={calculateEpfReturns}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate EPF Returns" : "Enter Valid Inputs"}
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
                  Total EPF Amount
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.totalAmount))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Employee Contribution
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(result.employeeContribution))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-purple-800 mb-2">
                  Employer Contribution
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(Number(result.employerContribution))}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Total Interest Earned
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(Number(result.totalInterest))}
                </p>
              </div>
            </section>

            {/* Chart and Summary Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
              <div className="lg:col-span-2">
                <Card className="h-full p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    EPF Growth Visualization
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
                            if (name === "employeeContribution") {
                              return [formatCurrency(value), "Employee Contribution"];
                            } else if (name === "employerContribution") {
                              return [formatCurrency(value), "Employer Contribution"];
                            } else if (name === "totalInterest") {
                              return [formatCurrency(value), "Interest Earned"];
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
                          dataKey="employeeContribution"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                          name="Employee Contribution"
                        />
                        <Area
                          type="monotone"
                          dataKey="employerContribution"
                          stackId="1"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                          name="Employer Contribution"
                        />
                        <Area
                          type="monotone"
                          dataKey="totalInterest"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="Interest Earned"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Employee Contribution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded"></div>
                      <span>Employer Contribution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Interest Earned</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="h-full">
                <Card className="h-full flex flex-col p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    EPF Summary & Benefits
                  </h3>

                  {/* EPF Summary */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-blue-600">
                      Contribution Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Basic Salary:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(Number(basicSalary) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Monthly Employee Contribution:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(summaryData.monthlyContribution)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Monthly Employer Contribution:
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(summaryData.monthlyContribution)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          EPF Interest Rate:
                        </span>
                        <span className="font-semibold">
                          {interestRate || "0"}% p.a.
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Service Period:
                        </span>
                        <span className="font-semibold">
                          {timePeriod || "0"} years
                        </span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Corpus Multiplier:
                          </span>
                          <span className="font-bold text-green-600 text-lg">
                            {summaryData.wealthMultiplier}x
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EPF Benefits */}
                  <div className="flex-1">
                    <h4 className="font-medium mb-3 text-green-600">
                      EPF Benefits
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 text-sm mb-1">
                          Tax Benefits
                        </h5>
                        <p className="text-xs text-green-600">
                          Contributions are tax-deductible under 80C
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 text-sm mb-1">
                          Employer Matching
                        </h5>
                        <p className="text-xs text-blue-600">
                          100% employer contribution matching
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <h5 className="font-medium text-purple-700 text-sm mb-1">
                          Guaranteed Returns
                        </h5>
                        <p className="text-xs text-purple-600">
                          Government-backed safe investment
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Formula Section */}
            <section className="mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCalculator className="text-purple-500" />
                  EPF Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      Formula Used
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm">
                      <div className="mb-2">
                        <strong>EPF = Σ(Monthly Contribution × (1 + r/12)^remaining months)</strong>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>Employee Contribution</strong> = 12% of Basic Salary (Max ₹1,800)</div>
                        <div><strong>Employer Contribution</strong> = Equal to Employee Contribution</div>
                        <div><strong>r</strong> = Annual Interest Rate</div>
                        <div><strong>Compound Interest</strong> = Applied monthly</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Your EPF Calculation
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Basic Salary:</span>
                          <span className="font-semibold">₹{Number(basicSalary) || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Employee Contribution:</span>
                          <span className="font-semibold">₹{summaryData.monthlyContribution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Employer Contribution:</span>
                          <span className="font-semibold">₹{summaryData.monthlyContribution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Monthly Contribution:</span>
                          <span className="font-semibold">₹{summaryData.monthlyContribution * 2}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Interest Rate:</span>
                          <span className="font-semibold">{Number(interestRate) || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Period:</span>
                          <span className="font-semibold">{Number(timePeriod) || 0} years</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total EPF Corpus:</span>
                            <span className="text-green-600">
                              {result ? formatCurrency(Number(result.totalAmount)) : "₹0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>How EPF works:</strong> Both employee and employer contribute 12% of basic salary (capped at ₹1,800) to EPF. 
                    The contributions earn compound interest as declared by EPFO annually. The corpus grows tax-free and can be withdrawn 
                    after retirement or under specific conditions.
                  </p>
                </div>
              </Card>
            </section>

            {/* Information Section */}
            <section>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  About EPF Benefits & Rules
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      EPF Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Tax deduction under Section 80C up to ₹1.5 lakh",
                        "Tax-free interest earnings and maturity amount",
                        "Employer contributes equal amount (100% matching)",
                        "Guaranteed returns backed by government",
                        "Pension benefits through EPS (Employee Pension Scheme)",
                        "Life insurance coverage through EDLI",
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
                      Withdrawal Rules
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Full withdrawal allowed after 5 years of unemployment",
                        "Partial withdrawal for home purchase, education, medical",
                        "58 years is retirement age for full withdrawal",
                        "Premature withdrawal may attract tax implications",
                        "Transfer EPF account when changing jobs",
                        "Online withdrawal through UAN portal",
                      ].map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h5 className="font-medium text-yellow-800 mb-2">Current EPF Interest Rate</h5>
                    <p className="text-sm text-yellow-700">
                      The EPF interest rate for FY 2023-24 is <strong>8.25% per annum</strong>. 
                      This rate is declared annually by EPFO and may vary year to year.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-800 mb-2">Tax Benefits Summary</h5>
                    <p className="text-sm text-green-700">
                      <strong>EEE Status:</strong> Exempt at contribution, Exempt during growth, 
                      Exempt at withdrawal (after 5 years of service).
                    </p>
                  </div>
                </div>
              </Card>
            </section>
          </>
        ) : (
          <section className="text-center py-16">
            <Card className="p-12">
              <div className="text-center text-gray-500">
                <FaShieldAlt className="mx-auto text-5xl mb-6 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">
                  Ready to Calculate Your EPF?
                </h3>
                <p className="text-gray-600">
                  Enter your salary and service details above to see your EPF projections 
                  and retirement corpus growth visualization.
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