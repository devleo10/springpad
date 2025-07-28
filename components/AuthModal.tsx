import React, { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  initialTab = "signup",
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);

  // Login form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup form states
  const [signupMode, setSignupMode] = useState<"mobile" | "email">("mobile");
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");
  const [verifySuccess, setVerifySuccess] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Reset form when tab changes
  React.useEffect(() => {
    setLoginError("");
    setSignupError("");
    setSignupSuccess("");
    setShowVerify(false);
    setVerifyError("");
    setVerifySuccess("");
  }, [activeTab]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          mobile: loginMobile,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      // Save token, redirect, etc.
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError("Login failed");
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    setSignupSuccess("");
    setShowVerify(false);
    setVerifySuccess("");
    setVerifyError("");
    try {
      const body: Record<string, string> = { name, password: signupPassword };
      if (signupMode === "mobile") {
        body.mobile = signupMobile;
      } else {
        body.email = signupEmail;
      }
      const res = await fetch(`${backendUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      setSignupSuccess(
        "Signup successful! Please verify your email or mobile."
      );
      if (signupMode === "email") {
        setShowVerify(true);
      }
      setName("");
      setSignupEmail("");
      setSignupMobile("");
      setSignupPassword("");
    } catch (err) {
      if (err instanceof Error) {
        setSignupError(err.message);
      } else {
        setSignupError("Signup failed");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifySuccess("");
    setVerifyError("");
    setSignupLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail, otp: verifyToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed");
      setVerifySuccess("Email verified successfully! You can now log in.");
      setShowVerify(false);
    } catch (err) {
      if (err instanceof Error) {
        setVerifyError(err.message);
      } else {
        setVerifyError("Verification failed");
      }
    } finally {
      setSignupLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center z-10"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Tab Headers */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1 mt-4">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "signup"
                ? "bg-white text-[#2C5282] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === "login"
                ? "bg-white text-[#2C5282] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "signup" ? (
          !showVerify ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              {signupMode === "mobile" ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mobile
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your mobile"
                      className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                      value={signupMobile}
                      onChange={(e) => setSignupMobile(e.target.value)}
                      autoComplete="tel"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="text-xs text-[#2C5282] underline hover:text-yellow-600"
                    onClick={() => setSignupMode("email")}
                  >
                    Sign up with email instead
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="text-xs text-[#2C5282] underline hover:text-yellow-600"
                    onClick={() => setSignupMode("mobile")}
                  >
                    Sign up with mobile instead
                  </button>
                </>
              )}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              {signupError && (
                <div className="text-red-500 text-sm">{signupError}</div>
              )}
              {signupSuccess && (
                <div className="text-green-600 text-sm">{signupSuccess}</div>
              )}
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#2C5282] font-semibold py-2 rounded-lg transition-all"
                disabled={signupLoading}
              >
                {signupLoading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-700">
                  Paste verification token from your email
                </label>
                <input
                  type="text"
                  placeholder="Enter verification token"
                  className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  required
                />
              </div>
              {verifyError && (
                <div className="text-red-500 text-sm">{verifyError}</div>
              )}
              {verifySuccess && (
                <div className="text-green-600 text-sm">{verifySuccess}</div>
              )}
              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#2C5282] font-semibold py-2 rounded-lg transition-all"
                disabled={signupLoading}
              >
                {signupLoading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          )
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email (optional)"
                className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                type="text"
                placeholder="Enter your mobile (optional)"
                className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                value={loginMobile}
                onChange={(e) => setLoginMobile(e.target.value)}
                autoComplete="tel"
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 rounded-lg px-3 py-2 outline-none transition-all"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {loginError && (
              <div className="text-red-500 text-sm">{loginError}</div>
            )}
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#2C5282] font-semibold py-2 rounded-lg transition-all"
              disabled={loginLoading}
            >
              {loginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {/* Google Sign Up/In Button */}
        <div className="mt-4 flex flex-col items-center">
          <button
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg shadow-sm transition-all"
            disabled={signupLoading || loginLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.54 0 6.36 1.22 8.29 2.98l6.16-6.16C34.91 2.7 29.89 0 24 0 14.82 0 6.91 5.8 2.69 14.09l7.19 5.59C12.01 13.09 17.56 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.1 24.55c0-1.64-.15-3.21-.42-4.73H24v9.01h12.41c-.54 2.91-2.18 5.38-4.66 7.04l7.19 5.59C43.09 37.3 46.1 31.45 46.1 24.55z"
                />
                <path
                  fill="#FBBC05"
                  d="M9.88 28.68A14.48 14.48 0 019.5 24c0-1.62.28-3.19.78-4.68l-7.19-5.59A23.93 23.93 0 000 24c0 3.77.9 7.34 2.5 10.47l7.38-5.79z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.48 0 11.92-2.15 15.89-5.85l-7.38-5.79c-2.06 1.39-4.7 2.22-8.51 2.22-6.44 0-11.99-3.59-14.12-8.68l-7.19 5.59C6.91 42.2 14.82 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </g>
            </svg>
            {activeTab === "signup"
              ? "Sign up with Google"
              : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
};
