"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaBalanceScale,
  FaCalculator,
  FaPlus,
  FaTimes,
  FaChartLine,
} from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

interface Goal {
  id: number;
  name: string;
  amount: number;
  years: number;
  priority: "High" | "Medium" | "Low";
}

export default function CompositeFinancialGoalCalculator() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      name: "Emergency Fund",
      amount: 500000,
      years: 2,
      priority: "High",
    },
    {
      id: 2,
      name: "House Down Payment",
      amount: 2000000,
      years: 5,
      priority: "High",
    },
  ]);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(100000);
  const [newGoal, setNewGoal] = useState<Omit<Goal, "id">>({
    name: "",
    amount: 0,
    years: 1,
    priority: "Medium",
  });
  const [result, setResult] = useState<{
    totalMonthlyInvestment: string;
    totalGoalAmount: string;
    totalInvestment: string;
    goalBreakdown: Array<{
      name: string;
      monthlyInvestment: string;
      totalAmount: string;
      priority: string;
    }>;
  } | null>(null);

  const addGoal = () => {
    if (newGoal.name && newGoal.amount > 0) {
      const goal: Goal = {
        ...newGoal,
        id: Date.now(),
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: "", amount: 0, years: 1, priority: "Medium" });
    }
  };

  const removeGoal = (id: number) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const calculateCompositeGoals = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    let totalMonthlyInvestment = 0;
    let totalGoalAmount = 0;
    const goalBreakdown: Array<{
      name: string;
      monthlyInvestment: string;
      totalAmount: string;
      priority: string;
    }> = [];

    // Sort goals by priority and time horizon
    const sortedGoals = [...goals].sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return a.years - b.years;
    });

    let remainingCurrentSavings = currentSavings;

    sortedGoals.forEach((goal) => {
      const totalMonths = goal.years * 12;
      totalGoalAmount += goal.amount;

      // Calculate future value of allocated current savings for this goal
      const allocatedSavings = Math.min(
        remainingCurrentSavings,
        goal.amount * 0.3
      ); // Max 30% of goal from current savings
      remainingCurrentSavings -= allocatedSavings;

      const futureValueOfSavings =
        allocatedSavings * Math.pow(1 + monthlyRate, totalMonths);
      const remainingAmount = Math.max(0, goal.amount - futureValueOfSavings);

      let monthlyInvestment = 0;
      if (remainingAmount > 0) {
        // Calculate required monthly SIP
        const futureValueFactor =
          (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
        monthlyInvestment = remainingAmount / futureValueFactor;
      }

      totalMonthlyInvestment += monthlyInvestment;

      goalBreakdown.push({
        name: goal.name,
        monthlyInvestment: monthlyInvestment.toFixed(0),
        totalAmount: goal.amount.toFixed(0),
        priority: goal.priority,
      });
    });

    const totalInvestment =
      totalMonthlyInvestment *
      (goals.reduce((max, goal) => Math.max(max, goal.years), 0) * 12);

    setResult({
      totalMonthlyInvestment: totalMonthlyInvestment.toFixed(0),
      totalGoalAmount: totalGoalAmount.toFixed(0),
      totalInvestment: totalInvestment.toFixed(0),
      goalBreakdown,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaBalanceScale className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">
            Composite Financial Goal Calculator
          </h1>
        </div>

        <p className="text-gray-600 mb-8">
          Plan multiple financial goals simultaneously and calculate the optimal
          investment strategy.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Goals Management Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Goal */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Add Financial Goal</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Goal Name
                  </label>
                  <Input
                    type="text"
                    value={newGoal.name}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, name: e.target.value })
                    }
                    placeholder="e.g., Dream Car, Vacation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={newGoal.amount || ""}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, amount: Number(e.target.value) })
                    }
                    min={1000}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time Horizon (Years)
                  </label>
                  <Input
                    type="number"
                    value={newGoal.years}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, years: Number(e.target.value) })
                    }
                    min={1}
                    max={30}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Priority
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        priority: e.target.value as "High" | "Medium" | "Low",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addGoal}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaPlus />
                Add Goal
              </button>
            </Card>

            {/* Goals List */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">
                Your Financial Goals
              </h2>
              <div className="divide-y divide-gray-200">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="py-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{goal.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            goal.priority
                          )}`}
                        >
                          {goal.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(goal.amount)} in {goal.years} years
                      </p>
                    </div>
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                {goals.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    No financial goals added yet. Add your goals above to get
                    started.
                  </div>
                )}
              </div>
            </Card>

            {/* Information Section */}
            <Card>
              <h3 className="text-lg font-semibold mb-3">How it works</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • This calculator helps you plan multiple financial goals
                  simultaneously
                </li>
                <li>
                  • Goals are prioritized (High, Medium, Low) and current
                  savings are allocated accordingly
                </li>
                <li>
                  • Higher priority goals get preference in current savings
                  allocation
                </li>
                <li>
                  • The calculation considers different time horizons for each
                  goal
                </li>
                <li>
                  • Regular review and adjustment of goals is recommended based
                  on changing priorities
                </li>
              </ul>
            </Card>
          </div>

          {/* Calculation Section */}
          <div className="space-y-6">
            {/* Input Parameters */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">
                Investment Parameters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Annual Return (%)
                  </label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    min={1}
                    max={30}
                    step={0.5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Savings (₹)
                  </label>
                  <Input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    min={0}
                  />
                </div>

                <button
                  onClick={calculateCompositeGoals}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                  disabled={goals.length === 0}
                >
                  <FaCalculator />
                  Calculate
                </button>
              </div>
            </Card>

            {/* Results */}
            {result ? (
              <>
                <Card>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    Investment Summary
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Monthly Investment
                      </h3>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(Number(result.totalMonthlyInvestment))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Goal Amount
                      </h3>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(Number(result.totalGoalAmount))}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-600 mb-1">
                        Total Investment Amount
                      </h3>
                      <p className="text-xl font-bold text-purple-600">
                        {formatCurrency(Number(result.totalInvestment))}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Goal-wise Breakdown
                  </h3>
                  <div className="space-y-3">
                    {result.goalBreakdown.map((goal, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {goal.name}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                goal.priority
                              )}`}
                            >
                              {goal.priority}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {formatCurrency(Number(goal.monthlyInvestment))}
                            /month
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div className="flex justify-between">
                            <span>
                              Goal Amount:{" "}
                              {formatCurrency(Number(goal.totalAmount))}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <h3 className="text-lg font-semibold mb-3">
                    Planning Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Expected Returns:
                      </span>
                      <span className="font-semibold">
                        {expectedReturn}% p.a.
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Current Savings:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(currentSavings)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Number of Goals:
                      </span>
                      <span className="font-semibold">{goals.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        High Priority Goals:
                      </span>
                      <span className="font-semibold">
                        {goals.filter((g) => g.priority === "High").length}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Total Monthly SIP:
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(
                            Number(result.totalMonthlyInvestment)
                          )}
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
                    Add your financial goals and click &quot;Calculate&quot; to
                    see your comprehensive investment strategy.
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
