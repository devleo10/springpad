// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { Navbar } from "@/components/Navbar";
// import { Footer } from "@/components/Footer";
// import { Card } from "@/components/ui/Card";
// import {
//   FaChartLine,
//   FaCalculator,
//   FaPiggyBank,
//   FaSave,
//   FaTrash,
//   FaEdit,
//   FaEye,
//   FaBookmark,
//   FaLightbulb,
// } from "react-icons/fa";
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Area,
//   AreaChart,
//   PieChart,
//   Pie,
//   Cell,
//   LineChart,
//   Line,
// } from "recharts";

// // Types
// interface ProposalResult {
//   finalAmount: string;
//   totalInvestment: string;
//   totalReturns: string;
//   monthlyReturn: string;
//   roi: string;
// }

// interface SavedProposal {
//   id: string;
//   name: string;
//   initialInvestment: number;
//   expectedReturn: number;
//   timePeriod: number;
//   result: ProposalResult;
//   createdAt: string;
//   updatedAt: string;
// }

// interface ChartDataPoint {
//   year: number;
//   principal: number;
//   returns: number;
//   totalValue: number;
// }

// interface BreakdownData {
//   name: string;
//   value: number;
//   color: string;
// }

// interface ComparisonData {
//   year: number;
//   [key: string]: number;
// }

// // Constants
// const DEBOUNCE_DELAY = 800;
// const MIN_INVESTMENT = 10000;
// const MAX_INVESTMENT = 10000000;
// const MIN_RETURN = 1;
// const MAX_RETURN = 30;
// const MIN_YEARS = 1;
// const MAX_YEARS = 30;

// // Helper functions
// const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     maximumFractionDigits: 0,
//   }).format(amount);
// };

// const calculateCompoundInterest = (
//   principal: number,
//   annualReturn: number,
//   years: number
// ): number => {
//   const rate = annualReturn / 100;
//   return principal * Math.pow(1 + rate, years);
// };

// const generateId = (): string => {
//   return Date.now().toString(36) + Math.random().toString(36).substr(2);
// };

// const isValidInput = (value: number | ""): boolean => {
//   return value !== "" && Number(value) > 0;
// };

// // Validation functions
// const validateInvestment = (value: number): boolean => {
//   return value >= MIN_INVESTMENT && value <= MAX_INVESTMENT;
// };

// const validateReturnRate = (value: number): boolean => {
//   return value >= MIN_RETURN && value <= MAX_RETURN;
// };

// const validateTimePeriod = (value: number): boolean => {
//   return value >= MIN_YEARS && value <= MAX_YEARS;
// };

// const sanitizeInput = (value: string, maxLength: number = 10): string => {
//   const cleaned = value.replace(/[^0-9.]/g, "");
//   const parts = cleaned.split(".");
//   if (parts.length > 2) {
//     return parts[0] + "." + parts.slice(1).join("");
//   }
//   return cleaned.substring(0, maxLength);
// };

// export default function SavedInvestmentProposalCalculator() {
//   const [initialInvestment, setInitialInvestment] = useState<number | "">(
//     100000
//   );
//   const [expectedReturn, setExpectedReturn] = useState<number | "">(12);
//   const [timePeriod, setTimePeriod] = useState<number | "">(5);
//   const [result, setResult] = useState<ProposalResult | null>(null);
//   const [savedProposals, setSavedProposals] = useState<SavedProposal[]>([]);
//   const [proposalName, setProposalName] = useState<string>("");
//   const [activeTab, setActiveTab] = useState<
//     "calculator" | "saved" | "comparison"
//   >("calculator");
//   const [selectedProposals, setSelectedProposals] = useState<string[]>([]);
//   const [editingProposal, setEditingProposal] = useState<SavedProposal | null>(
//     null
//   );

//   // Load saved proposals from memory on component mount
//   useEffect(() => {
//     // In a real app, this would load from an API or database
//     const mockSavedProposals: SavedProposal[] = [
//       {
//         id: "1",
//         name: "Emergency Fund Investment",
//         initialInvestment: 500000,
//         expectedReturn: 8,
//         timePeriod: 3,
//         result: {
//           finalAmount: "630494",
//           totalInvestment: "500000",
//           totalReturns: "130494",
//           monthlyReturn: "3625",
//           roi: "26.1",
//         },
//         createdAt: "2025-01-15",
//         updatedAt: "2025-01-15",
//       },
//       {
//         id: "2",
//         name: "Retirement Corpus",
//         initialInvestment: 1000000,
//         expectedReturn: 15,
//         timePeriod: 20,
//         result: {
//           finalAmount: "16366537",
//           totalInvestment: "1000000",
//           totalReturns: "15366537",
//           monthlyReturn: "64027",
//           roi: "1536.7",
//         },
//         createdAt: "2025-01-10",
//         updatedAt: "2025-01-20",
//       },
//     ];
//     setSavedProposals(mockSavedProposals);
//   }, []);

