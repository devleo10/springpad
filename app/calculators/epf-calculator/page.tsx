"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaCalculator,
  FaChartLine,
  FaBuilding,
  FaUserTie,
} from "react-icons/fa";

interface EPFData {
  year: number;
  salary: number;
  employeeContribution: number;
  employerContribution: number;
  pensionContribution: number;
  interest: number;
  totalBalance: number;
}

export default function EPFCalculator() {
  const [currentSalary, setCurrentSalary] = useState<number>(600000);
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(58);
  const [salaryIncrement, setSalaryIncrement] = useState<number>(8);
  const [employeeContribution, setEmployeeContribution] = useState<number>(12);
  const [currentEPFBalance, setCurrentEPFBalance] = useState<number>(0);
  const [epfInterestRate, setEpfInterestRate] = useState<number>(8.15);
  const pensionInterestRate = 8.15; // EPS interest rate (same as EPF currently)
  const [result, setResult] = useState<{
    epfMaturityAmount: string;
    pensionCorpus: string;
    totalEmployeeContribution: string;
    totalEmployerContribution: string;
    totalInterest: string;
    monthlyPension: string;
    yearlyBreakdown: EPFData[];
  } | null>(null);

  const calculateEPF = () => {
    const workingYears = retirementAge - currentAge;
    let salary = currentSalary;
    let epfBalance = currentEPFBalance;
    let pensionBalance = 0;
    let totalEmployeeContrib = 0;
    let totalEmployerContrib = 0;
    const yearlyBreakdown: EPFData[] = [];

    const epfRate = epfInterestRate / 100;
    const pensionRate = pensionInterestRate / 100;

    for (let year = 1; year <= workingYears; year++) {
      // Calculate contributions (12% employee + 3.67% employer EPF + 8.33% employer pension)
      const basicSalary = Math.min(salary, 1800000); // EPF ceiling of 15,000 per month = 1.8L per year
      const employeeContrib = (basicSalary * employeeContribution) / 100;
      const employerEPFContrib = (basicSalary * 3.67) / 100;
      const employerPensionContrib = (basicSalary * 8.33) / 100;

      // Calculate interest on previous balance
      const epfInterest = epfBalance * epfRate;
      const pensionInterest = pensionBalance * pensionRate;

      // Update balances
      epfBalance += employeeContrib + employerEPFContrib + epfInterest;
      pensionBalance += employerPensionContrib + pensionInterest;

      totalEmployeeContrib += employeeContrib;
      totalEmployerContrib += employerEPFContrib + employerPensionContrib;

      yearlyBreakdown.push({
        year: currentAge + year,
        salary: basicSalary,
        employeeContribution: employeeContrib,
        employerContribution: employerEPFContrib,
        pensionContribution: employerPensionContrib,
        interest: epfInterest + pensionInterest,
        totalBalance: epfBalance + pensionBalance,
      });

      // Increase salary for next year
      salary = salary * (1 + salaryIncrement / 100);
    }

    const totalInterest =
      epfBalance +
      pensionBalance -
      totalEmployeeContrib -
      totalEmployerContrib -
      currentEPFBalance;

    // Calculate monthly pension (approximate)
    // Monthly pension = (Pensionable salary × Pensionable service) / 70
    const averageSalary =
      currentSalary * Math.pow(1 + salaryIncrement / 100, workingYears / 2);
    const monthlyPension =
      (Math.min(averageSalary, 1800000) * workingYears) / (70 * 12);

    setResult({
      epfMaturityAmount: epfBalance.toFixed(0),
      pensionCorpus: pensionBalance.toFixed(0),
      totalEmployeeContribution: totalEmployeeContrib.toFixed(0),
      totalEmployerContribution: totalEmployerContrib.toFixed(0),
      totalInterest: totalInterest.toFixed(0),
      monthlyPension: monthlyPension.toFixed(0),
      yearlyBreakdown,
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

  return (
    <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaCalculator className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">EPF Calculator</h1>
        </div>

        <p className="text-gray-600 mb-8">
          Calculate your Employee Provident Fund maturity amount and estimate
          your pension benefits.
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaBuilding className="text-blue-500" />
                Employment Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Annual Salary (₹)
                  </label>
                  <input
                    type="number"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                    step="10000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Basic salary for EPF calculation
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="18"
                    max="58"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min={currentAge + 1}
                    max="65"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Normal retirement age is 58
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Annual Salary Increment (%)
                  </label>
                  <input
                    type="number"
                    value={salaryIncrement}
                    onChange={(e) => setSalaryIncrement(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                    max="20"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Employee Contribution (%)
                  </label>
                  <input
                    type="number"
                    value={employeeContribution}
                    onChange={(e) =>
                      setEmployeeContribution(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="12"
                    max="12"
                    step="0.1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Fixed at 12% of basic salary
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current EPF Balance (₹)
                  </label>
                  <input
                    type="number"
                    value={currentEPFBalance}
                    onChange={(e) =>
                      setCurrentEPFBalance(Number(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    EPF Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    value={epfInterestRate}
                    onChange={(e) => setEpfInterestRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    min="5"
                    max="12"
                    step="0.05"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Current rate: 8.15% (FY 2023-24)
                  </p>
                </div>

                <button
                  onClick={calculateEPF}
                  className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaCalculator />
                  Calculate EPF Benefits
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {result && (
              <>
                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                    <h3 className="text-sm font-medium text-green-800 mb-1">
                      EPF Maturity Amount
                    </h3>
                    <p className="text-2xl font-bold text-green-600">
                      {formatLakhs(Number(result.epfMaturityAmount))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-800 mb-1">
                      Pension Fund Corpus
                    </h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatLakhs(Number(result.pensionCorpus))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-sm font-medium text-purple-800 mb-1">
                      Total Interest Earned
                    </h3>
                    <p className="text-xl font-bold text-purple-600">
                      {formatLakhs(Number(result.totalInterest))}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-sm font-medium text-orange-800 mb-1">
                      Estimated Monthly Pension
                    </h3>
                    <p className="text-xl font-bold text-orange-600">
                      {formatCurrency(Number(result.monthlyPension))}
                    </p>
                  </div>
                </div>

                {/* Contribution Breakdown */}
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                    Contribution Summary
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-yellow-700">
                        Your Total Contribution
                      </p>
                      <p className="text-xl font-bold text-yellow-800">
                        {formatLakhs(Number(result.totalEmployeeContribution))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700">
                        Employer Total Contribution
                      </p>
                      <p className="text-xl font-bold text-yellow-800">
                        {formatLakhs(Number(result.totalEmployerContribution))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-yellow-700">Total Corpus</p>
                      <p className="text-xl font-bold text-yellow-800">
                        {formatLakhs(
                          Number(result.epfMaturityAmount) +
                            Number(result.pensionCorpus)
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Yearly Breakdown Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FaChartLine className="text-blue-500" />
                      Year-wise EPF Growth
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Age
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Salary
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Employee
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Employer EPF
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Pension
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Interest
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {result.yearlyBreakdown.slice(0, 10).map((data) => (
                          <tr key={data.year} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium">
                              {data.year}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatCurrency(data.salary)}
                            </td>
                            <td className="px-4 py-3 text-sm text-blue-600">
                              {formatCurrency(data.employeeContribution)}
                            </td>
                            <td className="px-4 py-3 text-sm text-green-600">
                              {formatCurrency(data.employerContribution)}
                            </td>
                            <td className="px-4 py-3 text-sm text-purple-600">
                              {formatCurrency(data.pensionContribution)}
                            </td>
                            <td className="px-4 py-3 text-sm text-orange-600">
                              {formatCurrency(data.interest)}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium">
                              {formatCurrency(data.totalBalance)}
                            </td>
                          </tr>
                        ))}
                        {result.yearlyBreakdown.length > 10 && (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-3 text-center text-sm text-gray-500"
                            >
                              ... and {result.yearlyBreakdown.length - 10} more
                              years
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* EPF vs EPS Breakdown */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">
                    EPF vs EPS Breakdown
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                        <FaUserTie className="text-blue-500" />
                        Employee Provident Fund (EPF)
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Your contribution: 12% of basic salary</li>
                        <li>• Employer contribution: 3.67% of basic salary</li>
                        <li>• Lump sum withdrawal at retirement</li>
                        <li>• Tax-free maturity amount</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-green-700 mb-2">
                        Employee Pension Scheme (EPS)
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Employer contribution: 8.33% of basic salary</li>
                        <li>• Monthly pension after retirement</li>
                        <li>• Minimum 10 years of service required</li>
                        <li>• Family pension for dependents</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!result && (
              <div className="bg-gray-50 p-12 rounded-lg text-center text-gray-500">
                <FaCalculator className="mx-auto text-4xl mb-4 text-gray-400" />
                <p>
                  Enter your employment details and click calculate to see your
                  EPF projections
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">
            About Employee Provident Fund (EPF)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Key Features</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Mandatory for companies with 20+ employees</li>
                <li>• Employee contributes 12% of basic salary</li>
                <li>• Employer contributes 12% (3.67% EPF + 8.33% EPS)</li>
                <li>• Interest rate declared annually by EPFO</li>
                <li>• Partial withdrawal allowed for specific purposes</li>
                <li>• Transferable between jobs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Withdrawal Rules</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Full withdrawal after 2 months of unemployment</li>
                <li>
                  • Partial withdrawal for house purchase, medical emergency
                </li>
                <li>• Tax-free if withdrawn after 5 years of service</li>
                <li>• Online withdrawal through UAN portal</li>
                <li>• Nomination facility available</li>
                <li>• Balance can be checked online anytime</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
