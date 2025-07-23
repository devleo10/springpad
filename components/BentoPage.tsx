"use client"
import React, { useState, useEffect } from "react";

const BentoPage = () => {
  const [animatedValues, setAnimatedValues] = useState({
    returns: 0,
    score: 0,
    savings: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        returns: 12.5,
        score: 8.7,
        savings: 46800
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl blur-3xl opacity-20 transform scale-110"></div>
          <div className="relative bg-gradient-to-br from-black via-gray-900 to-black rounded-3xl p-8 md:p-12 border border-yellow-400/20 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent leading-tight">
              AI-Powered
              <span className="block text-white">Mutual Funds</span>
            </h1>
            <p className="text-yellow-200 text-xl md:text-2xl max-w-3xl mx-auto font-light">
              Experience the future of investing with AI-driven intelligence
            </p>
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>

        {/* Enhanced Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hero AI Portfolio Card */}
          <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 rounded-3xl p-8 border-2 border-yellow-400/30 hover:border-yellow-400/60 hover:shadow-2xl hover:shadow-yellow-400/20 transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold mb-2 text-black">AI Portfolio</h3>
                  <p className="text-gray-600 text-lg">Intelligent optimization in real-time</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black font-black text-2xl px-4 py-2 rounded-2xl shadow-lg animate-pulse">
                  {animatedValues.score.toFixed(1)} / 10
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center group">
                  <div className="bg-black text-yellow-400 text-2xl font-black p-4 rounded-2xl mb-2 transform group-hover:scale-110 transition-transform">
                    LOW
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Risk Level</div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-black text-2xl font-black p-4 rounded-2xl mb-2 transform group-hover:scale-110 transition-transform">
                    {animatedValues.returns}%
                  </div>
                  <div className="text-sm font-semibold text-gray-700">Annual Returns</div>
                </div>
                <div className="text-center group">
                  <div className="bg-black text-yellow-400 text-2xl font-black p-4 rounded-2xl mb-2 transform group-hover:scale-110 transition-transform">
                    A+
                  </div>
                  <div className="text-sm font-semibold text-gray-700">AI Score</div>
                </div>
              </div>

              {/* Performance Chart Mockup */}
              <div className="mt-8 bg-black/90 rounded-2xl p-4 relative overflow-hidden">
                <div className="flex items-end justify-between h-20 space-x-1">
                  {[40, 65, 45, 80, 60, 95, 70, 85, 55, 90, 75, 100].map((height, i) => (
                    <div
                      key={i}
                      className="bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t transition-all duration-1000 delay-100"
                      style={{ 
                        height: `${height}%`,
                        width: '100%',
                        animationDelay: `${i * 100}ms`
                      }}
                    ></div>
                  ))}
                </div>
                <div className="text-yellow-400 text-xs mt-2 text-center font-semibold">12 Month Performance</div>
              </div>
            </div>
          </div>

          {/* Smart Rebalancing */}
          <div className="bg-gradient-to-br from-black to-gray-900 rounded-3xl p-6 border border-yellow-400/30 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-3 text-white">Smart Rebalancing</h3>
              <p className="text-yellow-200 text-sm mb-6">AI monitors and adjusts your portfolio automatically</p>
              <div className="text-3xl font-black text-yellow-400 mb-1">+15.2%</div>
              <div className="text-yellow-300 text-sm font-semibold">Performance boost</div>
              
              {/* Animated rebalancing visual */}
              <div className="mt-4 flex space-x-1">
                <div className="flex-1 bg-yellow-400 h-2 rounded animate-pulse"></div>
                <div className="flex-1 bg-yellow-300 h-2 rounded animate-pulse delay-100"></div>
                <div className="flex-1 bg-yellow-500 h-2 rounded animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 border-2 border-yellow-600 hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
            <h3 className="text-xl font-bold mb-3 text-black">Market Insights</h3>
            <p className="text-black/80 text-sm mb-6">Real-time AI analysis</p>
            
            <div className="space-y-3">
              <div className="flex items-center bg-black/20 rounded-xl p-3">
                <div className="w-3 h-3 bg-black rounded-full mr-3 animate-pulse"></div>
                <span className="text-black font-semibold text-sm">Bull market detected</span>
              </div>
              <div className="flex items-center bg-black/20 rounded-xl p-3">
                <div className="w-3 h-3 bg-black rounded-full mr-3 animate-pulse delay-200"></div>
                <span className="text-black font-semibold text-sm">Sector rotation ahead</span>
              </div>
            </div>
          </div>

          {/* Goals Progress */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-200 hover:border-yellow-400/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-6 text-black">Your Financial Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <div className="text-2xl font-black text-yellow-600 mb-1">₹5.2L</div>
                <div className="text-sm font-semibold text-gray-700 mb-3">Emergency Fund</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000" style={{width: '75%'}}></div>
                </div>
                <div className="text-xs text-gray-600 mt-2 font-semibold">75% Complete</div>
              </div>
              
              <div className="text-center bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <div className="text-2xl font-black text-yellow-600 mb-1">₹25L</div>
                <div className="text-sm font-semibold text-gray-700 mb-3">Dream Home</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 delay-300" style={{width: '50%'}}></div>
                </div>
                <div className="text-xs text-gray-600 mt-2 font-semibold">50% Complete</div>
              </div>
              
              <div className="text-center bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                <div className="text-2xl font-black text-yellow-600 mb-1">₹1.5Cr</div>
                <div className="text-sm font-semibold text-gray-700 mb-3">Retirement</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000 delay-500" style={{width: '25%'}}></div>
                </div>
                <div className="text-xs text-gray-600 mt-2 font-semibold">25% Complete</div>
              </div>
            </div>
          </div>

          {/* Tax Optimization */}
          <div className="bg-gradient-to-br from-black to-gray-900 rounded-3xl p-6 border border-yellow-400/30 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-3 text-white">Tax Optimization</h3>
            <p className="text-yellow-200 text-sm mb-6">ELSS & smart tax strategies</p>
            <div className="text-3xl font-black text-yellow-400 mb-1">₹{(animatedValues.savings/1000).toFixed(1)}k</div>
            <div className="text-yellow-300 text-sm font-semibold">Saved this year</div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 border-2 border-yellow-600 hover:shadow-xl hover:shadow-yellow-400/30 transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-3 text-black">AI Assistant</h3>
            <div className="bg-black/20 rounded-xl p-4 mb-4">
              <p className="text-black text-sm font-semibold italic">&quot;Should I invest in tech stocks now?&quot;</p>
            </div>
            <div className="text-black/80 text-sm font-semibold">Available 24/7</div>
          </div>

          {/* Performance Dashboard */}
          <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 border border-yellow-400/30 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 transform hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-6 text-white">Performance Dashboard</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center bg-yellow-400/10 rounded-2xl p-4 border border-yellow-400/30">
                <div className="text-2xl font-black text-yellow-400 mb-1">+18.5%</div>
                <div className="text-yellow-200 text-sm font-semibold">1Y Returns</div>
              </div>
              <div className="text-center bg-yellow-400/10 rounded-2xl p-4 border border-yellow-400/30">
                <div className="text-2xl font-black text-yellow-400 mb-1">₹2.4L</div>
                <div className="text-yellow-200 text-sm font-semibold">Portfolio Value</div>
              </div>
              <div className="text-center bg-yellow-400/10 rounded-2xl p-4 border border-yellow-400/30">
                <div className="text-2xl font-black text-yellow-400 mb-1">12</div>
                <div className="text-yellow-200 text-sm font-semibold">Active Funds</div>
              </div>
              <div className="text-center bg-yellow-400/10 rounded-2xl p-4 border border-yellow-400/30">
                <div className="text-2xl font-black text-yellow-400 mb-1">4.2</div>
                <div className="text-yellow-200 text-sm font-semibold">Risk Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA */}
        <div className="text-center mt-16">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl blur-xl opacity-50"></div>
            <button className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-black py-6 px-12 rounded-3xl shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 transition-all duration-300 text-xl">
              Start Your AI Investment Journey
              <span className="block text-sm font-semibold opacity-80">Join 50,000+ smart investors</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default BentoPage;