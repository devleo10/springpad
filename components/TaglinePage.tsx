"use client";

import Image from "next/image";
import {
  FaHome,
  FaUmbrellaBeach,
  FaGraduationCap,
  FaRing,
} from "react-icons/fa";

const cards = [
  {
    title: "Dream Home",
    Icon: FaHome,
  },
  {
    title: "Retirement",
    Icon: FaUmbrellaBeach,
  },
  {
    title: "Child's Education",
    Icon: FaGraduationCap,
  },
  {
    title: "Child's Wedding",
    Icon: FaRing,
  },
];

export default function TaglinePage() {
  return (
    <div className="pb-32 bg-white flex flex-col justify-center px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="space-y-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-neutral-800 mb-8 font-bold tracking-tight">
            It&apos;s Always A Good Time To Invest And Plan!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {cards.map(({ title, Icon }, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-3 p-6 bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl border border-yellow-100 hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 mb-2">
                  <Icon className="w-8 h-8 drop-shadow-lg" />
                </div>
                <div className="font-bold text-neutral-800 text-base md:text-lg tracking-wide group-hover:text-yellow-500 transition-colors duration-300 mb-2">
                  {title}
                </div>
                <div className="absolute right-0 top-0 w-16 h-16 bg-yellow-100 rounded-bl-3xl blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col items-center justify-center lg:justify-end gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl transform rotate-3 opacity-20"></div>
            <Image
              src="/family.png"
              alt="Financial Planning & Mutual Fund Investment"
              width={600}
              height={600}
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
          <button className="px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-neutral-800 rounded-xl font-bold text-lg shadow-lg transition-all duration-300">
            Know More
          </button>
        </div>
      </div>
    </div>
  );
}
