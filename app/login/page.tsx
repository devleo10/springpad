import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffb400]/10 to-[#ff8c00]/10">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-[#1B1B1B] mb-6 text-center">Login to InvestPro</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
          </div>
          <button type="submit" className="w-full bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-3 rounded-lg transition-colors">Login</button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <a href="/signup" className="text-[#ffb400] hover:text-[#ff8c00] font-medium">Sign Up</a>
        </div>
      </div>
    </div>
  );
}
