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
    <div className="pb-32 px-4 bg-white">
      <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#2C5282] leading-tight">
          Experience Next-Gen Investing with AI
        </h2>
        <p className="mt-2 text-gray-500 text-sm max-w-2xl mx-auto">
          Our AI-powered platform revolutionizes mutual fund investing with
          intelligent insights and automated portfolio management.
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
                <h4 className="text-sm font-semibold text-[#2C5282]">
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
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm max-w-[70%] text-[#2C5282] shadow-md">
                  Hello! I&apos;m your AI assistant. How can I help you today?
                </div>
              </div>

              {/* User Message */}
              <div className="flex gap-2 justify-end">
                <div className="bg-yellow-300 text-[#2C5282] rounded-lg px-3 py-2 text-sm max-w-[70%] shadow-md">
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
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm max-w-[70%] text-[#2C5282] shadow-md">
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
                className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#2C5282] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
              <button className="bg-yellow-300 text-[#2C5282] px-4 py-2 rounded-lg text-sm hover:bg-yellow-400 transition-colors font-semibold">
                Send
              </button>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-[#2C5282]">AI Chat Assistant</h3>
            <p className="text-sm text-gray-600">
              Get instant help and insights from our intelligent AI assistant
            </p>
          </div>
        </div>

        {/* Card 2 - Portfolio Health Checkup */}
        <div className="bg-[#f9fafb] rounded-[18px] p-4 border border-gray-200 shadow-lg">
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col h-80">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2C5282]">
                    Portfolio Health
                  </h4>
                  <p className="text-xs text-gray-500">
                    Score: <span className="font-medium text-green-600">8.5/10</span>
                  </p>
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Body */}
            <div className="py-3 flex-1 overflow-hidden">
              <div className="space-y-4 h-full">
                {/* Health Score Section */}
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-700">Overall Health</span>
                    <span className="text-sm font-bold text-green-600">Excellent</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-yellow-700">Risk Level</span>
                    <span className="text-sm font-bold text-yellow-600">Moderate</span>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded ${i <= 3 ? 'bg-yellow-500' : 'bg-yellow-200'}`}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Asset Allocation */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <span className="text-xs font-medium text-blue-700 block mb-2">Asset Mix</span>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-600">Equity</span>
                      <span className="text-[10px] font-bold text-blue-600">65%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-600">Debt</span>
                      <span className="text-[10px] font-bold text-blue-600">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-600">Gold</span>
                      <span className="text-[10px] font-bold text-blue-600">10%</span>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-purple-700">1Y Returns</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 4.414 6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold text-purple-600">+18.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4">
            <h3 className="text-lg font-bold text-[#2C5282]">Portfolio Health Checkup</h3>
            <p className="text-sm text-gray-600">
              Your portfolio shows excellent health with balanced diversification and strong performance.
            </p>
          </div>
        </div>

        {/* Card 3 - AI Financial Advisor */}
        <div className="bg-[#f9fafb] rounded-[18px] p-4 border border-gray-200 shadow-lg">
          <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col h-80">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold text-[#2C5282]">
                  AI
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#2C5282]">
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
            <h3 className="text-lg font-bold text-[#2C5282]">Market Insight</h3>
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
