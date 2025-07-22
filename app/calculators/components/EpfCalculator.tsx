import React from 'react';
const EpfCalculator = () => (
  <div className="group bg-transparent backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl relative overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:border-white/50 duration-500 text-white cursor-pointer mb-6">
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
    <div className="relative z-10">
      <h2 className="text-2xl font-bold mb-2">EPF Calculator</h2>
      <p>Calculator coming soon...</p>
    </div>
    <div className="absolute top-0 right-0 w-0 h-0 border-l-[15px] border-l-transparent border-t-[15px] border-t-white/20 group-hover:border-t-white/40 transition-colors duration-300" />
  </div>
);
export default EpfCalculator; 