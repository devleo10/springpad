"use client";
import React from "react";
import { PointerHighlight } from "./ui/pointer-highlight";

const HomePage = () => {
  return (
    <div className="pb-32 min-h-screen w-full">
      <section className="bg-transparent relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Video Wrapper with relative positioning */}
        <div className="max-w-4xl aspect-video overflow-hidden h-[90%] rounded-lg">
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
          <div className="absolute top-[35vw] inset-0 flex items-center justify-center z-10 px-4">
            <h2
              style={{ transform: "scaley(1.1)" }}
              className="text-center text-4xl md:text-6xl lg:text-7xl font-semibold"
            >
              <span className="bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent ml-[100px] mr-[120px]">
                {" "}
                {/* Added mr-8 for margin-right */}
                Smarter Funds,
              </span>
              <span className="bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent mr-[60px]">
                Sharper Returns
              </span>
              {/* <span className="bg-gradient-to-b from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                <br />
                with AI Precision.
              </span> */}
              <br /> 
            
                <span className="z-10 relative text-bold bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
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
