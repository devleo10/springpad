"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const HomePage = () => {
  const aiRefMobile = useRef<HTMLSpanElement>(null);
  const aiRefDesktop = useRef<HTMLSpanElement>(null);
  const precisionRefMobile = useRef<HTMLSpanElement>(null);
  const precisionRefDesktop = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const animateSequence = () => {
      // Initial state: Hide AI elements and position them at the very top of the screen
      gsap.set([aiRefMobile.current, aiRefDesktop.current], {
        opacity: 0,
        y: -window.innerHeight // Drop from the very top of the viewport
      });

      // Timeline for the animation sequence
      const tl = gsap.timeline();

      // Step 1: Wait 2 seconds, then create gap by moving "Precision" to the right
      tl.to([precisionRefMobile.current, precisionRefDesktop.current], {
        x: 20, // Move "Precision" 40px to the right to create gap
        duration: 0.6,
        ease: "power2.out",
        delay: 2
      })
      // Step 2: Drop in "AI" with bounce effect
      .to([aiRefMobile.current, aiRefDesktop.current], {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "bounce.out"
      }, "-=0.3") // Start slightly before the gap animation finishes
      // Step 3: Add yellow highlighting and continuous bouncing
      .to([aiRefMobile.current, aiRefDesktop.current], {
        color: "#2C5282", // Blue text color
        textShadow: "4px 8px 0 rgba(44, 82, 130, 0.7)",
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      })
      // Step 4: Continuous bouncing animation
      .to([aiRefMobile.current, aiRefDesktop.current], {
        y: -10,
        duration: 0.6,
        ease: "power2.out",
        repeat: -1, // Infinite repeat
        yoyo: true // Bounce back and forth
      });
    };

    animateSequence();
  }, []);
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
            <span className="bg-gradient-to-b from-[#2C5282] via-[#2C5282] to-[#1a3a5c] bg-clip-text text-transparent mb-4 block">
              <span>Smarter Funds, </span>
              <span>Sharper Returns </span>
              <span>with </span>
              <span
                ref={aiRefMobile}
                className="inline-block px-2 py-1 rounded-md"
                style={{ opacity: 0, transform: `translateY(-${window.innerHeight}px)` }}
              >
                AI{" "}
              </span>
              <span ref={precisionRefMobile} className="inline-block">
                Precision.
              </span>
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
              <span className="bg-gradient-to-b from-[#2C5282] via-[#2C5282] to-[#1a3a5c] bg-clip-text text-transparent block sm:inline sm:mr-1 md:mr-2 lg:mr-4 xl:ml-[50px] xl:mr-[60px] 2xl:ml-[100px] 2xl:mr-[120px]">
                Smarter Funds,
              </span>
              <span className="bg-gradient-to-b from-[#2C5282] via-[#2C5282] to-[#1a3a5c] bg-clip-text text-transparent block sm:inline sm:mr-1 md:mr-2 lg:mr-4 xl:mr-[30px] 2xl:mr-[60px]">
                Sharper Returns
              </span>
              <br className="hidden sm:block" /> 
              <span className="bg-gradient-to-b from-[#2C5282] via-[#2C5282] to-[#1a3a5c] bg-clip-text text-transparent">
                with{" "}
              </span>
              <span
                ref={aiRefDesktop}
                className="bg-gradient-to-b from-[#2C5282] via-[#2C5282] to-[#1a3a5c] bg-clip-text text-transparent inline-block px-2 py-1 rounded-md"
                style={{ opacity: 0, transform: `translateY(-${window.innerHeight}px)` }}
              >
                AI{" "}
              </span>
              <span 
                ref={precisionRefDesktop}
                className="z-10 relative text-bold bg-gradient-to-b from-[#2C5282] via-[#2C5282] to-[#1a3a5c] bg-clip-text text-transparent inline-block"
              >
                Precision.
              </span>
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;