"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import { Card } from "./ui/Card";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = "login" | "signup" | "otp" | "emailSent";
type Method = "email" | "mobile";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [method, setMethod] = useState<Method>("email");
  const [signupStep, setSignupStep] = useState<'form'|'verify'>('form');
  const [timer, setTimer] = useState(60);

  // Login state
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupId, setSignupId] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");

  function resetAll() {
    setView("login");
    setMethod("email");
    setLoginId("");
    setLoginPassword("");
    setSignupName("");
    setSignupId("");
    setSignupPassword("");
    setSignupConfirm("");
    setOtp("");
    toast.dismiss();
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loginId, password: loginPassword }),
      });
      if (!res.ok) throw new Error("Login failed");
      const { token } = await res.json();
      localStorage.setItem("token", token);
      toast.success("Logged in successfully");
      onClose();
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Login error");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only step 1: send signup request, then show verify screen
    setSignupStep('verify');
    setTimer(60);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: signupId, password: signupPassword, method }),
      });
      if (!res.ok) throw new Error("Signup failed");
      if (method === "email") setView("emailSent");
      else setView("otp");
    } catch (err: any) {
      toast.error(err.message || "Signup error");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/verify-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: signupId, otp }),
      });
      if (!res.ok) throw new Error("OTP verification failed");
      toast.success("Mobile verified, please login");
      setView("login");
    } catch (err: any) {
      toast.error(err.message || "OTP error");
    }
  };

  useEffect(() => {
    if (view === 'signup' && signupStep === 'verify' && timer > 0) {
      const t = setTimeout(() => setTimer(timer-1), 1000);
      return () => clearTimeout(t);
    }
  }, [view, signupStep, timer]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" onClick={() => { resetAll(); onClose(); }} />
      <Card className="relative p-6 w-full max-w-md">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => { resetAll(); onClose(); }}
        >
          ✕
        </button>
        {view === "login" ? (
          <LoginPage hideLogo />
        ) : (
          signupStep === 'form' ? (
            <form onSubmit={handleSignup} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
              <div className="flex mb-4">
                <button type="button" className={`flex-1 py-2 rounded-l border ${method === "email" ? "bg-blue-100" : "bg-white"}`} onClick={() => setMethod("email")}>Email</button>
                <button type="button" className={`flex-1 py-2 rounded-r border ${method === "mobile" ? "bg-blue-100" : "bg-white"}`} onClick={() => setMethod("mobile")}>Mobile</button>
              </div>
              <div>
                <label className="block text-sm">{method === "email" ? "Email" : "Mobile Number"}</label>
                <input type={method === "email" ? "email" : "tel"} value={signupId} onChange={e => setSignupId(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm">Password</label>
                <input type="password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Continue</button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <h2 className="text-xl font-semibold mb-4 text-center">Verify {method === 'email' ? 'Email' : 'Mobile'}</h2>
              <div className="mb-2 text-center text-gray-600 text-sm">
                {method === 'email' ? `A verification link was sent to ${signupId}` : `Enter the OTP sent to ${signupId}`}
              </div>
              {method === 'mobile' && (
                <div>
                  <label className="block text-sm">OTP</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required className="mt-1 w-full border rounded px-3 py-2" />
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Resend in {timer}s</span>
                <button type="button" disabled={timer > 0} className="text-blue-600 disabled:opacity-50">Resend</button>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2">Verify</button>
            </form>
          )
        )}
        <div className="mt-4 text-center text-sm">
          {view === "login" ? (
            <button className="text-blue-600 hover:underline" onClick={() => setView("signup")}>Don't have an account? Sign up</button>
          ) : (
            <button className="text-blue-600 hover:underline" onClick={() => { setView("login"); setSignupStep('form'); }}>Already have an account? Login</button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthModal;
