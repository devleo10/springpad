"use client";

import React from "react";

const AiFeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-10 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="bg-white border border-gray-200 rounded-xl p-4 h-80 flex flex-col">
            {/* Financial Advisor Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold"> </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-black">
                    AI Financial Advisor
                  </h4>
                  <span className="text-xs text-gray-500">
                    Age: 28 | Income: $85k
                  </span>
                </div>
              </div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>

            {/* Financial Advisory Content */}
            <div className="flex-1 py-2 space-y-2 overflow-hidden">
              {/* Market Alert */}
              <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-red-700">
                      Market Alert
                    </div>
                    <div className="text-xs text-red-600">
                      Portfolio down 3.2% today
                    </div>
                  </div>
                  <div className="text-sm font-bold text-red-600">-$1,850</div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Tech sector correction due to Fed rate hike
                </div>
              </div>

              {/* Recommended MF Mix */}
              <div className="bg-yellow-50 rounded-lg p-2 border border-yellow-200">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-xs font-semibold text-black">
                    Recommended MF Mix
                  </span>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Large Cap (40%)</span>
                    <span className="text-green-600">+8.2%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Mid Cap (30%)</span>
                    <span className="text-blue-600">+12.4%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Small Cap (20%)</span>
                    <span className="text-purple-600">+15.8%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-700">Debt (10%)</span>
                    <span className="text-gray-600">+6.1%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-black text-white px-3 py-1.5 rounded-lg text-xs hover:bg-gray-800 transition-colors">
                    Rebalance
                </button>
                <button className="bg-yellow-400 text-black px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-500 transition-colors">
                    Invest Now
                </button>
              </div>

            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-black">
              AI Financial Advisor
            </h3>
            <p className="text-sm text-gray-600">
              Personalized investment advice based on age & income
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AiFeaturesPage };
