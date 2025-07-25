"use client";

import React from "react";
import Image from "next/image";

// Security feature data with enhanced descriptions
const features = [
  {
    title: "Verified By Verisign",
    description:
      "SSL certification ensures your data is encrypted and protected during transmission.",
    image: "/verification.png",
    badge: "Certified",
  },
  {
    title: "No Money Can Be Moved",
    description:
      "We only provide investment recommendations. Your funds remain secure in your own accounts.",
    image: "/secure-money-2.png",
    badge: "Zero Risk",
  },
  {
    title: "Password Encryption",
    description:
      "Advanced encryption algorithms protect your login credentials and personal information.",
    image: "/password.png",
    badge: "256-bit SSL",
  },
  {
    title: "Bank Level Security",
    description:
      "Industry-standard security protocols ensure your financial data stays confidential.",
    image: "/bank-level-security.png",
    badge: "Enterprise Grade",
  },
];

const Feature = ({
  title,
  description,
  image,
  badge,
}: {
  title: string;
  description: string;
  image: string;
  badge: string;
}) => (
  <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
    {/* Security Badge */}
    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-md">
        {badge}
      </span>
    </div>

    {/* Feature illustration */}
    <div className="w-24 h-24 mx-auto mb-6 mt-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300"></div>
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Image
          src={image}
          alt={title}
          width={64}
          height={64}
          className="object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>

    {/* Feature content */}
    <div className="text-center space-y-3">
      <h3 className="text-lg font-bold text-[#2C5282] group-hover:text-[#1E3A8A] transition-colors duration-300">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>

    {/* Decorative element */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-400 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
  </div>
);

const FeaturePage = () => {
  return (
    <section className="pb-32 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <span className="bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-semibold mb-6 inline-block shadow-lg">
              Why Choose Us
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#2C5282] to-[#1E3A8A] bg-clip-text text-transparent mb-6 leading-tight">
            Reasons To Invest With Us
          </h1>
          <h2 className="text-xl md:text-2xl text-[#2C5282] font-medium max-w-3xl mx-auto leading-relaxed">
            Trust Us, Your Savings Are In{" "}
            <span className="text-yellow-600 font-bold">Safe Hands</span>
          </h2>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>10,000+ Happy Investors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>₹500+ Crores Invested</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>5+ Years Experience</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Feature {...feature} />
            </div>
          ))}
        </div>

        {/* Enhanced Description */}
        <div className="text-center mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-yellow-400 rounded-full"></div>
                <div className="w-4 h-1 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-1 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              We value the trust you place in us. That&apos;s why we are
              committed to maintaining the
              <span className="font-semibold text-[#2C5282]">
                {" "}
                highest standards
              </span>{" "}
              for securing transactions and
              <span className="font-semibold text-[#2C5282]">
                {" "}
                customer confidentiality
              </span>
              . Your financial journey is our responsibility.
            </p>
          </div>
        </div>

        {/* Enhanced Call to Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="group relative bg-yellow-400 hover:bg-yellow-500 text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 min-w-[250px]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Investing Now
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-black/10 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              <span className="text-gray-500 text-lg font-medium">OR</span>
              <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            </div>

            <button className="group relative border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-black px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 min-w-[250px]">
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Get Free Consultation
              </span>
            </button>
          </div>

          {/* Additional trust elements */}
          <p className="text-sm text-gray-500 mt-6">
            Free consultation • No hidden charges • Expert guidance
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturePage;
