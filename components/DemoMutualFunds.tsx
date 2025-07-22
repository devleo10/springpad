import React from "react";

const demoFunds = [
	{
		name: "HDFC Top 100 Fund",
		type: "Equity",
		returns: "18.2% (3Y CAGR)",
		risk: "Moderate",
		color: "from-[#ffb400] to-[#ff8c00]",
	},
	{
		name: "SBI Bluechip Fund",
		type: "Large Cap",
		returns: "15.6% (3Y CAGR)",
		risk: "Low",
		color: "from-blue-400 to-blue-600",
	},
	{
		name: "ICICI Prudential Balanced Advantage",
		type: "Hybrid",
		returns: "12.4% (3Y CAGR)",
		risk: "Low",
		color: "from-green-400 to-green-600",
	},
];

const DemoMutualFunds = () => {
	return (
		<div className="mt-8">
			<h2 className="text-3xl font-bold text-white mb-6 text-center">
				Highlighted Mutual Funds
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
				{demoFunds.map((fund, idx) => (
					<div
						key={fund.name}
						className={`group bg-transparent backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-start justify-between transition-all hover:scale-105 hover:shadow-2xl hover:border-white/50 duration-500 relative overflow-hidden cursor-pointer`}
						style={{
							animationDelay: `${idx * 150}ms`,
						}}
					>
						{/* Animated Background Gradient */}
						<div className={`absolute inset-0 bg-gradient-to-br ${fund.color} rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
						
						{/* Shimmer Effect */}
						<div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out" />
						
						{/* Glow Effect */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl blur-xl opacity-60 pointer-events-none group-hover:opacity-100 transition-opacity duration-300" />

						{/* Content */}
						<div className="relative z-10 mb-4 w-full">
							<div className="flex items-start justify-between mb-2">
								<span className="text-lg font-bold text-white group-hover:text-shadow-lg transition-all duration-300">
									{fund.name}
								</span>
								<span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs text-white font-semibold border border-white/30 group-hover:bg-white/30 transition-all duration-300">
									{fund.type}
								</span>
							</div>
							<div className="h-0.5 w-full bg-white/20 rounded-full overflow-hidden">
								<div className="h-full bg-white/60 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
							</div>
						</div>
						
						<div className="relative z-10 space-y-2 w-full">
							<div className="text-sm text-white/90 group-hover:text-white transition-colors duration-300">
								<span className="font-medium">Returns:</span>{" "}
								<span className="font-bold text-lg group-hover:scale-110 inline-block transition-transform duration-300">{fund.returns}</span>
							</div>
							<div className="text-xs text-white/70 group-hover:text-white/90 transition-colors duration-300">
								<span className="font-medium">Risk Level:</span> {fund.risk}
							</div>
						</div>

						{/* Floating Decorative Elements */}
						<div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-full blur-sm opacity-60 pointer-events-none animate-pulse group-hover:animate-bounce" />
						<div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-br from-[#ffb400]/40 to-[#ff8c00]/40 rounded-full blur-md opacity-50 pointer-events-none group-hover:opacity-80 transition-opacity duration-300" />
						
						{/* Corner Highlight */}
						<div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-white/20 group-hover:border-t-white/40 transition-colors duration-300" />
					</div>
				))}
			</div>
		</div>
	);
};

export default DemoMutualFunds;
