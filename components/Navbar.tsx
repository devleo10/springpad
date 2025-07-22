import { Link, TrendingUp } from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <div>
      <nav className="fixed left-1/2 top-6 -translate-x-1/2 w-[95vw] max-w-5xl z-50 bg-transparent backdrop-blur-lg shadow-xl px-8 py-3 rounded-full border border-white/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#ffb400] to-[#ff8c00] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SpringPad</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-white transition-colors">
              Mutual Funds
            </a>
            <a href="#" className="text-white transition-colors">
              SIP Calculator
            </a>
            <a href="#" className="text-white transition-colors">
              Portfolio
            </a>
            <a href="#" className="text-white transition-colors">
              About
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg font-medium bg-white/80 text-[#ff8c00] border-2 border-[#ffb400] hover:bg-[#ffb400] hover:text-white transition-colors shadow-md"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg font-medium bg-gradient-to-br from-[#ffb400] to-[#ff8c00] text-white shadow-lg border-2 border-[#ffb400] hover:from-[#ff8c00] hover:to-[#ffb400] transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
