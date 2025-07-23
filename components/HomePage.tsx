import { ArrowRight, BarChart3, Shield, TrendingUp, Users } from "lucide-react";
import React from "react";
import DemoMutualFunds from "./DemoMutualFunds";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-transparent relative overflow-hidden min-h-screen flex flex-col items-center justify-center pt-20">
        {/* Background Video */}
        <div className="relative w-full max-w-5xl aspect-video flex items-center justify-center overflow-hidden rounded-lg">
          <video
            className="w-full h-full object-cover"
            src="/heroVid.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>
        
        {/* Punchline Text */}
        <div className="w-full text-center px-4 -mt-8">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
            <span className="text-gray-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:text-black transition-colors duration-300">Smarter Funds, </span>
            <span className="text-gray-900 drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:text-black transition-colors duration-300">Sharper Returns </span>
            <span className="bg-gradient-to-r from-[#ffb400] via-[#ff9500] to-[#ff8c00] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,140,0,0.4)] hover:from-[#ff9500] hover:to-[#ff7700] transition-all duration-300 animate-pulse">— with AI Precision.</span>
          </h2>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
