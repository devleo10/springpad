"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaChild, FaChartLine } from "react-icons/fa";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ChildrenEducationPlanner() {
  // Input states
  const [firstChildName, setFirstChildName] = useState<string>("Raju");
  const [secondChildName, setSecondChildName] = useState<string>("Rani");
  const [firstChildCurrentAge, setFirstChildCurrentAge] = useState<number>(10);
  const [secondChildCurrentAge, setSecondChildCurrentAge] = useState<number>(5);
  const [firstChildEducationAge, setFirstChildEducationAge] = useState<number>(20);
  const [secondChildEducationAge, setSecondChildEducationAge] = useState<number>(20);
  const [firstChildCost, setFirstChildCost] = useState<number>(500000);
  const [secondChildCost, setSecondChildCost] = useState<number>(500000);
  const [inflationRate, setInflationRate] = useState<number>(5);
  const [expectedReturn, setExpectedReturn] = useState<number>(8);
  const [currentSavings, setCurrentSavings] = useState<number>(10000);

  // Calculations
  const yearsToFirstChildEducation = Math.max(0, firstChildEducationAge - firstChildCurrentAge);
  const yearsToSecondChildEducation = Math.max(0, secondChildEducationAge - secondChildCurrentAge);

  // Inflation adjusted costs
  const inflationAdjustedFirstChild = firstChildCost * Math.pow(1 + inflationRate / 100, yearsToFirstChildEducation);
  const inflationAdjustedSecondChild = secondChildCost * Math.pow(1 + inflationRate / 100, yearsToSecondChildEducation);

  // Split savings equally
  const finalSavingsFirstChild = currentSavings * 0.5;
  const finalSavingsSecondChild = currentSavings * 0.5;

  // Future value of current savings (annual compounding)
  const annualRate = expectedReturn / 100;
  const fvSavingsFirstChild = yearsToFirstChildEducation > 0 ? finalSavingsFirstChild * Math.pow(1 + annualRate, yearsToFirstChildEducation) : finalSavingsFirstChild;
  const fvSavingsSecondChild = yearsToSecondChildEducation > 0 ? finalSavingsSecondChild * Math.pow(1 + annualRate, yearsToSecondChildEducation) : finalSavingsSecondChild;

  // Remaining amount needed from SIP
  const remainingFirstChild = Math.max(0, inflationAdjustedFirstChild - fvSavingsFirstChild);
  const remainingSecondChild = Math.max(0, inflationAdjustedSecondChild - fvSavingsSecondChild);

  // Monthly SIP calculation (monthly compounding)
  const calculateMonthlySIP = (futureValue: number, years: number) => {
    if (years <= 0) return 0;
    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;
    if (monthlyRate === 0) return futureValue / totalMonths;
    const factor = (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    return futureValue / factor;
  };

  const monthlySIPFirstChild = yearsToFirstChildEducation > 0 ? calculateMonthlySIP(remainingFirstChild, yearsToFirstChildEducation) : 0;
  const monthlySIPSecondChild = yearsToSecondChildEducation > 0 ? calculateMonthlySIP(remainingSecondChild, yearsToSecondChildEducation) : 0;

  // Format number with Indian commas
  const formatCurrency = (value: number): string => {
    const rounded = Math.round(value);
    const str = String(rounded);
    let lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return formatted;
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaChild className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Children Education Planner</h1>
        </div>
        <p className="text-gray-600 mb-8">Plan and save for your children&apos;s education expenses with inflation-adjusted calculations.</p>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Education Inputs</h2>
              <div className="space-y-6">
                {/* First Child Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter your first child name</label>
                  <Input type="text" value={firstChildName} onChange={e => setFirstChildName(e.target.value)} className="mb-2" />
                </div>
                {/* Second Child Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter your second child name</label>
                  <Input type="text" value={secondChildName} onChange={e => setSecondChildName(e.target.value)} className="mb-2" />
                </div>
                {/* First Child Current Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter your first child current age (in years)</label>
                  <Input type="number" value={firstChildCurrentAge} onChange={e => setFirstChildCurrentAge(Number(e.target.value))} className="mb-2" />
                </div>
                {/* Second Child Current Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter your second child current age (in years)</label>
                  <Input type="number" value={secondChildCurrentAge} onChange={e => setSecondChildCurrentAge(Number(e.target.value))} className="mb-2" />
                </div>
                {/* First Child Education Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter the age at which your first child would be ready for professional education (in years)</label>
                  <Input type="number" value={firstChildEducationAge} onChange={e => setFirstChildEducationAge(Number(e.target.value))} className="mb-2" />
                </div>
                {/* Second Child Education Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter the age at which your second child would be ready for professional education (in years)</label>
                  <Input type="number" value={secondChildEducationAge} onChange={e => setSecondChildEducationAge(Number(e.target.value))} className="mb-2" />
                </div>
                {/* First Child Cost */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter the amount you would need at today&apos;s cost to fulfil your first child educational needs (Rs)</label>
                  <Input type="text" value={formatCurrency(firstChildCost)} onChange={e => { const raw = e.target.value.replace(/[^\d]/g, ""); setFirstChildCost(raw === "" ? 0 : Number(raw)); }} className="mb-2" />
                </div>
                {/* Second Child Cost */}
                <div>
                  <label className="block text-sm font-medium mb-2">Enter the amount you would need at today&apos;s cost to fulfil your second child educational needs (Rs)</label>
                  <Input type="text" value={formatCurrency(secondChildCost)} onChange={e => { const raw = e.target.value.replace(/[^\d]/g, ""); setSecondChildCost(raw === "" ? 0 : Number(raw)); }} className="mb-2" />
                </div>
                {/* Inflation Rate */}
                <div>
                  <label className="block text-sm font-medium mb-2">The expected rate of inflation over the years (% per annum)</label>
                  <Input type="number" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} step={0.5} className="mb-2" />
                </div>
                {/* Expected Return */}
                <div>
                  <label className="block text-sm font-medium mb-2">What rate of return would you expect your investment? (% per annum)</label>
                  <Input type="number" value={expectedReturn} onChange={e => setExpectedReturn(Number(e.target.value))} step={0.5} className="mb-2" />
                </div>
                {/* Current Savings */}
                <div>
                  <label className="block text-sm font-medium mb-2">How much savings you have now? (Rs)</label>
                  <Input type="text" value={formatCurrency(currentSavings)} onChange={e => { const raw = e.target.value.replace(/[^\d]/g, ""); setCurrentSavings(raw === "" ? 0 : Number(raw)); }} className="mb-2" />
                </div>
              </div>
            </Card>
          </div>
          {/* Results Section */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaChartLine className="text-green-500" />
                Result
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border text-left">Education Planner</th>
                      <th className="p-2 border">Cost of {firstChildName}&apos;s education</th>
                      <th className="p-2 border">Cost of {secondChildName}&apos;s education</th>
                      <th className="p-2 border">Total cost for both</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border font-semibold">Amount at today&apos;s prices</td>
                      <td className="p-2 border">Rs. {formatCurrency(firstChildCost)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(secondChildCost)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(firstChildCost + secondChildCost)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Your child will take up professional education in</td>
                      <td className="p-2 border">{yearsToFirstChildEducation} year(s)</td>
                      <td className="p-2 border">{yearsToSecondChildEducation} year(s)</td>
                      <td className="p-2 border">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Expected rate of return from investments (% per annum)</td>
                      <td className="p-2 border">{expectedReturn.toFixed(1)} %</td>
                      <td className="p-2 border">{expectedReturn.toFixed(1)} %</td>
                      <td className="p-2 border">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Future cost of education (Inflation adjusted)</td>
                      <td className="p-2 border">Rs. {formatCurrency(inflationAdjustedFirstChild)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(inflationAdjustedSecondChild)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(inflationAdjustedFirstChild + inflationAdjustedSecondChild)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Your current savings amount</td>
                      <td className="p-2 border">Rs. {formatCurrency(finalSavingsFirstChild)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(finalSavingsSecondChild)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(currentSavings)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Monthly Savings required</td>
                      <td className="p-2 border">Rs. {formatCurrency(monthlySIPFirstChild)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(monthlySIPSecondChild)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(monthlySIPFirstChild + monthlySIPSecondChild)}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-xs text-gray-500 mt-4">
                  <strong>Disclaimer :</strong> We have gathered all the data, information, statistics from the sources believed to be highly reliable and true. All necessary precautions have been taken to avoid any error, lapse or insufficiency; however, no representations or warranties are made (express or implied) as to the reliability, accuracy or completeness of such information. We cannot be held liable for any loss arising directly or indirectly from the use of, or any action taken in on, any information appearing herein. The user is advised to verify the contents of the report independently.<br/><br/>
                  Returns less than 1 year are in absolute (%) and greater than 1 year are compounded annualised (CAGR %). SIP returns are shown in XIRR (%).<br/><br/>
                  The Risk Level of any of the schemes must always be commensurate with the risk profile, investment objective or financial goals of the investor concerned. Mutual Fund Distributors (MFDs) or Registered Investment Advisors (RIAs) should assess the risk profile and investment needs of individual investors into consideration and make scheme(s) or asset allocation recommendations accordingly.<br/><br/>
                  Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance may or may not be sustained in the future. Investors should always invest according to their risk profile and consult with their mutual fund distributors or financial advisor before investing.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