//   // Validation messages
//   const validationMessages = useMemo(() => {
//     const messages: string[] = [];

//     if (
//       initialInvestment !== "" &&
//       !validateInvestment(Number(initialInvestment))
//     ) {
//       messages.push(
//         `Initial investment should be between ₹${MIN_INVESTMENT.toLocaleString()} and ₹${MAX_INVESTMENT.toLocaleString()}`
//       );
//     }

//     if (expectedReturn !== "" && !validateReturnRate(Number(expectedReturn))) {
//       messages.push(
//         `Expected return should be between ${MIN_RETURN}% and ${MAX_RETURN}%`
//     <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
//       <Navbar />
//       <div className="max-w-6xl mx-auto px-4 py-16">
//         {/* Header */}
//         <header className="flex items-center gap-3 mb-6">
//           <FaBookmark className="text-yellow-500 text-2xl" />
//           <h1 className="text-3xl font-bold">Saved Investment Proposal Calculator</h1>
//         </header>
//         <p className="text-gray-600 mb-8">
//           Calculate, save, and compare investment proposals. Track multiple investment scenarios and make informed decisions.
//         </p>
//         {/* Tab Navigation */}
//         <Card className="mb-8">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab("calculator")}
//               className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "calculator" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//               <FaCalculator className="inline mr-2" /> Calculator
//             </button>
//             <button
//               onClick={() => setActiveTab("saved")}
//               className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "saved" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//               <FaSave className="inline mr-2" /> Saved Proposals ({savedProposals.length})
//             </button>
//             <button
//               onClick={() => setActiveTab("comparison")}
//               className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "comparison" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//               <FaChartLine className="inline mr-2" /> Compare ({selectedProposals.length})
//             </button>
//           </div>
//         </Card>

