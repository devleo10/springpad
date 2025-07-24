"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaWallet, FaCalculator } from "react-icons/fa";

export default function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [loanTenure, setLoanTenure] = useState<number>(20);
  const [result, setResult] = useState<{
    emiAmount: string;
    totalInterest: string;
    totalAmount: string;
    interestPercentage: string;
  } | null>(null);

  const calculateEmi = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTenure * 12;

    // EMI formula: EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
    let emiAmount: number;

    if (monthlyRate === 0) {
      emiAmount = principal / totalMonths;
    } else {
      const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
      emiAmount =
        (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);
    }

    const totalAmount = emiAmount * totalMonths;
    const totalInterest = totalAmount - principal;
    const interestPercentage = (totalInterest / principal) * 100;

    setResult({
      emiAmount: emiAmount.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      totalAmount: totalAmount.toFixed(0),
      interestPercentage: interestPercentage.toFixed(1),
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyLakhs = (amount: number) => {
    const lakhs = amount / 100000;
    if (lakhs >= 100) {
      const crores = lakhs / 100;
      return `₹${crores.toFixed(2)} Cr`;
    }
    return `₹${lakhs.toFixed(1)} L`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-800">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaWallet className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">EMI Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate your Equated Monthly Installment (EMI) for home loans,
          personal loans, car loans, and more.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="50000"
                  step="50000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrencyLakhs(loanAmount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="5"
                  max="20"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Loan Tenure (Years)
                </label>
                <input
                  type="number"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  min="1"
                  max="30"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {loanTenure * 12} months
                </p>
              </div>

              <button
                onClick={calculateEmi}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate EMI
              </button>
            </div>

            {/* Loan Type Quick Selectors */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Quick Loan Types</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setLoanAmount(2500000);
                    setInterestRate(8.5);
                    setLoanTenure(20);
                  }}
                  className="p-2 text-xs bg-blue-100 hover:bg-blue-200 rounded transition-colors"
                >
                  Home Loan
                  <br />
                  <span className="text-gray-600">25L @ 8.5% - 20Y</span>
                </button>
                <button
                  onClick={() => {
                    setLoanAmount(800000);
                    setInterestRate(9.5);
                    setLoanTenure(7);
                  }}
                  className="p-2 text-xs bg-green-100 hover:bg-green-200 rounded transition-colors"
                >
                  Car Loan
                  <br />
                  <span className="text-gray-600">8L @ 9.5% - 7Y</span>
                </button>
                <button
                  onClick={() => {
                    setLoanAmount(500000);
                    setInterestRate(12);
                    setLoanTenure(5);
                  }}
                  className="p-2 text-xs bg-purple-100 hover:bg-purple-200 rounded transition-colors"
                >
                  Personal Loan
                  <br />
                  <span className="text-gray-600">5L @ 12% - 5Y</span>
                </button>
                <button
                  onClick={() => {
                    setLoanAmount(300000);
                    setInterestRate(11);
                    setLoanTenure(3);
                  }}
                  className="p-2 text-xs bg-orange-100 hover:bg-orange-200 rounded transition-colors"
                >
                  Education Loan
                  <br />
                  <span className="text-gray-600">3L @ 11% - 3Y</span>
                </button>
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">EMI Breakdown</h2>

            {result ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                  <h3 className="text-sm font-medium text-gray-600">
                    Monthly EMI
                  </h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(Number(result.emiAmount))}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Principal Amount
                  </h3>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrencyLakhs(loanAmount)}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Interest
                  </h3>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrencyLakhs(Number(result.totalInterest))}
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.interestPercentage}% of principal
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600">
                    Total Amount Payable
                  </h3>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrencyLakhs(Number(result.totalAmount))}
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">
                    Payment Summary
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Monthly EMI:</span>
                      <span className="font-medium">
                        {formatCurrency(Number(result.emiAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Months:</span>
                      <span className="font-medium">{loanTenure * 12}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-medium">{interestRate}% p.a.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Enter your loan details and click calculate to see EMI breakdown
              </p>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">EMI Calculation Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • EMI = [P × R × (1+R)^N] / [(1+R)^N-1], where P=Principal,
              R=Monthly Rate, N=Tenure in months
            </li>
            <li>
              • Lower interest rates and longer tenure reduce EMI but increase
              total interest
            </li>
            <li>
              • Prepayments can significantly reduce total interest and loan
              tenure
            </li>
            <li>
              • Consider your monthly income - EMI should not exceed 40-50% of
              your income
            </li>
            <li>
              • Compare different lenders for better interest rates and terms
            </li>
            <li>• Factor in processing fees, insurance, and other charges</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
