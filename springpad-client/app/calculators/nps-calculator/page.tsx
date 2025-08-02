"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import StyledSlider from "@/components/styled-slider";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaChartLine,
  FaCalculator,
  FaPiggyBank,
  FaTrophy,
  FaLightbulb,
  FaShieldAlt,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Types
interface PensionResult {
  contributionYears: number;
  totalContributions: number;
  interestEarned: number;
  totalValue: number;
  annuityAmount: number;
  lumpSumAmount: number;
  monthlyPension: number;
  totalPensionReceived: number;
}

interface ChartDataPoint {
  year: number;
  contributions: number;
  interestEarned: number;
  totalValue: number;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// Constants
const DEBOUNCE_DELAY = 500;
const MIN_AGE = 18;
const MAX_AGE = 70;
const MIN_RETIREMENT_AGE = 60;
const MAX_RETIREMENT_AGE = 75;
const MIN_CONTRIBUTION = 1000;
const MAX_CONTRIBUTION = 200000;

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${className}`}
  >
    {children}
  </div>
);

const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Slider: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input
    type="range"
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className}`}
    {...props}
  />
);

// Pension calculation formula
const calculatePension = (
  monthlyContribution: number,
  currentAge: number,
  retirementAge: number,
  investmentReturn: number,
  annuityPercentage: number,
  annuityReturn: number,
  annuityPeriod: number,
  isAnnual: boolean = false
): PensionResult => {
  const contributionYears = retirementAge - currentAge;
  const contributionAmount = isAnnual
    ? monthlyContribution
    : monthlyContribution * 12;
  const totalContributions = contributionAmount * contributionYears;

  // Calculate future value using compound interest
  const r = investmentReturn / 100;
  let totalValue = 0;

  for (let year = 1; year <= contributionYears; year++) {
    const yearsRemaining = contributionYears - year + 1;
    totalValue += contributionAmount * Math.pow(1 + r, yearsRemaining - 1);
  }

  const interestEarned = totalValue - totalContributions;

  // Calculate annuity and lump sum
  const annuityAmount = (totalValue * annuityPercentage) / 100;
  const lumpSumAmount = totalValue - annuityAmount;

  // Calculate monthly pension
  const annualReturn = annuityReturn / 100;
  const monthlyReturn = annualReturn / 12;
  const totalMonths = annuityPeriod * 12;

  let monthlyPension = 0;
  if (monthlyReturn > 0) {
    monthlyPension =
      (annuityAmount * monthlyReturn) /
      (1 - Math.pow(1 + monthlyReturn, -totalMonths));
  } else {
    monthlyPension = annuityAmount / totalMonths;
  }

  const totalPensionReceived = monthlyPension * totalMonths;

  return {
    contributionYears,
    totalContributions,
    interestEarned,
    totalValue,
    annuityAmount,
    lumpSumAmount,
    monthlyPension,
    totalPensionReceived,
  };
};

