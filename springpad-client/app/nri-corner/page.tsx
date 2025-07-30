"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaPlus, FaTimes, FaGlobe, FaUser, FaPassport } from "react-icons/fa";

const nriFaqs = [
  {
    question: "Who is an NRI?",
    answer:
      "A person who does NOT satisfy the following conditions is an NRI:\n\na) He/she is in India for 182 days or more during the financial year OR\n\nb) If he/she is in India for at least 365 days during the 4 years preceding that year AND at least 60 days in that year.",
  },
  {
    question: "Who is a person of Indian origin (PIO)?",
    answer:
      "A Person of Indian Origin (PIO) means a foreign citizen (except a national of Pakistan, Afghanistan Bangladesh, China, Iran, Bhutan, Sri Lanka and Nepal) who at any time held an Indian passport.\n\nOR who or either of their parents/ grand parents/ great grand parents was born and was permanently resident in India as defined in Government of India Act, 1935 and other territories that became part of India thereafter provided neither was at any time a citizen of any of the aforesaid countries (as referred above);\n\nOR Who is a spouse of a citizen of India or a PIO.",
  },
  {
    question: "What are the different types of rupee accounts that are permitted and can be maintained by NRIs?",
    answer:
      "A NRI can maintain three types of rupee accounts in India as mentioned below:\n\n• NRE: Non-Resident (External) Rupee Account\n• NRO: Non-Resident (Ordinary) Rupee Account\n• FCNR-B: Foreign Currency (Non-Resident)",
  },
  {
    question: "What are NRE and NRO accounts?",
    answer:
      "Non-Resident (External) Rupee (NRE) Account - NRE is a rupee bank account from which funds are freely repatriable. It can be opened with either funds remitted from abroad or local funds maintained in NRE/ FCNR accounts, which can be remitted abroad. The deposits can be used for all legitimate purposes. The balance in the account is freely repatriable.\n\nInterest credited to the NRE accounts is exempt from tax in the hands of the NRI.\n\nNon-Resident Ordinary Rupee (NRO) Account - NRO is a Rupee (INR) bank account and can be opened with funds either remitted from abroad or generated in India. The amounts in such an account generally cannot be repatriable. However, funds in NRO accounts can be remitted abroad subject to/as per various directives in force at the time of repatriation.",
  },
  {
    question: "What is the distinction between NRE and NRO accounts?",
    answer:
      "Balances held in NRE accounts can be repatriated abroad freely, while funds in NRO accounts cannot be remitted abroad but have to be used only for local payments in rupees. Funds due to the non-resident accountholder which do not qualify, under the Exchange Control regulations, for remittance outside India are required to be credited to NRO accounts.",
  },
  {
    question: "Which Mutual Fund houses (AMCs) accept investments from NRIs or PIOs?",
    answer:
      "All the Asset Management Companies (AMCs) in India don't allow NRIs especially from US and Canada because of the cumbersome compliance requirements under Foreign Account Tax Compliance Act (FATCA) in these countries. However, following fund houses do accept investments from NRIs from US and Canada:\n\n• Aditya Birla Sun Life Mutual Fund\n• Axis Mutual Fund\n• Bajaj Finserv Mutual Fund\n• Bandhan Mutual Fund\n• DSP Investment Managers\n• Edelweiss Asset Management\n• Groww Mutual Fund\n• HDFC Mutual Fund\n• ICICI Prudential Mutual Fund\n• IIFL Asset Management\n• ITI Mutual Fund\n• Kotak Mahindra Mutual Fund\n• Motilal Oswal Mutual Fund\n• Nippon India Mutual Fund\n• PPFAS Mutual Fund\n• Quant Mutual Fund\n• SBI Mutual Fund\n• Sundaram Mutual Fund\n• Samco Asset Management\n• UTI Mutual Fund\n• Whiteoak Mutual Fund",
  },
  {
    question: "Can NRIs from rest of the world (except from US and Canada) invest in Indian Mutual Funds?",
    answer:
      "NRIs from other countries can invest in almost all schemes of all asset management companies in India. They are allowed to invest in mutual funds in India on a repatriable or non-repatriable basis subject to regulations prescribed under the Foreign Exchange Management Act (FEMA). For NRIs (not from USA and Canada) the process of investing in Indian mutual funds is same as that of resident individuals.",
  },
  {
    question: "How the dividends and redemption proceeds are paid to NRIs?",
    answer:
      "Normally, dividends and redemptions are paid through direct credit to the designated bank account provided by the NRI in the scheme.",
  },
  {
    question: "Is the indexation benefit allowed to NRIs?",
    answer:
      "Yes, the indexation benefit is allowed to NRIs. Generally indexation benefit is required to be taken into account after 3 years of holding the units in Mutual Funds, while calculating long term capital gains taxes for specified mutual funds which have 35% - 65% of the portfolio in Equity.",
  },
  {
    question: "What is the taxation of mutual funds for NRIs?",
    answer:
      "Equity or Equity oriented Mutual Funds: Short term capital gains (holding period < 1 year) are taxed at 15%. Apart from this tax, the applicable Surcharge and Cess is also payable on the capital gains tax. However, long term capital gains (investments held for more than 1 year) are completely tax free, if the capital gains in a year is less then/ up to Rs 1 Lakh in a financial year. Capital gains exceeding Rs 1 Lakh in a financial year are taxed at 10% + applicable Surcharge and Cess is levied on it.\n\nDebt Funds: Short term capital gains (holding period < 3 years) are taxed as per income tax slab of the NRI investor, plus the applicable Surcharge and Cess is also payable. This is applicable for investments made till 31st March 2023. Long term capital gains (holding period > 3 years) are taxed (provided the funds are listed) at 20% after indexation, plus applicable Surcharge and Cess is also payable. This is applicable for investments made till 31st March 2023.\n\nHowever, following the Amendment to Finance Bill 2023, the indexation benefit on debt mutual funds has been withdrawn. Debt funds will now be taxed at the investor's tax slab rate. These changes bring taxation of debt and debt oriented mutual funds at par with fixed deposits for investments made from 1st April 2023 onwards.",
  },
  {
    question: "How and when Tax is deducted (TDS) at source in case of NRIs?",
    answer:
      "NRIs are subject to Tax Deducted at Source (TDS) at applicable rates on capital gains at the time of redemptions of mutual fund units, irrespective of any threshold value. The rate of TDS depends on the type of mutual fund and the duration of the investment.\n\nFor Equity oriented mutual funds, the TDS rate is 10% for long term capital gains (LTCG) and 15% for short term capital gains (STCG).\n\nFor non-equity-oriented funds, the TDS rate is 20% with indexation for LTCG for listed schemes and 10% without indexation for unlisted schemes. TDS on short term capital gains is as per the income tax slab rate of 30% assuming that the investor falls under the highest tax slab. Surcharge and Cess is payable, wherever applicable.",
  },
  {
    question: "What are Growth and Dividend Options in a Mutual Fund Scheme?",
    answer:
      "Growth and Dividend are essentially options of how investors want cash-flows. During the course of a year, a mutual fund scheme may make profits through dividends from shares ownership or interests from bonds owned by the scheme and also through portfolio churn (profit booking by buying and selling shares and bonds). In a growth option the profit is re-invested to generate more returns whereas in dividend option (Known as IDCW - Income distribution cum withdrawal) the profits are distributed to the investors on a regular basis (annual, semi-annual, quarterly, monthly etc.).\n\nDividends are declared on a per unit basis. Capital appreciation is much higher in growth option because investors benefit from compounding over a long investment horizon; NAV in growth options grows much more than dividend option where the NAVs get re-adjusted whenever the scheme declares dividends. However, some investors may need income during the tenure of the investment and dividend option is suitable for such investors.\n\nDividend re-investment is another option available to investors. In this option for the dividends instead of being distributed to investors, get re-invested to buy units of the scheme. A dividend re-investment option works very much like a growth option. The major difference between growth and dividend re-investment option is that, in growth option investor gets capital appreciation through growth in NAV, whereas in dividend re-investment option the investor gets capital appreciation through incremental units (the NAVs of dividend and dividend re-investment options are the same). Tax consequences of growth and dividend re-investment option are different.",
  },
  {
    question: "Is mutual fund dividends tax free for NRIs?",
    answer:
      "Dividends received from mutual funds are taxable in the hands of the investors. It is added to the income of the investor while filing IT returns.",
  },
  {
    question: "When certificate of TDS is issued to NRIs?",
    answer:
      "Like resident individuals, TDS certificates (Form 16A) are issued on a quarterly basis to NRIs and emailed to their registered email ID with the AMC or sent through post. The same can also be viewed online after registering with TRACES (TDS reconciliation Analysis and Correction Enabling System) https://contents.tdscpc.gov.in/",
  },
  {
    question: "What are the KYC and FATCA requirements in case of NRIs?",
    answer:
      "NRIs will need to submit following documents to the AMC (mutual fund house) or the RTA (Registrar and Transfer Agent) for fulfilling the mutual funds KYC requirements:\n\n• Self-attested copy of PAN\n• Self-attested copy of Passport/ PIO Card\n• Address proof (both Indian and Overseas)\n• Passport size photograph\n• Duly filled in KYC Form along with color passport size photograph\n• Additional information required for FATCA (Foreign Account Tax Compliance Act) - Tax number of country of residency (Other than India)\n• Income Slab\n• Occupation\n• Total net worth\n• Declaration, if you are politically exposed or not",
  },
  {
    question: "How to get KYC and FATCA requirements fulfilled in India?",
    answer:
      "NRIs on a visit to India can simply contact a mutual fund distributor or visit any mutual fund registrar officer with the aforesaid documents and complete the KYC and FATCA process.\n\nDocuments verification and IPV will be done at the same time and you are good to start investing in mutual funds. IPV or In-person verification is a process wherein an authorized official confirms your presence and verifies the copies of aforesaid documents with the originals in your presence.",
  },
  {
    question: "How to get In-person verification (IPV) done if the NRI is not in India?",
    answer:
      "NRIs on a visit to India can simply contact a mutual fund distributor or visit any mutual fund registrar officer with the aforesaid documents and complete the KYC and FATCA process.\n\nOnce IPV and mandatory document verification is completed, you can send the KYC form along with the aforementioned documents to their mutual fund distributor or the fund house (AMC) or the mutual fund R&T agents (CAMS or K-Fintech). On submission, the KYC information will be updated in the system in a few weeks.\n\nAnother way of doing this is to contact AMCs office or a distributor sitting in their respective countries which can initiate IPV of the documents and then those KYC forms and docs can be submitted via AMC houses or R&T Agents.\n\nThe KYC details can be viewed by entering the PAN number here - https://www.cvlkra.com/ and then clicking on 'KYC Inquiry' tab.",
  },
  {
    question: "Can a NRI make a nomination in his investments?",
    answer:
      "An NRI can make a resident Indian or NRI/PIO his nominee in the mutual fund schemes in which he has invested. An NRI can also be the nominee for investments made by a local resident Indian individual. Fund houses also allow an NRI to have a joint holding with a resident Indian or another NRI / PIO in a scheme.",
  },
  {
    question: "Can a NRI invest in Mutual Fund Tax Savings Schemes?",
    answer:
      "Yes, an NRI/PIO can invest in ELSS (Equity Linked Savings Schemes) of Mutual Funds if he or she is willing to avail tax rebate under Section 80C of The Income Tax Act 1961. Currently the investment limit is Rs. 150,000 (Rupees One Lac Fifty Thousand only) in a financial year.",
  },
];

