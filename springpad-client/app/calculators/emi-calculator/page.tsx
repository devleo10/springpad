"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaWallet, FaCalculator, FaChartLine } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

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
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaWallet className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">EMI Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate your Equated Monthly Installment (EMI) for home loans,
          personal loans, car loans, and more.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Input Section */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Loan Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min={50000}
                    step={50000}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrencyLakhs(loanAmount)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Annual Interest Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min={5}
                    max={20}
                    step={0.1}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Loan Tenure (Years)
                  </label>
                  <Input
                    type="number"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    min={1}
                    max={30}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {loanTenure * 12} months
                  </p>
                </div>
              </div>

              <button
                onClick={calculateEmi}
                className="w-full mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
              >
                <FaCalculator />
                Calculate EMI
              </button>
            </Card>

            {/* Loan Type Quick Selectors */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">Quick Loan Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => {
                    setLoanAmount(2500000);
                    setInterestRate(8.5);
                    setLoanTenure(20);
                  }}
                  className="p-3 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                >
                  <div className="font-medium text-blue-700">Home Loan</div>
                  <div className="text-xs text-blue-600 mt-1">
                    25L @ 8.5% - 20Y
                  </div>
                </button>
                <button
                  onClick={() => {
                    setLoanAmount(800000);
                    setInterestRate(9.5);
                    setLoanTenure(7);
                  }}
                  className="p-3 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                >
                  <div className="font-medium text-green-700">Car Loan</div>
                  <div className="text-xs text-green-600 mt-1">
                    8L @ 9.5% - 7Y
                  </div>
                </button>
                <button
                  onClick={() => {
                    setLoanAmount(500000);
                    setInterestRate(12);
                    setLoanTenure(5);
                  }}
                  className="p-3 text-sm bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
                >
                  <div className="font-medium text-purple-700">
                    Personal Loan
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    5L @ 12% - 5Y
                  </div>
                </button>
                <button
                  onClick={() => {
                    setLoanAmount(300000);
                    setInterestRate(11);
                    setLoanTenure(3);
                  }}
                  className="p-3 text-sm bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
                >
                  <div className="font-medium text-orange-700">
                    Education Loan
                  </div>
                  <div className="text-xs text-orange-600 mt-1">
                    3L @ 11% - 3Y
                  </div>
                </button>
              </div>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">
                EMI Calculation Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • EMI = [P × R × (1+R)^N] / [(1+R)^N-1], where P=Principal,
                  R=Monthly Rate, N=Tenure in months
                </li>
                <li>
                  • Lower interest rates and longer tenure reduce EMI but
                  increase total interest
                </li>
                <li>
                  • Prepayments can significantly reduce total interest and loan
                  tenure
                </li>
                <li>
                  • Consider your monthly income - EMI should not exceed 40-50%
                  of your income
                </li>
                <li>
                  • Compare different lenders for better interest rates and
                  terms
                </li>
                <li>
                  • Factor in processing fees, insurance, and other charges
                </li>
              </ul>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result ? (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    EMI Breakdown
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-l-4 border-yellow-500">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Monthly EMI
                      </h3>
                      <p className="text-2xl font-bold text-yellow-600">
                        {formatCurrency(Number(result.emiAmount))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Principal Amount
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrencyLakhs(loanAmount)}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Interest
                      </h3>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrencyLakhs(Number(result.totalInterest))}
                      </p>
                      <p className="text-sm text-gray-500">
                        {result.interestPercentage}% of principal
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Amount Payable
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrencyLakhs(Number(result.totalAmount))}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Payment Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly EMI:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(Number(result.emiAmount))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Months:
                      </span>
                      <span className="font-semibold">{loanTenure * 12}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Interest Rate:
                      </span>
                      <span className="font-semibold">
                        {interestRate}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Loan Amount:
                      </span>
                      <span className="font-semibold">
                        {formatCurrencyLakhs(loanAmount)}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Payable:
                        </span>
                        <span className="font-bold text-purple-600">
                          {formatCurrencyLakhs(Number(result.totalAmount))}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Principal Amount:
                      </span>
                      <span className="font-semibold text-blue-600">
                        {formatCurrencyLakhs(loanAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Interest Cost:
                      </span>
                      <span className="font-semibold text-red-600">
                        {formatCurrencyLakhs(Number(result.totalInterest))}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Cost:
                        </span>
                        <span className="font-bold text-purple-600">
                          {formatCurrencyLakhs(Number(result.totalAmount))}
                        </span>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-orange-700">
                          Interest as % of Principal:
                        </span>
                        <span className="font-bold text-orange-700">
                          {result.interestPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-8 text-gray-500">
                  <FaChartLine className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p>
                    Enter your loan details and click &quot;Calculate EMI&quot;
                    to see your payment breakdown.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