export default function NPSCalculator() {
  const [investmentType, setInvestmentType] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [contribution, setContribution] = useState<number>(10000);
  const [currentAge, setCurrentAge] = useState<number>(29);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [investmentReturn, setInvestmentReturn] = useState<number>(8);
  const [annuityPercentage, setAnnuityPercentage] = useState<number>(40);
  const [annuityReturn, setAnnuityReturn] = useState<number>(6);
  const [annuityPeriod, setAnnuityPeriod] = useState<number>(20);
  const [result, setResult] = useState<PensionResult | null>(null);

  // Validation
  const inputsValid = useMemo(() => {
    return (
      contribution >= MIN_CONTRIBUTION &&
      contribution <= MAX_CONTRIBUTION &&
      currentAge >= MIN_AGE &&
      currentAge <= MAX_AGE &&
      retirementAge >= MIN_RETIREMENT_AGE &&
      retirementAge <= MAX_RETIREMENT_AGE &&
      retirementAge > currentAge &&
      investmentReturn >= 0 &&
      investmentReturn <= 15 &&
      annuityPercentage >= 10 &&
      annuityPercentage <= 100 &&
      annuityReturn >= 0 &&
      annuityReturn <= 15 &&
      annuityPeriod >= 5 &&
      annuityPeriod <= 50
    );
  }, [
    contribution,
    currentAge,
    retirementAge,
    investmentReturn,
    annuityPercentage,
    annuityReturn,
    annuityPeriod,
  ]);

  // Calculate pension
  const calculatePensionPlan = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }

    const pensionResult = calculatePension(
      contribution,
      currentAge,
      retirementAge,
      investmentReturn,
      annuityPercentage,
      annuityReturn,
      annuityPeriod,
      investmentType === "annual"
    );

    setResult(pensionResult);
  }, [
    contribution,
    currentAge,
    retirementAge,
    investmentReturn,
    annuityPercentage,
    annuityReturn,
    annuityPeriod,
    investmentType,
    inputsValid,
  ]);

  // Auto-calculate with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      calculatePensionPlan();
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [calculatePensionPlan]);

  // Chart data
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!result) return [];

    const data: ChartDataPoint[] = [];
    const contributionAmount =
      investmentType === "annual" ? contribution : contribution * 12;
    const r = investmentReturn / 100;

    for (let year = 1; year <= result.contributionYears; year++) {
      let totalValue = 0;
      for (let y = 1; y <= year; y++) {
        const yearsRemaining = year - y + 1;
        totalValue += contributionAmount * Math.pow(1 + r, yearsRemaining - 1);
      }

      const contributions = contributionAmount * year;
      const interestEarned = totalValue - contributions;

      data.push({
        year,
        contributions,
        interestEarned,
        totalValue,
      });
    }

    return data;
  }, [result, contribution, investmentReturn, investmentType]);

  const pieData = useMemo(() => {
    if (!result) return [];
    return [
      { name: "Annuity Amount", value: result.annuityAmount, color: "#10b981" },
      {
        name: "Lump Sum Amount",
        value: result.lumpSumAmount,
        color: "#3b82f6",
      },
    ];
  }, [result]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] py-8">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-20">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaPiggyBank className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">NPS Pension Calculator</h1>
        </header>

        <p className="text-gray-600 mb-8">
          Calculate your National Pension System (NPS) returns and monthly
          pension based on your contributions and retirement planning.
        </p>

        {/* Input Section */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FaCalculator className="text-blue-500" />
              Investment Planning
            </h2>

            <div className="space-y-6">
              {/* Investment Type */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Investment Type
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setInvestmentType("monthly")}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      investmentType === "monthly"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setInvestmentType("annual")}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      investmentType === "annual"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Annual
                  </button>
                </div>
              </div>

              {/* Contribution Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {investmentType === "monthly" ? "Monthly" : "Annual"}{" "}
                  Contribution Amount
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">₹</span>
                  <Input
                    type="number"
                    value={contribution}
                    onChange={(e) =>
                      setContribution(Number(e.target.value) || 0)
                    }
                    min={MIN_CONTRIBUTION}
                    max={MAX_CONTRIBUTION}
                    step={investmentType === "monthly" ? 500 : 5000}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_CONTRIBUTION.toLocaleString()} - ₹
                  {MAX_CONTRIBUTION.toLocaleString()}
                </p>
              </div>

              {/* Current Age */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your current age (in years)
                </label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={(e) =>
                      setCurrentAge(Number(e.target.value) || MIN_AGE)
                    }
                    min={MIN_AGE}
                    max={MAX_AGE}
                  />
                  <StyledSlider
                    min={0}
                    max={15}
                    step={0.5}
                    value={annuityReturn}
                    onChange={(e) => setAnnuityReturn(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{MIN_AGE}</span>
                    <span>45</span>
                    <span>{MAX_AGE}</span>
                  </div>
                </div>
              </div>

              {/* Retirement Age */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  I would like to continue contributing till the age of
                </label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={retirementAge}
                    onChange={(e) =>
                      setRetirementAge(
                        Number(e.target.value) || MIN_RETIREMENT_AGE
                      )
                    }
                    min={MIN_RETIREMENT_AGE}
                    max={MAX_RETIREMENT_AGE}
                  />
                  <StyledSlider
                    min={5}
                    max={50}
                    value={annuityPeriod}
                    onChange={(e) => setAnnuityPeriod(Number(e.target.value))}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>60</span>
                    <span>68</span>
                    <span>75</span>
                  </div>
                </div>
              </div>

              {/* Investment Return */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected return on investment
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={investmentReturn}
                      onChange={(e) =>
                        setInvestmentReturn(Number(e.target.value) || 0)
                      }
                      min={0}
                      max={15}
                      step={0.5}
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <StyledSlider
                    min={0}
                    max={15}
                    step={0.5}
                    value={investmentReturn}
                    onChange={(e) =>
                      setInvestmentReturn(Number(e.target.value))
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>2.5</span>
                    <span>5.0</span>
                    <span>7.5</span>
                    <span>10</span>
                    <span>15</span>
                  </div>
                </div>
              </div>

              {/* Annuity Percentage */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Percentage of Annuity purchase
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={annuityPercentage}
                      onChange={(e) =>
                        setAnnuityPercentage(Number(e.target.value) || 10)
                      }
                      min={10}
                      max={100}
                      step={5}
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <StyledSlider
                    min={10}
                    max={100}
                    step={5}
                    value={annuityPercentage}
                    onChange={(e) =>
                      setAnnuityPercentage(Number(e.target.value))
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>10</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Annuity Return */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected return on Annuity
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={annuityReturn}
                      onChange={(e) =>
                        setAnnuityReturn(Number(e.target.value) || 0)
                      }
                      min={0}
                      max={15}
                      step={0.5}
                    />
                    <span className="text-sm font-medium">%</span>
                  </div>
                  <StyledSlider
                    min={0}
                    max={15}
                    step={0.5}
                    value={annuityReturn}
                    onChange={(e) => setAnnuityReturn(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>2.5</span>
                    <span>5.0</span>
                    <span>7.5</span>
                    <span>10</span>
                    <span>15</span>
                  </div>
                </div>
              </div>

              {/* Annuity Period */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Period of Annuity (in years)
                </label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={annuityPeriod}
                    onChange={(e) =>
                      setAnnuityPeriod(Number(e.target.value) || 5)
                    }
                    min={5}
                    max={50}
                  />
                  <StyledSlider
                    min={5}
                    max={50}
                    value={annuityPeriod}
                    onChange={(e) => setAnnuityPeriod(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>5</span>
                    <span>15</span>
                    <span>25</span>
                    <span>35</span>
                    <span>50</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {result && inputsValid ? (
          <>
            {/* Results Section */}
            <section className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Principal Amount ({result.contributionYears} Years)
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(result.totalContributions)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Interest Earned
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(result.interestEarned)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-purple-800 mb-2">
                  Total Value
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(result.totalValue)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Pension per Month
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(result.monthlyPension)}
                </p>
              </div>
            </section>

            {/* Additional Results */}
            <section className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg border border-indigo-200">
                <h3 className="text-sm font-medium text-indigo-800 mb-2">
                  Annuity Reinvested
                </h3>
                <p className="text-xl font-bold text-indigo-600">
                  {formatCurrency(result.annuityAmount)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200">
                <h3 className="text-sm font-medium text-teal-800 mb-2">
                  Lumpsum Amount Withdrawn
                </h3>
                <p className="text-xl font-bold text-teal-600">
                  {formatCurrency(result.lumpSumAmount)}
                </p>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-lg border border-pink-200">
                <h3 className="text-sm font-medium text-pink-800 mb-2">
                  Total Pension Received
                </h3>
                <p className="text-xl font-bold text-pink-600">
                  {formatCurrency(result.totalPensionReceived)}
                </p>
              </div>
            </section>

            {/* Charts Section */}
            <section className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-blue-500" />
                    Investment Growth Over Time
                  </h3>
                  <div className="h-80">
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
                            if (value >= 100000)
                              return `₹${(value / 100000).toFixed(1)}L`;
                            if (value >= 1000)
                              return `₹${(value / 1000).toFixed(1)}K`;
                            return `₹${value.toFixed(0)}`;
                          }}
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => {
                            const labels = {
                              contributions: "Total Contributions",
                              interestEarned: "Interest Earned",
                            };
                            return [
                              formatCurrency(value),
                              labels[name as keyof typeof labels] || name,
                            ];
                          }}
                          labelFormatter={(year) => `Year ${year}`}
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="contributions"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="interestEarned"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Total Contributions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Interest Earned</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div>
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500" />
                    Retirement Breakdown
                  </h3>

                  <div className="h-48 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            formatCurrency(value),
                            "",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(result.monthlyPension)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Monthly Pension
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Contribution Years:</span>
                        <span className="font-semibold">
                          {result.contributionYears}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annuity Period:</span>
                        <span className="font-semibold">
                          {annuityPeriod} years
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Months:</span>
                        <span className="font-semibold">
                          {annuityPeriod * 12}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>

            {/* Information Section */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  About NPS & Retirement Planning
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      NPS Benefits
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Tax deduction up to ₹2 lakh under 80CCD",
                        "Additional ₹50,000 deduction under 80CCD(1B)",
                        "Long-term wealth creation for retirement",
                        "Flexibility to choose investment options",
                        "Government co-contribution for certain categories",
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
                      Key Features
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Minimum 40% must be used for annuity purchase",
                        "Remaining 60% can be withdrawn as lump sum",
                        "Pension starts from age 60 (normal exit)",
                        "Premature exit allowed after 3 years with penalties",
                        "Portable across jobs and locations",
                      ].map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This calculator provides
                    estimates based on the inputs provided. Actual returns may
                    vary based on market conditions, fund performance, and
                    regulatory changes. Please consult with a financial advisor
                    for personalized retirement planning advice.
                  </p>
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
                  Plan Your Retirement
                </h3>
                <p className="text-gray-600">
                  Enter your details above to calculate your NPS pension and
                  plan your retirement effectively.
                </p>
                {!inputsValid && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      Please check your inputs. Ensure retirement age is greater
                      than current age and all values are within valid ranges.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </section>
        )}
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      <Footer />
    </div>
  );
}
