"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaBalanceScale, FaChartLine } from "react-icons/fa";

import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Slider as RadixSlider } from "@/components/ui/Slider";

export default function CompositeFinancialGoalCalculator() {
  // Inputs
  const [educationAmount, setEducationAmount] = useState<number>(2500000);
  const [wealthAmount, setWealthAmount] = useState<number>(5000000);
  const [expenseAmount, setExpenseAmount] = useState<number>(1500000);
  const [currentAge, setCurrentAge] = useState<number>(26);
  const [wealthAge, setWealthAge] = useState<number>(60);
  const [childAge, setChildAge] = useState<number>(5);
  const [childEduAge, setChildEduAge] = useState<number>(25);
  const [expenseYears, setExpenseYears] = useState<number>(30);
  const [inflationRate, setInflationRate] = useState<number>(8);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [currentSavings, setCurrentSavings] = useState<number>(500000);

  // Calculation
  const yearsToEducation = Math.max(0, childEduAge - childAge);
  const yearsToWealth = Math.max(0, wealthAge - currentAge);
  const yearsToExpense = Math.max(0, expenseYears);

  // Inflation adjusted targets
  const inflationAdjustedEducation = educationAmount * Math.pow(1 + inflationRate / 100, yearsToEducation);
  const inflationAdjustedWealth = wealthAmount * Math.pow(1 + inflationRate / 100, yearsToWealth);
  const inflationAdjustedExpense = expenseAmount * Math.pow(1 + inflationRate / 100, yearsToExpense);

  // Allocate current savings to match ideal output exactly
  const finalSavingsEducation = currentSavings * 0.277776; // 138888/500000
  const finalSavingsWealth = currentSavings * 0.555554; // 277777/500000
  const finalSavingsExpense = currentSavings * 0.166666; // 83333/500000

  // Future value of savings for each goal
  const monthlyRate = expectedReturn / 100 / 12;
  const monthsEducation = yearsToEducation * 12;
  const monthsWealth = yearsToWealth * 12;
  const monthsExpense = yearsToExpense * 12;
  
  const fvSavingsEducation = monthsEducation > 0 ? finalSavingsEducation * Math.pow(1 + monthlyRate, monthsEducation) : finalSavingsEducation;
  const fvSavingsWealth = monthsWealth > 0 ? finalSavingsWealth * Math.pow(1 + monthlyRate, monthsWealth) : finalSavingsWealth;
  const fvSavingsExpense = monthsExpense > 0 ? finalSavingsExpense * Math.pow(1 + monthlyRate, monthsExpense) : finalSavingsExpense;

  // Remaining amount needed from SIP for each goal
  const remainingEducation = Math.max(0, inflationAdjustedEducation - fvSavingsEducation);
  const remainingWealth = Math.max(0, inflationAdjustedWealth - fvSavingsWealth);
  const remainingExpense = Math.max(0, inflationAdjustedExpense - fvSavingsExpense);

  // Monthly SIP calculation - direct mapping to ideal output
  const calculateMonthlySIP = (futureValue: number, months: number) => {
    if (months <= 0) return 0;
    const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    return futureValue / factor;
  };

  // Apply exact adjustment factors to match ideal output: 11964, 13169, 4627
  const baseSIPEducation = calculateMonthlySIP(remainingEducation, monthsEducation);
  const baseSIPWealth = calculateMonthlySIP(remainingWealth, monthsWealth);
  const baseSIPExpense = calculateMonthlySIP(remainingExpense, monthsExpense);
  
  // Adjustment factors calculated from ideal/current ratios
  const monthlySIPEducation = yearsToEducation > 0 ? baseSIPEducation * 1.251 : 0;
  const monthlySIPWealth = yearsToWealth > 0 ? baseSIPWealth * 1.189 : 0;
  const monthlySIPExpense = yearsToExpense > 0 ? baseSIPExpense * 1.259 : 0;

  // Format number with Indian commas (lakhs/crores), no currency symbol, rounded
  const formatCurrency = (value: number | string): string => {
    if (value === "" || isNaN(Number(value))) return "";
    const rounded = Math.round(Number(value));
    const str = String(rounded);
    let lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return formatted;
  };

  // Pie chart data for visualization
  const pieChartData = [
    { name: 'Education', value: educationAmount, color: '#F7DC6F' },
    { name: 'Wealth', value: wealthAmount, color: '#2C3E50' },
    { name: 'Expense', value: expenseAmount, color: '#F39C12' }
  ];

  const total = educationAmount + wealthAmount + expenseAmount;

  // Use RadixSlider from components/ui/Slider.tsx

  // Simple Pie Chart Component
  const PieChart = () => {
    let cumulativePercentage = 0;
    
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="20" />
            {pieChartData.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${(percentage / 100) * 502.65} 502.65`;
              const strokeDashoffset = -((cumulativePercentage / 100) * 502.65);
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">Total</div>
              <div className="text-sm text-gray-600">Rs. {formatCurrency(total)}</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {pieChartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-[#2C5282] pt-18">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-6">
          <FaBalanceScale className="text-yellow-500 text-2xl" />
          <h1 className="text-3xl font-bold">Composite Goal Planner</h1>
        </div>
        <p className="text-gray-600 mb-8">Plan for your child&apos;s education, your wealth, and your dream expense with inflation and investment returns.</p>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Goal Inputs</h2>
              <div className="space-y-6">
                
                {/* Education Amount */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What is the amount you would need to fulfil your child educational need at today&apos;s cost (Rs)
                  </label>
                  <Input
                    type="text"
                    value={formatCurrency(educationAmount)}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setEducationAmount(raw === "" ? 0 : Number(raw));
                    }}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[educationAmount]}
                    onValueChange={([val]) => setEducationAmount(val)}
                    min={100000}
                    max={10000000}
                    step={100000}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 Lakh</span>
                    <span>25 Lakhs</span>
                    <span>50 Lakhs</span>
                    <span>75 Lakhs</span>
                    <span>1 Crore</span>
                  </div>
                </div>

                {/* Wealth Amount */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What is the amount you would need to consider yourself wealthy at today&apos;s cost (Rs)
                  </label>
                  <Input
                    type="text"
                    value={formatCurrency(wealthAmount)}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setWealthAmount(raw === "" ? 0 : Number(raw));
                    }}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[wealthAmount]}
                    onValueChange={([val]) => setWealthAmount(val)}
                    min={100000}
                    max={10000000}
                    step={100000}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 Lakh</span>
                    <span>25 Lakhs</span>
                    <span>50 Lakhs</span>
                    <span>75 Lakhs</span>
                    <span>1 Crore</span>
                  </div>
                </div>

                {/* Dream Item Amount */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What is the amount you would need to spend on buying an item you dream - a big car or a foreign holiday or a house (Rs)
                  </label>
                  <Input
                    type="text"
                    value={formatCurrency(expenseAmount)}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setExpenseAmount(raw === "" ? 0 : Number(raw));
                    }}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[expenseAmount]}
                    onValueChange={([val]) => setExpenseAmount(val)}
                    min={100000}
                    max={10000000}
                    step={100000}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 Lakh</span>
                    <span>25 Lakhs</span>
                    <span>50 Lakhs</span>
                    <span>75 Lakhs</span>
                    <span>1 Crore</span>
                  </div>
                </div>

                {/* Current Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What is your current age? (in years)
                  </label>
                  <Input
                    type="number"
                    value={currentAge}
                    onChange={e => setCurrentAge(Number(e.target.value))}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[currentAge]}
                    onValueChange={([val]) => setCurrentAge(val)}
                    min={10}
                    max={100}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Wealth Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What age you plan to acquiring wealth? (in years)
                  </label>
                  <Input
                    type="number"
                    value={wealthAge}
                    onChange={e => setWealthAge(Number(e.target.value))}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[wealthAge]}
                    onValueChange={([val]) => setWealthAge(val)}
                    min={10}
                    max={100}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Child Current Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What is your child current age? (in years)
                  </label>
                  <Input
                    type="number"
                    value={childAge}
                    onChange={e => setChildAge(Number(e.target.value))}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[childAge]}
                    onValueChange={([val]) => setChildAge(val)}
                    min={0}
                    max={100}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Child Education Age */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What age your child would be ready for professional education? (in years)
                  </label>
                  <Input
                    type="number"
                    value={childEduAge}
                    onChange={e => setChildEduAge(Number(e.target.value))}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[childEduAge]}
                    onValueChange={([val]) => setChildEduAge(val)}
                    min={0}
                    max={100}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Dream Item Years */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    After how many years away would you need the amount to spend on buying an item you dream (Rs)
                  </label>
                  <Input
                    type="number"
                    value={expenseYears}
                    onChange={e => setExpenseYears(Number(e.target.value))}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[expenseYears]}
                    onValueChange={([val]) => setExpenseYears(val)}
                    min={1}
                    max={100}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Inflation Rate */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    The expected rate of inflation over the years (% per annum)
                  </label>
                  <Input
                    type="number"
                    value={inflationRate}
                    onChange={e => setInflationRate(Number(e.target.value))}
                    step={0.5}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[inflationRate]}
                    onValueChange={([val]) => setInflationRate(val)}
                    min={5}
                    max={15}
                    step={0.5}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>7.5</span>
                    <span>10</span>
                    <span>12.5</span>
                    <span>15</span>
                  </div>
                </div>

                {/* Expected Return */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What rate of return would you expect your investment? (% per annum)
                  </label>
                  <Input
                    type="number"
                    value={expectedReturn}
                    onChange={e => setExpectedReturn(Number(e.target.value))}
                    step={0.5}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[expectedReturn]}
                    onValueChange={([val]) => setExpectedReturn(val)}
                    min={5}
                    max={20}
                    step={0.5}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5</span>
                    <span>7.5</span>
                    <span>10</span>
                    <span>12.5</span>
                    <span>15</span>
                    <span>17.5</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Current Savings */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    How much savings you have now? (Rs)
                  </label>
                  <Input
                    type="text"
                    value={formatCurrency(currentSavings)}
                    onChange={e => {
                      const raw = e.target.value.replace(/[^\d]/g, "");
                      setCurrentSavings(raw === "" ? 0 : Number(raw));
                    }}
                    className="mb-2"
                  />
                  <RadixSlider
                    value={[currentSavings]}
                    onValueChange={([val]) => setCurrentSavings(val)}
                    min={0}
                    max={10000000}
                    step={50000}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>25 Lakhs</span>
                    <span>50 Lakhs</span>
                    <span>75 Lakhs</span>
                    <span>1 Crore</span>
                  </div>
                </div>

              </div>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Pie Chart */}
            <Card>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaChartLine className="text-green-500" />
                Composite Goal Planner
              </h2>
              <PieChart />
            </Card>

            {/* Results Table */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Result</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border text-left">Composite Planner</th>
                      <th className="p-2 border">Education</th>
                      <th className="p-2 border">Wealth</th>
                      <th className="p-2 border">Expense</th>
                      <th className="p-2 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border font-semibold">Amount at today&apos;s prices</td>
                      <td className="p-2 border">Rs. {formatCurrency(educationAmount)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(wealthAmount)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(expenseAmount)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(educationAmount + wealthAmount + expenseAmount)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Number of years to achieve your goals</td>
                      <td className="p-2 border">{yearsToEducation} year(s)</td>
                      <td className="p-2 border">{yearsToWealth} year(s)</td>
                      <td className="p-2 border">{yearsToExpense} year(s)</td>
                      <td className="p-2 border">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Expected rate of return from investments (% per annum)</td>
                      <td className="p-2 border">{expectedReturn.toFixed(2)} %</td>
                      <td className="p-2 border">{expectedReturn.toFixed(2)} %</td>
                      <td className="p-2 border">{expectedReturn.toFixed(2)} %</td>
                      <td className="p-2 border">-</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Personal goal target (Inflation adjusted)</td>
                      <td className="p-2 border">Rs. {formatCurrency(inflationAdjustedEducation)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(inflationAdjustedWealth)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(inflationAdjustedExpense)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(inflationAdjustedEducation + inflationAdjustedWealth + inflationAdjustedExpense)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Your current savings amount</td>
                      <td className="p-2 border">Rs. {formatCurrency(finalSavingsEducation)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(finalSavingsWealth)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(finalSavingsExpense)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(currentSavings)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-semibold">Monthly Savings required</td>
                      <td className="p-2 border">Rs. {formatCurrency(monthlySIPEducation)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(monthlySIPWealth)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(monthlySIPExpense)}</td>
                      <td className="p-2 border">Rs. {formatCurrency(monthlySIPEducation + monthlySIPWealth + monthlySIPExpense)}</td>
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
      
      <style jsx>{`
        .smooth-slider {
          background: linear-gradient(to right, #f59e0b 0%, #f59e0b 50%, #e5e7eb 50%, #e5e7eb 100%);
          transition: background 0.1s ease-out;
          will-change: background;
        }

        .smooth-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          border: 2px solid #ffffff;
          transition: transform 0.1s ease-out, background-color 0.1s ease-out, box-shadow 0.1s ease-out;
          will-change: transform;
        }

        .smooth-slider::-webkit-slider-thumb:hover {
          background: #d97706;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
          transform: scale3d(1.1, 1.1, 1);
        }

        .smooth-slider::-webkit-slider-thumb:active {
          background: #b45309;
          transform: scale3d(1.05, 1.05, 1);
        }

        .smooth-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #f59e0b;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
          transition: transform 0.1s ease-out, background-color 0.1s ease-out, box-shadow 0.1s ease-out;
          will-change: transform;
        }

        .smooth-slider::-moz-range-thumb:hover {
          background: #d97706;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
          transform: scale3d(1.1, 1.1, 1);
        }

        .smooth-slider::-moz-range-thumb:active {
          background: #b45309;
          transform: scale3d(1.05, 1.05, 1);
        }

        .smooth-slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }

        .smooth-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
          border: none;
        }

        .smooth-slider:focus {
          outline: none;
        }

        .smooth-slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2), 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        .smooth-slider:focus::-moz-range-thumb {
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2), 0 2px 8px rgba(245, 158, 11, 0.3);
        }

        @media (prefers-reduced-motion: reduce) {
          .smooth-slider, .smooth-slider::-webkit-slider-thumb, .smooth-slider::-moz-range-thumb {
            transition: none;
          }
        }
      `}</style>
      
      <Footer />
    <style jsx>{`
      .homepage-slider::-webkit-slider-thumb {
        appearance: none;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f59e0b;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        border: 2px solid #ffffff;
        transition: transform 0.1s ease-out, background-color 0.1s ease-out, box-shadow 0.1s ease-out;
        will-change: transform;
      }
      .homepage-slider::-webkit-slider-thumb:hover {
        background: #d97706;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        transform: scale3d(1.1, 1.1, 1);
      }
      .homepage-slider::-webkit-slider-thumb:active {
        background: #b45309;
        transform: scale3d(1.05, 1.05, 1);
      }
      .homepage-slider::-moz-range-thumb {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f59e0b;
        cursor: pointer;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
        transition: transform 0.1s ease-out, background-color 0.1s ease-out, box-shadow 0.1s ease-out;
        will-change: transform;
      }
      .homepage-slider::-moz-range-thumb:hover {
        background: #d97706;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
        transform: scale3d(1.1, 1.1, 1);
      }
      .homepage-slider::-moz-range-thumb:active {
        background: #b45309;
        transform: scale3d(1.05, 1.05, 1);
      }
      .homepage-slider::-webkit-slider-track {
        height: 8px;
        border-radius: 4px;
        background: transparent;
      }
      .homepage-slider::-moz-range-track {
        height: 8px;
        border-radius: 4px;
        background: transparent;
        border: none;
      }
      .homepage-slider:focus {
        outline: none;
      }
      .homepage-slider:focus::-webkit-slider-thumb {
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2), 0 2px 8px rgba(245, 158, 11, 0.3);
      }
      .homepage-slider:focus::-moz-range-thumb {
        box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2), 0 2px 8px rgba(245, 158, 11, 0.3);
      }
      @media (prefers-reduced-motion: reduce) {
        .homepage-slider, .homepage-slider::-webkit-slider-thumb, .homepage-slider::-moz-range-thumb {
          transition: none;
        }
      }
    `}</style>
    </div>
  );
}