export default function NRICornerPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < answer.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-white text-[#2C5282] pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaGlobe className="text-4xl text-yellow-500" />
            <h1 className="text-4xl font-bold text-[#2C5282]">NRI Corner</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Comprehensive guide for Non-Resident Indians (NRIs) and Persons of Indian Origin (PIOs) 
            for investing in Indian mutual funds and understanding regulations.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <FaUser className="text-3xl text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-[#2C5282] mb-2">NRI Definition</h3>
            <p className="text-sm text-gray-600">Understanding who qualifies as an NRI and PIO</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <FaPassport className="text-3xl text-green-600 mb-3" />
            <h3 className="text-lg font-semibold text-[#2C5282] mb-2">KYC & Documentation</h3>
            <p className="text-sm text-gray-600">Required documents and compliance procedures</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <FaGlobe className="text-3xl text-purple-600 mb-3" />
            <h3 className="text-lg font-semibold text-[#2C5282] mb-2">Investment Guidelines</h3>
            <p className="text-sm text-gray-600">Taxation, accounts, and mutual fund investments</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 p-8 rounded-3xl shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#2C5282] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to the most common questions about NRI investments in Indian mutual funds
            </p>
          </div>

          <div className="space-y-4">
            {nriFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[#2C5282] font-semibold text-lg pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <FaTimes className="text-yellow-500 text-xl" />
                    ) : (
                      <FaPlus className="text-yellow-500 text-xl" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4 text-gray-700 leading-relaxed">
                      {formatAnswer(faq.answer)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#2C5282] mb-4">
              Need More Help?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our team of experts is here to help you with your NRI investment queries. 
              Get personalized guidance for your financial journey.
            </p>
            <button className="bg-yellow-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors">
              Contact Our NRI Experts
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
