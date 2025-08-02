"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaChartLine,
  FaPiggyBank,
  FaCalculator,
  FaArrowUp,
  FaLightbulb,
  FaShieldAlt,
} from "react-icons/fa";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

const MAX_AMOUNT = 100000000;
const MIN_AMOUNT = 1000;
const DEBOUNCE_DELAY = 500;

type CIIResult = {
  indexedCost: string;
  purchaseAmount: string;
  saleAmount: string;
  purchaseYear: string;
  saleYear: string;
  purchaseCII: string;
  saleCII: string;
};

// Official Cost Inflation Index table (FY label -> CII)
const CIITable: Record<string, number> = {
  "2001-2002": 100,
  "2002-2003": 105,
  "2003-2004": 109,
  "2004-2005": 113,
  "2005-2006": 117,
  "2006-2007": 122,
  "2007-2008": 129,
  "2008-2009": 137,
  "2009-2010": 148,
  "2010-2011": 167,
  "2011-2012": 184,
  "2012-2013": 200,
  "2013-2014": 220,
  "2014-2015": 240,
  "2015-2016": 254,
  "2016-2017": 264,
  "2017-2018": 272,
  "2018-2019": 280,
  "2019-2020": 289,
  "2020-2021": 301,
  "2021-2022": 317,
  "2022-2023": 331,
  "2023-2024": 348,
  "2024-2025": 363,
  "2025-2026": 376,
};

const allYears = Object.keys(CIITable);

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateIndexedCost = (
  purchaseAmount: number,
  purchaseCII: number,
  saleCII: number
): number => {
  if (purchaseCII === 0) return 0;
  return purchaseAmount * (saleCII / purchaseCII);
};

const isValidAmount = (value: number | ""): boolean => {
  return value !== "" && Number(value) >= MIN_AMOUNT && Number(value) <= MAX_AMOUNT;
};

const sanitizeInput = (value: string, maxLength: number = 12): string => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    return parts[0] + "." + parts.slice(1).join("");
  }
  return cleaned.substring(0, maxLength);
};

