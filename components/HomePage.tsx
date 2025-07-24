"use client";
import React from "react";
import { PointerHighlight } from "./ui/pointer-highlight";

const HomePage = () => {
  return (
    <div className="pb-32 min-h-screen w-full">
      <section className="bg-transparent relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Video Wrapper with relative positioning */}
        <div className="max-w-5xl aspect-video overflow-hidden h-[95%] rounded-lg">
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
              <span className="bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent mr-[230px]">
                {" "}
                {/* Added mr-8 for margin-right */}
                Smarter Funds,
              </span>
              <span className="bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                Sharper Returns
              </span>
              {/* <span className="bg-gradient-to-b from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                <br />
                with AI Precision.
              </span> */}
              <br /> 
              <PointerHighlight
                rectangleClassName="bg-yellow-200 border-yellow-300 leading-loose"
                pointerClassName="text-yellow-500 h-3 w-3"
                containerClassName="inline-block mx-1"
              >
                <span className="z-10 relative text-bold bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-600 bg-clip-text text-transparent">
                  {" "}
                  with AI Precision.
                </span>
              </PointerHighlight>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