//         {/* Calculator Tab */}
//         {activeTab === "calculator" && (
//           <Card className="mb-8">
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaPiggyBank className="text-green-500" /> Investment Proposal Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Initial Investment Amount (₹)</label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   value={initialInvestment === "" ? "" : initialInvestment}
//                   onChange={handleInputChange(setInitialInvestment, validateInvestment, "Initial Investment")}
//                   onFocus={handleInputFocus}
//                   onClick={handleInputClick}
//                   onPaste={handleInputPaste}
//                   onKeyPress={handleKeyPress}
//                   placeholder={`₹${MIN_INVESTMENT.toLocaleString()} - ₹${MAX_INVESTMENT.toLocaleString()}`}
//                   min={MIN_INVESTMENT}
//                   max={MAX_INVESTMENT}
//                   inputMode="numeric"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   value={expectedReturn === "" ? "" : expectedReturn}
//                   onChange={handleInputChange(setExpectedReturn, validateReturnRate, "Expected Return")}
//                   onFocus={handleInputFocus}
//                   onClick={handleInputClick}
//                   onPaste={handleInputPaste}
//                   onKeyPress={handleKeyPress}
//                   placeholder={`${MIN_RETURN}% - ${MAX_RETURN}%`}
//                   min={MIN_RETURN}
//                   max={MAX_RETURN}
//                   inputMode="numeric"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Time Period (years)</label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   value={timePeriod === "" ? "" : timePeriod}
//                   onChange={handleInputChange(setTimePeriod, validateTimePeriod, "Time Period")}
//                   onFocus={handleInputFocus}
//                   onClick={handleInputClick}
//                   onPaste={handleInputPaste}
//                   onKeyPress={handleKeyPress}
//                   placeholder={`${MIN_YEARS} - ${MAX_YEARS}`}
//                   min={MIN_YEARS}
//                   max={MAX_YEARS}
//                   inputMode="numeric"
//                 />
//               </div>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Proposal Name</label>
//                 <input
//                   type="text"
//                   className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   value={proposalName}
//                   onChange={(e) => setProposalName(e.target.value)}
//                   placeholder="e.g. Retirement Plan, Emergency Fund"
//                   maxLength={40}
//                 />
//               </div>
//               <div className="flex items-end gap-4">
//                 <button
//                   className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded shadow"
//                   onClick={calculateInvestmentReturns}
//                   disabled={!inputsValid}
//                 >
//                   <FaCalculator className="inline mr-2" /> Calculate
//                 </button>
//                 <button
//                   className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow"
//                   onClick={saveProposal}
//                   disabled={!inputsValid || !proposalName.trim()}
//                 >
//                   <FaSave className="inline mr-2" /> {editingProposal ? "Update" : "Save"}
//                 </button>
//                 {editingProposal && (
//                   <button
//                     className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold px-4 py-2 rounded shadow"
//                     onClick={() => {
//                       setEditingProposal(null);
//                       setProposalName("");
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </div>
//             {/* Validation Messages */}
//             {validationMessages.length > 0 && (
//               <div className="mt-4 text-red-500 text-sm">
//                 {validationMessages.map((msg, idx) => (
//                   <div key={idx}>{msg}</div>
//                 ))}
//               </div>
//             )}
//             {/* Results Grid and Chart Section */}
//             {result && summaryData && (
//               <>
//                 {/* Results Grid */}
//                 <section className="grid lg:grid-cols-4 gap-6 mb-8">
//                   <Card className="p-4 text-center">
//                     <div className="text-gray-500 text-xs mb-1">Total Investment</div>
//                     <div className="text-2xl font-bold text-blue-700">{formatCurrency(Number(result.totalInvestment))}</div>
//                   </Card>
//                   <Card className="p-4 text-center">
//                     <div className="text-gray-500 text-xs mb-1">Returns Generated</div>
//                     <div className="text-2xl font-bold text-green-700">{formatCurrency(Number(result.totalReturns))}</div>
//                   </Card>
//                   <Card className="p-4 text-center">
//                     <div className="text-gray-500 text-xs mb-1">Final Amount</div>
//                     <div className="text-2xl font-bold text-yellow-700">{formatCurrency(Number(result.finalAmount))}</div>
//                   </Card>
//                   <Card className="p-4 text-center">
//                     <div className="text-gray-500 text-xs mb-1">ROI (%)</div>
//                     <div className="text-2xl font-bold text-purple-700">{result.roi}%</div>
//                   </Card>
//                 </section>
//                 {/* Chart and Summary Section */}
//                 <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
//                   <Card className="p-4">
//                     <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
//                       <FaChartLine className="text-blue-500" /> Growth Over Time
//                     </h3>
//                     <div className="h-64">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                           <defs>
//                             <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//                               <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                             </linearGradient>
//                             <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
//                               <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
//                               <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
//                             </linearGradient>
//                           </defs>
//                           <XAxis dataKey="year" stroke="#666" fontSize={12} label={{ value: "Year", position: "insideBottom", offset: -5 }} />
//                           <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₹${value.toLocaleString()}`} />
//                           <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} labelFormatter={(year) => `Year ${year}`} />
//                           <Area type="monotone" dataKey="principal" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrincipal)" name="Principal" />
//                           <Area type="monotone" dataKey="returns" stroke="#10b981" fillOpacity={1} fill="url(#colorReturns)" name="Returns" />
//                         </AreaChart>
//                       </ResponsiveContainer>
//                     </div>
//                   </Card>
//                   <Card className="p-4">
//                     <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
//                       <FaPieChart className="text-green-500" /> Investment Breakdown
//                     </h3>
//                     <div className="h-64 flex items-center justify-center">
//                       <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                           <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
//                             {pieData.map((entry, idx) => (
//                               <Cell key={`cell-${idx}`} fill={entry.color} />
//                             ))}
//                           </Pie>
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                     <div className="mt-4 flex gap-4 justify-center text-sm">
//                       {pieData.map((entry, idx) => (
//                         <div key={idx} className="flex items-center gap-2">
//                           <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
//                           <span>{entry.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </Card>
//                   <Card className="p-4">
//                     <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
//                       <FaLightbulb className="text-yellow-500" /> Summary
//                     </h3>
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span>Return Percentage:</span>
//                         <span className="font-bold text-green-700">{summaryData.returnPercentage}%</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span>Wealth Multiplier:</span>
//                         <span className="font-bold text-blue-700">{summaryData.wealthMultiplier}x</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span>Annualized Return:</span>
//                         <span className="font-bold text-yellow-700">{summaryData.annualizedReturn}%</span>
//                       </div>
//                     </div>
//                   </Card>
//                 </section>
//               </>
//             )}
//           </Card>
//         )}

