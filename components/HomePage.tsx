import { ArrowRight, BarChart3, Shield, TrendingUp, Users } from "lucide-react";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <section className=" bg-transparent relative overflow-hidden">
        {/* Seamless Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          src="/heroVid.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            background: "black",
            opacity: 0.95,
            zIndex: 0,
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Overlay for better text readability (replaced with dark overlay above) */}

        <div className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Trust Indicators */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-[#ffb400]" />
                  <span className="text-sm text-gray-600 font-medium">
                    AMFI Registered
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-[#ffb400]" />
                  <span className="text-sm text-gray-600 font-medium">
                    10L+ Investors
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-md">
                  Invest in Mutual Funds with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffb400] to-[#ff8c00] drop-shadow-md">
                    Confidence
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 font-medium leading-relaxed max-w-lg">
                  Trusted AMFI-registered platform for secure SIP & Lumpsum
                  investments.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-100">
                  <div className="text-2xl font-bold text-[#1B1B1B]">₹100</div>
                  <div className="text-sm text-gray-700">Minimum SIP</div>
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-100">
                  <div className="text-2xl font-bold text-[#1B1B1B]">0%</div>
                  <div className="text-sm text-gray-700">Commission</div>
                </div>
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 border border-gray-100">
                  <div className="text-2xl font-bold text-[#1B1B1B]">24/7</div>
                  <div className="text-sm text-gray-700">Support</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-[#ffb400] hover:bg-[#ff8c00] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                  <span>Start Investing</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-white hover:bg-gray-50 text-[#1B1B1B] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border-2 border-gray-200 hover:border-[#ffb400] flex items-center justify-center space-x-2">
                  {/* <Play className="w-5 h-5" /> */}
                  <span>Explore Mutual Funds</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1B1B1B]">
                    Join 10,00,000+ investors
                  </div>
                  <div className="text-xs text-gray-500">
                    who trust us with their investments
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="relative">
              {/* Spotlight Effect Behind Card */}
              <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-white/20 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none" />
              {/* Enhanced Portfolio Card */}
              <div className="bg-transparent rounded-3xl shadow-2xl border border-white/30 p-8 md:p-10 relative z-10 overflow-hidden ring-1 ring-black/10">
                {/* Decorative Gradient Ring */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-[#ffb400]/40 to-[#ff8c00]/40 rounded-full blur-2xl z-0" />
                <div className="relative z-10 space-y-8">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-[#ffb400]" /> Portfolio
                      Overview
                    </h3>
                    <div className="flex items-center space-x-2 text-green-400 bg-green-900/20 px-3 py-1 rounded-full text-sm font-semibold">
                      <TrendingUp className="w-4 h-4" />
                      +12.5%
                    </div>
                  </div>

                  {/* Portfolio Value */}
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
                    <div>
                      <div className="text-4xl font-extrabold text-white tracking-tight">
                        ₹2,45,680
                      </div>
                      <div className="text-sm text-gray-200/80">
                        Current Value
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-300">
                        Last updated:{" "}
                        <span className="font-semibold text-white">
                          just now
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Chart Representation */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-200">
                        Equity Funds
                      </span>
                      <span className="text-sm font-semibold text-white">
                        65%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#ffb400] to-[#ff8c00] h-2 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-200">Debt Funds</span>
                      <span className="text-sm font-semibold text-white">
                        25%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                        style={{ width: "25%" }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-200">
                        Hybrid Funds
                      </span>
                      <span className="text-sm font-semibold text-white">
                        10%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-3 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-green-300" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            SIP Investment
                          </div>
                          <div className="text-xs text-gray-200/80">
                            HDFC Top 100 Fund
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        ₹5,000
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-[#ffb400] to-[#ff8c00] rounded-xl p-4 shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-[#1B1B1B]">
                    Live Market
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-[#ffb400]/10 to-[#ff8c00]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl"></div>
      </section>
    </div>
  );
};

export default HomePage;
