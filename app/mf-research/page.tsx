"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  PieChart,
  Calculator,
  Search,
} from "lucide-react";

export default function MFResearchPage() {
  const researchTools = [
    {
      title: "Fund Comparison",
      description:
        "Compare multiple mutual funds side by side to make informed investment decisions.",
      href: "/mf-research/fund-comparison",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      features: [
        "Performance comparison",
        "Risk analysis",
        "Expense ratio comparison",
        "Portfolio overlap",
      ],
    },
    {
      title: "SIP Returns Calculator",
      description:
        "Calculate potential returns from your SIP investments over different time periods.",
      href: "/mf-research/sip-returns",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      features: [
        "Historical returns",
        "Future projections",
        "Step-up SIP analysis",
        "Goal-based planning",
      ],
    },
  ];

  const additionalResources = [
    {
      title: "Fund Discovery",
      description:
        "Discover top-performing mutual funds across different categories",
      icon: <Search className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Portfolio Analysis",
      description: "Analyze your portfolio allocation and get recommendations",
      icon: <PieChart className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Risk Assessment",
      description: "Understand the risk profile of different mutual funds",
      icon: <Calculator className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Mutual Fund{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Research Hub
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Comprehensive tools and insights to help you make informed mutual
              fund investment decisions. Research, compare, and analyze funds
              with our advanced analytics platform.
            </p>
          </div>
        </div>
      </div>

      {/* Main Research Tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Research Tools
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Powerful tools to analyze and compare mutual funds for better
            investment decisions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {researchTools.map((tool, index) => (
            <Link
              key={index}
              href={tool.href}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative p-8">
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${tool.color} text-white mb-6`}
                >
                  {tool.icon}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {tool.description}
                </p>

                <div className="space-y-2 mb-6">
                  {tool.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-sm text-gray-500"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  Start Research
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Coming Soon
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
            More research tools and features are coming to enhance your
            investment research experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {additionalResources.map((resource, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/50 p-6 hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${resource.color} text-white mb-4`}
              >
                {resource.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {resource.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {resource.description}
              </p>

              <div className="mt-4 text-xs text-gray-400 font-medium">
                Coming Soon
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help with Your Investment Research?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Our team of experts is here to help you make the best investment
            decisions. Get personalized recommendations and insights.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-xl bg-white text-blue-600 font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Get Expert Help
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
