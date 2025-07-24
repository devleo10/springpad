"use client";

import React from "react";
import Image from "next/image";

const Feature2 = () => {
  return (
    <section className="bg-white py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get <span className="underline decoration-blue-400">financial</span> <br /> assistance with <br /> MOPD fund
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 max-w-md">
            The fund to provide financial assistance to families of K-12 students with disabilities
          </p>
          {/* CTA Buttons */}
          <div className="flex gap-4 mb-8">
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-5 rounded-lg">
              Apply now
            </button>
            <button className="border border-blue-500 hover:bg-blue-50 text-blue-600 font-semibold py-2 px-5 rounded-lg">
              Watch about us
            </button>
          </div>
          {/* Stats */}
          <div className="flex gap-10 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-800">54%</p>
              <p className="text-sm text-gray-500">Funds delivered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-800">4 340+</p>
              <p className="text-sm text-gray-500">Approved applications</p>
            </div>
          </div>
        </div>

        {/* Right Image & Stats */}
        <div className="relative">
          {/* Dummy group image */}
          <div className="rounded-xl overflow-hidden mb-4">
            <Image
              src="/family.png"
              alt="group of kids"
              width={500}
              height={300}
              className="rounded-xl object-cover w-full h-auto"
            />
          </div>

          {/* Floating Cards */}
          <div className="absolute top-0 right-0 bg-white rounded-xl shadow-lg p-3 text-center text-sm">
            <p className="font-bold text-blue-700">$1000</p>
            <p className="text-gray-500">Maximum benefit<br />per family</p>
          </div>

          <div className="absolute bottom-2 right-0 bg-white rounded-xl shadow-lg p-3 text-center text-sm flex flex-col items-center">
            <Image
              src="/family.png"
              alt="people helped"
              width={80}
              height={40}
              className="rounded-full mb-2"
            />
            <p className="font-bold text-blue-700">12 347+</p>
            <p className="text-gray-500">People helped</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature2;