export default function CostInflationIndexCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState<number | "">(1000000);
  const [purchaseAmountDisplay, setPurchaseAmountDisplay] =
    useState<string>("10,00,000");
  const [saleAmount, setSaleAmount] = useState<number | "">(2000000);
  const [saleAmountDisplay, setSaleAmountDisplay] =
    useState<string>("20,00,000");

  // Replace CII number inputs with year selection
  const [purchaseYear, setPurchaseYear] = useState<string>("2010-2011");
  const [saleYear, setSaleYear] = useState<string>("2023-2024");

  const [result, setResult] = useState<CIIResult | null>(null);

  // Derived CII values from selected years
  const purchaseCII = useMemo(() => CIITable[purchaseYear] ?? 0, [purchaseYear]);
  const saleCII = useMemo(() => CIITable[saleYear] ?? 0, [saleYear]);

  // Validation messages
  const validationMessages = useMemo(() => {
    const msgs: string[] = [];
    if (!isValidAmount(purchaseAmount)) {
      msgs.push(
        `Purchase amount should be between ₹${MIN_AMOUNT.toLocaleString()} and ₹${MAX_AMOUNT.toLocaleString()}`
      );
    }
    if (!isValidAmount(saleAmount)) {
      msgs.push(
        `Sale amount should be between ₹${MIN_AMOUNT.toLocaleString()} and ₹${MAX_AMOUNT.toLocaleString()}`
      );
    }
    if (!CIITable[purchaseYear]) {
      msgs.push(`Select a valid purchase financial year`);
    }
    if (!CIITable[saleYear]) {
      msgs.push(`Select a valid sale financial year`);
    }
    return msgs;
  }, [purchaseAmount, saleAmount, purchaseYear, saleYear]);

  const inputsValid = useMemo(() => {
    return (
      isValidAmount(purchaseAmount) &&
      isValidAmount(saleAmount) &&
      !!CIITable[purchaseYear] &&
      !!CIITable[saleYear]
    );
  }, [purchaseAmount, saleAmount, purchaseYear, saleYear]);

  const calculateCII = useCallback(() => {
    if (!inputsValid) {
      setResult(null);
      return;
    }
    const pa = Number(purchaseAmount);
    const sa = Number(saleAmount);
    const indexedCost = calculateIndexedCost(pa, purchaseCII, saleCII);
    setResult({
      indexedCost: indexedCost.toString(),
      purchaseAmount: pa.toString(),
      saleAmount: sa.toString(),
      purchaseYear,
      saleYear,
      purchaseCII: purchaseCII.toString(),
      saleCII: saleCII.toString(),
    });
  }, [
    inputsValid,
    purchaseAmount,
    saleAmount,
    purchaseCII,
    saleCII,
    purchaseYear,
    saleYear,
  ]);

  const handleAmountChange = useCallback(
    (setter: (v: number | "") => void, setDisplay: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, "");
        if (rawValue === "") {
          setter("");
          setDisplay("");
          return;
        }
        const sanitizedValue = sanitizeInput(rawValue);
        const numericValue = Number(sanitizedValue);
        if (isNaN(numericValue) || numericValue < 0) {
          return;
        }
        setter(numericValue);
        setDisplay(numericValue.toLocaleString("en-IN"));
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
        calculateCII();
      }
    },
    [calculateCII]
  );

  useEffect(() => {
    if (!inputsValid) return;
    const timer = setTimeout(() => {
      calculateCII();
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [purchaseAmount, saleAmount, purchaseYear, saleYear, inputsValid, calculateCII]);

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <FaChartLine className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">
            Cost Inflation Index Calculator
          </h1>
        </header>
        <p className="text-gray-600 mb-8">
          Calculate your indexed cost of acquisition for capital gains using CII
          values inferred from financial years.
        </p>
        <section className="mb-8">
          <Card>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaPiggyBank className="text-green-500" />
              CII & Amount Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Purchase Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Purchase Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={purchaseAmountDisplay}
                  onChange={handleAmountChange(
                    setPurchaseAmount,
                    setPurchaseAmountDisplay
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={10000}
                  placeholder="10,00,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_AMOUNT.toLocaleString()} - ₹
                  {MAX_AMOUNT.toLocaleString()}
                </p>
              </div>
              {/* Sale Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sale Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={saleAmountDisplay}
                  onChange={handleAmountChange(
                    setSaleAmount,
                    setSaleAmountDisplay
                  )}
                  onKeyDown={handleKeyPress}
                  onFocus={handleInputFocus}
                  onClick={handleInputClick}
                  onPaste={handleInputPaste}
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={10000}
                  placeholder="20,00,000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Range: ₹{MIN_AMOUNT.toLocaleString()} - ₹
                  {MAX_AMOUNT.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Year selectors for CII */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Purchase Financial Year
                </label>
                <select
                  value={purchaseYear}
                  onChange={(e) => setPurchaseYear(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {allYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} (CII: {CIITable[yr]})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Purchase Year CII: {purchaseCII}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Sale Financial Year
                </label>
                <select
                  value={saleYear}
                  onChange={(e) => setSaleYear(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  {allYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} (CII: {CIITable[yr]})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Sale Year CII: {saleCII}
                </p>
              </div>
            </div>

            <button
              onClick={calculateCII}
              disabled={!inputsValid}
              className="w-full mt-6 bg-yellow-400 text-white py-3 px-4 rounded-md hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
            >
              <FaCalculator />
              {inputsValid ? "Calculate Indexed Cost" : "Enter Valid Inputs"}
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
                  Indexed Cost of Acquisition
                </h3>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(Number(result.indexedCost))}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  Purchase Amount
                </h3>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(Number(result.purchaseAmount))}
                </p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200 transform hover:scale-105 transition-transform duration-200">
                <h3 className="text-sm font-medium text-yellow-800 mb-2">
                  Sale Amount
                </h3>
                <p className="text-xl font-bold text-yellow-600">
                  {formatCurrency(Number(result.saleAmount))}
                </p>
              </div>
            </section>
            {/* Summary Section */}
            <section className="grid lg:grid-cols-2 gap-8 mb-8 lg:items-stretch">
              <div>
                <Card className="h-full">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaArrowUp className="text-green-500" />
                    Indexed Cost Calculation Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Purchase Amount:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(Number(purchaseAmount) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sale Amount:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(Number(saleAmount) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Purchase Year CII:
                      </span>
                      <span className="font-semibold">
                        {purchaseCII || "0"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sale Year CII:
                      </span>
                      <span className="font-semibold">{saleCII || "0"}</span>
                    </div>
                  </div>
                </Card>
              </div>
              <div>
                <Card className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaCalculator className="text-purple-500" />
                    Indexed Cost Formula
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm mb-4">
                    <strong>
                      Indexed Cost = Purchase Amount × (Sale CII / Purchase CII)
                    </strong>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Purchase Amount:</span>
                      <span className="font-semibold">
                        ₹{Number(purchaseAmount) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sale CII:</span>
                      <span className="font-semibold">
                        {Number(saleCII) || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Purchase CII:</span>
                      <span className="font-semibold">
                        {Number(purchaseCII) || 0}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-bold">
                        <span>Indexed Cost:</span>
                        <span className="text-green-600">
                          {result
                            ? formatCurrency(Number(result.indexedCost))
                            : "₹0"}
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
                  About Cost Inflation Index
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium mb-3 text-green-600">
                      Why Use CII?
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Adjusts for inflation in capital gains calculation",
                        "Reduces taxable gains",
                        "Reflects true cost of acquisition",
                        "Helps in long-term asset planning",
                        "Required for LTCG tax computation",
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
                      Tips for CII Calculation
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {[
                        "Use correct CII for purchase and sale years",
                        "Refer to official CII tables",
                        "Keep records of purchase and sale dates",
                        "Consult a tax advisor for accuracy",
                        "Update for new financial years",
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
                  Enter your purchase/sale amounts and CII values above to see
                  your indexed cost calculation in real-time.
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
