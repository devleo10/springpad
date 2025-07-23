"use client";

import Image from "next/image";

export default function TaglinePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center px-4 py-30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
              It&apos;s Always A{" "} <br />
              <span className="text-yellow-500">Good Time </span>
              To Invest And Plan!
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Start your wealth creation journey with AI-powered mutual fund
              recommendations tailored for every life milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wealth Creation Card */}
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9l9-7 9 7v11a2 2 0 01-2 2h-4a2 2 0 01-2-2V12H9v8a2 2 0 01-2 2H3a2 2 0 01-2-2V9z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-black text-lg">Dream Home</div>
                <div className="text-sm text-gray-600">Real Estate Funds</div>
              </div>
            </div>

            {/* Retirement Card */}
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-black text-lg">
                  Retirement Planning
                </div>
                <div className="text-sm text-gray-600">
                  ELSS & Pension Funds
                </div>
              </div>
            </div>

            {/* Education Card */}
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-black text-lg">
                  Child&apos;s Education
                </div>
                <div className="text-sm text-gray-600">
                  Education Savings Plans
                </div>
              </div>
            </div>

            {/* Wealth Growth Card */}
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-yellow-300 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <div className="font-bold text-black text-lg">
                  Wealth Creation
                </div>
                <div className="text-sm text-gray-600">
                  Equity & Hybrid Funds
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl">
              Start Investing Today
            </button>
            <button className="border-2 border-black text-black hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
              Explore Mutual Funds →
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl transform rotate-3 opacity-20"></div>
            <Image
              src="/family.png"
              alt="Financial Planning & Mutual Fund Investment"
              width={600}
              height={600}
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