//         {/* Saved Proposals Tab */}
//         {activeTab === "saved" && (
//           <section className="mb-8">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                 <FaSave className="text-green-500" />
//                 Saved Proposals
//               </h2>
//               {savedProposals.length === 0 ? (
//                 <p className="text-gray-500">No saved proposals yet.</p>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full text-sm">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="px-4 py-2 text-left">Name</th>
//                         <th className="px-4 py-2 text-left">Investment</th>
//                         <th className="px-4 py-2 text-left">Return (%)</th>
//                         <th className="px-4 py-2 text-left">Period (yrs)</th>
//                         <th className="px-4 py-2 text-left">Final Amount</th>
//                         <th className="px-4 py-2 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {savedProposals.map((proposal) => (
//                         <tr key={proposal.id} className="border-b">
//                           <td className="px-4 py-2 font-semibold">
//                             {proposal.name}
//                           </td>
//                           <td className="px-4 py-2">
//                             {formatCurrency(proposal.initialInvestment)}
//                           </td>
//                           <td className="px-4 py-2">
//                             {proposal.expectedReturn}%
//                           </td>
//                           <td className="px-4 py-2">{proposal.timePeriod}</td>
//                           <td className="px-4 py-2">
//                             {formatCurrency(Number(proposal.result.finalAmount))}
//                           </td>
//                           <td className="px-4 py-2 flex gap-2">
//                             <button
//                               className="text-blue-500 hover:text-blue-700"
//                               title="View"
//                               onClick={() => loadProposal(proposal)}
//                             >
//                               <FaEye />
//                             </button>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               title="Edit"
//                               onClick={() => loadProposal(proposal)}
//                             >
//                               <FaEdit />
//                             </button>
//                             <button
//                               className="text-red-500 hover:text-red-700"
//                               title="Delete"
//                               onClick={() => deleteProposal(proposal.id)}
//                             >
//                               <FaTrash />
//                             </button>
//                             <button
//                               className={`text-yellow-500 hover:text-yellow-700 ${selectedProposals.includes(proposal.id) ? "font-bold" : ""}`}
//                               title="Select for Comparison"
//                               onClick={() => toggleProposalSelection(proposal.id)}
//                               disabled={selectedProposals.length >= 4 && !selectedProposals.includes(proposal.id)}
//                             >
//                               <FaChartLine />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}

//         {/* Comparison Tab */}
//         {activeTab === "comparison" && (
//           <section className="mb-8">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                 <FaChartLine className="text-blue-500" />
//                 Compare Proposals
//               </h2>
//               {selectedProposals.length < 2 ? (
//                 <p className="text-gray-500">Select at least two proposals to compare.</p>
//               ) : (
//                 <div className="h-96">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={comparisonData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis dataKey="year" stroke="#666" fontSize={12} label={{ value: "Years", position: "insideBottom", offset: -5 }} />
//                       <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₹${value.toLocaleString()}`} />
//                       <Tooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} labelFormatter={(year) => `Year ${year}`} />
//                       {savedProposals.filter((p) => selectedProposals.includes(p.id)).map((proposal, idx) => (
//                         <Line
//                           key={proposal.id}
//                           type="monotone"
//                           dataKey={proposal.name}
//                           stroke={colors[idx % colors.length]}
//                           strokeWidth={3}
//                           dot={false}
//                           name={proposal.name}
//                         />
//                       ))}
//                     </LineChart>
//                   </ResponsiveContainer>
//                   <div className="mt-4 flex gap-6 justify-center text-sm">
//                     {savedProposals.filter((p) => selectedProposals.includes(p.id)).map((proposal, idx) => (
//                       <div key={proposal.id} className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded" style={{ backgroundColor: colors[idx % colors.length] }}></div>
//                         <span>{proposal.name}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}
//       </div>
//       <Footer />
//     </div>
//       e.stopPropagation();
//     },
//     []
//   );

//   const handleInputPaste = useCallback(
//     (e: React.ClipboardEvent<HTMLInputElement>) => {
//       const pastedText = e.clipboardData.getData("text");
//       const sanitized = sanitizeInput(pastedText);

//       if (sanitized !== pastedText) {
//         e.preventDefault();
//         const target = e.target as HTMLInputElement;
//         target.value = sanitized;
//         target.dispatchEvent(new Event("input", { bubbles: true }));
//       }
//     },
//     []
//   );

