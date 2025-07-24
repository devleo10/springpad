"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaChild, FaCalculator, FaGraduationCap } from "react-icons/fa";

interface Child {
  id: number;
  name: string;
  currentAge: number;
  educationStage:
    | "Primary"
    | "Secondary"
    | "Higher Secondary"
    | "Undergraduate"
    | "Postgraduate";
  estimatedCost: number;
}

export default function ChildrenEducationPlanner() {
  const [children, setChildren] = useState<Child[]>([
    {
      id: 1,
      name: "Child 1",
      currentAge: 5,
      educationStage: "Undergraduate",
      estimatedCost: 1000000,
    },
  ]);
  const [educationInflation, setEducationInflation] = useState<number>(8);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(50000);
  const [newChild, setNewChild] = useState<Omit<Child, "id">>({
    name: "",
    currentAge: 1,
    educationStage: "Undergraduate",
    estimatedCost: 1000000,
  });
  const [result, setResult] = useState<{
    totalMonthlyInvestment: string;
    totalFutureCost: string;
    totalInvestment: string;
    childrenBreakdown: Array<{
      name: string;
      futureCost: string;
      monthlyInvestment: string;
      yearsToEducation: number;
      stage: string;
    }>;
  } | null>(null);

  const educationAges = {
    Primary: 6,
    Secondary: 11,
    "Higher Secondary": 16,
    Undergraduate: 18,
    Postgraduate: 22,
  };

  const addChild = () => {
    if (newChild.name) {
      const child: Child = {
        ...newChild,
        id: Date.now(),
      };
      setChildren([...children, child]);
      setNewChild({
        name: "",
        currentAge: 1,
        educationStage: "Undergraduate",
        estimatedCost: 1000000,
      });
    }
  };

  const removeChild = (id: number) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  const calculateEducationPlan = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    let totalMonthlyInvestment = 0;
    let totalFutureCost = 0;
    const childrenBreakdown: Array<{
      name: string;
      futureCost: string;
      monthlyInvestment: string;
      yearsToEducation: number;
      stage: string;
    }> = [];

    // Sort children by years to education (earliest first)
    const sortedChildren = [...children].sort((a, b) => {
      const yearsToEducationA = Math.max(
        0,
        educationAges[a.educationStage] - a.currentAge
      );
      const yearsToEducationB = Math.max(
        0,
        educationAges[b.educationStage] - b.currentAge
      );
      return yearsToEducationA - yearsToEducationB;
    });

    let remainingCurrentSavings = currentSavings;

    sortedChildren.forEach((child) => {
      const yearsToEducation = Math.max(
        0,
        educationAges[child.educationStage] - child.currentAge
      );

      // If education is due now or in the past, skip investment calculation
      if (yearsToEducation === 0) {
        childrenBreakdown.push({
          name: child.name,
          futureCost: child.estimatedCost.toFixed(0),
          monthlyInvestment: "0",
          yearsToEducation: 0,
          stage: child.educationStage,
        });
        return;
      }

      // Calculate future cost considering education inflation
      const futureCost =
        child.estimatedCost *
        Math.pow(1 + educationInflation / 100, yearsToEducation);
      totalFutureCost += futureCost;

      // Allocate portion of current savings to this child
      const allocatedSavings = Math.min(
        remainingCurrentSavings,
        futureCost * 0.4
      ); // Max 40% of future cost from current savings
      remainingCurrentSavings -= allocatedSavings;

      // Future value of allocated current savings
      const totalMonths = yearsToEducation * 12;
      const futureValueOfSavings =
        allocatedSavings * Math.pow(1 + monthlyRate, totalMonths);
      const remainingAmount = Math.max(0, futureCost - futureValueOfSavings);

      let monthlyInvestment = 0;
      if (remainingAmount > 0) {
        // Calculate required monthly SIP
        const futureValueFactor =
          (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
        monthlyInvestment = remainingAmount / futureValueFactor;
      }

      totalMonthlyInvestment += monthlyInvestment;

      childrenBreakdown.push({
        name: child.name,
        futureCost: futureCost.toFixed(0),
        monthlyInvestment: monthlyInvestment.toFixed(0),
        yearsToEducation: yearsToEducation,
        stage: child.educationStage,
      });
    });

    const maxYears = Math.max(
      ...sortedChildren.map((child) =>
        Math.max(0, educationAges[child.educationStage] - child.currentAge)
      )
    );
    const totalInvestment = totalMonthlyInvestment * maxYears * 12;

    setResult({
      totalMonthlyInvestment: totalMonthlyInvestment.toFixed(0),
      totalFutureCost: totalFutureCost.toFixed(0),
      totalInvestment: totalInvestment.toFixed(0),
      childrenBreakdown,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-800 pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaChild className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Children Education Planner</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan and save for your children&apos;s education expenses with
          inflation-adjusted calculations.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Children Management Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Child */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaGraduationCap className="text-blue-500" />
                Add Child&apos;s Education Plan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Child&apos;s Name
                  </label>
                  <input
                    type="text"
                    value={newChild.name}
                    onChange={(e) =>
                      setNewChild({ ...newChild, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="e.g., Rahul, Priya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={newChild.currentAge}
                    onChange={(e) =>
                      setNewChild({
                        ...newChild,
                        currentAge: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                    max="25"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Education Stage
                  </label>
                  <select
                    value={newChild.educationStage}
                    onChange={(e) =>
                      setNewChild({
                        ...newChild,
                        educationStage: e.target
                          .value as Child["educationStage"],
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="Primary">Primary School (Age 6)</option>
                    <option value="Secondary">Secondary School (Age 11)</option>
                    <option value="Higher Secondary">
                      Higher Secondary (Age 16)
                    </option>
                    <option value="Undergraduate">
                      Undergraduate (Age 18)
                    </option>
                    <option value="Postgraduate">Postgraduate (Age 22)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Cost Today (₹)
                  </label>
                  <input
                    type="number"
                    value={newChild.estimatedCost || ""}
                    onChange={(e) =>
                      setNewChild({
                        ...newChild,
                        estimatedCost: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="10000"
                    step="10000"
                  />
                </div>
              </div>
              <button
                onClick={addChild}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaChild />
                Add Child
              </button>
            </div>

            {/* Children List */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold p-6 border-b border-gray-200">
                Education Plans
              </h2>
              <div className="divide-y divide-gray-200">
                {children.map((child) => {
                  const yearsToEducation = Math.max(
                    0,
                    educationAges[child.educationStage] - child.currentAge
                  );
                  return (
                    <div
                      key={child.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{child.name}</h3>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                            {child.educationStage}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Age {child.currentAge} •{" "}
                          {formatCurrency(child.estimatedCost)} cost today •
                          {yearsToEducation > 0
                            ? ` ${yearsToEducation} years to go`
                            : " Due now"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeChild(child.id)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                {children.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No children added yet. Add your children&apos;s education
                    plans above.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calculation Section */}
          <div className="space-y-6">
            {/* Input Parameters */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Planning Parameters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Education Inflation Rate (%)
                  </label>
                  <input
                    type="number"
                    value={educationInflation}
                    onChange={(e) =>
                      setEducationInflation(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="3"
                    max="15"
                    step="0.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Typically 6-10% for education in India
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Investment Return (%)
                  </label>
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                    max="30"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Education Savings (₹)
                  </label>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                  />
                </div>

                <button
                  onClick={calculateEducationPlan}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                  disabled={children.length === 0}
                >
                  <FaCalculator />
                  Calculate Plan
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Investment Plan</h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Monthly Investment
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(Number(result.totalMonthlyInvestment))}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600">
                      Total Future Education Cost
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(Number(result.totalFutureCost))}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Child-wise Breakdown
                    </h3>
                    <div className="space-y-2">
                      {result.childrenBreakdown.map((child, index) => (
                        <div key={index} className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{child.name}</span>
                            <span className="text-gray-600">
                              {formatCurrency(Number(child.monthlyInvestment))}
                              /month
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {child.stage} • Future cost:{" "}
                            {formatCurrency(Number(child.futureCost))}
                            {child.yearsToEducation > 0 &&
                              ` • ${child.yearsToEducation} years`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            Important Considerations
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • Education costs have been rising faster than general inflation
              (6-10% annually in India)
            </li>
            <li>
              • Start early to benefit from compounding and reduce monthly
              investment burden
            </li>
            <li>
              • Consider dedicated education savings schemes like Sukanya
              Samriddhi Yojana for daughters
            </li>
            <li>
              • Review and adjust the plan annually based on actual education
              cost trends
            </li>
            <li>
              • Factor in additional costs like accommodation, books, and living
              expenses
            </li>
            <li>
              • Consider education insurance for protection against unforeseen
              circumstances
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
