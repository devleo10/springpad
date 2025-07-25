"use client";
import React from "react";
import Image from "next/image";

const logo = "/client_logos.png";

function OurPartners() {
  return (
    <section className="bg-white pb-32">
      <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-[#2C5282] mb-2">
          Our Trusted Partners
        </h2>
        <p className="text-sm text-neutral-500 mb-10">
          These banks and AMCs partner with us to bring smarter investments to you.
        </p>

        {/* Vertical marquee container */}
        <div className="overflow-hidden relative w-full h-40 flex justify-center items-center mx-auto">
          {/* Marquee inner wrapper for vertical animation */}
          <div className="flex flex-col animate-marquee-vertical">
            {/* First image */}
            <Image
              alt="Partner Logos"
              src={logo}
              width={1000}
              height={250}
              className="object-contain mb-4"
              priority
            />
            {/* Duplicate image for seamless infinite scroll */}
            <Image
              alt="Partner Logos"
              src={logo}
              width={1000}
              height={250}
              className="object-contain mb-4"
              priority
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        
        .animate-marquee-vertical {
          animation: marquee-vertical 10s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default OurPartners;