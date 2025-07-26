"use client";
import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";

export default function ChildWeddingGoal() {
  const [currentCost, setCurrentCost] = useState(0);
  const [years, setYears] = useState(20);
  const [inflation, setInflation] = useState(7);
  const [futureCost, setFutureCost] = useState<number | null>(null);

  const calculate = () => {
    const fv = currentCost * Math.pow(1 + inflation / 100, years);
    setFutureCost(fv);
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <Image src="/goals/child-wedding.png" alt="Child&apos;s Wedding" width={64} height={64} className="w-16 h-16 object-cover rounded" />
          <h1 className="text-3xl font-bold">Child&apos;s Wedding Goal Calculator</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Estimate the future cost of your child&apos;s wedding by factoring in inflation and your time horizon.
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Current Wedding Cost (₹):</label>
            <input type="number" value={currentCost} onChange={e => setCurrentCost(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Years Until Wedding:</label>
            <input type="number" value={years} onChange={e => setYears(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Expected Inflation Rate (%):</label>
            <input type="number" value={inflation} onChange={e => setInflation(Number(e.target.value))} className="border rounded p-2 w-full" />
          </div>
          <button onClick={calculate} className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold">Calculate</button>
          {futureCost !== null && (
            <div className="mt-6 text-lg font-semibold text-center bg-blue-50 p-4 rounded">
              Future Wedding Cost: ₹{futureCost.toLocaleString()}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
