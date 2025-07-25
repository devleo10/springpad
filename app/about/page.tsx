"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import {
  FaLinkedin,
  FaTwitter,
  FaEnvelope,
  FaGraduationCap,
  FaTrophy,
  FaUsers,
  FaRocket,
} from "react-icons/fa";
import { useState } from "react";

export default function AboutPage() {
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>(
    {}
  );

  const teamMembers = [
    {
      name: "Rahul Chandra",
      position: "Founder & CEO",
      description:
        "Rahul Chandra is the founder of SpringPad Mutual Fund, where he combines his deep expertise in finance with a passion for enabling sustainable investment growth. With over a decade of experience in private equity capital, equity research and asset management, Rahul has built a reputation for fostering long-impact investment strategies in the Indian markets.",
      image: "/rahul.avif",
      linkedin: "#",
      twitter: "#",
      email: "rahul@springpad.com",
    },
    {
      name: "Pratik Chakrabarty",
      position: "Co-founder & CTO",
      description:
        "Pratik Chakrabarty, co-founder of SpringPad Mutual Fund, is a seasoned multi-asset international markets hedge fund trader, financial strategist with extensive experience in equity markets and wealth management. His commitment to ethical investing and financial inclusion shapes SpringPad's vision as a transparent, sustainable mutual fund platform. Pratik's expertise in blending quantitative and modern investment approaches has positioned him as a trusted figure in the financial community, inspiring investors to achieve their long-term financial goals.",
      image: "/pratik.avif",
      linkedin: "#",
      twitter: "#",
      email: "pratik@springpad.com",
    },
  ];

  const stats = [
    { icon: <FaUsers />, value: "10K+", label: "Happy Investors" },
    { icon: <FaTrophy />, value: "₹500Cr+", label: "Assets Under Management" },
    { icon: <FaRocket />, value: "15%", label: "Average Returns" },
    { icon: <FaGraduationCap />, value: "50+", label: "Financial Tools" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      {/* Hero Section */}
      <div className="p-6">
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white py-20 rounded-3xl">
          <div className="absolute inset-0 opacity-10"></div>
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-6">
                  SpringPad: Your Financial Compass
                </h1>
                <p className="text-xl mb-8 leading-relaxed">
                  SpringPad is more than just a platform; it&apos;s your trusted
                  partner on your financial journey. We&apos;re committed to
                  simplifying the complex world of investments and helping you
                  achieve your financial goals.
                </p>
                <div className="flex gap-4">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Start Investing
                  </button>
                  <button className="border-2 border-white hover:bg-white hover:text-[#2C5282] text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                      <div className="h-8 w-8 bg-yellow-400 rounded mb-2"></div>
                      <div className="text-sm">Portfolio Growth</div>
                      <div className="text-2xl font-bold">+24.5%</div>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                      <div className="h-8 w-8 bg-green-400 rounded mb-2"></div>
                      <div className="text-sm">Risk Score</div>
                      <div className="text-2xl font-bold">7.2/10</div>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl col-span-2">
                      <div className="h-16 bg-gradient-to-r from-yellow-400 to-green-400 rounded mb-2 flex items-end justify-around p-2">
                        <div className="bg-white bg-opacity-50 w-3 h-8 rounded"></div>
                        <div className="bg-white bg-opacity-50 w-3 h-12 rounded"></div>
                        <div className="bg-white bg-opacity-50 w-3 h-6 rounded"></div>
                        <div className="bg-white bg-opacity-50 w-3 h-14 rounded"></div>
                        <div className="bg-white bg-opacity-50 w-3 h-10 rounded"></div>
                      </div>
                      <div className="text-sm">Monthly Performance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SpringPad is your personal dedicated Mutual Fund advisor,
              empowering you with the tools and advisory to make informed
              financial decisions. Our AI-powered technology creates
              personalized mutual fund portfolios tailored to your unique goals
              and risk tolerance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                Cutting-edge technology to simplify complex financial decisions
                and optimize your investment strategy.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-gray-600">
                Transparent processes and ethical practices that put your
                financial well-being at the center of everything we do.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrophy className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                Dedicated to delivering superior investment outcomes and
                exceptional customer experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6">
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 py-16 px-8 relative z-10 rounded-3xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Impact</h2>
              <p className="text-xl text-gray-300">
                Numbers that reflect our commitment to your financial success
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-yellow-400 text-2xl">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Features */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">
              Our platform offers the best AI-Powered mutual fund selections
              specifically catering to all your goals
            </p>
          </div>

          <div className="mb-12 bg-blue-50 p-8 rounded-2xl">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our platform offers the best AI-Powered mutual fund selections
              specifically catering to all your goals, allowing you to maximize
              your returns and achieve your plans. Our core plans focus on your
              financial goals like buying assets, financial freedom, retirement
              benefits etc. Our investment strategies have been tested and
              proven by a dedicated team of financial experts is always ready to
              assist you, providing personalized advice and support. Join the
              SpringPad community and let&apos;s together embark on a journey
              towards your financial freedom.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to your financial success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-yellow-100 relative">
                    {!imageErrors[index] ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [index]: true }))
                        }
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-[#2C5282] to-[#4A90E2] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-yellow-600 font-semibold mb-4">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {member.description}
                    </p>
                    <div className="flex gap-4">
                      <a
                        href={member.linkedin}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaLinkedin className="text-xl" />
                      </a>
                      <a
                        href={member.twitter}
                        className="text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <FaTwitter className="text-xl" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <FaEnvelope className="text-xl" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of investors who trust SpringPad with their financial
            future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Start Investing Today
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-yellow-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
