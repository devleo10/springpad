"use client";

import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const faqs = [
  {
    question:
      "What is SpringPad and how does it help with mutual fund investments?",
    answer:
      "SpringPad is a comprehensive mutual fund investment platform that provides AI-driven insights, portfolio analysis, and smart investment tools to help you make informed decisions about mutual fund investments and achieve your financial goals.",
  },
  {
    question: "How do I start investing in mutual funds through SpringPad?",
    answer:
      "Getting started is simple! Create your account, complete your KYC verification, set your investment goals, and our AI will recommend suitable mutual fund schemes based on your risk profile and financial objectives.",
  },
  {
    question: "What types of mutual funds can I invest in?",
    answer:
      "You can invest in a wide range of mutual funds including equity funds, debt funds, hybrid funds, ELSS (tax-saving funds), index funds, and international funds from top AMCs like HDFC, ICICI Prudential, SBI, and more.",
  },
  {
    question: "Are there any charges or fees for investing through SpringPad?",
    answer:
      "SpringPad offers direct mutual fund investments with zero commission. You only pay the fund management fees (expense ratio) charged by the AMCs, which are typically lower in direct plans compared to regular plans.",
  },
  {
    question: "Is my money and personal information safe with SpringPad?",
    answer:
      "Absolutely! We are SEBI registered and use bank-level security encryption. Your investments are held with registered depositories, and we follow strict compliance and security protocols to protect your data and investments.",
  },
  {
    question:
      "Can I set up SIP (Systematic Investment Plan) through SpringPad?",
    answer:
      "Yes! You can easily set up SIPs starting from as low as ₹500 per month. Our platform also offers SIP calculators, step-up SIPs, and automated investment features to help you build wealth systematically.",
  },
  {
    question: "How does SpringPad's AI help in mutual fund selection?",
    answer:
      "Our AI analyzes your financial goals, risk tolerance, investment horizon, and market conditions to recommend the most suitable mutual fund schemes. It also provides portfolio rebalancing suggestions and performance tracking.",
  },
  {
    question: "Can I withdraw my mutual fund investments anytime?",
    answer:
      "Yes, most mutual funds offer liquidity, though some may have exit loads if redeemed within a specific period. ELSS funds have a 3-year lock-in period. You can track and manage all your redemptions through our platform.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="px-4 max-w-6xl mx-auto bg-white pb-32">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Frequently <span className="text-yellow-600">Asked</span> Questions
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Get answers to common questions about mutual fund investments, our
          platform features, and how SpringPad can help you build wealth through
          smart mutual fund investing.
        </p>
      </div>

      <div className="bg-gray-50 p-8 rounded-3xl shadow-sm space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md"
          >
            <button
              onClick={() => toggle(index)}
              className="flex justify-between items-center w-full text-left group"
            >
              <span className="font-semibold text-lg text-gray-900 group-hover:text-yellow-700 transition-colors duration-200">
                {faq.question}
              </span>
              <span className="text-yellow-600 bg-yellow-100 p-2 rounded-full transition-all duration-200 group-hover:bg-yellow-600 group-hover:text-white">
                {openIndex === index ? (
                  <FaTimes className="w-4 h-4" />
                ) : (
                  <FaPlus className="w-4 h-4" />
                )}
              </span>
            </button>
            {openIndex === index && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-gray-700 text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
