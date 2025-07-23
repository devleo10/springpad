"use client";
import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-transparent relative overflow-hidden min-h-screen flex items-center justify-center pt-20">
        {/* Video Wrapper with relative positioning */}
        <div className="relative w-full max-w-5xl aspect-video overflow-hidden rounded-lg">
          {/* Background Video */}
          <video
            className="w-full h-full object-cover"
            src="/heroVid.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />

          {/* Punchline Text */}
          <div className="absolute inset-0 flex items-center justify-center z-10 px-4">
            <h2 className="text-center text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-[0_6px_20px_rgba(0,0,0,0.25)]">
              <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:text-neutral-200 transition-colors duration-300">
                Smarter Funds,&nbsp;
              </span>
              <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:text-neutral-200 transition-colors duration-300">
                Sharper Returns&nbsp;
              </span>
              <span className="bg-gradient-to-r from-[#ffb400] via-[#ff9500] to-[#ff8c00] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,140,0,0.4)] hover:from-[#ff9500] hover:to-[#ff7700] transition-all duration-300 animate-pulse">
                — with AI Precision.
              </span>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
