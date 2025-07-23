"use client";

import React, { useState, useEffect } from "react";

const AiFeaturesPage: React.FC = () => {
  const [niftyData, setNiftyData] = useState({
    price: 25145.4,
    lastUpdated: "09:15",
    isLoading: false,
  });

  // Function to fetch Nifty 50 data
  const fetchNiftyData = async () => {
    setNiftyData((prev) => ({ ...prev, isLoading: true }));

    try {
      // Example API call - replace with actual Nifty 50 API
      // const response = await fetch('https://api.example.com/nifty50');
      // const data = await response.json();

      // For demo purposes, simulate API response with random variation
      const mockPrice = 25000 + Math.random() * 500;
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      });

      setNiftyData({
        price: parseFloat(mockPrice.toFixed(2)),
        lastUpdated: timeString,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching Nifty data:", error);
      setNiftyData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchNiftyData();

    const interval = setInterval(fetchNiftyData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-neutral-800 leading-tight">
          AI-Driven Mutual Fund Investing Built for the Modern Investor
        </h2>
        <p className="mt-2 text-neutral-500 text-sm max-w-2xl mx-auto">
          From personalized fund recommendations to real-time performance
          insights, our platform uses the power of AI to help you invest with
          confidence and clarity.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 - AI Chat Interface */}
        <div className="bg-[#f9fafb] rounded-[18px] p-4 border border-gray-200 shadow-lg">
          <div className="bg-white border border-gray-200 rounded-xl p-4 h-80 flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">AI</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black">
                  AI Assistant
                </h4>
                <span className="text-xs text-green-500 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </span>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto py-3 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#d1d5db #f3f4f6",
              }}
            >
              {/* AI Message */}
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm max-w-[70%] text-gray-700 shadow-md">
                  Hello! I&apos;m your AI assistant. How can I help you today?
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-2 justify-end">
                <div className="bg-yellow-400 text-black rounded-lg px-3 py-2 text-sm max-w-[70%] shadow-md">
                  Can you help me analyze my data?
                </div>
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm max-w-[70%] text-gray-700 shadow-md">
                  Absolutely! I can help you analyze various types of data. What
                  kind of analysis are you looking for?
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                  AI
                </div>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm shadow-md">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
              <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg text-sm hover:bg-yellow-500 transition-colors font-semibold">
                Send
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-black">AI Chat Assistant</h3>
            <p className="text-sm text-gray-600">
              Get instant help and insights from our intelligent AI assistant
            </p>
          </div>
        </div>

        {/* Card 2 - AI Payment Cards Carousel */}
        <div className="bg-[#f9fafb] rounded-[18px] p-4 border border-gray-200 shadow-lg">
          <div className="bg-white border border-gray-200 rounded-xl p-4 h-80 flex flex-col relative overflow-hidden">
            {/* Animated Cards Container */}
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-[280px] h-[180px]">
                  {/* Card 1 */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 text-white shadow-xl transform transition-all duration-2000 ease-in-out"
                    style={{
                      animation: "cardLoop1 9s infinite",
                      zIndex: 3,
                    }}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-lg font-bold">$12,000</div>
                      <div className="text-sm opacity-80">Total Balance</div>
                    </div>
                    <div className="mb-4">
                      <div className="w-12 h-8 bg-yellow-400 rounded"></div>
                    </div>
                    <div className="text-sm font-medium">
                      john.doe@email.com
                    </div>
                    <div className="text-xs opacity-80 mt-1">
                      PayPal • Connected
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-black to-black/80 rounded-xl p-4 text-white shadow-xl transform transition-all duration-2000 ease-in-out"
                    style={{
                      animation: "cardLoop2 9s infinite",
                      zIndex: 2,
                    }}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-lg font-bold">$8,500</div>
                      <div className="text-sm opacity-80">Available</div>
                    </div>
                    <div className="mb-4">
                      <div className="w-12 h-8 bg-yellow-400 rounded"></div>
                    </div>
                    <div className="text-sm font-medium">
                      **** **** **** 4532
                    </div>
                    <div className="text-xs opacity-80 mt-1">
                      Visa • Premium
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-4 text-white shadow-xl transform transition-all duration-2000 ease-in-out"
                    style={{
                      animation: "cardLoop3 9s infinite",
                      zIndex: 1,
                    }}
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-lg font-bold">$15,250</div>
                      <div className="text-sm opacity-80">Savings</div>
                    </div>
                    <div className="mb-4">
                      <div className="w-12 h-8 bg-yellow-400 rounded"></div>
                    </div>
                    <div className="text-sm font-medium">
                      **** **** **** 7891
                    </div>
                    <div className="text-xs opacity-80 mt-1">
                      Mastercard • Gold
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm font-semibold text-black">
                  Easy payments
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  We accept all kinds of cards. We make sure you get money
                  whichever way possible.
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-black">Payment Solutions</h3>
            <p className="text-sm text-gray-600">
              Secure and flexible payment options for all your needs
            </p>
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            @keyframes cardLoop1 {
              0%,
              33.33% {
                transform: translateX(0) scale(1);
                opacity: 1;
                z-index: 3;
              }
              34%,
              66.66% {
                transform: translateX(-100%) scale(0.95);
                opacity: 0.7;
                z-index: 1;
              }
              67%,
              100% {
                transform: translateX(100%) scale(0.95);
                opacity: 0.7;
                z-index: 2;
              }
            }

            @keyframes cardLoop2 {
              0%,
              33.33% {
                transform: translateX(100%) scale(0.95);
                opacity: 0.7;
                z-index: 2;
              }
              34%,
              66.66% {
                transform: translateX(0) scale(1);
                opacity: 1;
                z-index: 3;
              }
              67%,
              100% {
                transform: translateX(-100%) scale(0.95);
                opacity: 0.7;
                z-index: 1;
              }
            }

            @keyframes cardLoop3 {
              0%,
              33.33% {
                transform: translateX(-100%) scale(0.95);
                opacity: 0.7;
                z-index: 1;
              }
              34%,
              66.66% {
                transform: translateX(100%) scale(0.95);
                opacity: 0.7;
                z-index: 2;
              }
              67%,
              100% {
                transform: translateX(0) scale(1);
                opacity: 1;
                z-index: 3;
              }
            }
          `}</style>
        </div>

        {/* Card 3 - AI Financial Advisor */}
        <div className="bg-[#f9fafb] rounded-[18px] p-4 border border-gray-200 shadow-lg">
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col h-80">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">
                    AI Financial Advisor
                  </h4>
                  <p className="text-xs text-gray-500">
                    Age: <span className="font-medium">28</span> | Income:{" "}
                    <span className="font-medium">$85k</span>
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>

            {/* Body */}
            <div className="py-3 flex-1 overflow-hidden">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between ">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        Nifty 50
                      </span>
                      <span className="text-[10px] text-white bg-red-500 px-1.5 py-0.5 rounded-full">
                        Live
                      </span>
                      {niftyData.isLoading && (
                        <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {niftyData.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last updated:{" "}
                    <span className="font-medium">{niftyData.lastUpdated}</span>
                  </p>
                </div>

                {/* Chart */}
                <div className="w-full h-30 mt-3">
                  <svg
                    viewBox="0 0 200 60"
                    width="100%"
                    height="100%"
                    className="bg-yellow-100 rounded-md"
                  >
                    <defs>
                      <linearGradient
                        id="priceGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#22c55e"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="#22c55e"
                          stopOpacity="0.1"
                        />
                      </linearGradient>
                    </defs>

                    <polyline
                      fill="url(#priceGradient)"
                      stroke="none"
                      points="10,30 30,20 50,35 70,33 90,40 110,37 130,43 150,40 170,45 190,43 190,50 10,50"
                    />

                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      points="10,30 30,20 50,35 70,33 90,40 110,37 130,43 150,40 170,45 190,43"
                    />

                    <circle cx="10" cy="30" r="2.5" fill="#22c55e" />

                    <text
                      x="15"
                      y="16"
                      fontSize="8"
                      fill="#16a34a"
                      fontWeight="bold"
                    >
                      {niftyData.price.toFixed(2)}
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-black">Market Insight</h3>
            <p className="text-sm text-gray-600">
              Nifty 50 shows stable trends. Review your portfolio to stay
              aligned with your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AiFeaturesPage };
