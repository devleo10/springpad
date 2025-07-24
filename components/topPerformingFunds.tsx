"use client";
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ChevronDown } from 'lucide-react';

// Custom CSS animations
const customStyles = `
  @keyframes float-slow {
    0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    25% { transform: translateY(-20px) translateX(10px) rotate(90deg); }
    50% { transform: translateY(-10px) translateX(-15px) rotate(180deg); }
    75% { transform: translateY(-30px) translateX(5px) rotate(270deg); }
  }
  
  @keyframes float-medium {
    0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    33% { transform: translateY(-15px) translateX(-10px) rotate(120deg); }
    66% { transform: translateY(-25px) translateX(8px) rotate(240deg); }
  }
  
  @keyframes float-fast {
    0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
    50% { transform: translateY(-40px) translateX(20px) rotate(180deg); }
  }
  
  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
  .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
  .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
  .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
  .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
`;

interface Fund {
  id: string;
  name: string;
  category: string;
  logo: string;
  logoColor: string;
  launchDate: string;
  aum: string;
  returns: {
    oneYear: string;
    threeYear: string;
    fiveYear: string;
  };
}

const fundsData: Fund[] = [
  {
    id: '1',
    name: 'Motilal Oswal Flexi Cap Fund Regular Plan-Growth Option',
    category: 'Equity: Flexi Cap',
    logo: 'mo',
    logoColor: 'bg-blue-600',
    launchDate: '08-04-2014',
    aum: '1,342.70',
    returns: {
      oneYear: '12.18',
      threeYear: '26.05',
      fiveYear: '20.12'
    }
  },
  {
    id: '2',
    name: 'Invesco India Flexi Cap Fund - Growth',
    category: 'Equity: Flexi Cap',
    logo: '🏔️',
    logoColor: 'bg-blue-500',
    launchDate: '05-02-2022',
    aum: '326.69',
    returns: {
      oneYear: '11.48',
      threeYear: '25.47',
      fiveYear: '0'
    }
  },
  {
    id: '3',
    name: 'WhiteOak Capital Flexi Cap Fund Regular Plan-Growth',
    category: 'Equity: Flexi Cap',
    logo: '🌳',
    logoColor: 'bg-green-600',
    launchDate: '05-08-2022',
    aum: '546.61',
    returns: {
      oneYear: '9.79',
      threeYear: '0',
      fiveYear: '0'
    }
  },
  {
    id: '4',
    name: 'Parag Parikh Flexi Cap Fund - Regular Plan - Growth',
    category: 'Equity: Flexi Cap',
    logo: 'PPAS',
    logoColor: 'bg-green-500',
    launchDate: '05-05-2013',
    aum: '11,039.23',
    returns: {
      oneYear: '9.63',
      threeYear: '22.23',
      fiveYear: '24.1'
    }
  }
];

const TopPerformingFunds: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Equity: Flexi Cap');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ['Equity: Flexi Cap', 'Equity: Large Cap', 'Equity: Mid Cap', 'Equity: Small Cap'];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen/3 bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 p-6 relative overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Enhanced Animated Background Objects */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-orange-300/20 rounded-full animate-float-slow blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-orange-300/25 to-yellow-300/15 rounded-full animate-float-medium blur-lg"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-yellow-200/20 to-orange-200/30 rounded-full animate-float-fast blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-gradient-to-br from-orange-200/25 to-yellow-200/20 rounded-full animate-float-slow blur-lg"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-gradient-to-br from-yellow-300/15 to-orange-300/15 rounded-full animate-float-medium transform -translate-x-1/2 -translate-y-1/2 blur-xl"></div>
      </div> */}
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Top Performing Funds
            </h1>
            <p className="text-gray-600 text-base">Discover the best investment opportunities</p>
          </div>
          
          {/* Enhanced Category Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 bg-white/70 backdrop-blur-lg border border-yellow-200 rounded-xl px-6 py-3 text-gray-700 hover:bg-white/90 hover:shadow-xl hover:border-yellow-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-w-[200px]"
            >
              <span className="font-medium">{selectedCategory}</span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </motion.button>
            
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg border border-yellow-200 rounded-xl shadow-2xl z-20 overflow-hidden"
              >
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-yellow-50 hover:text-yellow-800 transition-colors duration-200 border-b border-yellow-100 last:border-b-0"
                  >
                    {category}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Funds Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
        >
          {fundsData.map((fund, index) => (
            <motion.div 
              key={fund.id}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              className="group bg-white/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-yellow-100 hover:shadow-2xl hover:border-yellow-300 transition-all duration-200 relative overflow-hidden min-h-[380px]"
            >
              {/* Glassmorphism Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-yellow-50/40 rounded-xl"></div>
              <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-bl from-yellow-200/40 to-orange-200/20 rounded-bl-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Enhanced Header with Logo and Category */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-14 h-14 ${fund.logoColor} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:shadow-lg transition-shadow duration-300`}>
                    {fund.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-xs leading-tight mb-2 group-hover:text-gray-800 transition-colors duration-300">
                      {fund.name}
                    </h3>
                    <span className="inline-block bg-gradient-to-r from-orange-400 to-orange-500 text-white text-[10px] px-2 py-1 rounded-md font-semibold shadow-sm">
                      {fund.category}
                    </span>
                  </div>
                </div>

                {/* Enhanced Fund Details */}
                <div className="space-y-4">
                  {/* Launch Date and AUM with Icons */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-yellow-50/60 rounded-md p-2 border border-yellow-100">
                      <p className="text-[10px] text-gray-500 mb-1 font-medium">📅 Launch Date</p>
                      <p className="text-xs font-bold text-gray-900">{fund.launchDate}</p>
                    </div>
                    <div className="bg-orange-50/60 rounded-md p-2 border border-orange-100">
                      <p className="text-[10px] text-gray-500 mb-1 font-medium">💰 AUM (Cr)</p>
                      <p className="text-xs font-bold text-gray-900">₹{fund.aum}</p>
                    </div>
                  </div>

                  {/* Enhanced Returns Section */}
                  <div className="bg-gradient-to-r from-yellow-50/80 to-orange-50/60 rounded-lg p-2 border border-yellow-200">
                    <p className="text-xs text-gray-700 mb-2 font-semibold flex items-center gap-2">
                      📈 Returns (%)
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center bg-white/60 rounded p-2 border border-yellow-100">
                        <p className="text-[10px] text-gray-500 mb-1 font-medium">1Y</p>
                        <p className="text-base font-bold text-green-600">
                          {fund.returns.oneYear}%
                        </p>
                      </div>
                      <div className="text-center bg-white/60 rounded p-2 border border-yellow-100">
                        <p className="text-[10px] text-gray-500 mb-1 font-medium">3Y</p>
                        <p className="text-base font-bold text-green-600">
                          {fund.returns.threeYear || 'N/A'}
                        </p>
                      </div>
                      <div className="text-center bg-white/60 rounded p-2 border border-yellow-100">
                        <p className="text-[10px] text-gray-500 mb-1 font-medium">5Y</p>
                        <p className="text-base font-bold text-green-600">
                          {fund.returns.fiveYear || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-2 text-xs"
                  >
                    Invest Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TopPerformingFunds;