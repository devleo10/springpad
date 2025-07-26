"use client"

import Image from 'next/image';
import React, { useState } from 'react';

export default function SignupPage({ hideLogo = false }: { hideLogo?: boolean }) {
  const [authMode, setAuthMode] = useState<'email' | 'mobile'>('email');
  const [mobileStep, setMobileStep] = useState<'enter' | 'otp'>('enter');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    setMobileStep('enter');
    setOtp('');
    setPassword('');
    setError('');
    setOtpSent(false);
    setIsRequestingOtp(false);
  }, [authMode]);

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequestingOtp(true);
    setError('');
    // Simulate OTP request
    setTimeout(() => {
      setOtpSent(true);
      setMobileStep('otp');
      setIsRequestingOtp(false);
    }, 1000);
  };

  const handleResendOtp = () => {
    setOtp('');
    setError('');
    setIsRequestingOtp(true);
    // Simulate resend
    setTimeout(() => {
      setIsRequestingOtp(false);
    }, 1000);
  };

  const handleBack = () => {
    setMobileStep('enter');
    setOtp('');
    setPassword('');
    setError('');
  };
  
  if (hideLogo) {
    // Modal version - compact form only
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-[#1B1B1B] mb-4 text-center">Create your SpringPad account</h2>
        {/* Tab Switcher for Email/Mobile */}
        <div className="flex mb-4">
          <button
            type="button"
            className={`w-1/2 py-2 rounded-l-lg border border-gray-200 font-semibold focus:outline-none transition-colors ${authMode === 'email' ? 'bg-[#ffb400]/10 text-[#ffb400]' : 'bg-white text-gray-700'}`}
            onClick={() => setAuthMode('email')}
          >
            Email
          </button>
          <button
            type="button"
            className={`w-1/2 py-2 rounded-r-lg border border-gray-200 font-semibold focus:outline-none transition-colors ${authMode === 'mobile' ? 'bg-[#ffb400]/10 text-[#ffb400]' : 'bg-white text-gray-700'}`}
            onClick={() => setAuthMode('mobile')}
          >
            Mobile
          </button>
        </div>
        {authMode === 'email' ? (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" placeholder="Enter your email" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" placeholder="Enter password" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
            </div>
            <button type="submit" className="w-full bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-2.5 rounded-lg transition-colors">Sign Up</button>
          </form>
        ) : (
          <>
            {mobileStep === 'enter' && (
              <form className="space-y-4" onSubmit={handleGetOtp}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter your mobile number" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" pattern="[0-9]{10}" maxLength={10} required />
                </div>
                <button type="submit" className="w-full bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-2.5 rounded-lg transition-colors" disabled={isRequestingOtp || !name || !/^\d{10}$/.test(mobile)}>
                  {isRequestingOtp ? 'Sending OTP...' : 'Get OTP'}
                </button>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              </form>
            )}
            {mobileStep === 'otp' && (
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); /* handle sign up with OTP */ }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <input type="tel" value={mobile} disabled className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" maxLength={6} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
                </div>
                <div className="flex gap-2">
                  <button type="button" className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg" onClick={handleBack}>Back</button>
                  <button type="button" className="flex-1 bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-2.5 rounded-lg" onClick={handleResendOtp} disabled={isRequestingOtp}>{isRequestingOtp ? 'Resending...' : 'Resend OTP'}</button>
                </div>
                <button type="submit" className="w-full bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">Sign Up</button>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
              </form>
            )}
          </>
        )}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <button className="w-full flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.528 2.84-2.12 5.24-4.52 6.86v5.68h7.32c4.28-3.94 6.73-9.74 6.73-16.856z" fill="#4285F4"/><path d="M24.48 48c6.12 0 11.26-2.04 15.01-5.54l-7.32-5.68c-2.04 1.36-4.66 2.18-7.69 2.18-5.92 0-10.94-4-12.74-9.36H4.18v5.84C7.92 43.98 15.56 48 24.48 48z" fill="#34A853"/><path d="M11.74 29.6c-.48-1.36-.76-2.8-.76-4.28s.28-2.92.76-4.28v-5.84H4.18A23.97 23.97 0 0 0 0 24.32c0 3.92.94 7.64 2.6 10.88l9.14-5.6z" fill="#FBBC05"/><path d="M24.48 9.52c3.34 0 6.32 1.14 8.68 3.38l6.48-6.48C35.74 2.18 30.6 0 24.48 0 15.56 0 7.92 4.02 4.18 10.16l9.14 5.84c1.8-5.36 6.82-9.36 12.74-9.36z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><path fill="#fff" d="M0 0h48v48H0z"/></clipPath></defs></svg>
          Continue with Google
        </button>
      </div>
    );
  }
  
  // Full page version
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#ffb400]/10 to-[#ff8c00]/10">
      {/* Logo Section */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <Image src="/logo.png" alt="SpringPad Logo" width={300} height={300} className="object-contain" />
      </div>
      {/* Form Section */}
      <div className="md:w-1/2 flex items-center justify-center p-8 w-full">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl px-10 py-6 w-full max-w-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1B1B1B] mb-6 text-center">Create your SpringPad account</h2>
          {/* Tab Switcher for Email/Mobile */}
          <div className="flex mb-4">
            <button
              type="button"
              className={`w-1/2 py-2 rounded-l-lg border border-gray-200 font-semibold focus:outline-none transition-colors ${authMode === 'email' ? 'bg-[#ffb400]/10 text-[#ffb400]' : 'bg-white text-gray-700'}`}
              onClick={() => setAuthMode('email')}
            >
              Email
            </button>
            <button
              type="button"
              className={`w-1/2 py-2 rounded-r-lg border border-gray-200 font-semibold focus:outline-none transition-colors ${authMode === 'mobile' ? 'bg-[#ffb400]/10 text-[#ffb400]' : 'bg-white text-gray-700'}`}
              onClick={() => setAuthMode('mobile')}
            >
              Mobile
            </button>
          </div>
          {authMode === 'email' ? (
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" placeholder="Enter your email" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" placeholder="Enter password" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
              </div>
              <button type="submit" className="w-full bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-3 rounded-lg transition-colors">Sign Up</button>
            </form>
          ) : (
            <>
              {mobileStep === 'enter' && (
                <form className="space-y-5" onSubmit={handleGetOtp}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="Enter your mobile number" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" pattern="[0-9]{10}" maxLength={10} required />
                  </div>
                  <button type="submit" className="w-full bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-3 rounded-lg transition-colors" disabled={isRequestingOtp || !name || !/^\d{10}$/.test(mobile)}>
                    {isRequestingOtp ? 'Sending OTP...' : 'Get OTP'}
                  </button>
                  {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                </form>
              )}
              {mobileStep === 'otp' && (
                <form className="space-y-5" onSubmit={e => { e.preventDefault(); /* handle sign up with OTP */ }}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                    <input type="tel" value={mobile} disabled className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 bg-gray-100 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">OTP</label>
                    <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" maxLength={6} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="mt-1 block w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffb400]" required />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="flex-1 bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg" onClick={handleBack}>Back</button>
                    <button type="button" className="flex-1 bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-2.5 rounded-lg" onClick={handleResendOtp} disabled={isRequestingOtp}>{isRequestingOtp ? 'Resending...' : 'Resend OTP'}</button>
                  </div>
                  <button type="submit" className="w-full bg-[#ffb400] hover:bg-[#ff8c00] text-white font-semibold py-3 rounded-lg transition-colors mt-2">Sign Up</button>
                  {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                </form>
              )}
            </>
          )}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <button className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_17_40)"><path d="M47.532 24.552c0-1.636-.146-3.2-.418-4.704H24.48v9.02h13.02c-.528 2.84-2.12 5.24-4.52 6.86v5.68h7.32c4.28-3.94 6.73-9.74 6.73-16.856z" fill="#4285F4"/><path d="M24.48 48c6.12 0 11.26-2.04 15.01-5.54l-7.32-5.68c-2.04 1.36-4.66 2.18-7.69 2.18-5.92 0-10.94-4-12.74-9.36H4.18v5.84C7.92 43.98 15.56 48 24.48 48z" fill="#34A853"/><path d="M11.74 29.6c-.48-1.36-.76-2.8-.76-4.28s.28-2.92.76-4.28v-5.84H4.18A23.97 23.97 0 0 0 0 24.32c0 3.92.94 7.64 2.6 10.88l9.14-5.6z" fill="#FBBC05"/><path d="M24.48 9.52c3.34 0 6.32 1.14 8.68 3.38l6.48-6.48C35.74 2.18 30.6 0 24.48 0 15.56 0 7.92 4.02 4.18 10.16l9.14 5.84c1.8-5.36 6.82-9.36 12.74-9.36z" fill="#EA4335"/></g><defs><clipPath id="clip0_17_40"><path fill="#fff" d="M0 0h48v48H0z"/></clipPath></defs></svg>
            Continue with Google
          </button>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-[#ffb400] hover:text-[#ff8c00] font-medium">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
