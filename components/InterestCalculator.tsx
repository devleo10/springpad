"use client";
import React, { useState, useCallback, useMemo, useRef } from 'react';

export function InterestCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(1000);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Investment options with their annual returns
  const investmentOptions = [
    { name: 'Bank', return: 0.03, color: 'bg-gray-100' },
    { name: 'Fixed Deposit', return: 0.06, color: 'bg-gray-100' },
    { name: 'Gold', return: 0.09, color: 'bg-gray-100' },
    { name: 'Sensex', return: 0.11, color: 'bg-gray-100' },
    { name: 'Mutual Fund', return: 0.15, color: 'bg-gray-100' }
  ];

  // Calculate compound interest
  const calculateMaturityAmount = useCallback((principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 12;
    const totalMonths = years * 12;
    
    // Future Value of Annuity formula for SIP
    const futureValue = principal * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    
    return Math.round(futureValue);
  }, []);

  // Format currency in Indian format
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) { // 1 crore
      return `₹ ${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      return `₹ ${(amount / 100000).toFixed(2)}L`;
    } else {
      return `₹ ${(amount / 1000).toFixed(2)}K`;
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Update immediately for visual feedback, but debounce expensive calculations
    setMonthlyInvestment(newValue);
  };

  // Memoize the investment calculations to prevent unnecessary re-renders
  const investmentResults = useMemo(() => {
    return investmentOptions.map(option => ({
      ...option,
      maturityAmount: calculateMaturityAmount(monthlyInvestment, option.return, 25)
    }));
  }, [monthlyInvestment, calculateMaturityAmount]);

  return (
    <div className="pb-32 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#2C5282] mb-8">
            How SpringPad Works In Your Best Interest
          </h1>
          
          {/* Investment Amount Selector */}
          <div className="mb-8">
            <h2 className="text-xl text-[#2C5282] mb-6 font-semibold">Monthly Investment</h2>
            <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6 max-w-md mx-auto">
              <div className="bg-[#2C5282] text-white text-xl font-semibold py-3 px-6 rounded-lg mb-4">
                ₹{monthlyInvestment.toLocaleString('en-IN')}/-
              </div>
              
              {/* Slider */}
              <div className="relative px-2">
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlyInvestment}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider focus:outline-none"
                />
                <div className="flex justify-between text-sm text-[#2C5282] mt-3 px-1">
                  <span>₹500</span>
                  <span>₹1,00,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-[#2C5282] mb-8">
            AFTER 25 YEARS, IT WOULD HAVE ACCUMULATED TO
          </h3>
        </div>

        {/* Investment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {investmentResults.map((option, index) => (
            <div key={option.name} className="relative bg-white/60 backdrop-blur-md rounded-2xl border border-yellow-100 shadow-xl p-6 transform-gpu hover:scale-105 transition-all duration-300 ease-in-out hover:border-yellow-300 hover:shadow-2xl group overflow-hidden will-change-transform">
              {/* Hover Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
              
              <div className="text-center relative z-10">
                <h4 className="text-lg font-medium text-[#2C5282] mb-4">
                  {option.name}
                </h4>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-[#2C5282] mb-2">
                    {formatCurrency(option.maturityAmount)}
                  </div>
                </div>
                
                <div className="bg-[#2C5282] text-white font-semibold py-2 px-4 rounded-full text-sm">
                  @{(option.return * 100).toFixed(0)}% Return
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="relative bg-white/60 backdrop-blur-md rounded-2xl border border-yellow-100 shadow-xl p-6 max-w-2xl mx-auto group hover:border-yellow-300 hover:shadow-2xl transition-all duration-300">
            {/* Hover Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
            
            <h4 className="text-lg font-semibold text-[#2C5282] mb-4 relative z-10">Investment Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
              <div>
                <span className="text-[#2C5282]">Monthly Investment:</span>
                <span className="font-semibold ml-2 text-[#2C5282]">₹{monthlyInvestment.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#2C5282]">Investment Period:</span>
                <span className="font-semibold ml-2 text-[#2C5282]">25 Years</span>
              </div>
              <div>
                <span className="text-[#2C5282]">Total Investment:</span>
                <span className="font-semibold ml-2 text-[#2C5282]">₹{(monthlyInvestment * 25 * 12).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[#2C5282]">Best Returns:</span>
                <span className="font-semibold ml-2 text-green-600">Mutual Fund @15%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #2C5282 0%, #2C5282 ${((monthlyInvestment - 500) / (100000 - 500)) * 100}%, #e5e7eb ${((monthlyInvestment - 500) / (100000 - 500)) * 100}%, #e5e7eb 100%);
          transition: background 0.1s ease-out;
          will-change: background;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2C5282;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          transition: transform 0.1s ease-out, background-color 0.1s ease-out, box-shadow 0.1s ease-out;
          will-change: transform;
        }

        .slider::-webkit-slider-thumb:hover {
        
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          transform: scale3d(1.1, 1.1, 1);
        }

        .slider::-webkit-slider-thumb:active {
          transform: scale3d(1.05, 1.05, 1);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
          transition: transform 0.1s ease-out, background-color 0.1s ease-out, box-shadow 0.1s ease-out;
          will-change: transform;
        }

        .slider::-moz-range-thumb:hover {
          background: #1d4ed8;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          transform: scale3d(1.1, 1.1, 1);
        }

        .slider::-moz-range-thumb:active {
          background: #1e40af;
          transform: scale3d(1.05, 1.05, 1);
        }

        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }

        .slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
          border: none;
        }

        .slider:focus {
          outline: none;
        }

        .slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2), 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        .slider:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2), 0 2px 8px rgba(37, 99, 235, 0.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .slider, .slider::-webkit-slider-thumb, .slider::-moz-range-thumb {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default InterestCalculator;