//   const handleKeyPress = useCallback(
//     (e: React.KeyboardEvent) => {
//       if (e.key === "Enter") {
//         calculateInvestmentReturns();
//       }
//     },
//     [calculateInvestmentReturns]
//   );

//   // Auto-calculate with debounce
//   useEffect(() => {
//     if (!inputsValid) return;

//     const timer = setTimeout(() => {
//       calculateInvestmentReturns();
//     }, DEBOUNCE_DELAY);

//     return () => clearTimeout(timer);
//   }, [
//     initialInvestment,
//     expectedReturn,
//     timePeriod,
//     calculateInvestmentReturns,
//     inputsValid,
//   ]);

//   // Summary data
//   const summaryData = useMemo(() => {
//     if (!result) return null;

//     const totalInvestment = Number(result.totalInvestment);
//     const totalReturns = Number(result.totalReturns);
//     const finalAmount = Number(result.finalAmount);

//     if (totalInvestment === 0) {
//       return {
//         returnPercentage: "0.0",
//         wealthMultiplier: "1.0",
//         annualizedReturn: "0.0",
//       };
//     }

//     const returnPercentage = ((totalReturns / totalInvestment) * 100).toFixed(
//       1
//     );
//     const wealthMultiplier = (finalAmount / totalInvestment).toFixed(1);
//     const annualizedReturn = (Number(expectedReturn) || 0).toFixed(1);

//     return {
//       returnPercentage: Math.min(Number(returnPercentage), 9999).toFixed(1),
//       wealthMultiplier,
//       annualizedReturn,
//     };
//   }, [result, expectedReturn]);

//   const colors = [
//     "#3b82f6",
//     "#10b981",
//     "#f59e0b",
//     "#ef4444",
//     "#8b5cf6",
//     "#06b6d4",
//   ];

//   return (
//     <div className="relative min-h-screen bg-white text-[#2C5282] pt-18">
//       <Navbar />
//       <div className="max-w-6xl mx-auto px-4 py-16">
//         {/* Header */}
//         <header className="flex items-center gap-3 mb-6">
//           <FaBookmark className="text-yellow-500 text-2xl" />
//           <h1 className="text-3xl font-bold">Saved Investment Proposal Calculator</h1>
//         </header>
//         <p className="text-gray-600 mb-8">
//           Calculate, save, and compare investment proposals. Track multiple investment scenarios and make informed decisions.
//         </p>
//         {/* Tab Navigation */}
//         <Card className="mb-8">
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab("calculator")}
//               className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "calculator" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//               <FaCalculator className="inline mr-2" /> Calculator
//             </button>
//             <button
//               onClick={() => setActiveTab("saved")}
//               className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "saved" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//               <FaSave className="inline mr-2" /> Saved Proposals ({savedProposals.length})
//             </button>
//             <button
//               onClick={() => setActiveTab("comparison")}
//               className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === "comparison" ? "border-yellow-500 text-yellow-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
//             >
//               <FaChartLine className="inline mr-2" /> Compare ({selectedProposals.length})
//             </button>
//           </div>
//         </Card>
//         {/* Calculator Tab */}
//         {activeTab === "calculator" && (
//           <Card className="mb-8">
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaPiggyBank className="text-green-500" /> Investment Proposal Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Initial Investment Amount (₹)</label>
//                 <input
//           <Card className="mb-8">
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaPiggyBank className="text-green-500" /> Investment Proposal Details
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* ...existing input fields... */}
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//               {/* ...existing buttons... */}
//             </div>
//             {/* Validation Messages */}
//             {/* ...existing validation messages... */}
//             {/* Results Grid and Chart Section */}
//             {result && summaryData && (
//               <>
//                 {/* Results Grid */}
//                 <section className="grid lg:grid-cols-4 gap-6 mb-8">
//                   {/* ...existing Card results... */}
//                 </section>
//                 {/* Chart and Summary Section */}
//                 <section className="grid lg:grid-cols-3 gap-8 mb-8 lg:items-stretch">
//                   {/* ...existing chart and summary Card... */}
//                 </section>
//               </>
//             )}
//           </Card>

