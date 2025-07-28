"use client";
import React from "react";

const HomePage = () => {
  return (
    <div className="pb-16 sm:pb-24 md:pb-32 min-h-screen w-full">
      {/* Removed hero animation and text. */}
      {/* Mobile Layout - Stacked */}
      <section className="md:hidden bg-transparent relative overflow-hidden min-h-screen flex flex-col p-4">
        {/* Video on top for mobile */}
        <div className="w-full h-[30vh] rounded-lg overflow-hidden mt-[220px]">
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

      {/* Demo text for mobile */}
      <div className="w-full flex items-center justify-center px-2 mt-6">
        <h2 className="text-center text-3xl sm:text-3xl font-semibold leading-tight">Demo Text</h2>
      </div>
      </section>

      {/* Desktop Layout - Overlaid */}
      <section className="hidden md:flex bg-transparent relative overflow-hidden min-h-screen flex-col items-center justify-center p-2 sm:p-4 md:p-6">
        {/* Video Wrapper with relative positioning */}
        <div className="max-w-4xl aspect-video overflow-hidden h-[80%] sm:h-[85%] md:h-[90%] w-[95%] sm:w-[90%] md:w-[85%] lg:w-auto rounded-lg">
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
        </div>
        {/* Demo text for desktop */}
        <div className="w-full flex items-center justify-center px-2 mt-6">
          <h2 className="text-center text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">Demo Text</h2>
        </div>
      </section>
    </div>
  );
};

export default HomePage;