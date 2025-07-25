"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  FaChartLine,
  FaDollarSign,
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaPiggyBank,
  FaArrowUp,
  FaChartBar,
  FaCheckCircle,
  FaUserTie,
  FaClock,
  FaBullseye,
} from "react-icons/fa";
import { useState } from "react";

export default function MutualFundsPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const fundTypes = [
    {
      title: "Equity Funds",
      description:
        "Invest primarily in equity and equity-related securities. These funds have high risk and high potential returns.",
      risk: "High",
      returns: "15-20%",
      icon: <FaChartLine className="text-blue-600" />,
      color: "bg-blue-100",
    },
    {
      title: "Debt Funds",
      description:
        "Invest in fixed income securities like bonds and debentures. Suitable for conservative investors.",
      risk: "Low to Medium",
      returns: "6-8%",
      icon: <FaShieldAlt className="text-green-600" />,
      color: "bg-green-100",
    },
    {
      title: "Hybrid Funds",
      description:
        "Invest in both equity and debt securities. They provide balanced risk and return potential.",
      risk: "Medium",
      returns: "8-12%",
      icon: <FaPiggyBank className="text-purple-600" />,
      color: "bg-purple-100",
    },
  ];

  const investmentSteps = [
    {
      step: 1,
      title: "Choose Your Goal",
      description:
        "Define your investment objective - retirement, child's education, or wealth creation.",
      icon: <FaBullseye />,
    },
    {
      step: 2,
      title: "Assess Risk Profile",
      description:
        "Determine your risk tolerance based on age, income, and investment horizon.",
      icon: <FaShieldAlt />,
    },
    {
      step: 3,
      title: "Select Fund Type",
      description:
        "Choose between equity, debt, or hybrid funds based on your risk profile.",
      icon: <FaChartLine />,
    },
    {
      step: 4,
      title: "Start Investing",
      description:
        "Begin with SIP or lump sum investment and track your portfolio performance.",
      icon: <FaArrowUp />,
    },
  ];

  const benefits = [
    { text: "Professional Fund Management", icon: <FaUserTie /> },
    { text: "Diversification Across Assets", icon: <FaGlobe /> },
    { text: "Liquidity & Easy Access", icon: <FaClock /> },
    { text: "Tax Benefits Under 80C", icon: <FaDollarSign /> },
    { text: "SIP Investment Option", icon: <FaChartBar /> },
    { text: "Regulated by SEBI", icon: <FaShieldAlt /> },
  ];

  const performanceData = [
    { year: "2020", equity: 15.5, debt: 7.2, hybrid: 11.3 },
    { year: "2021", equity: 22.1, debt: 6.8, hybrid: 14.2 },
    { year: "2022", equity: -4.2, debt: 5.9, hybrid: 2.1 },
    { year: "2023", equity: 18.7, debt: 6.4, hybrid: 12.8 },
    { year: "2024", equity: 25.3, debt: 7.1, hybrid: 16.2 },
  ];

  const sipCalculation = [
    { year: 1, investment: 12000, value: 12600 },
    { year: 3, investment: 36000, value: 41850 },
    { year: 5, investment: 60000, value: 76420 },
    { year: 10, investment: 120000, value: 198630 },
    { year: 15, investment: 180000, value: 378940 },
    { year: 20, investment: 240000, value: 693820 },
  ];

  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      {/* Hero Section */}
      <div className="p-6">
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white py-20 rounded-3xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">
                Understanding Mutual Funds
              </h1>
              <p className="text-xl mb-8 leading-relaxed max-w-4xl mx-auto">
                Mutual funds pool money from multiple investors to invest in a
                diversified portfolio of stocks, bonds, and other securities.
                Learn how they work and discover their benefits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Start Investing
                </button>
                <button className="border-2 border-white hover:bg-white hover:text-[#2C5282] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: "overview", label: "What is Mutual Fund?" },
              { id: "types", label: "Types of Funds" },
              { id: "benefits", label: "Benefits" },
              { id: "performance", label: "Performance" },
              { id: "howto", label: "How to Invest" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedTab === tab.id
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      {selectedTab === "overview" && (
        <div className="py-16 bg-gray-50 relative">
          {/* Blur effect div that blends white to gray-50 */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/70 to-transparent backdrop-blur-sm"></div>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  What is Mutual Fund?
                </h2>
                <div className="space-y-4 text-lg text-gray-700">
                  <p>
                    A mutual fund is a financial instrument where money from
                    multiple investors is pooled together to invest in a
                    portfolio of securities like stocks, bonds, money market
                    instruments, and other assets.
                  </p>
                  <p>
                    When you invest in a mutual fund, you get units based on the
                    Net Asset Value (NAV). The fund is managed by professional
                    fund managers who make investment decisions based on
                    research and market analysis.
                  </p>
                  <p>
                    Your returns depend on the performance of the underlying
                    securities in the fund&apos;s portfolio. As these securities
                    grow in value, so does the value of your investment.
                  </p>
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  How It Works
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <FaUsers className="text-yellow-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Investors Pool Money</h4>
                      <p className="text-sm text-gray-600">
                        Multiple investors contribute funds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserTie className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Professional Management</h4>
                      <p className="text-sm text-gray-600">
                        Expert fund managers invest the money
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <FaChartLine className="text-green-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Diversified Portfolio</h4>
                      <p className="text-sm text-gray-600">
                        Invested across various securities
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaArrowUp className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Shared Returns</h4>
                      <p className="text-sm text-gray-600">
                        Profits/losses shared proportionally
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "types" && (
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Different Types of Mutual Funds
              </h2>
              <p className="text-xl text-gray-600">
                Choose the right fund type based on your risk tolerance and
                investment goals
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {fundTypes.map((fund, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`w-16 h-16 ${fund.color} rounded-full flex items-center justify-center mb-6`}
                  >
                    <div className="text-2xl">{fund.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{fund.title}</h3>
                  <p className="text-gray-600 mb-6">{fund.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">Risk Level:</span>
                      <span className="text-gray-600">{fund.risk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Expected Returns:</span>
                      <span className="text-green-600 font-semibold">
                        {fund.returns}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fund Categories Chart */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Fund Allocation Example
              </h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Equity Funds</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-4 bg-gray-200 rounded-full">
                          <div className="w-20 h-4 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="font-semibold">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Debt Funds</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-4 bg-gray-200 rounded-full">
                          <div className="w-12 h-4 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="font-semibold">30%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Hybrid Funds</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-4 bg-gray-200 rounded-full">
                          <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        </div>
                        <span className="font-semibold">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto relative">
                    <div className="w-full h-full rounded-full border-[30px] border-blue-500 border-r-green-500 border-b-purple-500 border-l-purple-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold">100%</div>
                        <div className="text-sm text-gray-600">Portfolio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "benefits" && (
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Benefits of Mutual Funds
              </h2>
              <p className="text-xl text-gray-600">
                Why mutual funds are the preferred choice for smart investors
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-yellow-600 text-2xl">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold">{benefit.text}</h3>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">
                Key Advantages Explained
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Diversification</h4>
                      <p className="text-gray-600 text-sm">
                        Mutual funds invest in a wide range of securities,
                        reducing the risk associated with investing in
                        individual stocks or bonds.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">
                        Professional Management
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Experienced fund managers make investment decisions
                        based on extensive research and market analysis.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Liquidity</h4>
                      <p className="text-gray-600 text-sm">
                        Most mutual funds offer easy redemption options,
                        allowing you to access your money when needed.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Affordability</h4>
                      <p className="text-gray-600 text-sm">
                        Start investing with as little as ₹500 per month through
                        SIP, making it accessible to all income groups.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Transparency</h4>
                      <p className="text-gray-600 text-sm">
                        Regular disclosure of portfolio holdings, NAV, and
                        performance ensures complete transparency.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-2">Tax Efficiency</h4>
                      <p className="text-gray-600 text-sm">
                        ELSS funds offer tax deduction under Section 80C, while
                        equity funds have favorable long-term capital gains tax.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "performance" && (
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                Historical Performance
              </h2>
              <p className="text-xl text-gray-600">
                Track record of different fund categories over the years
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Enhanced Performance Chart */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold mb-2 text-blue-700">
                  Annual Returns by Fund Type
                </h3>
                <div className="space-y-6 mt-8">
                  {performanceData.map((data, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">
                          {data.year}
                        </span>
                        <div className="text-sm text-gray-500 font-medium">
                          E: {data.equity}% | D: {data.debt}% | H: {data.hybrid}
                          %
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* Equity Bar */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 text-xs font-medium text-blue-600">
                            Equity
                          </div>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                            <div
                              className={`h-6 rounded-full transition-all duration-1000 ease-out ${
                                data.equity < 0
                                  ? "bg-gradient-to-r from-red-500 to-red-600"
                                  : "bg-gradient-to-r from-blue-500 to-blue-600"
                              }`}
                              style={{
                                width: `${Math.min(
                                  Math.abs(data.equity) * 3,
                                  100
                                )}%`,
                              }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-end pr-2">
                              <span className="text-xs font-semibold text-white">
                                {data.equity > 0 ? "+" : ""}
                                {data.equity}%
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Debt Bar */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 text-xs font-medium text-green-600">
                            Debt
                          </div>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${data.debt * 12}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-end pr-2">
                              <span className="text-xs font-semibold text-white">
                                +{data.debt}%
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Hybrid Bar */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 text-xs font-medium text-purple-600">
                            Hybrid
                          </div>
                          <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                            <div
                              className={`h-6 rounded-full transition-all duration-1000 ease-out ${
                                data.hybrid < 0
                                  ? "bg-gradient-to-r from-red-500 to-red-600"
                                  : "bg-gradient-to-r from-purple-500 to-purple-600"
                              }`}
                              style={{
                                width: `${Math.min(
                                  Math.abs(data.hybrid) * 6,
                                  100
                                )}%`,
                              }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-end pr-2">
                              <span className="text-xs font-semibold text-white">
                                {data.hybrid > 0 ? "+" : ""}
                                {data.hybrid}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-6 text-sm bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="font-medium">Equity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="font-medium">Debt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500 rounded"></div>
                    <span className="font-medium">Hybrid</span>
                  </div>
                </div>
              </div>

              {/* Enhanced SIP Calculator Visualization */}
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold mb-2 text-blue-700">
                  SIP Growth Projection
                </h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                  Monthly SIP of ₹1,000 @ 12% annual return
                </p>
                <div className="space-y-5">
                  {sipCalculation.map((data, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">
                          Year {data.year}
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          ₹{data.value.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-8 relative overflow-hidden">
                        <div className="flex h-8 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000 ease-out"
                            style={{
                              width: `${(data.investment / data.value) * 100}%`,
                            }}
                          ></div>
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 ease-out"
                            style={{
                              width: `${
                                ((data.value - data.investment) / data.value) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-semibold text-white">
                            ₹{data.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span className="font-medium">
                          Invested: ₹{data.investment.toLocaleString()}
                        </span>
                        <span className="font-medium text-green-600">
                          Gains: ₹
                          {(data.value - data.investment).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="font-medium">Investment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="font-medium">Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Performance Insights */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100 mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Fund Performance Insights
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    15.2%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Average Equity Returns
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Last 5 years</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    6.8%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Average Debt Returns
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Last 5 years</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    12.1%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Average Hybrid Returns
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Last 5 years</div>
                </div>
              </div>
            </div>

            {/* Market Comparison Chart */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Market Comparison
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-blue-700">
                    Risk vs Return Analysis
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-blue-800">
                          Equity Funds
                        </div>
                        <div className="text-sm text-blue-600">
                          High Risk, High Return
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-700">
                          15-20%
                        </div>
                        <div className="text-xs text-blue-500">
                          Expected Returns
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-green-800">
                          Debt Funds
                        </div>
                        <div className="text-sm text-green-600">
                          Low Risk, Stable Return
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-700">
                          6-8%
                        </div>
                        <div className="text-xs text-green-500">
                          Expected Returns
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-purple-800">
                          Hybrid Funds
                        </div>
                        <div className="text-sm text-purple-600">
                          Balanced Risk & Return
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-700">
                          8-12%
                        </div>
                        <div className="text-xs text-purple-500">
                          Expected Returns
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-700">
                    Performance Metrics
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50">
                      <div className="font-semibold text-yellow-800">
                        Best Performing Year
                      </div>
                      <div className="text-sm text-yellow-600">
                        2024: Equity funds delivered 25.3% returns
                      </div>
                    </div>
                    <div className="p-4 border-l-4 border-red-400 bg-red-50">
                      <div className="font-semibold text-red-800">
                        Challenging Year
                      </div>
                      <div className="text-sm text-red-600">
                        2022: Market correction affected equity returns
                      </div>
                    </div>
                    <div className="p-4 border-l-4 border-green-400 bg-green-50">
                      <div className="font-semibold text-green-800">
                        Consistent Performer
                      </div>
                      <div className="text-sm text-green-600">
                        Debt funds maintained steady 6-7% returns
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "howto" && (
        <div className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                How To Invest in Mutual Funds
              </h2>
              <p className="text-xl text-gray-600">
                Simple steps to start your investment journey with SpringPad
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {investmentSteps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-yellow-600 text-2xl">{step.icon}</div>
                  </div>
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Investment Options</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border-2 border-yellow-200 p-6 rounded-xl">
                  <h4 className="text-xl font-bold mb-4 text-yellow-600">
                    SIP (Systematic Investment Plan)
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Start with as low as ₹500/month
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Auto-debit from your bank account
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Benefits of rupee cost averaging
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Disciplined investing approach
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="border-2 border-blue-200 p-6 rounded-xl">
                  <h4 className="text-xl font-bold mb-4 text-blue-600">
                    Lump Sum Investment
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Invest large amount at once
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">
                        Suitable for windfall gains
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">Maximum market exposure</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      <span className="text-sm">Higher potential returns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taxation Section */}
      <div className="py-16 bg-blue-50 relative">
        {/* Blur effect div that blends gray-50 with bg-blue-50 */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 via-gray-50/70 to-transparent backdrop-blur-sm"></div>
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Taxation of Mutual Funds
            </h2>
            <p className="text-xl text-gray-600">
              Understanding tax implications for better investment planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-blue-600">
                Equity Funds
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-semibold">
                    Short-term (&lt; 1 year)
                  </span>
                  <span className="text-red-600 font-semibold">15% tax</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-semibold">Long-term (&gt; 1 year)</span>
                  <span className="text-green-600 font-semibold">
                    10% above ₹1L
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold">Dividend</span>
                  <span className="text-gray-600 font-semibold">Tax-free</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-green-600">
                Debt Funds
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-semibold">
                    Short-term (&lt; 3 years)
                  </span>
                  <span className="text-red-600 font-semibold">
                    As per slab
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-semibold">
                    Long-term (&gt; 3 years)
                  </span>
                  <span className="text-green-600 font-semibold">
                    20% with indexation
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold">Dividend</span>
                  <span className="text-gray-600 font-semibold">
                    As per slab
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Mutual Fund Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let SpringPad help you choose the right mutual funds for your
            financial goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Start SIP Today
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Explore Funds
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
