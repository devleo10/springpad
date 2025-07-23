"use client";
import React from "react";
import Image from "next/image";

const logos = [
  "/bank1.png",
  "/bank2.png",
  "/bank3.png",
  "/bank4.png",
  "/bank5.png",
  "/bank6.png",
  "/bank7.png",
];

function OurPartners() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-neutral-800 mb-2">
          Trusted by leading mutual fund institutions
        </h2>
        <p className="text-sm text-neutral-500 mb-10">
          These banks and AMCs partner with us to bring smarter investments to
          you.
        </p>

        {/* Outer wrapper */}
        <div className="overflow-hidden relative w-full">
          {/* Marquee inner wrapper */}
          <div className="flex animate-marquee">
            {/* Combined logos array for seamless scrolling */}
            {[...logos, ...logos, ...logos].map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center flex-shrink-0 min-w-[200px] px-8"
              >
                <Image
                  src={logo}
                  alt={`Partner ${(idx % logos.length) + 1}`}
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurPartners;
