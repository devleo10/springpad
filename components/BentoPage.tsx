import React from 'react'

const BentoPage = () => {
  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
            AI-Powered Mutual Funds
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Smart investment management with AI agents that make mutual fund investing simple and profitable.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* AI Portfolio Analysis - Large Card */}
          <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-black/5 rounded-xl p-6 border border-yellow-400/50 hover:border-yellow-500 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/30 relative group overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/30 to-transparent animate-pulse opacity-50"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/30 rounded-full blur-3xl animate-bounce"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">AI Portfolio Analysis</h3>
              </div>
              <p className="text-gray-700 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                Our AI agents continuously analyze your portfolio performance and market trends to optimize your mutual fund investments.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-300/30 hover:border-yellow-400/50 transition-all duration-300 hover:bg-white/90 shadow-sm">
                  <span className="text-sm text-gray-700">Risk Assessment</span>
                  <span className="text-yellow-600 font-semibold animate-pulse">Low Risk</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-300/30 hover:border-yellow-400/50 transition-all duration-300 hover:bg-white/90 shadow-sm">
                  <span className="text-sm text-gray-700">Expected Returns</span>
                  <span className="text-yellow-600 font-semibold">12.5% annually</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-300/30 hover:border-yellow-400/50 transition-all duration-300 hover:bg-white/90 shadow-sm">
                  <span className="text-sm text-gray-700">Portfolio Score</span>
                  <span className="text-yellow-600 font-semibold">8.7/10</span>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Rebalancing */}
          <div className="bg-gradient-to-br from-black/10 to-yellow-100/30 rounded-xl p-6 border border-black/20 hover:border-yellow-500 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/30 relative group overflow-hidden">
            {/* Moving Elements */}
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-300/40 rounded-full animate-spin"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 bg-black/20 rounded-full animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-400 transition-all duration-300">
                  <svg className="w-5 h-5 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm8-2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">Smart Rebalancing</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
                Automatic portfolio rebalancing based on market conditions and your financial goals.
              </p>
              <div className="text-3xl font-bold text-yellow-600 animate-pulse">
                +15.2%
              </div>
              <div className="text-xs text-gray-500">
                Performance improvement
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gradient-to-br from-yellow-100/40 to-black/5 rounded-xl p-6 border border-yellow-300/40 hover:border-yellow-500 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/20 relative group overflow-hidden">
            {/* Floating Market Indicators */}
            <div className="absolute top-2 right-2 flex space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 animate-pulse">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2V6a1 1 0 10-2 0v1a1 1 0 102 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">Market Insights</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
                Real-time market analysis and trend predictions powered by AI.
              </p>
              <div className="space-y-2">
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-gray-700">Bull market detected</span>
                </div>
                <div className="flex items-center transform hover:translate-x-2 transition-transform duration-300">
                  <div className="w-2 h-2 bg-black rounded-full mr-2 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-xs text-gray-700">Sector rotation opportunity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Goals */}
          <div className="lg:col-span-2 bg-gradient-to-br from-black/5 via-yellow-50 to-black/5 rounded-xl p-6 border border-black/20 hover:border-yellow-500 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/20 relative group overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/20 via-transparent to-yellow-100/20 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-yellow-200/30 rounded-full blur-2xl animate-bounce"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-black/10 rounded-full blur-xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 group-hover:animate-spin">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">Goal-Based Investing</h3>
              </div>
              <p className="text-gray-700 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                Set financial goals and let our AI agents create personalized investment strategies to achieve them.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-300/40 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 group shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600 group-hover:animate-pulse">₹5.2L</div>
                  <div className="text-xs text-gray-500">Emergency Fund</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-yellow-400 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-300/40 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 group shadow-sm">
                  <div className="text-2xl font-bold text-black group-hover:text-yellow-600 transition-colors duration-300">₹25L</div>
                  <div className="text-xs text-gray-500">Home Purchase</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-black h-2 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-yellow-300/40 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 group shadow-sm">
                  <div className="text-2xl font-bold text-yellow-600 group-hover:animate-pulse">₹1.5Cr</div>
                  <div className="text-xs text-gray-500">Retirement</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-yellow-400 h-2 rounded-full w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tax Optimization */}
          <div className="bg-gradient-to-br from-yellow-100/40 to-black/10 rounded-xl p-6 border border-yellow-300/50 hover:border-yellow-500 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/30 relative group overflow-hidden">
            {/* Money Animation Elements */}
            <div className="absolute top-1 right-1 text-yellow-500 text-xs animate-bounce">₹</div>
            <div className="absolute bottom-1 left-1 text-black/50 text-xs animate-pulse">💰</div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-400 transition-all duration-300">
                  <svg className="w-5 h-5 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">Tax Optimization</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
                Smart tax-saving strategies and ELSS fund recommendations.
              </p>
              <div className="text-3xl font-bold text-yellow-600 animate-pulse">
                ₹46,800
              </div>
              <div className="text-xs text-gray-500 group-hover:text-yellow-600/70 transition-colors duration-300">
                Tax saved this year
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-black/10 to-yellow-100/30 rounded-xl p-6 border border-black/30 hover:border-yellow-500 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/20 relative group overflow-hidden">
            {/* Chat Bubble Animation */}
            <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-black/50 rounded-full animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 group-hover:animate-bounce">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">AI Assistant</h3>
              </div>
              <p className="text-gray-700 text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
                24/7 AI support for all your mutual fund queries and decisions.
              </p>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-yellow-300/30 hover:border-yellow-400/50 transition-all duration-300 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Latest Query:</div>
                <div className="text-sm text-black group-hover:text-yellow-600 transition-colors duration-300">&ldquo;Should I invest in tech funds now?&rdquo;</div>
              </div>
            </div>
          </div>

          {/* Performance Dashboard */}
          <div className="lg:col-span-2 bg-gradient-to-br from-black/5 via-yellow-50 to-black/10 rounded-xl p-6 border border-black/20 hover:border-yellow-500 transition-all duration-500 shadow-2xl hover:shadow-yellow-400/20 relative group overflow-hidden">
            {/* Animated Chart Elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/30 to-transparent rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full blur-xl animate-bounce"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3 group-hover:bg-yellow-400 transition-all duration-300">
                  <svg className="w-5 h-5 text-white group-hover:text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black group-hover:text-yellow-600 transition-colors duration-300">Performance Dashboard</h3>
              </div>
              <p className="text-gray-700 mb-6 group-hover:text-gray-800 transition-colors duration-300">
                Comprehensive analytics and performance tracking for all your investments.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center transform hover:scale-110 transition-all duration-300 hover:bg-black/5 p-2 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 animate-pulse">+18.5%</div>
                  <div className="text-xs text-gray-500">1Y Returns</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-all duration-300 hover:bg-black/5 p-2 rounded-lg">
                  <div className="text-3xl font-bold text-black">₹2.4L</div>
                  <div className="text-xs text-gray-500">Current Value</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-all duration-300 hover:bg-black/5 p-2 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600 animate-pulse">12</div>
                  <div className="text-xs text-gray-500">Active Funds</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-all duration-300 hover:bg-black/5 p-2 rounded-lg">
                  <div className="text-3xl font-bold text-black">4.2</div>
                  <div className="text-xs text-gray-500">Risk Score</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-10 rounded-xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-yellow-400/50 border-2 border-yellow-400 hover:border-black relative overflow-hidden group">
            <span className="relative z-10">Start Your AI-Powered Investment Journey</span>
            <div className="absolute inset-0 bg-black/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BentoPage