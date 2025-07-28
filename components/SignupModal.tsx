
import React, { useState } from 'react';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
}

export const SignupModal: React.FC<SignupModalProps> = ({ open, onClose }) => {
  const [mode, setMode] = useState<'mobile' | 'email'>("mobile");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyToken, setVerifyToken] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [verifyError, setVerifyError] = useState('');

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setShowVerify(false);
    setVerifySuccess('');
    setVerifyError('');
    try {
      const body: Record<string, string> = { name, password };
      if (mode === "mobile") {
        body.mobile = mobile;
      } else {
        body.email = email;
      }
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      setSuccess('Signup successful! Please verify your email or mobile.');
      if (mode === 'email') {
        setShowVerify(true);
      }
      setName(''); setEmail(''); setMobile(''); setPassword('');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  // Email verification handler
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifySuccess('');
    setVerifyError('');
    setLoading(true);
    try {
      // Send email and OTP as JSON in POST body
      const res = await fetch(`${backendUrl}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: verifyToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      setVerifySuccess('Email verified successfully! You can now log in.');
      setShowVerify(false);
    } catch (err) {
      if (err instanceof Error) {
        setVerifyError(err.message);
      } else {
        setVerifyError('Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 text-[#2C5282]">Sign Up</h2>
        {!showVerify ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            {mode === "mobile" ? (
              <>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="text"
                    placeholder="Enter your mobile"
                    className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    autoComplete="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="text-xs text-[#2C5282] underline hover:text-yellow-600"
                  onClick={() => setMode("email")}
                >
                  Sign up with email instead
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <button
                  type="button"
                  className="text-xs text-[#2C5282] underline hover:text-yellow-600"
                  onClick={() => setMode("mobile")}
                >
                  Sign up with mobile instead
                </button>
              </>
            )}
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">{success}</div>}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#2C5282] font-semibold py-2 rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Paste verification token from your email</label>
              <input
                type="text"
                placeholder="Enter verification token"
                className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                value={verifyToken}
                onChange={e => setVerifyToken(e.target.value)}
                required
              />
            </div>
            {verifyError && <div className="text-red-500 text-sm">{verifyError}</div>}
            {verifySuccess && <div className="text-green-600 text-sm">{verifySuccess}</div>}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#2C5282] font-semibold py-2 rounded-lg transition-all"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
        )}
        <div className="mt-4 flex flex-col items-center">
          <button
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg shadow-sm transition-all"
            // onClick={handleGoogleSignup}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.36 1.22 8.29 2.98l6.16-6.16C34.91 2.7 29.89 0 24 0 14.82 0 6.91 5.8 2.69 14.09l7.19 5.59C12.01 13.09 17.56 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v9.01h12.41c-.54 2.91-2.18 5.38-4.66 7.04l7.19 5.59C43.09 37.3 46.1 31.45 46.1 24.55z"/><path fill="#FBBC05" d="M9.88 28.68A14.48 14.48 0 019.5 24c0-1.62.28-3.19.78-4.68l-7.19-5.59A23.93 23.93 0 000 24c0 3.77.9 7.34 2.5 10.47l7.38-5.79z"/><path fill="#EA4335" d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.38-5.79c-2.06 1.39-4.7 2.22-8.51 2.22-6.44 0-11.99-3.59-14.12-8.68l-7.19 5.59C6.91 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
};