//         {/* Saved Proposals Tab */}
//         {activeTab === "saved" && (
//           <section className="mb-8">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                 <FaSave className="text-green-500" />
//                 Saved Proposals
//               </h2>
//               {savedProposals.length === 0 ? (
//                 <p className="text-gray-500">No saved proposals yet.</p>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full text-sm">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="px-4 py-2 text-left">Name</th>
//                         <th className="px-4 py-2 text-left">Investment</th>
//                         <th className="px-4 py-2 text-left">Return (%)</th>
//                         <th className="px-4 py-2 text-left">Period (yrs)</th>
//                         <th className="px-4 py-2 text-left">Final Amount</th>
//                         <th className="px-4 py-2 text-left">Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {savedProposals.map((proposal) => (
//                         <tr key={proposal.id} className="border-b">
//                           <td className="px-4 py-2 font-semibold">
//                             {proposal.name}
//                           </td>
//                           <td className="px-4 py-2">
//                             {formatCurrency(proposal.initialInvestment)}
//                           </td>
//                           <td className="px-4 py-2">
//                             {proposal.expectedReturn}%
//                           </td>
//                           <td className="px-4 py-2">{proposal.timePeriod}</td>
//                           <td className="px-4 py-2">
//                             {formatCurrency(
//                               Number(proposal.result.finalAmount)
//                             )}
//                           </td>
//                           <td className="px-4 py-2 flex gap-2">
//                             <button
//                               className="text-blue-500 hover:text-blue-700"
//                               title="View"
//                               onClick={() => loadProposal(proposal)}
//                             >
//                               <FaEye />
//                             </button>
//                             <button
//                               className="text-green-500 hover:text-green-700"
//                               title="Edit"
//                               onClick={() => loadProposal(proposal)}
//                             >
//                               <FaEdit />
//                             </button>
//                             <button
//                               className="text-red-500 hover:text-red-700"
//                               title="Delete"
//                               onClick={() => deleteProposal(proposal.id)}
//                             >
//                               <FaTrash />
//                             </button>
//                             <button
//                               className={`text-yellow-500 hover:text-yellow-700 ${
//                                 selectedProposals.includes(proposal.id)
//                                   ? "font-bold"
//                                   : ""
//                               }`}
//                               title="Select for Comparison"
//                               onClick={() =>
//                                 toggleProposalSelection(proposal.id)
//                               }
//                               disabled={
//                                 selectedProposals.length >= 4 &&
//                                 !selectedProposals.includes(proposal.id)
//                               }
//                             >
//                               <FaChartLine />
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}

//         {/* Comparison Tab */}
//         {activeTab === "comparison" && (
//           <section className="mb-8">
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//               <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//                 <FaChartLine className="text-blue-500" />
//                 Compare Proposals
//               </h2>
//               {selectedProposals.length < 2 ? (
//                 <p className="text-gray-500">
//                   Select at least two proposals to compare.
//                 </p>
//               ) : (
//                 <div className="h-96">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={comparisonData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis
//                         dataKey="year"
//                         stroke="#666"
//                         fontSize={12}
//                         label={{
//                           value: "Years",
//                           position: "insideBottom",
//                           offset: -5,
//                         }}
//                       />
//                       <YAxis
//                         stroke="#666"
//                         fontSize={12}
//                         tickFormatter={(value) => `₹${value.toLocaleString()}`}
//                       />
//                       <Tooltip
//                         formatter={(value: number, name: string) => [
//                           formatCurrency(value),
//                           name,
//                         ]}
//                         labelFormatter={(year) => `Year ${year}`}
//                       />
//                       {savedProposals
//                         .filter((p) => selectedProposals.includes(p.id))
//                         .map((proposal, idx) => (
//                           <Line
//                             key={proposal.id}
//                             type="monotone"
//                             dataKey={proposal.name}
//                             stroke={colors[idx % colors.length]}
//                             strokeWidth={3}
//                             dot={false}
//                             name={proposal.name}
//                           />
//                         ))}
//                     </LineChart>
//                   </ResponsiveContainer>
//                   <div className="mt-4 flex gap-6 justify-center text-sm">
//                     {savedProposals
//                       .filter((p) => selectedProposals.includes(p.id))
//                       .map((proposal, idx) => (
//                         <div
//                           key={proposal.id}
//                           className="flex items-center gap-2"
//                         >
//                           <div
//                             className="w-3 h-3 rounded"
//                             style={{
//                               backgroundColor: colors[idx % colors.length],
//                             }}
//                           ></div>
//                           <span>{proposal.name}</span>
//                         </div>
//                       ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// }

import React from 'react'

function page() {
  return (
    <div>page</div>
  )
}

export default page