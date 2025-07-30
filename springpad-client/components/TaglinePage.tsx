"use client";

import Image from "next/image";

const cards = [
  {
    title: "Dream Home",
    imageSrc: "/house.png",
  },
  {
    title: "Retirement",
    imageSrc: "/beach.png",
  },
  {
    title: "Child's Education",
    imageSrc: "/graduation.png",
  },
  {
    title: "Child's Wedding",
    imageSrc: "/icons/wedding.png",
  },
];

export default function TaglinePage() {
  return (
    <div className="pb-32 bg-white flex flex-col justify-center px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="space-y-8">
          <h1 className="text-3xl md:text-3xl lg:text-4xl text-[#2C5282] mb-8 font-bold">
            It&apos;s Always A{" "}
            <span className="animated-underline font-semibold text-yellow-500">
              Good Time To Invest
            </span>{" "}
            <br />
            And Plan!
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cards.map(({ title, imageSrc }, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-yellow-100 group overflow-hidden transition-all duration-300 ease-in-out hover:border-yellow-300 hover:shadow-2xl shadow-xl"
              >
                {/* Hover Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

                {/* Image Box */}
                <div className="z-10 w-14 h-14 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg mb-2 group-hover:scale-110 transition-all ease-in-out duration-300">
                  <Image
                    src={imageSrc}
                    alt={title}
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                </div>

                {/* Title */}
                <div className="z-10 font-semibold text-[#2C5282] text-base md:text-lg text-center tracking-wide">
                  {title}
                </div>

                {/* Circular Background Blur */}
                <div className="z-0 absolute -top-4 -right-4 w-16 h-16 bg-yellow-100 opacity-20 rounded-full blur-2xl pointer-events-none group-hover:opacity-40 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center justify-center lg:justify-end gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-300 rounded-3xl transform rotate-5 opacity-50"></div>
            <Image
              src="/family.png"
              alt="Financial Planning & Mutual Fund Investment"
              width={600}
              height={600}
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
                    <button className="px-8 py-3 bg-yellow-300 hover:bg-yellow-400 text-[#2C5282] rounded-xl font-bold text-lg shadow-lg transition-all duration-300">
            Explore Our Calculators →
          </button>
        </div>
      </div>
    </div>
  );
}
