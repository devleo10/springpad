"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function EmergencyGoal() {
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [months, setMonths] = useState(6);
  const [totalFund, setTotalFund] = useState<number | null>(null);

  const calculate = () => {
    setTotalFund(monthlyExpense * months);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/goals/emergency.png" alt="Emergency Fund" width={64} height={64} className="w-16 h-16 object-cover rounded" />
          <h1 className="text-3xl font-bold">Emergency Fund Calculator</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Calculate the emergency fund you need to cover your expenses for a set number of months.
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Monthly Expense (₹):</label>
            <input type="number" value={monthlyExpense} onChange={e => setMonthlyExpense(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Number of Months to Cover:</label>
            <input type="number" value={months} onChange={e => setMonths(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <button onClick={calculate} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold">Calculate</button>
          {totalFund !== null && (
            <div className="mt-6 text-lg font-semibold text-center bg-blue-50 p-4 rounded">
              Emergency Fund Needed: ₹{totalFund.toLocaleString()}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
