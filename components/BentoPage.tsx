import React from 'react'

const BentoPage = () => {
  return (
    <div className="min-h-screen text-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Mutual Funds
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Smart investment management with AI agents that make mutual fund investing simple and profitable.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* AI Portfolio Analysis - Large Card */}
          <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">AI Portfolio Analysis</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Our AI agents continuously analyze your portfolio performance and market trends to optimize your mutual fund investments.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">Risk Assessment</span>
                <span className="text-green-600 font-semibold">Low Risk</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">Expected Returns</span>
                <span className="text-blue-600 font-semibold">12.5% annually</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/70 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">Portfolio Score</span>
                <span className="text-purple-600 font-semibold">8.7/10</span>
              </div>
            </div>
          </div>

          {/* Smart Rebalancing */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:border-green-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Smart Rebalancing</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Automatic portfolio rebalancing based on market conditions and your financial goals.
            </p>
            <div className="text-2xl font-bold text-green-600">
              +15.2%
            </div>
            <div className="text-xs text-gray-500">
              Performance improvement
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 hover:border-purple-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2V6a1 1 0 10-2 0v1a1 1 0 102 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Market Insights</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Real-time market analysis and trend predictions powered by AI.
            </p>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-700">Bull market detected</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-xs text-gray-700">Sector rotation opportunity</span>
              </div>
            </div>
          </div>

          {/* Investment Goals */}
          <div className="lg:col-span-2 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 hover:border-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Goal-Based Investing</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Set financial goals and let our AI agents create personalized investment strategies to achieve them.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-yellow-600">₹5.2L</div>
                <div className="text-xs text-gray-500">Emergency Fund</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">₹25L</div>
                <div className="text-xs text-gray-500">Home Purchase</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full w-1/2"></div>
                </div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">₹1.5Cr</div>
                <div className="text-xs text-gray-500">Retirement</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-500 h-2 rounded-full w-1/4"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Optimization */}
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 hover:border-red-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Tax Optimization</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Smart tax-saving strategies and ELSS fund recommendations.
            </p>
            <div className="text-2xl font-bold text-red-600">
              ₹46,800
            </div>
            <div className="text-xs text-gray-500">
              Tax saved this year
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200 hover:border-indigo-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">AI Assistant</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              24/7 AI support for all your mutual fund queries and decisions.
            </p>
            <div className="bg-white/70 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Latest Query:</div>
              <div className="text-sm text-gray-800">&ldquo;Should I invest in tech funds now?&rdquo;</div>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-lg hover:shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Performance Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics and performance tracking for all your investments.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+18.5%</div>
                <div className="text-xs text-gray-500">1Y Returns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₹2.4L</div>
                <div className="text-xs text-gray-500">Current Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-xs text-gray-500">Active Funds</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">4.2</div>
                <div className="text-xs text-gray-500">Risk Score</div>
              </div>
            </div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Start Your AI-Powered Investment Journey
          </button>
        </div>
      </div>
    </div>
  )
}

export default BentoPage