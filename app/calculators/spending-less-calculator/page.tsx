"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaWallet,
  FaCalculator,
  FaPlus,
  FaTimes,
  FaShoppingCart,
  FaCoffee,
  FaCar,
  FaHome,
} from "react-icons/fa";

interface ExpenseItem {
  id: number;
  name: string;
  currentAmount: number;
  reducedAmount: number;
  frequency: "Daily" | "Weekly" | "Monthly" | "Yearly";
  category:
    | "Food & Dining"
    | "Entertainment"
    | "Transportation"
    | "Shopping"
    | "Utilities"
    | "Other";
}

export default function SpendingLessCalculator() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 1,
      name: "Coffee",
      currentAmount: 150,
      reducedAmount: 100,
      frequency: "Daily",
      category: "Food & Dining",
    },
    {
      id: 2,
      name: "Movie Tickets",
      currentAmount: 800,
      reducedAmount: 400,
      frequency: "Monthly",
      category: "Entertainment",
    },
    {
      id: 3,
      name: "Fuel",
      currentAmount: 5000,
      reducedAmount: 4000,
      frequency: "Monthly",
      category: "Transportation",
    },
  ]);

  const [investmentReturn, setInvestmentReturn] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(10);

  const [newExpense, setNewExpense] = useState<Omit<ExpenseItem, "id">>({
    name: "",
    currentAmount: 0,
    reducedAmount: 0,
    frequency: "Monthly",
    category: "Other",
  });

  const [result, setResult] = useState<{
    dailySavings: string;
    monthlySavings: string;
    annualSavings: string;
    futureValue: string;
    expenseBreakdown: Array<{
      name: string;
      savings: string;
      futureValue: string;
      category: string;
    }>;
  } | null>(null);

  const addExpense = () => {
    if (newExpense.name && newExpense.currentAmount > 0) {
      setExpenses([...expenses, { ...newExpense, id: Date.now() }]);
      setNewExpense({
        name: "",
        currentAmount: 0,
        reducedAmount: 0,
        frequency: "Monthly",
        category: "Other",
      });
    }
  };

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const updateExpense = (
    id: number,
    field: keyof ExpenseItem,
    value: string | number
  ) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  const calculateSavings = () => {
    let totalAnnualSavings = 0;
    const expenseBreakdown: Array<{
      name: string;
      savings: string;
      futureValue: string;
      category: string;
    }> = [];

    expenses.forEach((expense) => {
      const savings = expense.currentAmount - expense.reducedAmount;
      if (savings <= 0) return;

      // Convert to annual savings
      let annualSavings = 0;
      switch (expense.frequency) {
        case "Daily":
          annualSavings = savings * 365;
          break;
        case "Weekly":
          annualSavings = savings * 52;
          break;
        case "Monthly":
          annualSavings = savings * 12;
          break;
        case "Yearly":
          annualSavings = savings;
          break;
      }

      totalAnnualSavings += annualSavings;

      // Calculate future value if invested
      const monthlyInvestment = annualSavings / 12;
      const monthlyRate = investmentReturn / 100 / 12;
      const totalMonths = timePeriod * 12;

      let futureValue = 0;
      if (monthlyRate === 0) {
        futureValue = monthlyInvestment * totalMonths;
      } else {
        futureValue =
          monthlyInvestment *
          ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
      }

      expenseBreakdown.push({
        name: expense.name,
        savings: annualSavings.toFixed(0),
        futureValue: futureValue.toFixed(0),
        category: expense.category,
      });
    });

    // Calculate total future value
    const totalMonthlyInvestment = totalAnnualSavings / 12;
    const monthlyRate = investmentReturn / 100 / 12;
    const totalMonths = timePeriod * 12;

    let totalFutureValue = 0;
    if (monthlyRate === 0) {
      totalFutureValue = totalMonthlyInvestment * totalMonths;
    } else {
      totalFutureValue =
        totalMonthlyInvestment *
        ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    }

    setResult({
      dailySavings: (totalAnnualSavings / 365).toFixed(0),
      monthlySavings: (totalAnnualSavings / 12).toFixed(0),
      annualSavings: totalAnnualSavings.toFixed(0),
      futureValue: totalFutureValue.toFixed(0),
      expenseBreakdown,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLakhs = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} L`;
    } else {
      return formatCurrency(amount);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Food & Dining":
        return <FaCoffee className="text-orange-500" />;
      case "Entertainment":
        return <FaShoppingCart className="text-purple-500" />;
      case "Transportation":
        return <FaCar className="text-blue-500" />;
      case "Utilities":
        return <FaHome className="text-green-500" />;
      default:
        return <FaWallet className="text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Food & Dining": "bg-orange-50 border-orange-200",
      Entertainment: "bg-purple-50 border-purple-200",
      Transportation: "bg-blue-50 border-blue-200",
      Shopping: "bg-pink-50 border-pink-200",
      Utilities: "bg-green-50 border-green-200",
      Other: "bg-gray-50 border-gray-200",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-50 border-gray-200"
    );
  };

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaWallet className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Spending Less Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Discover how much you could save and earn by reducing your expenses
          and investing the difference.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Expenses Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add New Expense */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Add Expense to Reduce
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expense Name
                    </label>
                    <input
                      type="text"
                      value={newExpense.name}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="e.g., Coffee, Uber rides"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          category: e.target.value as ExpenseItem["category"],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newExpense.currentAmount || ""}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          currentAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reduced Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={newExpense.reducedAmount || ""}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          reducedAmount: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      min="0"
                      max={newExpense.currentAmount}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Frequency
                    </label>
                    <select
                      value={newExpense.frequency}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          frequency: e.target.value as ExpenseItem["frequency"],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={addExpense}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <FaPlus />
                  Add Expense
                </button>
              </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold p-6 border-b border-gray-200">
                Your Expense Reductions
              </h2>
              <div className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className={`p-4 ${getCategoryColor(expense.category)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(expense.category)}
                        <div>
                          <h3 className="font-medium">{expense.name}</h3>
                          <p className="text-xs text-gray-500">
                            {expense.category} • {expense.frequency}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Current
                        </label>
                        <input
                          type="number"
                          value={expense.currentAmount}
                          onChange={(e) =>
                            updateExpense(
                              expense.id,
                              "currentAmount",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Reduced
                        </label>
                        <input
                          type="number"
                          value={expense.reducedAmount}
                          onChange={(e) =>
                            updateExpense(
                              expense.id,
                              "reducedAmount",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Savings
                        </label>
                        <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm font-medium">
                          ₹
                          {(
                            expense.currentAmount - expense.reducedAmount
                          ).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No expenses added yet. Add some expenses you want to reduce
                    above.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Calculation Section */}
          <div className="space-y-6">
            {/* Investment Parameters */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Investment Parameters
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expected Investment Return (%)
                  </label>
                  <input
                    type="number"
                    value={investmentReturn}
                    onChange={(e) =>
                      setInvestmentReturn(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                    max="30"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Investment Time Period (Years)
                  </label>
                  <input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="1"
                    max="40"
                  />
                </div>

                <button
                  onClick={calculateSavings}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                  disabled={expenses.length === 0}
                >
                  <FaCalculator />
                  Calculate Savings
                </button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Savings Impact</h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600">
                      Daily Savings
                    </h3>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(Number(result.dailySavings))}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600">
                      Monthly Savings
                    </h3>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(Number(result.monthlySavings))}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600">
                      Annual Savings
                    </h3>
                    <p className="text-xl font-bold text-purple-600">
                      {formatLakhs(Number(result.annualSavings))}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-300">
                    <h3 className="text-sm font-medium text-gray-600">
                      Future Value ({timePeriod} years)
                    </h3>
                    <p className="text-2xl font-bold text-yellow-600">
                      {formatLakhs(Number(result.futureValue))}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      If invested at {investmentReturn}% annual return
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">
                      Expense-wise Breakdown
                    </h3>
                    <div className="space-y-2">
                      {result.expenseBreakdown.map((expense, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="font-medium">{expense.name}</span>
                          <div className="text-right">
                            <div className="text-green-600">
                              ₹{Number(expense.savings).toLocaleString()}/year
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatLakhs(Number(expense.futureValue))} future
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!result && (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                Add some expenses and click calculate to see your potential
                savings
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Smart Spending Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">
                Common Areas to Reduce Spending
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Daily coffee and dining out expenses</li>
                <li>• Unused subscriptions and memberships</li>
                <li>• Impulse shopping and non-essential purchases</li>
                <li>• Premium brands when generics work equally well</li>
                <li>• Transportation costs (carpooling, public transport)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Investment Strategy</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Automate investments to avoid spending saved money</li>
                <li>• Start with safe options like SIPs in index funds</li>
                <li>• Gradually increase investment amounts</li>
                <li>• Track your progress monthly</li>
                <li>• Reinvest returns for compound growth</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
