"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function WealthCreationGoal() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(0);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [futureValue, setFutureValue] = useState<number | null>(null);

  const calculate = () => {
    const n = years * 12;
    const r = rate / 12 / 100;
    const fv = monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    setFutureValue(fv);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/goals/wealth-creation.png" alt="Wealth Creation" width={64} height={64} className="w-16 h-16 object-cover rounded" />
          <h1 className="text-3xl font-bold">Wealth Creation Goal Calculator</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Estimate the future value of your monthly investments over a period of time.
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Monthly Investment (₹):</label>
            <input type="number" value={monthlyInvestment} onChange={e => setMonthlyInvestment(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Investment Duration (Years):</label>
            <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Expected Return Rate (% p.a.):</label>
            <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <button onClick={calculate} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold">Calculate</button>
          {futureValue !== null && (
            <div className="mt-6 text-lg font-semibold text-center bg-blue-50 p-4 rounded">
              Future Value: ₹{futureValue.toLocaleString()}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
