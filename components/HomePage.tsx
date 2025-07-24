"use client";
import React from "react";

const HomePage = () => {
  return (
    <div className="pb-16 sm:pb-24 md:pb-32 min-h-screen w-full">
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

        {/* Hero text at bottom for mobile */}
        <div className="flex-1 flex items-start justify-center px-2 pt-[90px]">
          <h2
            style={{ transform: "scaley(1.1)" }}
            className="text-center text-3xl sm:text-3xl font-semibold leading-tight"
          >
            <span className="bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent mb-4 block">
              Smarter Funds, Sharper Returns
            </span>
            <span className="z-10 relative text-bold bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent block">
              with AI Precision.
            </span>
          </h2>
        </div>
      </section>

      {/* Desktop Layout - Overlaid */}
      <section className="hidden md:flex bg-transparent relative overflow-hidden min-h-screen items-center justify-center p-2 sm:p-4 md:p-6">
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

          {/* Punchline Text */}
          <div className="absolute top-[15%] sm:top-[20%] md:top-[25%] lg:top-[30%] xl:top-[35vw] inset-0 flex items-center justify-center z-10 px-2 sm:px-4">
            <h2
              style={{ transform: "scaley(1.1)" }}
              className="text-center text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl 2xl:text-7xl font-semibold leading-tight"
            >
              <span className="bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent block sm:inline sm:mr-1 md:mr-2 lg:mr-4 xl:ml-[50px] xl:mr-[60px] 2xl:ml-[100px] 2xl:mr-[120px]">
                Smarter Funds,
              </span>
              <span className="bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent block sm:inline sm:mr-1 md:mr-2 lg:mr-4 xl:mr-[30px] 2xl:mr-[60px]">
                Sharper Returns
              </span>
              <br className="hidden sm:block" /> 
            
              <span className="z-10 relative text-bold bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent block mt-1 sm:mt-0">
                with AI Precision.
              </span>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
