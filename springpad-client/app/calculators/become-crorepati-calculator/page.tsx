"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  FaRupeeSign,
  FaChartLine,
  FaCalculator,
  FaArrowUp,
  FaLightbulb,
  FaShieldAlt,
} from "react-icons/fa";

// Currency formatter (Indian Rupees)
const formatCurrency = (num: number) => {
  if (!num || isNaN(num) || !isFinite(num) || num <= 0) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

// For text input: only keep numbers and dot
const sanitizeNumeric = (v: string): string => {
  const cleaned = v.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  return cleaned;
};

// SIP formula (reverse) to compute P given FV, rate, n
const computeMonthlySip = (
  FV: number,
  annualReturnPercent: number,
  years: number
): number => {
  const r = Number(annualReturnPercent) / 100 / 12;
  const n = Number(years) * 12;
  if (!n || years <= 0) return 0;
  if (r === 0) return FV / n;
  const factor = (Math.pow(1 + r, n) - 1) / r;
  return FV / (factor * (1 + r));
};

export default function CrorepatiCalculator() {
  // "" means empty, user can freely clear and edit
  const [desiredCrores, setDesiredCrores] = useState<number | "">(5);
  const [currentAge, setCurrentAge] = useState<number | "">(30);
  const [targetAge, setTargetAge] = useState<number | "">(60);
  const [inflation, setInflation] = useState<number | "">(5);
  const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
  const [currentSavings, setCurrentSavings] = useState<number | "">(2500000);
  const [submitted, setSubmitted] = useState(false);

  // Treat empty fields as 0 in all calculations
  const years =
    currentAge !== "" &&
    targetAge !== "" &&
    Number(targetAge) > Number(currentAge)
      ? Number(targetAge) - Number(currentAge)
      : 0;

  // "Inflation-adjusted" FV target at goal age
  const futureTarget =
    desiredCrores !== "" && inflation !== "" && years > 0
      ? Number(desiredCrores) *
        1e7 *
        Math.pow(1 + Number(inflation) / 100, years)
      : 0;

  // Projected current savings value by then
  const savingsFuture =
    currentSavings !== "" && expectedReturn !== "" && years > 0
      ? Number(currentSavings) *
        Math.pow(1 + Number(expectedReturn) / 100, years)
      : 0;

  // Remaining gap to be filled by SIP
  const gap =
    futureTarget > savingsFuture &&
    isFinite(futureTarget) &&
    isFinite(savingsFuture)
      ? futureTarget - savingsFuture
      : 0;

  // SIP required per month to reach gap
  const sipPerMonth =
    gap > 0 && expectedReturn !== "" && years > 0
      ? computeMonthlySip(gap, expectedReturn, years)
      : 0;

  const totalSIP = sipPerMonth * years * 12;
  const sipGrowth = gap - totalSIP;

  // Validation checks, now allow empty ("" is invalid)
  const errors = [];
  if (
    desiredCrores === "" ||
    isNaN(Number(desiredCrores)) ||
    Number(desiredCrores) < 0.1
  )
    errors.push("Target wealth should be at least 0.1 crore (₹10 lakh).");

  if (
    currentAge === "" ||
    isNaN(Number(currentAge)) ||
    Number(currentAge) < 10 ||
    Number(currentAge) > 90
  )
    errors.push("Current age should be realistic (10-90).");

  if (
    targetAge === "" ||
    isNaN(Number(targetAge)) ||
    Number(targetAge) <= Number(currentAge) ||
    Number(targetAge) > 100
  )
    errors.push("Target age should be greater than current age and ≤ 100.");

  if (
    inflation === "" ||
    isNaN(Number(inflation)) ||
    Number(inflation) < 0 ||
    Number(inflation) > 20
  )
    errors.push("Inflation must be between 0-20%.");

  if (
    expectedReturn === "" ||
    isNaN(Number(expectedReturn)) ||
    Number(expectedReturn) <= 0 ||
    Number(expectedReturn) > 30
  )
    errors.push("Expected returns should be positive and ≤ 30%.");

  if (
    currentSavings === "" ||
    isNaN(Number(currentSavings)) ||
    Number(currentSavings) < 0
  )
    errors.push("Current savings must be zero or more.");

  // submission handler
  const handleCalculate = useCallback(() => setSubmitted(true), []);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* HEADER */}
        <header className="flex items-center gap-3 mb-6">
          <FaRupeeSign className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Become a Crorepati Calculator</h1>
        </header>
        <p className="text-gray-600 mb-8">
          Find out how much you must invest every month to meet your dream
          corpus, factoring in inflation, current savings, and expected
          returns—modern SIP planning for big wealth!
        </p>

        {/* INPUTS in a CARD */}
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaCalculator className="text-purple-500" /> Your Wealth Goal
              Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Crores at Today&apos;s Value
                </label>
                <Input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={desiredCrores === "" ? "" : desiredCrores}
                  onChange={(e) => {
                    if (e.target.value === "") setDesiredCrores("");
                    else setDesiredCrores(Number(e.target.value));
                    setSubmitted(false);
                  }}
                  placeholder="5"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Current value: {desiredCrores === "" ? "–" : desiredCrores}{" "}
                  crore ={" "}
                  {formatCurrency(
                    desiredCrores === "" ? 0 : desiredCrores * 1e7
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Current Age (years)
                </label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={currentAge === "" ? "" : currentAge}
                  onChange={(e) => {
                    if (e.target.value === "") setCurrentAge("");
                    else setCurrentAge(Number(e.target.value));
                    setSubmitted(false);
                  }}
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Age to Become Crorepati (years)
                </label>
                <Input
                  type="number"
                  min={currentAge === "" ? 11 : Number(currentAge) + 1}
                  max={100}
                  value={targetAge === "" ? "" : targetAge}
                  onChange={(e) => {
                    if (e.target.value === "") setTargetAge("");
                    else setTargetAge(Number(e.target.value));
                    setSubmitted(false);
                  }}
                  placeholder="60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Inflation (% p.a.)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={inflation === "" ? "" : inflation}
                  onChange={(e) => {
                    if (e.target.value === "") setInflation("");
                    else setInflation(Number(e.target.value));
                    setSubmitted(false);
                  }}
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expected Return (% p.a.)
                </label>
                <Input
                  type="number"
                  min={0.1}
                  max={30}
                  step={0.1}
                  value={expectedReturn === "" ? "" : expectedReturn}
                  onChange={(e) => {
                    if (e.target.value === "") setExpectedReturn("");
                    else setExpectedReturn(Number(e.target.value));
                    setSubmitted(false);
                  }}
                  placeholder="12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Savings (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={
                    currentSavings === "" ? "" : formatCurrency(currentSavings)
                  }
                  onChange={(e) => {
                    if (e.target.value === "") setCurrentSavings("");
                    else {
                      const txt = sanitizeNumeric(e.target.value);
                      setCurrentSavings(Number(txt));
                    }
                    setSubmitted(false);
                  }}
                  placeholder="2500000"
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className={`w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md 
                hover:bg-yellow-500 transition-all duration-200 flex items-center justify-center gap-2 font-semibold
                ${errors.length > 0 ? "opacity-60 cursor-not-allowed" : ""}`}
              disabled={errors.length > 0}
            >
              <FaCalculator />
              Calculate Required SIP
            </button>

            {/* Validation Errors */}
            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  Please fix the following issues:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((m, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </section>

        {submitted && errors.length === 0 ? (
          <>
            {/* STAT GRID */}
            <section className="grid lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <h3 className="text-sm font-medium text-green-800 mb-2">
                  Target Wealth (Inflation Adjusted)
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(futureTarget)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Savings Projected by {targetAge}
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(savingsFuture)}
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Required Monthly SIP
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(Math.ceil(sipPerMonth))}
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <h3 className="text-sm font-medium text-purple-800 mb-2">
                  Total SIP Investment
                </h3>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(totalSIP)}
                </p>
              </div>
            </section>

            {/* BREAKDOWN and INSIGHTS */}
            <section className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-500" />
                  How This is Calculated
                </h3>
                <div className="space-y-4">
                  <div>
                    <p>
                      <span className="font-semibold">
                        Inflation adjusted target:
                      </span>{" "}
                      {formatCurrency(futureTarget)}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Future value of current savings:
                      </span>{" "}
                      {formatCurrency(savingsFuture)}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Amount to be generated via SIP:
                      </span>{" "}
                      {formatCurrency(gap)}
                    </p>
                  </div>
                  <div className="border-t pt-2 space-y-2">
                    <div>
                      <span className="font-semibold">
                        Required SIP per month:{" "}
                      </span>
                      <span className="text-purple-700 font-bold">
                        {formatCurrency(Math.ceil(sipPerMonth))}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">
                        Total Invested via SIP:{" "}
                      </span>
                      {formatCurrency(totalSIP)}
                    </div>
                    <div>
                      <span className="font-semibold">
                        Total Growth via SIP:{" "}
                      </span>
                      <span className="text-green-700 font-bold">
                        {formatCurrency(sipGrowth)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaArrowUp className="text-green-500" />
                  Key Investment Principles
                </h3>
                <div className="flex-1 space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-700 text-sm mb-1">
                      Start Early
                    </h5>
                    <p className="text-xs text-green-600">
                      The earlier you begin, the smaller your monthly SIP,
                      thanks to compounding!
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-700 text-sm mb-1">
                      Beat Inflation
                    </h5>
                    <p className="text-xs text-blue-600">
                      Your goal is adjusted to protect your future purchasing
                      power.
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                    <h5 className="font-medium text-purple-700 text-sm mb-1">
                      Compounding Works for You
                    </h5>
                    <p className="text-xs text-purple-600">
                      Both savings and SIP grow at the expected return rate.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* FORMULA CARD */}
            <section className="mb-8">
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaCalculator className="text-purple-500" />
                  Calculation Formula
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 text-blue-600">
                      SIP Reverse Calculation
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm space-y-1">
                      <div>
                        <strong>P = FV / {`[((1+r)^n-1)/r]*(1+r)`}</strong>
                      </div>
                      <div>
                        <strong>where:</strong>
                      </div>
                      <div>
                        <strong>FV</strong> = Future Value needed via SIP (
                        {formatCurrency(gap)})
                      </div>
                      <div>
                        <strong>r</strong> = Monthly Interest Rate (Annual ÷ 12
                        ÷ 100)
                      </div>
                      <div>
                        <strong>n</strong> = Total Months
                      </div>
                      <div>
                        <strong>P</strong> = Required Monthly SIP
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Your Calculation Example
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg border text-sm">
                      <div className="space-y-2">
                        <div>
                          Target Crores:{" "}
                          <span className="font-semibold">
                            {desiredCrores === "" ? "—" : desiredCrores} Crore
                          </span>
                        </div>
                        <div>
                          Current Age:{" "}
                          <span className="font-semibold">
                            {currentAge === "" ? "—" : currentAge}
                          </span>
                        </div>
                        <div>
                          Target Age:{" "}
                          <span className="font-semibold">
                            {targetAge === "" ? "—" : targetAge} ({years} years)
                          </span>
                        </div>
                        <div>
                          Inflation:{" "}
                          <span className="font-semibold">
                            {inflation === "" ? "—" : inflation}% p.a.
                          </span>
                        </div>
                        <div>
                          Expected Return:{" "}
                          <span className="font-semibold">
                            {expectedReturn === "" ? "—" : expectedReturn}% p.a.
                          </span>
                        </div>
                        <div>
                          Current Savings:{" "}
                          <span className="font-semibold">
                            {currentSavings === ""
                              ? "—"
                              : formatCurrency(currentSavings)}
                          </span>
                        </div>
                        <div>
                          Total Months:{" "}
                          <span className="font-semibold">{years * 12}</span>
                        </div>
                        <div>
                          Required Monthly SIP:{" "}
                          <span className="font-semibold text-purple-700">
                            {formatCurrency(Math.ceil(sipPerMonth))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700">
                  The required SIP is calculated so that your SIP contributions
                  (and their returns), together with your existing investments,
                  will reach your crorepati goal after adjusting for inflation.
                </div>
              </Card>
            </section>

            {/* Investment Insights */}
            <section>
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" /> Investment
                  Insights
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>
                        Inflation can greatly increase target required. Plan
                        accordingly.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>
                        Let your existing wealth work for you by investing it
                        effectively.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>
                        Higher returns lower needed SIP — but generally come
                        with higher risk.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>
                        SIP works best with discipline and regularity.
                      </span>
                    </li>
                  </ul>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>
                        Both SIP and lump sum are invested at{" "}
                        <b>
                          {expectedReturn === "" ? "–" : expectedReturn}% p.a.
                        </b>{" "}
                        assumption.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>
                        Target age and early planning both have major impact on
                        SIP requirement.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span>
                      <span>
                        Revisit your plan as your life situation or market
                        returns change.
                      </span>
                    </li>
                  </ul>
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
                  Ready to calculate your path to Crorepati?
                </h3>
                <p className="text-gray-600">
                  Fill in your info above and hit Calculate to see exactly what
                  it takes.
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
